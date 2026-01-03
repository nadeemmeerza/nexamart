export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  thumbnail:string;
  rating: number;
  reviews: number[];
  category: string;
  brand: string;
  stock: number;
  isNew?: boolean;
  discount?: number;
  description?: string;
  shortDescription:string;
  specs?: Record<string, string>;
  sku:string;
  status:string;
  reviewCount:number;
  comparePrice:number;
  weight:number;
}

export interface CartItem  {
 id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Make optional if not always available
  rating?: number; // Make optional
  reviews?: number[]; // Make optional
  category?: string; // Make optional
  brand?: string; // Make optional
  stock?: number; // 
}

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  minRating: number;
  searchTerm: string;
}

export interface FilterAction {
  type: 'SET_PRICE' | 'TOGGLE_CATEGORY' | 'TOGGLE_BRAND' | 'SET_RATING' | 'SET_SEARCH' | 'RESET';
  payload?: any;
}