import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
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

    const db = getDatabase();

    // Check if user already exists
    const existingUser = db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).get(validatedData.email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Insert new user
    const result = db.prepare(
      `INSERT INTO users (email, password, name, phone, blood_group, area, city)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      validatedData.email,
      hashedPassword,
      validatedData.name,
      validatedData.phone || null,
      validatedData.bloodGroup,
      validatedData.area,
      validatedData.city
    );

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: result.lastInsertRowid 
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