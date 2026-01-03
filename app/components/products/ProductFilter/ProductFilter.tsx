// src/components/products/ProductFilter/ProductFilter.tsx

'use client';

import React from 'react';
import { PriceRangeFilter } from './PriceRangeFilter';
import { CategoryFilter } from './CategoryFilter';
import { RatingFilter } from './RatingFilter';
import { X } from 'lucide-react';
import styles from './ProductFilter.module.css';
import type { FilterState } from '../../../types/product.types';

interface ProductFilterProps {
  filters: FilterState;
  onPriceChange: (range: [number, number]) => void;
  onToggleCategory: (category: string) => void;
  onToggleBrand?: (brand: string) => void;
  onRatingChange: (rating: number) => void;
  onReset: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onPriceChange,
  onToggleCategory,
  onRatingChange,
  onReset,
  onClose,
  isOpen = true,
}) => {
  const hasActiveFilters = 
    filters.priceRange[0] !== 0 || 
    filters.priceRange[1] !== 500 ||
    filters.categories.length > 0 || 
    filters.minRating > 0;

  return (
    <div className={`${styles.filterContainer} ${isOpen ? styles.open : ''}`}>
      <div className={styles.filterHeader}>
        <h2 className={styles.filterHeading}>Filters</h2>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className={styles.filterContent}>
        <PriceRangeFilter priceRange={filters.priceRange} onPriceChange={onPriceChange} />
        <CategoryFilter selectedCategories={filters.categories} onToggle={onToggleCategory} />
        <RatingFilter minRating={filters.minRating} onRatingChange={onRatingChange} />
      </div>

      {hasActiveFilters && (
        <button onClick={onReset} className={styles.resetButton}>
          Clear All Filters
        </button>
      )}
    </div>
  );
};

