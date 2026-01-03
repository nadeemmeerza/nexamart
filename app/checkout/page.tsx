// src/app/(routes)/checkout/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AddressForm } from '@/app/components/checkout/CheckoutForm/AddressForm';
import { AddressSelector } from '@/app/components/checkout/AddressSelector/AddressSelector';
import { ShippingMethodSelector } from '@/app/components/checkout/CheckoutForm/ShippingMethodSelector';
import { PaymentForm } from '@/app/components/checkout/CheckoutForm/PaymentForm';
import { useCheckout } from '@/app/context/CheckoutContext';
import { useCart } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import type { CreateCheckoutAddressInput } from '@/app/types/address.types';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    checkout, 
    userAddresses,
    showAddressForm,
    updateShippingAddress,
    updateShippingMethod,
    processPayment,
    loadUserAddresses,
    addNewAddress,
    selectExistingAddress,
    toggleAddressForm,
    resetCheckout
  } = useCheckout();
  
  const { cartItems, total, clearCart } = useCart();
  const { addNotification } = useNotification();
  
  const [step, setStep] = useState<'address' | 'shipping' | 'payment'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [discount, setDiscount] = useState(0);

  // Prevent showing checkout if order was just completed
  useEffect(() => {
    const fromConfirmation = sessionStorage.getItem('from_order_confirmation');
    
    if (fromConfirmation) {
      router.replace('/');
      sessionStorage.removeItem('from_order_confirmation');
      return;
    }

    // Load addresses and initialize
    const initializeCheckout = async () => {
      setIsLoading(true);
      try {
        await loadUserAddresses();
        
        // Auto-select shipping address if available
        // if (userAddresses.length > 0 && !checkout.shippingAddress) {
        //   const defaultAddress = userAddresses.find(addr => addr.isDefault);
        //   if (defaultAddress) {
        //     updateShippingAddress(defaultAddress);
        //   }
        // }


        if(checkout.discount)
          setDiscount(checkout.discount);

      } catch (error) {
        console.error('Failed to initialize checkout:', error);
        addNotification('Failed to load addresses', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();

    return () => {
      // Cleanup if needed
    };
  }, [loadUserAddresses, router]);

  // Reset address form visibility based on user addresses
  useEffect(() => {
    if (!isLoading) {
      if (userAddresses.length === 0) {
        toggleAddressForm(true);
      } else {
        toggleAddressForm(false);
      }
    }
  }, [userAddresses.length, isLoading, toggleAddressForm]);

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleAddressSelect = (addressId: string) => {
    selectExistingAddress(addressId);
    setStep('shipping');
    addNotification('Address selected', 'success');
  };

  const handleNewAddress = () => {
    toggleAddressForm(true);
  };

  const handleAddressSubmit = async (addressData: CreateCheckoutAddressInput) => {
    try {
      await addNewAddress(addressData);
      setStep('shipping');
      addNotification('Address saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save address:', error);
      addNotification('Failed to save address', 'error');
    }
  };

  const handleShippingSubmit = () => {
    if (checkout.shippingMethod) {
      setStep('payment');
      addNotification('Shipping method selected', 'success');
    } else {
      addNotification('Please select a shipping method', 'error');
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (!checkout.shippingAddress) {
        addNotification('Please select a shipping address', 'error');
        setIsProcessing(false);
        return;
      }

      if (!checkout.shippingMethod) {
        addNotification('Please select a shipping method', 'error');
        setIsProcessing(false);
        return;
      }

      console.log('Processing payment...');
      const order = await processPayment(paymentData);
      console.log('Order created:', order);

      if (!order?.id) {
        throw new Error('No order ID returned from payment process');
      }

      // Mark order as completed
      setOrderCompleted(true);
      
      // Clear cart
      clearCart();
      
      addNotification('Order placed successfully!', 'success');
      
      // Store in session storage to prevent back navigation to checkout
      sessionStorage.setItem('from_order_confirmation', 'true');
      sessionStorage.setItem('last_order_id', order.id);
      
      // Use router.replace to prevent back navigation
      router.replace(`/order-confirmation/${order.id}`);
      
    } catch (error) {
      console.error('Payment process failed:', error);
      addNotification(error instanceof Error ? error.message : 'Payment failed. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  // Don't render if order was completed
  if (orderCompleted) {
    return (
      <div className="max-w-1200px mx-auto px-4 py-8 text-center">
        <div className="bg-white border rounded-lg p-8">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4">Processing Your Order...</h1>
          <p className="text-gray-600 mb-8">Redirecting to order confirmation...</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-1200px mx-auto px-4 py-8 text-center">
        <div className="bg-white border rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">Loading checkout...</h2>
          <p className="text-gray-600">Please wait while we load your information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-1200px mx-auto px-4 py-8">
      {/* Continue Shopping Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleContinueShopping}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          ← Continue Shopping
        </button>
      </div>

      {/* Checkout Steps Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-8">
          <div className={`flex items-center ${step === 'address' ? 'text-blue-600' : step === 'shipping' || step === 'payment' ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'address' ? 'bg-blue-600 text-white' : 
              step === 'shipping' || step === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}>
              {step === 'shipping' || step === 'payment' ? '✓' : '1'}
            </div>
            <span className="ml-2 font-medium">Address</span>
          </div>
          
          <div className={`flex items-center ${step === 'shipping' ? 'text-blue-600' : step === 'payment' ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'shipping' ? 'bg-blue-600 text-white' : 
              step === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}>
              {step === 'payment' ? '✓' : '2'}
            </div>
            <span className="ml-2 font-medium">Shipping</span>
          </div>
          
          <div className={`flex items-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Forms */}
        <div className="col-span-2">
          {/* ADDRESS STEP */}
          {step === 'address' && (
            <div className="space-y-6">
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                
                {showAddressForm ? (
                  <AddressForm
                    title={userAddresses.length > 0 ? "Add New Address" : "Enter Shipping Address"}
                    onSubmit={handleAddressSubmit}
                    onCancel={userAddresses.length > 0 ? () => toggleAddressForm(false) : undefined}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Show addresses if user has them */}
                    {userAddresses.length > 0 ? (
                      <>
                        <p className="text-gray-600 mb-4">
                          Select a saved address or add a new one
                        </p>
                        <AddressSelector
                          addresses={userAddresses}
                          selectedAddress={checkout.shippingAddress}
                          onSelectAddress={(address) => handleAddressSelect(address.id!)}
                          onAddNewAddress={handleNewAddress}
                        />
                      </>
                    ) : (
                      <div className="text-center py-8 border rounded-lg">
                        <p className="text-gray-600 mb-4">No saved addresses found</p>
                        <button
                          onClick={handleNewAddress}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add Your First Address
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Proceed button when address is selected */}
                {checkout.shippingAddress && !showAddressForm && (
                  <div className="mt-6 pt-6 border-t">
                    <button
                      onClick={() => setStep('shipping')}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Proceed to Shipping
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SHIPPING STEP */}
          {step === 'shipping' && checkout.shippingAddress && (
            <div className="space-y-6">
              {/* Selected Address Display */}
              <div className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Shipping Address</h3>
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Change
                  </button>
                </div>
                <div className="text-gray-700">
                  <p className="font-medium capitalize">{checkout.shippingAddress.type || 'Home'}</p>
                  <p>{checkout.shippingAddress.street}</p>
                  {checkout.shippingAddress.apartment && (
                    <p>Apartment/Suite: {checkout.shippingAddress.apartment}</p>
                  )}
                  <p>{checkout.shippingAddress.city}, {checkout.shippingAddress.state} {checkout.shippingAddress.postalCode}</p>
                  <p>{checkout.shippingAddress.country}</p>
                </div>
              </div>

              {/* Shipping Method Selection */}
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Method</h2>
                <ShippingMethodSelector
                  selectedMethod={checkout.shippingMethod}
                  onSelect={(method) => {
                    updateShippingMethod(method);
                    handleShippingSubmit();
                  }}
                />
              </div>
            </div>
          )}

          {/* PAYMENT STEP */}
          {step === 'payment' && (
            <>
              {/* Order Summary Header */}
              <div className="bg-white border rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    {checkout.shippingAddress && (
                      <div className="text-sm text-gray-600">
                        <p className="font-medium capitalize">{checkout.shippingAddress.type || 'Home'}</p>
                        <p>{checkout.shippingAddress.street}</p>
                        {checkout.shippingAddress.apartment && (
                          <p>Apartment/Suite: {checkout.shippingAddress.apartment}</p>
                        )}
                        <p>{checkout.shippingAddress.city}, {checkout.shippingAddress.state} {checkout.shippingAddress.postalCode}</p>
                        <p>{checkout.shippingAddress.country}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Method</h4>
                    {checkout.shippingMethod && (
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{checkout.shippingMethod.name}</p>
                        <p>${checkout.shippingMethod.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{checkout?.shippingMethod?.estimatedDays}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Change shipping details
                </button>
              </div>

              {/* Payment Form */}
              <div className="bg-white border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">Payment Information</h2>
                <PaymentForm 
                  onSubmit={handlePaymentSubmit} 
                  // isProcessing={isProcessing || checkout.isProcessing}
                />
              </div>

              {/* Continue Shopping Button */}
              <div className="bg-white border rounded-lg p-6">
                <button
                  onClick={handleContinueShopping}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  ← Continue Shopping
                </button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  You can continue shopping and your cart will be saved
                </p>
              </div>
            </>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white border rounded-lg p-6 h-fit sticky top-4">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty
              <button
                onClick={handleContinueShopping}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <div className="max-w-[70%]">
                    <span className="font-medium truncate block">{item.name}</span>
                    <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {checkout.shippingMethod && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${checkout.shippingMethod.price.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${checkout?.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>
                    ${(total + (checkout.shippingMethod?.price || 0) - discount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="mt-6 space-y-3">
                {step === 'address' && checkout.shippingAddress && (
                  <button
                    onClick={() => setStep('shipping')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue to Shipping
                  </button>
                )}
                {step === 'shipping' && checkout.shippingMethod && (
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                )}
                {step === 'payment' && (
                  <button
                    onClick={handleContinueShopping}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Continue Shopping
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}