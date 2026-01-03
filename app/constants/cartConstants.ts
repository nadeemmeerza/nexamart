// src/constants/cartConstants.ts

import { ShippingMethod } from "../types/order.types";

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 5.99,
    estimatedDays: 7,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 14.99,
    estimatedDays: 3,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 29.99,
    estimatedDays: 1,
  },
];

export const TAX_RATE = 0.1; // 10%
export const CART_STORAGE_KEY = 'nexamart_cart';
export const CHECKOUT_STORAGE_KEY = 'nexamart_checkout';
