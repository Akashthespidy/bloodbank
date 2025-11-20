import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const area = searchParams.get('area');
    const city = searchParams.get('city');

    const db = getDatabase();

    let query = `
      SELECT id, name, blood_group, area, city, created_at
      FROM users 
      WHERE is_donor = 1
    `;
    const params: any[] = [];

    if (bloodGroup) {
      query += ' AND blood_group = ?';
      params.push(bloodGroup);
    }

    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }

    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }

    query += ' ORDER BY created_at DESC';

    const donors = db.prepare(query).all(...params);

    return NextResponse.json({
      donors,
      count: donors.length
    });
  } catch (error) {
    console.error('Donors search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 