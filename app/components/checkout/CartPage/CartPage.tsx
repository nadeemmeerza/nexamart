// src/components/checkout/CartPage/CartPage.tsx

'use client';

import React, { useState } from 'react';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import styles from './CartPage.module.css';
import type { CartItem as CartItemType } from '../../../types/product.types';
import { redirect } from 'next/navigation';

interface CartPageProps {
  items: CartItemType[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.1; // 10% tax
  const shipping = items.length > 0 ? 10 : 0;

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className={styles.emptyTitle}>Your cart is empty !</h2>
        <p className={styles.emptyDescription}>
          Looks like you haven't added anything yet. Start shopping!
        </p>
        <button className={styles.continueShopping} onClick={continueShoping}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </button>
      </div>
    );
  }

  function continueShoping(){
    redirect("/")
  }

  return (
    <div className={styles.cartPageContainer}>
      <div className={styles.cartHeader}>
        <h1 className={styles.pageTitle}>Shopping Cart</h1>
        <p className={styles.itemCount}>{items.length} items</p>
      </div>

      <div className={styles.cartContent}>
        {/* Cart Items */}
        <div className={styles.cartItems}>
          <div className={styles.itemsHeader}>
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))}
        </div>

        {/* Order Summary */}
        <CartSummary
          subtotal={subtotal}
          tax={estimatedTax}
          shipping={shipping}
          onCheckout={onCheckout}
        />
      </div>
    </div>
  );
};