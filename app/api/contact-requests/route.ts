import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
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

    const db = await getDatabase();

    // Get contact requests for the authenticated user (as donor)
    const requests = await db.all(`
      SELECT 
        cr.id,
        cr.status,
        cr.message,
        cr.created_at,
        u.name as requester_name,
        u.email as requester_email,
        u.phone as requester_phone,
        u.blood_group as requester_blood_group,
        u.area as requester_area
      FROM contact_requests cr
      JOIN users u ON cr.requester_id = u.id
      WHERE cr.donor_id = ?
      ORDER BY cr.created_at DESC
    `, [decoded.userId]);

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

    const db = await getDatabase();

    // Update contact request status
    const result = await db.run(
      'UPDATE contact_requests SET status = ? WHERE id = ? AND donor_id = ?',
      [status, requestId, decoded.userId]
    );

    if (result.changes === 0) {
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