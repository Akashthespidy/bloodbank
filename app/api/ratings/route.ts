import { auth, clerkClient } from '@clerk/nextjs/server';
import { and, eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/database';
import { ratings, users } from '@/lib/schema';

const ratingSchema = z.object({
  donorId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get Clerk user details
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = ratingSchema.parse(body);

    // Check if rater exists in local DB, if not create one
    let raterId: number;
    const existingRater = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingRater.length > 0) {
      raterId = existingRater[0].id;
    } else {
      // Create a new user record for the rater
      const name = clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
        : email?.split('@')[0] || 'User';
      const newUser = await db
        .insert(users)
        .values({
          email,
          name,
          bloodGroup: 'Unknown',
          area: 'Unknown',
          city: 'Unknown',
          isDonor: false,
        })
        .returning({ id: users.id });
      raterId = newUser[0].id;
    }

    // Verify donor exists
    const donor = await db
      .select()
      .from(users)
      .where(and(eq(users.id, validatedData.donorId), eq(users.isDonor, true)))
      .limit(1);

    if (donor.length === 0) {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
    }

    // Check if user already rated this donor
    const existingRating = await db
      .select()
      .from(ratings)
      .where(and(eq(ratings.donorId, validatedData.donorId), eq(ratings.raterId, raterId)))
      .limit(1);

    if (existingRating.length > 0) {
      // Update existing rating
      await db
        .update(ratings)
        .set({
          rating: validatedData.rating,
          comment: validatedData.comment || null,
        })
        .where(eq(ratings.id, existingRating[0].id));

      return NextResponse.json({
        message: 'Rating updated successfully',
      });
    } else {
      // Create new rating
      await db.insert(ratings).values({
        donorId: validatedData.donorId,
        raterId: raterId,
        rating: validatedData.rating,
        comment: validatedData.comment || null,
      });

      return NextResponse.json({
        message: 'Rating submitted successfully',
      });
    }
  } catch (error) {
    console.error('Rating error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET ratings for a donor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const donorId = searchParams.get('donorId');

    if (!donorId) {
      return NextResponse.json({ error: 'Donor ID is required' }, { status: 400 });
    }

    // Get all ratings for the donor
    const donorRatings = await db
      .select({
        id: ratings.id,
        rating: ratings.rating,
        comment: ratings.comment,
        createdAt: ratings.createdAt,
        raterName: users.name,
      })
      .from(ratings)
      .leftJoin(users, eq(ratings.raterId, users.id))
      .where(eq(ratings.donorId, parseInt(donorId, 10)));

    // Calculate average rating
    const avgResult = await db
      .select({
        avg: sql<number>`AVG(${ratings.rating})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(ratings)
      .where(eq(ratings.donorId, parseInt(donorId, 10)));

    const averageRating = avgResult[0]?.avg ? parseFloat(Number(avgResult[0].avg).toFixed(1)) : 0;
    const totalRatings = Number(avgResult[0]?.count) || 0;

    return NextResponse.json({
      ratings: donorRatings,
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
