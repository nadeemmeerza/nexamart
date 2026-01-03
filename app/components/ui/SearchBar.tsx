// app/components/ui/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchContext } from '@/app/context/SearchContext';
import { Search, X } from 'lucide-react';
import type { Product } from '@/app/types/product.types';

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  const { updateSearchResults, clearSearchResults } = useSearchContext();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // If empty, clear results immediately
    if (!value.trim()) {
      clearSearchResults();
      setIsSearching(false);
      return;
    }
    
    // Show loading immediately
    setIsSearching(true);
    updateSearchResults({
      products: [],
      count: 0,
      query: value, // Set query immediately for better UX
      loading: true,
      error: null,
    });
    
    // Set new debounce timer
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(value)}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Transform search results to match your Product type
          const transformedProducts: Product[] = data.products.map((dbProduct: any) => ({
            id: dbProduct.id,
            name: dbProduct.name,
            price: dbProduct.price,
            image: dbProduct.thumbnail || dbProduct.images?.[0] || '📦',
            rating: dbProduct.rating || 4.0,
            reviews: dbProduct.reviewCount || 0,
            category: dbProduct.category?.name || 'Uncategorized',
            brand: dbProduct.metadata?.brand || 'Generic',
            stock: 10,
            isNew: isProductNew(dbProduct.createdAt),
            discount: calculateDiscount(dbProduct.price, dbProduct.comparePrice),
            originalPrice: dbProduct.comparePrice || undefined,
            description: dbProduct.description,
            shortDescription: dbProduct.shortDescription,
            slug: dbProduct.slug,
            sku: dbProduct.sku,
            images: dbProduct.images || [],
          }));
          
          updateSearchResults({
            products: transformedProducts,
            count: transformedProducts.length,
            query: value,
            loading: false,
            error: null,
          });
        } else {
          throw new Error(data.error || 'Search failed');
        }
      } catch (err) {
        console.error('Search error:', err);
        updateSearchResults({
          products: [],
          count: 0,
          query: value,
          loading: false,
          error: err instanceof Error ? err.message : 'Search failed',
        });
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce
  };

  const handleClear = () => {
    setSearchInput('');
    clearSearchResults();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    setIsSearching(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If form is submitted and there's input, ensure search happens
    if (searchInput.trim() && !isSearching) {
      handleInputChange({ target: { value: searchInput } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Helper functions
  const isProductNew = (createdAt: string): boolean => {
    if (!createdAt) return false;
    try {
      const createdDate = new Date(createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    } catch {
      return false;
    }
  };

  const calculateDiscount = (price: number, comparePrice?: number): number => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </form>

     
    </div>
  );
}