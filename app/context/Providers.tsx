'use client';

import React from 'react';
import { CartProvider } from './CartContext';
import { NotificationProvider } from './NotificationContext';
import { CheckoutProvider } from './CheckoutContext';
// import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import { SessionProvider } from 'next-auth/react';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    
    <CartProvider>
      <NotificationProvider>
        <CheckoutProvider>
          
            <AdminProvider>
              {children}
            </AdminProvider>
         
        </CheckoutProvider>
      </NotificationProvider>
    </CartProvider>
    
  );
};