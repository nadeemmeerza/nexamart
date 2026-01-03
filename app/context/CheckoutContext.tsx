// src/context/CheckoutContext.tsx

'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { CheckoutState, Order, PaymentMethod, ShippingMethod } from '../types/order.types';
import { Address, CheckoutAddress, CreateCheckoutAddressInput } from '../types/address.types';
import { useCart } from './CartContext'; // Import useCart to get cart data

interface CheckoutAction {
  type:
    | 'SET_SHIPPING_ADDRESS'
    | 'SET_BILLING_ADDRESS'
    | 'SET_SHIPPING_METHOD'
    | 'SET_PAYMENT_METHOD'
    | 'SET_DISCOUNT'
    | 'SET_PROCESSING'
    | 'SET_ERROR'
    | 'SET_USER_ADDRESSES'
    | 'SET_SHOW_ADDRESS_FORM'
    | 'RESET';
  payload?: any;
}

// Extend the initial state to include address management
interface ExtendedCheckoutState extends CheckoutState {
  userAddresses: Address[];
  showAddressForm: boolean;
}

const initialState: ExtendedCheckoutState = {
  shippingAddress: null,
  billingAddress: null,
  shippingMethod: null,
  paymentMethod: null,
  couponCode: undefined,
  discount: 0,
  isProcessing: false,
  error: null,
  userAddresses: [],
  showAddressForm: false,
};

const checkoutReducer = (state: ExtendedCheckoutState, action: CheckoutAction): ExtendedCheckoutState => {
  switch (action.type) {
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    case 'SET_BILLING_ADDRESS':
      return { ...state, billingAddress: action.payload };
    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethod: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_DISCOUNT':
      return {
        ...state,
        couponCode: action.payload.code,
        discount: action.payload.discount,
      };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isProcessing: false };
    case 'SET_USER_ADDRESSES':
      return { 
        ...state, 
        userAddresses: action.payload,
        // Auto-show form if no addresses exist
        showAddressForm: action.payload.length === 0
      };
    case 'SET_SHOW_ADDRESS_FORM':
      return { ...state, showAddressForm: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface CheckoutContextType {
  checkout: CheckoutState;
  userAddresses: Address[];
  showAddressForm: boolean;
  updateShippingAddress: (address: CheckoutAddress) => void;
  updateBillingAddress: (address: CheckoutAddress) => void;
  updateShippingMethod: (method: ShippingMethod) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  setDiscount: (code: string, discount: number) => void;
  processPayment: (paymentDetails: any) => Promise<Order>;
  resetCheckout: () => void;
  loadUserAddresses: () => Promise<void>;
  addNewAddress: (addressData: CreateCheckoutAddressInput) => Promise<void>;
  selectExistingAddress: (addressId: string) => void;
  toggleAddressForm: (show: boolean) => void;
  lastOrderId: string | null;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  
  // Get cart data using useCart hook
  const { cartItems, total } = useCart(); // This might cause issues if CartProvider is not parent

  // Load user addresses on component mount
  useEffect(() => {
    loadUserAddresses();
  }, []);

  const loadUserAddresses = useCallback(async () => {
    try {
      const response = await fetch('/api/user/addresses');
      if (response.ok) {
        const addresses = await response.json();
        dispatch({ type: 'SET_USER_ADDRESSES', payload: addresses });

        // Auto-select default shipping address if available
        const defaultAddress = addresses.find((addr: Address) => addr.isDefault && addr.isShipping);
        if (defaultAddress) {
          dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: defaultAddress });
        }
      }
    } catch (error) {
      console.error('Failed to load user addresses:', error);
    }
  }, []);

  const addNewAddress = useCallback(async (addressData: CreateCheckoutAddressInput): Promise<void> => {
    try {
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const newAddress = await response.json();
      
      // Update local state
      const updatedAddresses = [...state.userAddresses, newAddress];
      dispatch({ type: 'SET_USER_ADDRESSES', payload: updatedAddresses });
      dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: newAddress });
      dispatch({ type: 'SET_SHOW_ADDRESS_FORM', payload: false });

    } catch (error) {
      console.error('Error adding new address:', error);
      throw error;
    }
  }, [state.userAddresses]);

  const selectExistingAddress = useCallback((addressId: string) => {
    const address = state.userAddresses.find(addr => addr.id === addressId);
    if (address) {
      dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
    }
  }, [state.userAddresses]);

  const toggleAddressForm = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_ADDRESS_FORM', payload: show });
  }, []);

  const updateShippingAddress = useCallback((address: CheckoutAddress) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  }, []);

  const updateBillingAddress = useCallback((address: CheckoutAddress) => {
    dispatch({ type: 'SET_BILLING_ADDRESS', payload: address });
  }, []);

  const updateShippingMethod = useCallback((method: ShippingMethod) => {
    dispatch({ type: 'SET_SHIPPING_METHOD', payload: method });
  }, []);

  const updatePaymentMethod = useCallback((method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  }, []);

  const setDiscount = useCallback((code: string, discount: number) => {
    dispatch({ type: 'SET_DISCOUNT', payload: { code, discount } });
  }, []);

  const processPayment = useCallback(
    async (paymentDetails: any): Promise<Order> => {
      dispatch({ type: 'SET_PROCESSING', payload: true });

      try {
        console.log('Processing payment with API...');
        console.log('Cart items:', cartItems);
        console.log('Total:', total);
        console.log('Shipping address:', state.shippingAddress);

        // Call the real checkout API
        const response = await fetch('/api/checkout/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shippingAddress: state.shippingAddress,
            billingAddress: state.billingAddress,
            shippingMethod: state.shippingMethod,
            paymentData: paymentDetails,
            cartItems: cartItems,
            subtotal: total,
            shippingCost: state.shippingMethod?.price || 0,
            total: total + (state.shippingMethod?.price || 0),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Payment failed');
        }

        const result = await response.json();
        console.log('API response:', result);

        if (!result.success || !result.order) {
          throw new Error('Order creation failed');
        }

        // Create the Order object to return
        const order: Order = {
          id: result.order.id, // Real database ID
          orderNumber: result.order.orderNumber,
          userId: result.order.userId,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress: state.shippingAddress!,
          billingAddress: state.billingAddress || state.shippingAddress!,
          shippingMethod: state.shippingMethod!,
          paymentMethod: paymentDetails,
          subtotal: total,
          tax: 0,
          shipping: state.shippingMethod?.price || 0,
          total: total + (state.shippingMethod?.price || 0),
          status: 'pending',
          createdAt: new Date(result.order.createdAt),
          updatedAt: new Date(),
        };

        dispatch({ type: 'SET_PROCESSING', payload: false });
        return order;

      } catch (error) {
        console.error('Payment processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Payment failed';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },
    [state, cartItems, total] // Fixed dependencies
  );

  const resetCheckout = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Extract the base checkout state (without address management props)
  const { userAddresses, showAddressForm, ...checkoutState } = state;

  return (
    <CheckoutContext.Provider
      value={{
        // Base checkout state (for backward compatibility)
        checkout: checkoutState,
        // Direct access to address management properties
        userAddresses,
        showAddressForm,
        // Existing functions
        updateShippingAddress,
        updateBillingAddress,
        updateShippingMethod,
        updatePaymentMethod,
        setDiscount,
        processPayment,
        resetCheckout,
        // New address management functions
        loadUserAddresses,
        addNewAddress,
        selectExistingAddress,
        toggleAddressForm,
         lastOrderId :null,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
};