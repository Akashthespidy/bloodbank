import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { users } from '@/lib/schema';

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const donorId = parseInt(params.id, 10);

    if (Number.isNaN(donorId)) {
      return NextResponse.json({ error: 'Invalid donor ID' }, { status: 400 });
    }

    const donorResult = await db
      .select({
        id: users.id,
        name: users.name,
        bloodGroup: users.bloodGroup,
        area: users.area,
        city: users.city,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(eq(users.id, donorId), eq(users.isDonor, true)))
      .limit(1);

    const donor = donorResult[0];

    if (!donor) {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
    }

    return NextResponse.json({
      donor,
    });
  } catch (error) {
    console.error('Get donor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
