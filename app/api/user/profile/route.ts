// app/api/user/profile.ts

// import { auth } from '@/app/auth';
import { auth } from '@/app/auth';
import prisma from '@/lib/prisma';
// import { getSession } from 'next-auth/react';


export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      }
    });
    
    return new Response(JSON.stringify({ user }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch user data' }), { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { firstName, lastName, phone, avatar } = await request.json();
    
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        phone,
        avatar,
        updatedAt: new Date(),
      }
    });
    console.log(user);
    return new Response(JSON.stringify({ user }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update user data' }), { status: 500 });
  }
}