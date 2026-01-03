// src/app/api/checkout/process/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Checkout process called with:', body);

    const {
      shippingAddress,
      paymentData,
      shippingMethod,
      cartItems,
      subtotal,
      shippingCost,
      total
    } = body;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.cart || user.cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Create or find address
    let address = await prisma.address.findFirst({
      where: {
        userId: user.id,
        street: shippingAddress.street,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
      },
    });

    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: user.id,
          type: shippingAddress.type || 'home',
          street: shippingAddress.street,
          apartment: shippingAddress.apartment,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          isDefault: true,
          isShipping: true,
          isBilling: false,
        },
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create the order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        shippingAddressId: address.id,
        
        // Pricing
        subtotal: subtotal || 0,
        taxAmount: 0, // You can calculate tax if needed
        shippingCost: shippingCost || 0,
        discountAmount: 0,
        total: total || 0,
        paid: total || 0,
        
        // Status
        status: 'pending',
        paymentStatus: 'completed',
        fulfillmentStatus: 'unfulfilled',
        
        // Payment method
        paymentMethod: paymentData?.type || 'card',
        
        // Order items
        items: {
          create: user.cart.items.map(cartItem => ({
            productId: cartItem.productId,
            name: cartItem.product.name,
            sku: cartItem.product.sku,
            quantity: cartItem.quantity,
            price: cartItem.price,
            discount: 0,
            tax: 0,
            total: cartItem.price * cartItem.quantity,
            attributes: cartItem.attributes || {},
          })),
        },
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    console.log('Order created successfully:', order.id);

    // Clear the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: user.cart.id },
    });

    await prisma.cart.update({
      where: { id: user.cart.id },
      data: {
        subtotal: 0,
        taxAmount: 0,
        shippingCost: 0,
        discountAmount: 0,
        total: 0,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id, // Real database ID
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      },
    });

  } catch (error) {
    console.error('Checkout process error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}