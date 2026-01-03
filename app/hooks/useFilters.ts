// src/hooks/useFilters.ts

import { useReducer, useCallback } from 'react';
import type { FilterState, FilterAction, Product } from '../types/product.types';

const initialState: FilterState = {
  priceRange: [0, 500],
  categories: [],
  brands: [],
  minRating: 0,
  searchTerm: '',
};

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_PRICE':
      return { ...state, priceRange: action.payload };
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        categories: state.categories.includes(action.payload)
          ? state.categories.filter(c => c !== action.payload)
          : [...state.categories, action.payload],
      };
    case 'TOGGLE_BRAND':
      return {
        ...state,
        brands: state.brands.includes(action.payload)
          ? state.brands.filter(b => b !== action.payload)
          : [...state.brands, action.payload],
      };
    case 'SET_RATING':
      return { ...state, minRating: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const useFilters = (products: Product[]) => {
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  const filteredProducts = products.filter(product => {
    const matchesPrice = product.price >= filters.priceRange[0] && 
                        product.price <= filters.priceRange[1];
    
    const matchesCategory = filters.categories.length === 0 || 
                           filters.categories.includes(product.category);
    
    const matchesBrand = filters.brands.length === 0 || 
                        filters.brands.includes(product.brand);
    
    const matchesRating = product.rating >= filters.minRating;
    
    const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesPrice && matchesCategory && matchesBrand && matchesRating && matchesSearch;
  });

  return {
    filters,
    filteredProducts,
    setPrice: (price: [number, number]) => dispatch({ type: 'SET_PRICE', payload: price }),
    toggleCategory: (category: string) => dispatch({ type: 'TOGGLE_CATEGORY', payload: category }),
    toggleBrand: (brand: string) => dispatch({ type: 'TOGGLE_BRAND', payload: brand }),
    setRating: (rating: number) => dispatch({ type: 'SET_RATING', payload: rating }),
    setSearch: (term: string) => dispatch({ type: 'SET_SEARCH', payload: term }),
    reset: () => dispatch({ type: 'RESET' }),
  };
};
