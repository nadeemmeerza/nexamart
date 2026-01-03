// src/constants/authConstants.ts

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'current_user';

// Password validation regex
// Requirements:
// - At least 8 characters
// - One uppercase letter (A-Z)
// - One lowercase letter (a-z)
// - One number (0-9)
// - One special character (@$!%*?&)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements list
export const PASSWORD_REQUIREMENTS = [
  'At least 8 characters long',
  'One uppercase letter (A-Z)',
  'One lowercase letter (a-z)',
  'One number (0-9)',
  'One special character (@$!%*?&)',
];

// User roles
export type UserRole = 'customer' | 'admin' | 'vendor';

export const USER_ROLES: Record<UserRole, string> = {
  customer: 'Customer',
  admin: 'Administrator',
  vendor: 'Vendor',
};

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  ADMIN: {
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin' as UserRole,
  },
  CUSTOMER: {
    email: 'user@example.com',
    password: 'User123!',
    role: 'customer' as UserRole,
  },
};

// API endpoints (ready for backend integration)
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  PROFILE: '/api/auth/profile',
  UPDATE_PROFILE: '/api/auth/profile',
};

// Token expiration times (in seconds)
export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: 3600, // 1 hour
  REFRESH_TOKEN: 604800, // 7 days
};

// Session timeout (in milliseconds)
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Error messages
export const AUTH_ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password does not meet requirements',
  PASSWORD_MISMATCH: 'Passwords do not match',
  REQUIRED_FIELD: 'This field is required',
  EMAIL_EXISTS: 'Email already registered',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to access this resource',
  FORBIDDEN: 'You do not have permission to perform this action',
  SERVER_ERROR: 'An error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

// Success messages
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  SIGNUP: 'Account created successfully!',
  LOGOUT: 'Logged out successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  PHONE: /^[\d\s\-\+\(\)]{10,}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  NAME: /^[a-zA-Z\s'-]{2,}$/,
};
