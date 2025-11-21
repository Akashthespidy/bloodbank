import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This login endpoint is deprecated. Please use Clerk authentication.' },
    { status: 410 }
  );
}
