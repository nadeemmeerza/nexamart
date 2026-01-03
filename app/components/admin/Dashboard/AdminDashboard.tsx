// src/components/admin/Dashboard/AdminDashboard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { InventoryTable } from '../Inventory/InventoryTable';
import { OrdersTable } from '../Orders/OrdersTable';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  AlertCircle,
  LogOut,
  Home,
} from 'lucide-react';
import type { Order } from '@/app/types/order.types';
import { StatsCard } from '../StatsCard';
import { useAdmin } from '@/app/context/AdminContext';
import { useSession } from 'next-auth/react';
import { AddProductModal } from '../AddProductModal';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/auth';


export const AdminDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const [showAddProductModal, setShowAddProductModal] = useState(false);

 
  const {
    stats,
    inventory,
    isLoading,
    error,
    fetchStats,
    fetchInventory,
    updateInventory,
  } = useAdmin();

  useEffect(() => {
    fetchStats();
    fetchInventory();
  }, [fetchStats, fetchInventory]);

   if(session?.user.role != "admin")
     return (
         <div className="flex items-center justify-center min-h-screen">
           Your are not authorized!
         </div>
       )

  const lowStockItems = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');

  const handleInventoryUpdate = async (id: string, quantity: number) => {
    try {
      await updateInventory(id, quantity);
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  const handleViewOrder = (order: Order) => {
    console.log('View order:', order);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-lg text-gray-600 mt-1">
              Welcome back, {session?.user?.name}!
            </p>
          </div>
          <div className=" text-cyan-600 ">
            <Home onClick={()=>redirect("/")} className='hover:text-cyan-300'/>            
          </div>
          <div className="text-gray-700 font-medium">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Sales"
          value={stats ? `$${stats.totalSales.toFixed(2)}` : '$0.00'}
          icon={<DollarSign className="w-6 h-6" />}
          trend={12.5}
          trendLabel="vs last month"
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={<ShoppingCart className="w-6 h-6" />}
          trend={8.2}
          trendLabel="vs last month"
        />
        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={<Users className="w-6 h-6" />}
          trend={5.1}
          trendLabel="new this month"
        />
        <StatsCard
          title="Avg Order Value"
          value={stats ? `$${stats.averageOrderValue.toFixed(2)}` : '$0.00'}
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-2">Today</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats?.revenue.today.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-2">This Week</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats?.revenue.thisWeek.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-2">This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats?.revenue.thisMonth.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-2">This Year</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats?.revenue.thisYear.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-8 text-yellow-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">
            {lowStockItems.length} product{lowStockItems.length !== 1 ? 's' : ''} need{lowStockItems.length === 1 ? 's' : ''} attention - low or out of stock
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-8 text-red-800">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Inventory Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-gray-500" />
            Inventory Management
          </h2>
          <button onClick={() => setShowAddProductModal(true)}
           className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200">
            Add Product
          </button>
        </div>
        {inventory.length > 0 ? (
          <InventoryTable
            items={inventory}
            onUpdate={handleInventoryUpdate}
            onDelete={() => {}}
            isLoading={isLoading}
          />
        ) : (
          <p className="text-center py-8 text-gray-500">No inventory items found</p>
        )}
      </div>

      {/* Orders Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-gray-500" />
            Recent Orders
          </h2>
          <a 
            href="/admin/orders" 
            className="text-black font-semibold hover:text-gray-700 hover:underline transition-colors duration-200"
          >
            View all orders →
          </a>
        </div>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <OrdersTable
            orders={stats.recentOrders}
            onViewDetails={handleViewOrder}
            isLoading={isLoading}
          />
        ) : (
          <p className="text-center py-8 text-gray-500">No recent orders</p>
        )}
      </div>
      {showAddProductModal && (
  <AddProductModal
    isOpen={showAddProductModal}
    onClose={() => setShowAddProductModal(false)}
    onSuccess={() => {
      setShowAddProductModal(false);
      fetchInventory(); // Refresh the inventory list
      fetchStats(); // Refresh stats if needed
    }}
  />
)}
    </div>
  );
};