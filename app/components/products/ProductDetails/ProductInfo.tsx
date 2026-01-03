// src/components/products/ProductDetails/ProductInfo.tsx

'use client';

import React, { useState } from 'react';
import { Heart, Share2, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import styles from './ProductDetails.module.css';
import type { Product } from '@/app/types/product.types';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  onAddToWishlist: () => void;
  isLoading?: boolean;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isLoading = false,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(quantity);
    setQuantity(1);
  };

  const handleWishlist = () => {
    setIsFavorite(!isFavorite);
    onAddToWishlist();
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const savings = product.originalPrice ? product.originalPrice - product.price : null;

  return (
    <div className={styles.infoContainer}>
      {/* Category & Badge */}
      <div className={styles.meta}>
        <span className={styles.category}>{product.category}</span>
        {product.isNew && <span className={styles.badge}>New</span>}
        {product.discount && <span className={styles.badgeDiscount}>-{product.discount}%</span>}
      </div>

      {/* Title */}
      <h1 className={styles.productTitle}>{product.name}</h1>

      {/* Rating */}
      <div className={styles.rating}>
        <div className={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className={styles.ratingText}>
          {product.rating} ({product.reviews} reviews)
        </span>
      </div>

      {/* Brand */}
      <p className={styles.brand}>by {product.brand}</p>

      {/* Pricing */}
      <div className={styles.pricing}>
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>${discountedPrice.toFixed(2)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        {savings && (
          <p className={styles.savings}>You save ${savings.toFixed(2)} ({product.discount}%)</p>
        )}
      </div>

      {/* Description */}
      <p className={styles.description}>{product.description || 'Premium product with excellent features.'}</p>

      {/* Stock Status */}
      <div className={styles.stockStatus}>
        {product.stock > 10 ? (
          <p className={styles.inStock}>✓ In Stock ({product.stock} available)</p>
        ) : product.stock > 0 ? (
          <p className={styles.lowStock}>⚠ Only {product.stock} left in stock</p>
        ) : (
          <p className={styles.outOfStock}>Out of Stock</p>
        )}
      </div>

      {/* Quantity & Actions */}
      <div className={styles.actionSection}>
        {product.stock > 0 && (
          <div className={styles.quantitySelector}>
            <label htmlFor="quantity" className={styles.quantityLabel}>
              Quantity:
            </label>
            <div className={styles.quantityControl}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={styles.quantityButton}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={e => setQuantity(Math.min(product.stock, Math.max(1, Number(e.target.value))))}
                className={styles.quantityInput}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className={styles.quantityButton}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className={`${styles.addToCartButton} ${product.stock === 0 ? styles.disabled : ''}`}
        >
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`${styles.wishlistButton} ${isFavorite ? styles.favorited : ''}`}
          title="Add to wishlist"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>

        {/* Share Button */}
        <button
          className={styles.shareButton}
          title="Share this product"
          onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <div className={styles.feature}>
          <Truck className="w-6 h-6" />
          <div>
            <p className={styles.featureTitle}>Free Shipping</p>
            <p className={styles.featureDesc}>On orders over $50</p>
          </div>
        </div>
        <div className={styles.feature}>
          <Shield className="w-6 h-6" />
          <div>
            <p className={styles.featureTitle}>Secure Checkout</p>
            <p className={styles.featureDesc}>SSL encrypted</p>
          </div>
        </div>
        <div className={styles.feature}>
          <RefreshCw className="w-6 h-6" />
          <div>
            <p className={styles.featureTitle}>30-Day Returns</p>
            <p className={styles.featureDesc}>Hassle-free returns</p>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className={styles.specs}>
          <h3 className={styles.specsTitle}>Specifications</h3>
          <div className={styles.specsList}>
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className={styles.specItem}>
                <span className={styles.specKey}>{key}:</span>
                <span className={styles.specValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};