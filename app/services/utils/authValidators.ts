// app/services/utils/authValidators.ts

import { PASSWORD_REGEX, EMAIL_REGEX } from '@/app/constants/authConstants';

export interface AuthValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const authValidators = {
  /**
   * Validate login form
   * Checks: email format, password presence
   */
  validateLoginForm: (email: string, password: string): AuthValidationResult => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validate signup form
   * Checks: all fields, password strength, password match
   */
  validateSignupForm: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ): AuthValidationResult => {
    const errors: Record<string, string> = {};

    // First name validation
    if (!firstName) {
      errors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!lastName) {
      errors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (!PASSWORD_REGEX.test(password)) {
      errors.password = 'Password does not meet requirements';
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validate email field
   */
  validateEmail: (email: string): AuthValidationResult => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validate password strength
   */
  validatePassword: (password: string): AuthValidationResult => {
    const errors: Record<string, string> = {};

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/[@$!%*?&]/.test(password)) {
      errors.password = 'Password must contain at least one special character (@$!%*?&)';
    }

    return {
      isValid: !PASSWORD_REGEX.test(password),
      errors,
    };
  },

  /**
   * Validate first name
   */
  validateFirstName: (firstName: string): AuthValidationResult => {
    const errors: Record<string, string> = {};

    if (!firstName) {
      errors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    } else if (firstName.trim().length > 50) {
      errors.firstName = 'First name must be less than 50 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validate last name
   */
  validateLastName: (lastName: string): AuthValidationResult => {
    const errors: Record<string, string> = {};

    if (!lastName) {
      errors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    } else if (lastName.trim().length > 50) {
      errors.lastName = 'Last name must be less than 50 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validate required field
   */
  validateRequiredField: (value: string, fieldName: string): AuthValidationResult => {
    const errors: Record<string, string> = {};

    if (!value || value.trim() === '') {
      errors[fieldName] = `${fieldName} is required`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validate form field based on type
   */
  validateField: (
    name: string,
    value: string,
    fieldType: 'email' | 'password' | 'text' | 'name'
  ): AuthValidationResult => {
    switch (fieldType) {
      case 'email':
        return authValidators.validateEmail(value);
      case 'password':
        return authValidators.validatePassword(value);
      case 'name':
        return authValidators.validateRequiredField(value, name);
      case 'text':
      default:
        return authValidators.validateRequiredField(value, name);
    }
  },

  /**
   * Check password strength level (1-5)
   */
  getPasswordStrengthLevel: (password: string): number => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    return Math.min(strength, 5);
  },

  /**
   * Get password strength label
   */
  getPasswordStrengthLabel: (password: string): string => {
    const level = authValidators.getPasswordStrengthLevel(password);

    switch (level) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return 'Unknown';
    }
  },

  /**
   * Check password requirements met
   */
  checkPasswordRequirements: (
    password: string
  ): {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    allMet: boolean;
  } => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
      allMet: false,
    };

    requirements.allMet = Object.values(requirements).every(v => v === true);

    return requirements;
  },
};
