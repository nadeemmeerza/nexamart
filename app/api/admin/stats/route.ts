// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

    // Get stats from database
    const [
      totalSales,
      totalOrders,
      totalCustomers,
      pendingOrders,
      inventoryStats,
      recentOrders,
    ] = await Promise.all([
      // Total sales (sum of all completed order totals)
      prisma.order.aggregate({
        where: {
          paymentStatus: 'completed',
        },
        _sum: {
          total: true,
        },
      }),
      
      // Total orders
      prisma.order.count(),
      
      // Total customers
      prisma.user.count({
        where: {
          role: 'customer',
        },
      }),
      
      // Pending orders
      prisma.order.count({
        where: {
          status: 'pending',
        },
      }),
      
      // Inventory stats
      prisma.inventory.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      }),
      
      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          items: {
            take: 1,
          },
        },
      }),
    ]);

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 
      ? (totalSales._sum.total || 0) / totalOrders
      : 0;

    // Calculate revenue by period
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [todayRevenue, weekRevenue, monthRevenue, yearRevenue] = await Promise.all([
      prisma.order.aggregate({
        where: {
          paymentStatus: 'completed',
          createdAt: {
            gte: todayStart,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'completed',
          createdAt: {
            gte: weekStart,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'completed',
          createdAt: {
            gte: monthStart,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'completed',
          createdAt: {
            gte: yearStart,
          },
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    // Get top products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Fetch product details for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            images: true,
          },
        });
        
        return {
          id: item.productId,
          name: product?.name || 'Unknown Product',
          price: product?.price || 0,
          image: product?.images?.[0] || '',
          quantitySold: item._sum.quantity || 0,
        };
      })
    );

    return NextResponse.json({
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      totalCustomers,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      pendingOrders,
      revenue: {
        today: todayRevenue._sum.total || 0,
        thisWeek: weekRevenue._sum.total || 0,
        thisMonth: monthRevenue._sum.total || 0,
        thisYear: yearRevenue._sum.total || 0,
      },
      inventoryStats: {
        inStock: inventoryStats.find(s => s.status === 'in_stock')?._count.id || 0,
        lowStock: inventoryStats.find(s => s.status === 'low_stock')?._count.id || 0,
        outOfStock: inventoryStats.find(s => s.status === 'out_of_stock')?._count.id || 0,
      },
      topProducts: topProductDetails,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown',
        email: order.user?.email || '',
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      })),
    });

  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}