// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { auth } from '@/app/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Get user first
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { items: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                category: {
                  select: { name: true }
                }
              }
            }
          }
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match your frontend types
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      items: order.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || '',
        brand: '', // You might want to add brand to your Product model
        category: item.product.category?.name,
      })),
      status: order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingNumber: order.tracking,
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}