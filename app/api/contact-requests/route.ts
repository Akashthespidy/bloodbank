import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { contactRequests, users } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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



    // Get contact requests for the authenticated user (as donor)
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
      .where(eq(contactRequests.donorId, decoded.userId))
      .orderBy(desc(contactRequests.createdAt));

    return NextResponse.json({
      requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Get contact requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const { requestId, status } = body;

    if (!requestId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }



    // Update contact request status
    const result = await db
      .update(contactRequests)
      .set({ status })
      .where(
        and(
          eq(contactRequests.id, requestId),
          eq(contactRequests.donorId, decoded.userId)
        )
      )
      .returning({ id: contactRequests.id });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Contact request not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Contact request ${status} successfully`
    });
  } catch (error) {
    console.error('Update contact request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 