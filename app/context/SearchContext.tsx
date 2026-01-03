// app/context/SearchContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/app/types/product.types';

interface SearchResult {
  products: Product[]; // Now using your Product type
  count: number;
  query: string;
  loading: boolean;
  error: string | null;
}

interface SearchContextType {
  searchResults: SearchResult;
  updateSearchResults: (results: SearchResult) => void;
  clearSearchResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchResults, setSearchResults] = useState<SearchResult>({
    products: [],
    count: 0,
    query: '',
    loading: false,
    error: null,
  });

  const updateSearchResults = (results: SearchResult) => {
    setSearchResults(results);
  };

  const clearSearchResults = () => {
    setSearchResults({
      products: [],
      count: 0,
      query: '',
      loading: false,
      error: null,
    });
  };

  return (
    <SearchContext.Provider value={{ 
      searchResults, 
      updateSearchResults, 
      clearSearchResults 
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};