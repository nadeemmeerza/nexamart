// src/constants/adminConstants.ts

export const ADMIN_ENDPOINTS = {
  DASHBOARD: '/api/admin/dashboard',
  PRODUCTS: '/api/admin/products',
  INVENTORY: '/api/admin/inventory',
  ORDERS: '/api/admin/orders',
  CUSTOMERS: '/api/admin/customers',
  ANALYTICS: '/api/admin/analytics',
};

// Order statuses with colors
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#f59e0b', bgColor: '#fef3c7' },
  { value: 'processing', label: 'Processing', color: '#3b82f6', bgColor: '#eff6ff' },
  { value: 'shipped', label: 'Shipped', color: '#8b5cf6', bgColor: '#f3e8ff' },
  { value: 'delivered', label: 'Delivered', color: '#10b981', bgColor: '#d1fae5' },
  { value: 'cancelled', label: 'Cancelled', color: '#ef4444', bgColor: '#fee2e2' },
];

// Inventory status thresholds
export const INVENTORY_THRESHOLDS = {
  LOW_STOCK: 10,
  CRITICAL_STOCK: 5,
};

// Inventory statuses with colors
export const INVENTORY_STATUSES = [
  { value: 'in-stock', label: 'In Stock', color: '#10b981', bgColor: '#d1fae5' },
  { value: 'low-stock', label: 'Low Stock', color: '#f59e0b', bgColor: '#fef3c7' },
  { value: 'out-of-stock', label: 'Out of Stock', color: '#ef4444', bgColor: '#fee2e2' },
];

// Admin error messages
export const ADMIN_ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access. Admin privileges required.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  ORDER_NOT_FOUND: 'Order not found.',
  INVENTORY_UPDATE_FAILED: 'Failed to update inventory.',
  PRODUCT_DELETE_FAILED: 'Failed to delete product.',
  STATS_FETCH_FAILED: 'Failed to fetch statistics.',
};
