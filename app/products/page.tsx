// app/(routes)/products/page.tsx
'use client';

import  { useState } from 'react';
import { useFilters } from '../hooks/useFilters';
import { Filter } from 'lucide-react';
import { ProductFilter } from '../components/products/ProductFilter/ProductFilter';
import ProductGrid from '../components/products/ProductGrid';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    image: '🎧',
    rating: 4.8,
    reviews: [342],
    category: 'Electronics',
    brand: 'SoundMax',
    stock: 8,
    isNew: true,
    sku:'sku456',
    images:['🎧'],
    thumbnail:'🎧',
    shortDescription:'', 
    status:'',
    reviewCount:3,
    comparePrice:3,
    weight:3,
  },
  // ... more products
];

export default function ProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const {
    filters,
    filteredProducts,
    setPrice,
    toggleCategory,
    toggleBrand,
    setRating,
    setSearch,
    reset,
  } = useFilters(MOCK_PRODUCTS);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-72">
          <ProductFilter
            filters={filters}
            onPriceChange={setPrice}
            onToggleCategory={toggleCategory}
            onRatingChange={setRating}
            onReset={reset}
          />
        </aside>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>

        {/* Mobile Filters */}
        {filterOpen && (
          <ProductFilter
            filters={filters}
            onPriceChange={setPrice}
            onToggleCategory={toggleCategory}
            onRatingChange={setRating}
            onReset={reset}
            onClose={() => setFilterOpen(false)}
            isOpen={filterOpen}
          />
        )}

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}