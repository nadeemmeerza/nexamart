// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.sku || !data.price || !data.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = data.slug || data.name.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');

    // Create product in database
    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        slug: slug,
        description: data.description || '',
        shortDescription: data.shortDescription || '',
        categoryId: data.categoryId,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
        images: data.images || [],
        thumbnail: data.thumbnail || data.images?.[0] || null,
        weight: data.weight ? parseFloat(data.weight) : null,
        dimensions: data.dimensions || null,
        status: data.status || 'active',
        visibility: data.visibility || 'visible',
        seo: data.seo || null,
        metadata: data.metadata || null,
        publishedAt: data.status === 'active' ? new Date() : null,
      },
    });

    // Create inventory record for the product
    const initialStock = parseInt(data.initialStock) || 0;
    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: initialStock,
        reserved: 0,
        reorder: parseInt(data.reorderPoint) || 10,
        status: initialStock > 0 
          ? (initialStock <= (parseInt(data.reorderPoint) || 10) ? 'low_stock' : 'in_stock')
          : 'out_of_stock',
        warehouse: data.warehouse || null,
      },
    });

    // If there's initial stock, create inventory movement record
    if (initialStock > 0) {
      await prisma.inventoryMovement.create({
        data: {
          inventoryId: inventory.id,
          type: 'in',
          quantity: initialStock,
          reason: 'initial_stock',
          notes: 'Initial stock added during product creation',
        },
      });
    }

    return NextResponse.json({
      success: true,
      product: product,
      inventory: inventory,
    });

  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      const field = (error.meta?.target || []).includes('sku') ? 'SKU' : 'Slug';
      return NextResponse.json(
        { error: `${field} already exists. Please use a different ${field.toLowerCase()}.` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}