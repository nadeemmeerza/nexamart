// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { createUser, findUserByEmail } from '@/app/services/user-service';
import { authValidators } from '@/app/services/utils/authValidators';
import { createUser, findUserByEmail } from '@/lib/auth/user-service';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, confirmPassword } = await request.json();

    // Server-side validation
    const validation = authValidators.validateSignupForm(
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create user using your service function
    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });

    // Return user without password
    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: safeUser 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}