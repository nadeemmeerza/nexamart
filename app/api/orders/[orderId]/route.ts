// src/app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Order } from '@/app/types/order.types';

// Helper function to convert Prisma order to your Order type
function convertToOrderType(prismaOrder: any): Order {
  // Get user info for personal details
  const user = prismaOrder.user;
  const shippingAddress = prismaOrder.shippingAddress;
  
  return {
    id: prismaOrder.id,
    orderNumber: prismaOrder.orderNumber,
    userId: prismaOrder.userId,
    items: prismaOrder.items.map((item: any) => ({
      id: item.id,
      name: item.name || `Product ${item.productId}`,
      price: item.price,
      quantity: item.quantity,
      image: item.product?.images?.[0] || item.product?.thumbnail || '',
    })),
    shippingAddress: {
      // Base Address properties
      type: shippingAddress?.type || 'home',
      street: shippingAddress?.street || '',
      apartment: shippingAddress?.apartment || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || '',
      postalCode: shippingAddress?.postalCode || '',
      country: shippingAddress?.country || '',
      isDefault: shippingAddress?.isDefault || false,
      isShipping: shippingAddress?.isShipping !== undefined ? shippingAddress.isShipping : true,
      isBilling: shippingAddress?.isBilling || false,
      // CheckoutAddress personal info properties
      firstName: user?.firstName || 'Customer',
      lastName: user?.lastName || 'Name',
      email: user?.email || 'customer@example.com',
      phone: user?.phone || '',
    },
    billingAddress: {
      // For now, use the same as shipping address
      type: shippingAddress?.type || 'home',
      street: shippingAddress?.street || '',
      apartment: shippingAddress?.apartment || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || '',
      postalCode: shippingAddress?.postalCode || '',
      country: shippingAddress?.country || '',
      isDefault: shippingAddress?.isDefault || false,
      isShipping: shippingAddress?.isShipping !== undefined ? shippingAddress.isShipping : true,
      isBilling: shippingAddress?.isBilling || false,
      // CheckoutAddress personal info properties
      firstName: user?.firstName || 'Customer',
      lastName: user?.lastName || 'Name',
      email: user?.email || 'customer@example.com',
      phone: user?.phone || '',
    },
    shippingMethod: {
      id: 'standard',
      name: 'Standard Shipping',
      description: '3-5 business days',
      price: prismaOrder.shippingCost,
      estimatedDays: 5
    },
    paymentMethod: {
      type: (prismaOrder.paymentMethod as 'card' | 'paypal' | 'apple-pay' | 'google-pay') || 'card',
    },
    subtotal: prismaOrder.subtotal,
    tax: prismaOrder.taxAmount,
    shipping: prismaOrder.shippingCost,
    total: prismaOrder.total,
    status: mapOrderStatus(prismaOrder.status),
    createdAt: prismaOrder.createdAt,
    updatedAt: prismaOrder.updatedAt,
  };
}

// Helper function to map Prisma order status to your Order status
function mapOrderStatus(prismaStatus: string): Order['status'] {
  const statusMap: Record<string, Order['status']> = {
    'pending': 'pending',
    'confirmed': 'processing',
    'processing': 'processing',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
    'returned': 'cancelled'
  };
  
  return statusMap[prismaStatus] || 'pending';
} 

export async function GET(
 request: NextRequest,
  context: { params: Promise<{ orderId: string }> } // Change to this signature
) {
  try {
    // Await the params promise
    const params = await context.params;
    const orderId = params.orderId;
    
    console.log('🔍 Fetching order with ID:', orderId);
    
    // Fetch order with minimal includes to avoid relation issues
    const prismaOrder = await prisma.order.findUnique({
      where: { id :orderId },
      include: {
        items: true, // Just get the items without product relation for now
        shippingAddress: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      }
    });

    console.log('📊 Prisma order result:', prismaOrder ? 'FOUND' : 'NOT FOUND');
    
    if (!prismaOrder) {
      console.log('❌ Order not found in database');
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', {
      id: prismaOrder.id,
      orderNumber: prismaOrder.orderNumber,
      itemsCount: prismaOrder.items.length,
      hasShippingAddress: !!prismaOrder.shippingAddress,
      hasUser: !!prismaOrder.user, 
      items:prismaOrder.items

    });

    // Convert to your Order type
    const order = convertToOrderType(prismaOrder);
    
    console.log('🎉 Converted order ready with ID:', order.id);

    return NextResponse.json(order);
  } catch (error) {
    console.error('💥 Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}