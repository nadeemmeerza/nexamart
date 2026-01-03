// src/components/checkout/CartPage/CartSummary.tsx

'use client';

import React from 'react';
import styles from './CartPage.module.css';
import { redirect } from 'next/navigation';

interface CartSummaryProps {
  subtotal: number;
  tax?: number;
  shipping?: number;
  onCheckout: () => void;
  isCheckoutDisabled?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax = 0,
  shipping = 10,
  onCheckout,
  isCheckoutDisabled = false,
}) => {
  const total = subtotal + tax + shipping;

  return (
    <div className={styles.cartSummary}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>

      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className={styles.summaryRow}>
        <span>Tax (estimated)</span>
        <span>${tax.toFixed(2)}</span>
      </div>

      <div className={styles.summaryRow}>
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.summaryTotal}>
        <span>Total</span>
        <span className={styles.totalAmount}>${total.toFixed(2)}</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className={styles.checkoutButton}
      >
        Proceed to Checkout
      </button>

      <button className={styles.continueShopping} onClick={()=>redirect("/")}>
        Continue Shopping
      </button>
    </div>
  );
};
