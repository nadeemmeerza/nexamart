// src/components/products/ProductFilter/CategoryFilter.tsx

'use client';

import React from 'react';
import { CATEGORIES } from '../../../constants/filterConstants';
import styles from './ProductFilter.module.css';

interface CategoryFilterProps {
  selectedCategories: string[];
  onToggle: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onToggle,
}) => {
  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterTitle}>Categories</h3>
      <div className={styles.checkboxGroup}>
        {CATEGORIES.map(category => (
          <label key={category} className={styles.checkbox}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onToggle(category)}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxLabel}>{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
