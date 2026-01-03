// src/types/analytics.types.ts

export interface DailySalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface CategorySales {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sold: number;
  revenue: number;
}

export interface Analytics {
  salesTrend: DailySalesData[];
  categorySales: CategorySales[];
  topProducts: TopProduct[];
  conversionRate: number;
  customerSatisfaction: number;
  averageOrderValue: number;
}