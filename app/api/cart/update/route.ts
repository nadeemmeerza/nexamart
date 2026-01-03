// app/api/cart/update/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { userId, productId, quantity } = await request.json();

  try {
    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Check if item exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}