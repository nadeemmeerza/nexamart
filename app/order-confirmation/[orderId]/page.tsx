// src/app/order-confirmation/[orderId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/app/types/order.types';
import { CheckoutAddress } from '@/app/types/address.types'; // Import the correct type

const fetchOrderDetails = async (orderId: string): Promise<Order> => {
  const response = await fetch(`/api/orders/${orderId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Order not found');
    }
    throw new Error('Failed to fetch order details');
  }
  const data = await response.json();
  return data;
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.orderId as string;

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        const orderData = await fetchOrderDetails(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Error loading order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

   const handleClose = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Order Data</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/20 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-2">
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="text-gray-600">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
      
      {/* Additional Close Button at Bottom */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleClose}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}