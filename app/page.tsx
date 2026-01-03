// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/app/components/common/HeroSection';
import NotificationContainer from '@/app/components/common/Notification/NotificationContainer';
import type { Product, FilterState } from '@/app/types/product.types';
import CartDropdown from './components/checkout/CartDropdown';
import ProductGrid from './components/products/ProductGrid';
import { useSearchContext } from '@/app/context/SearchContext';
import Navbar from './components/layout/navbar/Navbar';
import { FilterSidebar } from '@/app/components/products/ProductFilter/FilterSidebar';
import { X, Filter } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSession } from 'next-auth/react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    categories: [],
    brands: [],
    minRating: 0,
    searchTerm: '',
  });

  const { searchResults } = useSearchContext();
  


  // Debug log to see when searchResults update
  useEffect(() => {
    console.log('Search results updated:', {
      query: searchResults.query,
      count: searchResults.count,
      loading: searchResults.loading
    });
  }, [searchResults]);

  useEffect( () => {
    setIsMounted(true);
    fetchProducts();
  }, []);

  // Set search query in filters when search is performed
  useEffect(() => {
    if (searchResults.query) {
      setFilters(prev => ({
        ...prev,
        searchQuery: searchResults.query
      }));
    }
  }, [searchResults.query]);

 


  // ✅ Fetch products from database
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Transform the database products to match your Product type
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
      
      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Helper function to determine if product is new
  const isProductNew = (createdAt: string): boolean => {
    const createdDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  };

  // ✅ Helper function to calculate discount percentage
  const calculateDiscount = (price: number, comparePrice?: number): number => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  // Apply filters to products
  const applyFilters = (productsToFilter: Product[], currentFilters: FilterState) => {
    let result = [...productsToFilter];

    // Apply search query filter
    if (currentFilters.searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(currentFilters.searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(currentFilters.searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(currentFilters.searchTerm.toLowerCase())
      );
    }

    // Apply price filter
    result = result.filter(product =>
      product.price >= currentFilters.priceRange[0] &&
      product.price <= currentFilters.priceRange[1]
    );

    // Apply category filter
    if (currentFilters.categories.length > 0) {
      result = result.filter(product =>
        currentFilters.categories.includes(product.category)
      );
    }

    // Apply rating filter
    if (currentFilters.minRating > 0) {
      result = result.filter(product =>
        product.rating >= currentFilters.minRating
      );
    }

    return result;
  };

  // Get filtered products
  const filteredProducts = searchResults.query 
    ? applyFilters(searchResults.products, filters)
    : applyFilters(products, filters);

  const hasSearchResults = searchResults.products.length > 0 && searchResults.query;
  const showSearchLoading = searchResults.loading && searchResults.query;

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 500],
      categories: [],
      brands:[],
      minRating: 0,
      searchTerm: searchResults.query || '',
    });
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar */}
      <Navbar 
        onCartClick={() => setCartOpen(!cartOpen)} 
      />
      
      {/* ✅ Cart Dropdown */}
      <CartDropdown 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
      />

      {/* ✅ Notifications */}
      <NotificationContainer />

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* ✅ SEARCH RESULTS SECTION WITH SIDEBAR */}
        {hasSearchResults && (
          <div className="mb-16">
            {/* Search Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Search Results for "{searchResults.query}"
                </h2>
                <p className="text-gray-600 mt-1">
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {filters.categories.length > 0 && ` in ${filters.categories.length} categorie${filters.categories.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar for Filters - Desktop */}
              <div className="hidden md:block w-84 shrink-0">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onResetFilters={handleResetFilters}
                  isLoading={showSearchLoading as boolean}
                  resultsCount={filteredProducts.length}
                />
              </div>

              {/* Main Content Area */}
              <div className="flex-1">
                {/* Active Filters Display */}
                {(filters.categories.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium text-gray-700">Active filters:</span>
                      
                      {filters.categories.map(category => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-sm flex items-center gap-1"
                        >
                          {category}
                          <button
                            onClick={() => {
                              const newCategories = filters.categories.filter(c => c !== category);
                              setFilters({ ...filters, categories: newCategories });
                            }}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      
                      {filters.minRating > 0 && (
                        <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-sm flex items-center gap-1">
                          ⭐ {filters.minRating}+ stars
                          <button
                            onClick={() => setFilters({ ...filters, minRating: 0 })}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      
                      {(filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
                        <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-sm flex items-center gap-1">
                          ${filters.priceRange[0]} - ${filters.priceRange[1]}
                          <button
                            onClick={() => setFilters({ ...filters, priceRange: [0, 500] })}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      
                      <button
                        onClick={handleResetFilters}
                        className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}

                {/* Search error */}
                {searchResults.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 font-medium">Search Error</p>
                    <p className="text-red-600 mt-1">{searchResults.error}</p>
                  </div>
                )}

                {/* Search results grid */}
                {filteredProducts.length > 0 ? (
                  <ProductGrid products={filteredProducts} />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No products match your filters
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filter criteria
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Filter Sidebar/Drawer */}
            {isFilterOpen && (
              <div className="md:hidden">
                {/* Overlay */}
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsFilterOpen(false)}
                />
                
                {/* Sidebar */}
                <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto shadow-xl">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onResetFilters={handleResetFilters}
                      isLoading={showSearchLoading as boolean}
                      resultsCount={filteredProducts.length}
                      isMobileOpen={isFilterOpen}
                      onMobileClose={() => setIsFilterOpen(false)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ SEARCH LOADING STATE */}
        {showSearchLoading && (
          <section className="mb-16 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for "{searchResults.query}"...</p>
          </section>
        )}

        {/* ✅ REGULAR PRODUCTS SECTION - Shows after search results (or if no search) */}
        <section>
          {/* Header for regular products */}
          {!hasSearchResults && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Discover our latest collection of premium products
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Showing {filteredProducts.length} products
              </p>
            </div>
          )}

          {/* If we have search results, show a divider header for regular products */}
          {hasSearchResults && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                More Products
              </h2>
              <p className="text-gray-600">
                Browse our complete collection
              </p>
            </div>
          )}

          {/* ✅ Loading State for initial products load */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          )}

          {/* ✅ Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 font-medium">Error loading products</p>
                <p className="text-red-600 mt-2">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* ✅ Products Grid - Show filtered products when no search, otherwise show all products */}
          {!isLoading && !error && (hasSearchResults ? products : filteredProducts).length > 0 && (
            <ProductGrid products={hasSearchResults ? products : filteredProducts} />
          )}

          {/* ✅ Empty State (no products at all) */}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-gray-800 font-medium">No products available</p>
                <p className="text-gray-600 mt-2">
                  We couldn't find any products in our database.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}