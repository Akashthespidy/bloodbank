import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { contactRequests, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken, sendContactRequestEmail } from '@/lib/auth';
import { z } from 'zod';

const contactRequestSchema = z.object({
  donorId: z.number(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = contactRequestSchema.parse(body);

    // Get requester info
    const requesterResult = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);
    const requester = requesterResult[0];

    if (!requester) {
      return NextResponse.json(
        { error: 'Requester not found' },
        { status: 404 }
      );
    }

    // Get donor info
    const donorResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        bloodGroup: users.bloodGroup,
        area: users.area,
      })
      .from(users)
      .where(and(eq(users.id, validatedData.donorId), eq(users.isDonor, true)))
      .limit(1);
    const donor = donorResult[0];

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    // Check if request already exists
    const existingRequest = await db
      .select({ id: contactRequests.id })
      .from(contactRequests)
      .where(
        and(
          eq(contactRequests.requesterId, decoded.userId),
          eq(contactRequests.donorId, validatedData.donorId),
          eq(contactRequests.status, 'pending')
        )
      )
      .limit(1);

    if (existingRequest.length > 0) {
      return NextResponse.json(
        { error: 'Contact request already sent' },
        { status: 400 }
      );
    }

    // Create contact request
    const result = await db
      .insert(contactRequests)
      .values({
        requesterId: decoded.userId,
        donorId: validatedData.donorId,
        message: validatedData.message || null,
      })
      .returning({ id: contactRequests.id });

    // Send email to donor
    await sendContactRequestEmail(
      donor.email,
      donor.name,
      requester.name,
      donor.bloodGroup,
      donor.area
    );

    return NextResponse.json({
      message: 'Contact request sent successfully',
      requestId: result[0].id
    });
  } catch (error) {
    console.error('Contact request error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 