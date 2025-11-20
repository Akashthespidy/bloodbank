import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
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

    const db = await getDatabase();

    // Get requester info
    const requester = await db.get(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!requester) {
      return NextResponse.json(
        { error: 'Requester not found' },
        { status: 404 }
      );
    }

    // Get donor info
    const donor = await db.get(
      'SELECT id, name, email, blood_group, area FROM users WHERE id = ? AND is_donor = true',
      [validatedData.donorId]
    );

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    // Check if request already exists
    const existingRequest = await db.get(
      'SELECT id FROM contact_requests WHERE requester_id = ? AND donor_id = ? AND status = "pending"',
      [decoded.userId, validatedData.donorId]
    );

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Contact request already sent' },
        { status: 400 }
      );
    }

    // Create contact request
    const result = await db.run(
      `INSERT INTO contact_requests (requester_id, donor_id, message)
       VALUES (?, ?, ?)`,
      [decoded.userId, validatedData.donorId, validatedData.message || null]
    );

    // Send email to donor
    await sendContactRequestEmail(
      donor.email,
      donor.name,
      requester.name,
      donor.blood_group,
      donor.area
    );

    return NextResponse.json({
      message: 'Contact request sent successfully',
      requestId: result.lastID
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