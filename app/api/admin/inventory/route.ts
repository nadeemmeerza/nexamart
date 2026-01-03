// app/api/admin/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters for filtering/sorting
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const searchQuery = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (statusFilter) {
      where.status = statusFilter;
    }

    if (searchQuery) {
      where.OR = [
        {
          product: {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        },
        {
          product: {
            sku: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Fetch inventory with related product data
    const [inventoryItems, totalCount] = await Promise.all([
      prisma.inventory.findMany({
        where,
        include: {
          product: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
          variant: {
            select: {
              name: true,
              sku: true,
              attributes: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.inventory.count({ where }),
    ]);

    // Transform data to match your InventoryItem type
    const transformedItems = inventoryItems.map((item) => {
      // Determine status mapping
      let status: 'in-stock' | 'low-stock' | 'out-of-stock';
      switch (item.status) {
        case 'in_stock':
          status = 'in-stock';
          break;
        case 'low_stock':
          status = 'low-stock';
          break;
        case 'out_of_stock':
          status = 'out-of-stock';
          break;
        default:
          status = 'in-stock';
      }

      return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId || undefined,
    quantity: item.quantity,
    reserved: item.reserved || 0,
    reorderLevel: item.reorder || 10,
    status: status,
    warehouse: item.warehouse || undefined,
    lastRestocked: item.updatedAt, // or use a specific lastRestocked field if you have it
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    product: item.product ? {
      id: item.product.id,
      name: item.product.name,
      sku: item.product.sku,
      price: item.product.price,
      images: item.product.images || [],
      category: item.product.category?.name || 'Uncategorized',
      description: item.product.description || '',
      shortDescription: item.product.shortDescription || '',
      comparePrice: item.product.comparePrice,
      costPrice: item.product.costPrice,
      weight: item.product.weight,
      dimensions: item.product.dimensions as any,
      status: item.product.status,
      visibility: item.product.visibility,
      rating: item.product.rating,
      reviewCount: item.product.reviewCount,
      categoryId: item.product.categoryId,
      createdAt: item.product.createdAt,
      updatedAt: item.product.updatedAt,
    } : undefined,
  };
    });

    return NextResponse.json({
      items: transformedItems,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });

  } catch (error: any) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const { inventoryId, quantity, reason } = data;

    if (!inventoryId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: inventoryId and quantity' },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get current inventory
      const currentInventory = await tx.inventory.findUnique({
        where: { id: inventoryId },
      });

      if (!currentInventory) {
        throw new Error('Inventory item not found');
      }

      // Calculate new status based on quantity
      let newStatus = 'in_stock';
      if (quantity === 0) {
        newStatus = 'out_of_stock';
      } else if (quantity <= currentInventory.reorder) {
        newStatus = 'low_stock';
      }

      // Update inventory
      const updatedInventory = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          quantity: quantity,
          status: newStatus,
          updatedAt: new Date(),
        },
      });

      // Create inventory movement record
      const movementType = quantity > currentInventory.quantity ? 'in' : 'out';
      const movementQuantity = Math.abs(quantity - currentInventory.quantity);

      if (movementQuantity > 0) {
        await tx.inventoryMovement.create({
          data: {
            inventoryId: inventoryId,
            type: movementType,
            quantity: movementQuantity,
            reason: reason || 'manual_adjustment',
            notes: `Quantity updated from ${currentInventory.quantity} to ${quantity}`,
          },
        });
      }

      return updatedInventory;
    });

    return NextResponse.json({
      success: true,
      message: 'Inventory updated successfully',
      inventory: result,
    });

  } catch (error: any) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory', details: error.message },
      { status: 500 }
    );
  }
}