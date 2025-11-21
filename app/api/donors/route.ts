import { and, desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { users } from '@/lib/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const area = searchParams.get('area');
    const city = searchParams.get('city');

    const conditions = [eq(users.isDonor, true)];

    if (bloodGroup) {
      conditions.push(eq(users.bloodGroup, bloodGroup));
    }

    if (area) {
      conditions.push(eq(users.area, area));
    }

    if (city) {
      conditions.push(eq(users.city, city));
    }

    const donors = await db
      .select({
        id: users.id,
        name: users.name,
        bloodGroup: users.bloodGroup,
        area: users.area,
        city: users.city,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(...conditions))
      .orderBy(desc(users.createdAt));

    return NextResponse.json({
      donors,
      count: donors.length,
    });
  } catch (error) {
    console.error('Donors search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
