// app/hooks/useProductSearch.ts
import { useState, useEffect } from 'react';
import type { Product } from '@/app/types/product.types';

export const useProductSearch = (searchTerm: string) => {
  const [results, setResults] = useState<{
    products: Product[];
    count: number;
    query: string;
    loading: boolean;
    error: string | null;
  }>({
    products: [],
    count: 0,
    query: '',
    loading: false,
    error: null,
  });

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setResults({
          products: [],
          count: 0,
          query: '',
          loading: false,
          error: null,
        });
        return;
      }

      setResults(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match your Product interface
          const transformedProducts: Product[] = data.products.map((dbProduct: any) => ({
            id: dbProduct.id,
            name: dbProduct.name,
            price: dbProduct.price,
            originalPrice: dbProduct.comparePrice || undefined,
            image: dbProduct.thumbnail || dbProduct.images?.[0] || '📦',
            images:dbProduct.images,
            rating: dbProduct.rating || 4.0,
            reviews: dbProduct.reviewCount || 0,
            category: dbProduct.category?.name || 'Uncategorized',
            brand: dbProduct.metadata?.brand || 'Generic',
            stock: dbProduct.stock || 10,
            isNew: isProductNew(dbProduct.createdAt),
            discount: calculateDiscount(dbProduct.price, dbProduct.comparePrice),
            description: dbProduct.description,
            // specs can be added if available from API
            specs: dbProduct.specs || {}
          }));

          setResults({
            products: transformedProducts,
            count: data.count,
            query: data.query,
            loading: false,
            error: null,
          });
        } else {
          throw new Error(data.error || 'Search failed');
        }
      } catch (error) {
        setResults(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Search failed',
        }));
      }
    };

    const timeoutId = setTimeout(searchProducts, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return results;
};

// Helper functions
const isProductNew = (createdAt: string): boolean => {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return createdDate > thirtyDaysAgo;
};

const calculateDiscount = (price: number, comparePrice?: number): number => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};