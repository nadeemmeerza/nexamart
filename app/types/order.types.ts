// src/types/order.types.ts
import { CartItem } from "./product.types";
import { Address, CheckoutAddress } from "./address.types"; // Import from address.types

// Remove the duplicate Address interface from here
// Use the imported Address types from address.types.ts

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  last4?: string;
  brand?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: CheckoutAddress; // Use CheckoutAddress which includes personal info
  billingAddress: CheckoutAddress; // Use CheckoutAddress which includes personal info
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
}

export interface CheckoutState {
  shippingAddress: CheckoutAddress | null; // Use CheckoutAddress for checkout
  billingAddress: CheckoutAddress | null; // Use CheckoutAddress for checkout
  shippingMethod: ShippingMethod | null;
  paymentMethod: PaymentMethod | null;
  couponCode?: string;
  discount?: number;
  isProcessing: boolean;
  error: string | null;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrderFilter {
  status?: Order['status'];
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export interface OrderSortOption {
  field: 'createdAt' | 'total' | 'status';
  direction: 'asc' | 'desc';
}