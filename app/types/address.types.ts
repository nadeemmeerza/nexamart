// src/types/address.types.ts
export interface Address {
  id?: string;
  userId?: string;
  type: 'home' | 'office' | 'other';
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
  isShipping: boolean;
  isBilling: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// For checkout flow with personal information
export interface CheckoutAddress extends Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// For creating new addresses in address book
export type CreateAddressInput = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

// For checkout address creation
export type CreateCheckoutAddressInput = Omit<CheckoutAddress, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;