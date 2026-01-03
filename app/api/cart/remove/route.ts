// app/api/cart/remove/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const { userId, productId } = await request.json();

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

    // Remove item from cart
    await prisma.cartItem.delete({
      where: { id: existingItem.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}