// app/api/cart/add/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 API Request body:', JSON.stringify(body, null, 2));
    
    const { userId, product, quantity } = body;

    // Validate required fields
    if (!userId) {
      console.error('❌ Missing userId');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!product || !product.id) {
      console.error('❌ Invalid product data:', product);
      return NextResponse.json({ error: 'Valid product is required' }, { status: 400 });
    }

    if (!quantity || quantity <= 0) {
      console.error('❌ Invalid quantity:', quantity);
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 });
    }

    // ✅ Convert product.id to string to ensure compatibility with MongoDB
    const productId = String(product.id);
    console.log('🔍 Product ID conversion:', {
      original: product.id,
      type: typeof product.id,
      converted: productId,
      convertedType: typeof productId
    });

    console.log('🔍 Validated data:', { userId, productId, quantity });

    // Test database connection first
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    console.log('🛒 Found cart:', cart);

    if (!cart) {
      console.log('🆕 Creating new cart for user:', userId);
      try {
        cart = await prisma.cart.create({
          data: { 
            userId,
            subtotal: 0,
            taxAmount: 0,
            shippingCost: 0,
            discountAmount: 0,
            total: 0
          },
        });
        console.log('✅ Created cart:', cart);
      } catch (createError) {
        console.error('❌ Failed to create cart:', createError);
        return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
      }
    }

    // ✅ Check if item already exists in cart - using converted string productId
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId, // ✅ Use the converted string
        },
      },
    });

    console.log('🔍 Existing cart item:', existingItem);

    if (existingItem) {
      // Update quantity
      console.log('📈 Updating quantity from', existingItem.quantity, 'to', existingItem.quantity + quantity);
      try {
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { 
            quantity: existingItem.quantity + quantity,
            updatedAt: new Date(),
          },
        });
        console.log('✅ Quantity updated successfully:', updatedItem);
      } catch (updateError) {
        console.error('❌ Failed to update cart item:', updateError);
        return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
      }
    } else {
      // ✅ Add new item - using converted string productId
      console.log('🆕 Creating new cart item');
      try {
        const newItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: productId, // ✅ Use the converted string
            quantity,
            price: product.price,
          },
        });
        console.log('✅ New cart item created:', newItem);
      } catch (createError) {
        console.error('❌ Failed to create cart item:', createError);
        return NextResponse.json({ error: 'Failed to create cart item' }, { status: 500 });
      }
    }

    console.log('✅ Cart operation completed successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Unexpected error in cart/add API:', error);
    
    // More detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', { errorMessage, errorStack });
    
    return NextResponse.json({ 
      error: 'Failed to add item to cart',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}