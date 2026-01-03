// src/components/checkout/CartPage/CartItem.tsx
'use client';

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import styles from './CartPage.module.css';
import type { CartItem as CartItemType } from '../../../types/product.types';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImage}>
        <span className={styles.imagePlaceholder}>
          <Image src={item.image as string} alt="thumbnail" width={60} height={60}/>
          </span>
      </div>

      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <p className={styles.itemBrand}>{item.brand}</p>
        <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
      </div>

      <div className={styles.itemQuantity}>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className={styles.quantityButton}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, Math.max(1, Number(e.target.value)))}
          className={styles.quantityInput}
          aria-label="Quantity"
        />
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className={styles.quantityButton}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className={styles.itemTotal}>
        <p className={styles.totalPrice}>${itemTotal.toFixed(2)}</p>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className={styles.removeButton}
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
