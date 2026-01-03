// app/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CartItem, Product } from '@/app/types/product.types';
import { useSession } from 'next-auth/react';

const CART_STORAGE_KEY = 'nexamart_cart';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const { data: session, status } = useSession();

  // Simple API calls
  const cartAPI = {
    async getCart(userId: string): Promise<CartItem[]> {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      return data.items || [];
    },

    async addItem(userId: string, product: Product, quantity: number): Promise<void> {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, product, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
    },

    async updateItem(userId: string, productId: string, quantity: number): Promise<void> {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to update cart item');
    },

    async removeItem(userId: string, productId: string): Promise<void> {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      if (!response.ok) throw new Error('Failed to remove item from cart');
    },

    async clearCart(userId: string): Promise<void> {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to clear cart');
    },
  };

  // Get current user
  const getCurrentUser = useCallback((): { id: string; isLoggedIn: boolean } => {
    if (status === 'loading') return { id: '', isLoggedIn: false };
    if (session?.user) {
      const userId = session.user.id ||  '';
      return { id: userId, isLoggedIn: !!userId };
    }
    return { id: '', isLoggedIn: false };
  }, [session, status]);

  // Load cart on mount and when session changes
  useEffect(() => {
    if (!isMounted) return;

    const loadCart = async () => {
      try {
        const user = getCurrentUser();
        let items: CartItem[] = [];

        if (user.isLoggedIn) {
          // Always load from database for logged-in users
          items = await cartAPI.getCart(user.id);
        } else {
          // Load from localStorage for guests
          const saved = localStorage.getItem(CART_STORAGE_KEY);
          if (saved) {
            items = JSON.parse(saved);
          }
        }

        setCartItems(items);
      } catch (error) {
        console.error('Failed to load cart:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          setCartItems(JSON.parse(saved));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isMounted, getCurrentUser]);

  // Save to localStorage for guest users only
  useEffect(() => {
    if (!isMounted || isLoading) return;
    
    const user = getCurrentUser();
    if (!user.isLoggedIn) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted, isLoading, getCurrentUser]);

  // Add to cart
  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    const user = getCurrentUser();
    
    // Update local state immediately for better UX
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    // Save to database if user is logged in
    if (user.isLoggedIn) {
      try {
        await cartAPI.addItem(user.id, product, quantity);
      } catch (error) {
        console.error('Failed to save to database:', error);
        // Optionally: Show error message to user
      }
    }
  }, [getCurrentUser]);

  // Remove from cart
  const removeFromCart = useCallback(async (id: string) => {
    const user = getCurrentUser();

    setCartItems(prev => prev.filter(item => item.id !== id));

    if (user.isLoggedIn) {
      try {
        await cartAPI.removeItem(user.id, id);
      } catch (error) {
        console.error('Failed to remove from database:', error);
      }
    }
  }, [getCurrentUser]);

  // Update quantity
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    const user = getCurrentUser();

    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    if (user.isLoggedIn) {
      try {
        await cartAPI.updateItem(user.id, id, quantity);
      } catch (error) {
        console.error('Failed to update in database:', error);
      }
    }
  }, [getCurrentUser, removeFromCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    const user = getCurrentUser();

    setCartItems([]);

    if (user.isLoggedIn) {
      try {
        await cartAPI.clearCart(user.id);
      } catch (error) {
        console.error('Failed to clear database cart:', error);
      }
    }
  }, [getCurrentUser]);

  // Calculate totals
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isLoading: isLoading || !isMounted || status === 'loading',
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default useCart;