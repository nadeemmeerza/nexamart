// app/context/WishlistContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/app/types/product.types';
import { useNotification } from './NotificationContext';
import { useSession } from 'next-auth/react';

export interface WishlistItem extends Product {
  addedAt: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();
  const { data: session, status } = useSession();

  // Fetch wishlist on mount and when auth changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist();
    } else if (status === 'unauthenticated') {
      setWishlist([]); // Clear wishlist when logged out
    }
  }, [status]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const addToWishlist = async (product: Product) => {
    if (!session) {
      addNotification('Please login to add items to wishlist', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });

      if (response.ok) {
        const newItem: WishlistItem = {
          ...product,
          addedAt: new Date().toISOString(),
        };
        setWishlist(prev => [...prev, newItem]);
        addNotification(`${product.name} added to wishlist`, 'success');
      } else {
        throw new Error('Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      addNotification('Failed to add to wishlist', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.id !== productId));
        addNotification('Removed from wishlist', 'success');
      } else {
        throw new Error('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      addNotification('Failed to remove from wishlist', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};