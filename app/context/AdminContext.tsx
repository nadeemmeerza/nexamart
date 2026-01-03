// src/context/AdminContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { DashboardStats, AdminContextType } from '@/app/types/admin.types';
import type { InventoryItem } from '@/app/types/inventory.types'; // Import from inventory.types
import type { Product } from '@/app/types/product.types';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from API instead of mock data
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from API instead of mock data
      const response = await fetch('/api/admin/inventory', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the API response to match your InventoryItem type
      const transformedItems: InventoryItem[] = data.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        reserved: item.reserved || 0,
        reorderLevel: item.reorderLevel || item.reorder || 10,
        status: item.status, // Make sure this matches your type
        warehouse: item.warehouse,
        lastRestocked: item.lastRestocked ? new Date(item.lastRestocked) : new Date(item.updatedAt),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          price: item.product.price,
          images: item.product.images || [],
          category: item.product.category,
          // Add other product fields as needed
        } : undefined,
      }));
      
      setInventory(transformedItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch inventory';
      setError(errorMessage);
      console.error('Error fetching inventory:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateInventory = useCallback(async (id: string, quantity: number, reason?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          inventoryId: id,
          quantity,
          reason: reason || 'manual_update',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update inventory: ${response.status}`);
      }

      const data = await response.json();
      
      // Update local state
      setInventory(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                quantity,
                lastRestocked: new Date(),
                status: data.inventory?.status || item.status,
                updatedAt: new Date(),
              }
            : item
        )
      );

      return data.inventory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update inventory';
      setError(errorMessage);
      console.error('Error updating inventory:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (product: Product) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add product: ${response.status}`);
      }

      const data = await response.json();
      
      // Refresh inventory after adding product
      await fetchInventory();
      
      return data.product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product';
      setError(errorMessage);
      console.error('Error adding product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInventory]);

  const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update product: ${response.status}`);
      }

      const data = await response.json();
      
      // Update local state if product is in inventory
      setInventory(prev =>
        prev.map(item =>
          item.product?.id === id
            ? {
                ...item,
                product: {
                  ...item.product,
                  ...product,
                },
              }
            : item
        )
      );

      return data.product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete product: ${response.status}`);
      }

      const data = await response.json();
      
      // Remove from local state
      setInventory(prev => prev.filter(item => item.product?.id !== id));
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        stats,
        inventory,
        isLoading,
        error,
        fetchStats,
        fetchInventory,
        updateInventory,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};