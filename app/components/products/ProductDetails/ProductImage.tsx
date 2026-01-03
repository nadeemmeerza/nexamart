// app/components/products/ProductDetails/ProductImage.tsx

'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ProductDetails.module.css';

interface ProductImageProps {
  image: string;
  name: string;
  images?: string[];
}

export const ProductImage: React.FC<ProductImageProps> = ({ image, name, images = [image] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.imageContainer}>
      {/* Main Image */}
      <div className={styles.mainImage}>
        <div className={styles.imagePlaceholder}>{images[activeIndex]}</div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button onClick={handlePrevious} className={styles.imageNavButton} aria-label="Previous image">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={handleNext} className={styles.imageNavButton} aria-label="Next image">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className={styles.imageCounter}>
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`${styles.thumbnail} ${activeIndex === idx ? styles.active : ''}`}
              aria-label={`View image ${idx + 1}`}
            >
              {img}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
