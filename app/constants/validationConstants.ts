// src/constants/validationConstants.ts

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]{10,}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  cardNumber: /^\d{13,19}$/,
  cvv: /^\d{3,4}$/,
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_ZIP: 'Please enter a valid zip code',
  INVALID_CARD: 'Please enter a valid card number',
  INVALID_CVV: 'Please enter a valid CVV',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};
