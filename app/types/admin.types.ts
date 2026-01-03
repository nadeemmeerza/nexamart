// src/types/admin.types.ts

import { InventoryItem } from "./inventory.types";
import { Order } from "./order.types";
import { Product } from "./product.types";

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  pendingOrders: number;
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  topProducts: Product[];
  recentOrders: Order[];
}



export interface AdminContextType {
  stats: DashboardStats | null;
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  updateInventory: (id: string, quantity: number) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}