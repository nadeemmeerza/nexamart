// src/services/utils/validators.ts

import { ERROR_MESSAGES, VALIDATION_RULES } from "@/app/constants/validationConstants";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validators = {
  email: (email: string): ValidationResult => {
    if (!email) return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    if (!VALIDATION_RULES.email.test(email)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
    }
    return { isValid: true };
  },

  phone: (phone: string): ValidationResult => {
    if (!phone) return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    if (!VALIDATION_RULES.phone.test(phone)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_PHONE };
    }
    return { isValid: true };
  },

  zipCode: (zipCode: string): ValidationResult => {
    if (!zipCode) return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    if (!VALIDATION_RULES.zipCode.test(zipCode)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_ZIP };
    }
    return { isValid: true };
  },

  requiredField: (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
    }
    return { isValid: true };
  },

  cardNumber: (cardNumber: string): ValidationResult => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!VALIDATION_RULES.cardNumber.test(cleaned)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CARD };
    }
    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    if (sum % 10 !== 0) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CARD };
    }
    return { isValid: true };
  },

  cvv: (cvv: string): ValidationResult => {
    if (!VALIDATION_RULES.cvv.test(cvv)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CVV };
    }
    return { isValid: true };
  },
};