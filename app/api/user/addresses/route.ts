// src/app/api/user/addresses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { addresses: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.addresses);
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, street, apartment, city, state, postalCode, country, isDefault, isShipping, isBilling } = body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id,
          isDefault: true 
        },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id!,
        type,
        street,
        apartment,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || false,
        isShipping: isShipping !== undefined ? isShipping : true,
        isBilling: isBilling || false,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error('Failed to create address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}