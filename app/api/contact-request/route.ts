import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { sendContactRequestEmail } from '@/lib/auth';
import { db } from '@/lib/database';
import { contactRequests, users } from '@/lib/schema';

const contactRequestSchema = z.object({
  donorId: z.number(),
  hospital: z.string().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  time: z.string().optional(),
  message: z.string().optional(),
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
    const name = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : email?.split('@')[0] || 'User';

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = contactRequestSchema.parse(body);

    // Check if requester exists in local DB, if not create one
    let requesterId: number;
    const existingRequester = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingRequester.length > 0) {
      requesterId = existingRequester[0].id;
    } else {
      // Create a new user record for the requester (non-donor by default)
      // We need to provide dummy values for required fields since this is just a requester
      const newUser = await db
        .insert(users)
        .values({
          email,
          name,
          password: 'clerk-auth-user', // Dummy password
          bloodGroup: 'Unknown', // Placeholder
          area: 'Unknown', // Placeholder
          city: 'Unknown', // Placeholder
          isDonor: false,
        })
        .returning({ id: users.id });
      requesterId = newUser[0].id;
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
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
    }

    // Check if request already exists
    const existingRequest = await db
      .select({ id: contactRequests.id })
      .from(contactRequests)
      .where(
        and(
          eq(contactRequests.requesterId, requesterId),
          eq(contactRequests.donorId, validatedData.donorId),
          eq(contactRequests.status, 'pending')
        )
      )
      .limit(1);

    if (existingRequest.length > 0) {
      return NextResponse.json({ error: 'Contact request already sent' }, { status: 400 });
    }

    // Create contact request
    const result = await db
      .insert(contactRequests)
      .values({
        requesterId: requesterId,
        donorId: validatedData.donorId,
        message: validatedData.message || null,
      })
      .returning({ id: contactRequests.id });

    // Send email to donor with structured information
    await sendContactRequestEmail(
      donor.email,
      donor.name,
      name,
      donor.bloodGroup,
      donor.area,
      {
        hospital: validatedData.hospital,
        address: validatedData.address,
        contact: validatedData.contact,
        time: validatedData.time,
        message: validatedData.message,
      }
    );

    return NextResponse.json({
      message: 'Contact request sent successfully',
      requestId: result[0].id,
    });
  } catch (error) {
    console.error('Contact request error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
