import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const donorId = parseInt(params.id);
    
    if (isNaN(donorId)) {
      return NextResponse.json(
        { error: 'Invalid donor ID' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    const donor = db.prepare(
      'SELECT id, name, blood_group, area, city, created_at FROM users WHERE id = ? AND is_donor = 1'
    ).get(donorId);

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      donor
    });
  } catch (error) {
    console.error('Get donor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 