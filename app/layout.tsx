// app/layout.tsx
import type { Metadata } from "next";
import { CartProvider } from "@/app/context/CartContext";
import { NotificationProvider } from "@/app/context/NotificationContext";
import "./globals.css";
import { CheckoutProvider } from "./context/CheckoutContext";
import { SessionProvider } from "next-auth/react";
import { SearchProvider } from "./context/SearchContext";
import { WishlistProvider } from "./context/WishlistContext";
import Footer from "./components/layout/Footer";
import { AdminProvider } from "./context/AdminContext";


export const metadata: Metadata = {
  title: "NEXAMART - Online Shopping",
  description: "Shop the best products online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Providers in correct order */}
       <AdminProvider>
        <SessionProvider>
          <CartProvider>
            <CheckoutProvider>
            <NotificationProvider>
              <SearchProvider>
                <WishlistProvider>
              {children}
              </WishlistProvider>
              </SearchProvider>
            </NotificationProvider>
            </CheckoutProvider>
          </CartProvider>       
        </SessionProvider>
       </AdminProvider> 
        <Footer/>
       
      </body>
    </html>
  );
}