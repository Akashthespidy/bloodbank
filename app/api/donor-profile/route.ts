import { auth, clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { users } from '@/lib/schema';

// GET - Get donor info by Clerk email
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Clerk user email
    // Get Clerk user email
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    // Check if user is a donor
    const donor = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (donor.length === 0) {
      return NextResponse.json({ isDonor: false }, { status: 200 });
    }

    return NextResponse.json({
      isDonor: true,
      donor: {
        id: donor[0].id,
        name: donor[0].name,
        email: donor[0].email,
        bloodGroup: donor[0].bloodGroup,
        area: donor[0].area,
        city: donor[0].city,
        phone: donor[0].phone,
        createdAt: donor[0].createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching donor info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update donor info
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Clerk user email
    // Get Clerk user email
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    const body = await request.json();
    const { bloodGroup, area, city, phone } = body;

    // Update donor info
    await db
      .update(users)
      .set({
        bloodGroup,
        area,
        city,
        phone,
      })
      .where(eq(users.email, email));

    return NextResponse.json({ success: true, message: 'Donor info updated successfully' });
  } catch (error) {
    console.error('Error updating donor info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
