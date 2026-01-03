// app/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Order } from '../types/order.types';
import { CartItem } from '../types/product.types';

interface ExtendedOrder extends Order {
  orderNumber: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: string;
  fulfillmentStatus?: string;
  createdAt: Date;
  updatedAt: Date;
  total: number;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router, filter, searchTerm]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: '⏳',
      processing: '🔄',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌',
    };
    return icons[status as keyof typeof icons] || '📦';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading') {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in to view your orders</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-600 mb-8">View and manage your orders</p>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter(status as any)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-2">No orders found</p>
            <p className="text-gray-400">
              {filter === 'all' && searchTerm === ''
                ? "You haven't placed any orders yet."
                : `No orders match your current filters.`}
            </p>
            {(filter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                }}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                View All Orders
              </button>
            )}
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              {/* Order Header */}
              <div className="border-b p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getStatusIcon(order.status)}</div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 flex flex-col md:items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">Image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        {item.brand && (
                          <p className="text-gray-600 text-sm">Brand: {item.brand}</p>
                        )}
                        {item.category && (
                          <p className="text-gray-500 text-sm">Category: {item.category}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        <p className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="mt-6 pt-6 border-t flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Order ID:</span> {order.id}
                    </p>
                    <p>
                      <span className="font-medium">Last updated:</span> {formatDate(order.updatedAt)}
                    </p>
                    {order?.trackingNumber && (
                      <p>
                        <span className="font-medium">Tracking:</span> {order?.trackingNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors">
                        Leave Review
                      </button>
                    )}
                    {['pending', 'processing'].includes(order.status) && (
                      <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors">
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-colors">
                        Track Package
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}