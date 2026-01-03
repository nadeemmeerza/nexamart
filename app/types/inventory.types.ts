// app/types/inventory.types.ts
import type { Product } from './product.types';

export interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  reserved: number;
  reorderLevel: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock'; // or 'in_stock' | 'low_stock' | 'out_of_stock'
  warehouse?: string;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
  product?: Product; // Use your existing Product type
  variant?: {
    id: string;
    name: string;
    sku: string;
    attributes: Record<string, any>;
    price?: number;
    comparePrice?: number;
    weight?: number;
    images: string[];
    isDefault: boolean;
    status: string;
  };
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  reorderLevel: number;
  status: 'low' | 'critical' | 'out';
  alertedAt: Date;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  type: 'inbound' | 'outbound' | 'adjustment' | 'damage';
  quantity: number;
  reference: string;
  notes: string;
  createdAt: Date;
  createdBy: string;
}