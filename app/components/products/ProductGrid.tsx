'use client'

import { Product } from "@/app/types/product.types";
import ProductCard from "./ProductCard";
// import ProductCard from "../ProductCard/ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // ❌ ISSUE 3 FIXED: Added proper loading and empty state handling
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}