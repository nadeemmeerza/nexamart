// src/types/checkout.types.ts

import { Address } from "./address.types";
import {CheckoutState, Order, PaymentMethod, ShippingMethod } from "./order.types";

export interface CheckoutContextType {
  checkout: CheckoutState;
  updateShippingAddress: (address: Address) => void;
  updateBillingAddress: (address: Address) => void;
  updateShippingMethod: (method: ShippingMethod) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  setDiscount: (code: string, discount: number) => void;
  processPayment: (paymentDetails: any) => Promise<Order>;
  isProcessing: boolean;
  error: string | null;
  reset: () => void;
}