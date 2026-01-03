// src/components/checkout/CheckoutForm/ShippingMethodSelector.tsx

'use client';

import React from 'react';
import { Truck, Clock } from 'lucide-react';
import styles from './CheckoutForm.module.css';
import { SHIPPING_METHODS } from '@/app/constants/cartConstants';
import type { ShippingMethod } from '@/app/types/order.types';

interface ShippingMethodSelectorProps {
  selectedMethod: ShippingMethod | null;
  onSelect: (method: ShippingMethod) => void;
}

export const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
}) => {
  return (
    <div className={styles.shippingContainer}>
      <h2 className={styles.formTitle}>Select Shipping Method</h2>

      <div className={styles.shippingMethods}>
        {SHIPPING_METHODS.map(method => (
          <label key={method.id} className={styles.shippingOption}>
            <input
              type="radio"
              name="shipping"
              value={method.id}
              checked={selectedMethod?.id === method.id}
              onChange={() => onSelect(method)}
              className={styles.radioInput}
            />
            <div className={styles.shippingDetails}>
              <div className={styles.shippingHeader}>
                <Truck className="w-5 h-5 text-gray-600" />
                <div>
                  <p className={styles.shippingName}>{method.name}</p>
                  <p className={styles.shippingDescription}>{method.description}</p>
                </div>
              </div>
              <p className={styles.shippingPrice}>${method.price.toFixed(2)}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};