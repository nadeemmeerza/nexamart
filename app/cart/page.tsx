// src/app/(routes)/cart/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { CartPage } from '../components/checkout/CartPage/CartPage';
import useCart from '../context/CartContext';

export default function CartPageView() {
  const router = useRouter();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    isLoading,
  } = useCart();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CartPage
      items={cartItems}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeFromCart}
      onCheckout={handleCheckout}
    />
  );
}