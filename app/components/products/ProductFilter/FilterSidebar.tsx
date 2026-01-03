'use client';

import React from 'react';
import { ProductFilter } from './ProductFilter';
import type { FilterState } from '../../../types/product.types';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
  resultsCount?: number;
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  isLoading = false,
  resultsCount = 0,
  className = '',
  isMobileOpen = false,
  onMobileClose,
}) => {
  // Handle individual filter changes
  const handlePriceChange = (priceRange: [number, number]) => {
    onFiltersChange({ ...filters, priceRange });
  };

  const handleToggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleRatingChange = (minRating: number) => {
    onFiltersChange({ ...filters, minRating });
  };

  const handleReset = () => {
    onResetFilters();
  };

  return (
    <aside className={`${className} bg-white rounded-lg shadow-sm border`}>
      {/* Header with results count */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Filters
            {resultsCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({resultsCount} {resultsCount === 1 ? 'result' : 'results'})
              </span>
            )}
          </h2>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close filters"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-4 border-b">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )}

      {/* Filter components */}
      <div className="p-4 space-y-6">
        <ProductFilter
          filters={filters}
          onPriceChange={handlePriceChange}
          onToggleCategory={handleToggleCategory}
          onRatingChange={handleRatingChange}
          onReset={handleReset}
          onClose={onMobileClose}
          isOpen={isMobileOpen}
        />
      </div>
    </aside>
  );
};