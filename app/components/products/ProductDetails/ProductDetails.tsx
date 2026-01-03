
// src/components/products/ProductDetails/ProductDetails.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { ProductImage } from './ProductImage';
import { ProductInfo } from './ProductInfo';
// import { useCartContext } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import styles from './ProductDetails.module.css';
import type { Product } from '@/app/types/product.types';
import useCart from '@/app/context/CartContext';

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  relatedProducts = [],
}) => {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = useCallback(
    async (quantity: number) => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        addToCart(product, quantity);
        addNotification(
          `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`,
          'success'
        );
      } catch (error) {
        addNotification('Failed to add to cart', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [product, addToCart, addNotification]
  );

  const handleAddToWishlist = useCallback(() => {
    addNotification('Added to wishlist', 'success');
  }, [addNotification]);

  const productImages = [
    product.images[0],
    product.images[1],
    product.images[2],
  ]; // In real app, fetch from API

  return (
    <div className={styles.detailsContainer}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <ProductImage image={product.images[0]} name={product.name} images={productImages} />
        <ProductInfo
          product={product}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          isLoading={isLoading}
        />
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Related Products</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map(prod => (
              <div key={prod.id} className={styles.relatedCard}>
                <div className={styles.relatedImage}>{prod.images[0]}</div>
                <h3 className={styles.relatedName}>{prod.name}</h3>
                <p className={styles.relatedPrice}>${prod.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
