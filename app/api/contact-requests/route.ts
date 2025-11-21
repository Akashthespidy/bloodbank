import { and, desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { contactRequests, users } from '@/lib/schema';

export async function GET(request: NextRequest) {
  try {
    // Verify Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get Clerk user email
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    // Get donor ID from email
    const donor = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (donor.length === 0) {
      return NextResponse.json({ requests: [], count: 0 });
    }

    const donorId = donor[0].id;

    // Get contact requests for the authenticated donor
    const requests = await db
      .select({
        id: contactRequests.id,
        status: contactRequests.status,
        message: contactRequests.message,
        createdAt: contactRequests.createdAt,
        requester_name: users.name,
        requester_email: users.email,
        requester_phone: users.phone,
        requester_blood_group: users.bloodGroup,
        requester_area: users.area,
      })
      .from(contactRequests)
      .innerJoin(users, eq(contactRequests.requesterId, users.id))
      .where(eq(contactRequests.donorId, donorId))
      .orderBy(desc(contactRequests.createdAt));

    return NextResponse.json({
      requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Get contact requests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get Clerk user email
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    // Get donor ID from email
    const donor = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (donor.length === 0) {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
    }

    const donorId = donor[0].id;

    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Update contact request status
    const result = await db
      .update(contactRequests)
      .set({ status })
      .where(and(eq(contactRequests.id, requestId), eq(contactRequests.donorId, donorId)))
      .returning({ id: contactRequests.id });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Contact request not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Contact request ${status} successfully`,
    });
  } catch (error) {
    console.error('Update contact request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
