// src/components/products/ProductFilter/RatingFilter.tsx

'use client';

import React from 'react';
import { RATINGS } from '../../../constants/filterConstants';
import { Star } from 'lucide-react';
import styles from './ProductFilter.module.css';

interface RatingFilterProps {
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({
  minRating,
  onRatingChange,
}) => {
  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterTitle}>Rating</h3>
      <div className={styles.ratingOptions}>
        {RATINGS.map(rating => (
          <label key={rating.value} className={styles.ratingOption}>
            <input
              type="radio"
              name="rating"
              value={rating.value}
              checked={minRating === rating.value}
              onChange={() => onRatingChange(rating.value)}
              className={styles.radioInput}
            />
            <div className={styles.ratingLabel}>
              {rating.value > 0 && (
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating.value)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
              <span>{rating.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
