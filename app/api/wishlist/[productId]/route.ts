// app/api/wishlist/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';


// GET: Check if product is in wishlist
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        isInWishlist: false,
        error: 'Unauthorized'
      }, { status: 200 });
    }
    
    const params = await context.params;
    const  productId  =  params.productId;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get user's wishlist and check if item exists
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          where: { productId },
        },
      },
    });
    // if wishlist exist then return true else false
    const isInWishlist = wishlist ? true : false;
    
    return NextResponse.json({ 
      isInWishlist,
      productId 
    });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return NextResponse.json(
      { 
        isInWishlist: false,
        error: 'Failed to check wishlist' 
      },
      { status: 500 }
    );
  }
}

// POST: Add item to wishlist
export async function POST(
  request: NextRequest,
  context: { params: Promise<{productId:string}> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await context.params;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      );
    }

    // Add to wishlist
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Added to wishlist'
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE: Remove item from wishlist
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{productId:string}> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await context.params;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get user's wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
    });

    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Check if item exists
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    // Remove item
    await prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Removed from wishlist'
    });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}