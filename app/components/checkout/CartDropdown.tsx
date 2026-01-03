// app/components/common/CartDropdown/CartDropdown.tsx

'use client';

import React, { useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useNotification } from '@/app/context/NotificationContext';
import Button from '@/app/components/ui/Button';
import useCart from '@/app/context/CartContext';
import { redirect } from 'next/navigation';
import Image from 'next/image';



interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}


export const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const { addNotification } = useNotification();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 bg-opacity-50"
        onClick={onClose}
      />

      {/* Cart Dropdown */}
      <div className="fixed top-16 right-4 w-96 max-w-[calc(100vw-1rem)] bg-white rounded-lg shadow-xl z-50 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    <Image src={item?.image as string } alt="image" width={64} height={64}/>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                    <p className="text-sm font-bold text-gray-900 mt-2">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          addNotification('Item removed from cart', 'info');
                        }}
                        className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-3">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <Button
              variant="default"
              onClick={() => {
                addNotification('Proceeding to checkout', 'info');
                onClose();
                redirect("/cart")
              }}
              className="w-full"
            >
              Go to Cart
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDropdown;