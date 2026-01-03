// app/components/admin/Orders/OrdersTable.tsx
'use client';

import React from 'react';
import { Eye, MoreVertical, User } from 'lucide-react';
import { ORDER_STATUSES } from '@/app/constants/adminConstants';
import type { Order } from '@/app/types/order.types';

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  isLoading?: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onViewDetails,
  isLoading = false,
}) => {
  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status);
    return statusObj?.color || '#6b7280';
  };

  // Helper function to get customer name safely
  const getCustomerName = (order: Order) => {
    if (order.shippingAddress) {
      // Try to get from user if available
      const user = order.shippingAddress
      if (user.firstName && user.lastName) {
        return `$user.firstName} ${user.lastName}`;
      }
      return 'Unknown Customer';
    }
    
    // Check if shippingAddress is an object with firstName/lastName
    if (typeof order.shippingAddress === 'object' && order.shippingAddress !== null) {
      const addr = order.shippingAddress as any;
      if (addr.firstName && addr.lastName) {
        return `${addr.firstName} ${addr.lastName}`;
      }
    }
    
    return 'Unknown Customer';
  };

  // Helper function to get customer email safely
  const getCustomerEmail = (order: Order) => {   
    
    if (typeof order.shippingAddress === 'object' && order.shippingAddress !== null) {
      const addr = order.shippingAddress as any;
      return addr.email;
    }    
    return  'No email';
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-mono font-semibold text-gray-900">
                  {order.orderNumber || `ORD-${order.id?.slice(-8) || 'N/A'}`}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {getCustomerName(order)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getCustomerEmail(order)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-900">
                  ${order.total?.toFixed(2) || '0.00'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${getStatusColor(order.status)}20`, 
                    color: getStatusColor(order.status) 
                  }}
                >
                  {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  {order.items?.length || 0} items
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};