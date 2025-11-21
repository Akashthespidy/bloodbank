import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  area: z.string().min(2),
  city: z.string().min(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Insert new user
    const result = await db.insert(users).values({
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
      phone: validatedData.phone || null,
      bloodGroup: validatedData.bloodGroup,
      area: validatedData.area,
      city: validatedData.city,
      isDonor: true,
    }).returning({ id: users.id });

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: result[0].id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
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