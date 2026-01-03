// src/components/products/ProductFilter/PriceRangeFilter.tsx

'use client';

import React from 'react';
import { PRICE_RANGE_MIN, PRICE_RANGE_MAX, PRICE_STEP } from '../../../constants/filterConstants';
import styles from './ProductFilter.module.css';

interface PriceRangeFilterProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRange,
  onPriceChange,
}) => {
  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterTitle}>Price Range</h3>
      
      <div className={styles.priceInputs}>
        <input
          type="number"
          min={PRICE_RANGE_MIN}
          max={PRICE_RANGE_MAX}
          value={priceRange[0]}
          onChange={(e) => {
            const newMin = Math.min(Number(e.target.value), priceRange[1]);
            onPriceChange([newMin, priceRange[1]]);
          }}
          placeholder="Min"
          className={styles.priceInput}
        />
        <span className={styles.priceSeparator}>—</span>
        <input
          type="number"
          min={PRICE_RANGE_MIN}
          max={PRICE_RANGE_MAX}
          value={priceRange[1]}
          onChange={(e) => {
            const newMax = Math.max(Number(e.target.value), priceRange[0]);
            onPriceChange([priceRange[0], newMax]);
          }}
          placeholder="Max"
          className={styles.priceInput}
        />
      </div>

      <input
        type="range"
        min={PRICE_RANGE_MIN}
        max={PRICE_RANGE_MAX}
        step={PRICE_STEP}
        value={priceRange[0]}
        onChange={(e) => {
          const newMin = Math.min(Number(e.target.value), priceRange[1]);
          onPriceChange([newMin, priceRange[1]]);
        }}
        className={styles.rangeSlider}
      />

      <input
        type="range"
        min={PRICE_RANGE_MIN}
        max={PRICE_RANGE_MAX}
        step={PRICE_STEP}
        value={priceRange[1]}
        onChange={(e) => {
          const newMax = Math.max(Number(e.target.value), priceRange[0]);
          onPriceChange([priceRange[0], newMax]);
        }}
        className={styles.rangeSlider}
      />

      <p className={styles.priceDisplay}>
        ${priceRange[0]} — ${priceRange[1]}
      </p>
    </div>
  );
};
