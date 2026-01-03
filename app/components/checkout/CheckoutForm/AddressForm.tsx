// app/components/checkout/CheckoutForm/AddressForm.tsx

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import styles from './CheckoutForm.module.css';
import { CheckoutAddress, CreateCheckoutAddressInput } from '@/app/types/address.types';
import { validators } from '@/app/services/utils/validators';

interface AddressFormProps {
  title: string;
  onSubmit: (address: CreateCheckoutAddressInput) => void;
  initialValues?: Partial<CheckoutAddress>;
  isLoading?: boolean;
  onCancel?: () => void;
  showAddressType?: boolean;
}

// Constants
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France'];
const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA'];
const ADDRESS_TYPES = [
  { value: 'home', label: 'Home' },
  { value: 'office', label: 'Office' },
  { value: 'other', label: 'Other' }
];

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'postalCode'];

export const AddressForm: React.FC<AddressFormProps> = ({
  title,
  onSubmit,
  initialValues = {},
  isLoading = false,
  onCancel,
  showAddressType = false,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<Partial<CheckoutAddress>>({
    type: 'home',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
    isShipping: true,
    isBilling: false,
    ...initialValues
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      
      setFormData(prev => ({ ...prev, [name]: finalValue }));
      
      if (touched[name]) {
        validateField(name, finalValue as string);
      }
    },
    [touched]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, []);

  const validateField = useCallback((name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'street':
      case 'city':
      case 'state':
        error = validators.requiredField(value).error || '';
        break;
      case 'email':
        error = validators.email(value).error || '';
        break;
      case 'phone':
        error = validators.phone(value).error || '';
        break;
      case 'postalCode':
        error = validators.zipCode(value).error || '';
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    REQUIRED_FIELDS.forEach(field => {
      const value = formData[field as keyof CheckoutAddress];
      const stringValue = typeof value === 'string' ? value : '';
      
      const result = validators.requiredField(stringValue);
      if (!result.isValid) {
        newErrors[field] = result.error || '';
      }
    });

    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const newErrors = validateForm();
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setTouched(
          REQUIRED_FIELDS.reduce(
            (acc, field) => ({ ...acc, [field]: true }),
            {}
          )
        );
        return;
      }

      const submitData: CreateCheckoutAddressInput = {
        type: formData.type || 'home',
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        street: formData.street || '',
        apartment: formData.apartment || '',
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.postalCode || '',
        country: formData.country || 'United States',
        isDefault: formData.isDefault || false,
        isShipping: formData.isShipping !== undefined ? formData.isShipping : true,
        isBilling: formData.isBilling || false,
      };

      onSubmit(submitData);
    },
    [formData, onSubmit, validateForm]
  );

  // Form field configuration for easier rendering
  const formFields = [
    // Address Type (conditional)
    ...(showAddressType ? [{
      type: 'select' as const,
      id: 'type',
      name: 'type',
      label: 'Address Type',
      required: false,
      options: ADDRESS_TYPES,
      fullWidth: false
    }] : []),

    // Personal Information
    {
      type: 'text' as const,
      id: 'firstName',
      name: 'firstName',
      label: 'First Name *',
      required: true,
      placeholder: 'John'
    },
    {
      type: 'text' as const,
      id: 'lastName',
      name: 'lastName',
      label: 'Last Name *',
      required: true,
      placeholder: 'Doe'
    },
    {
      type: 'email' as const,
      id: 'email',
      name: 'email',
      label: 'Email *',
      required: true,
      placeholder: 'john@example.com'
    },
    {
      type: 'tel' as const,
      id: 'phone',
      name: 'phone',
      label: 'Phone *',
      required: true,
      placeholder: '(555) 123-4567'
    },

    // Address Information
    {
      type: 'text' as const,
      id: 'street',
      name: 'street',
      label: 'Street Address *',
      required: true,
      placeholder: '123 Main Street',
      fullWidth: true
    },
    {
      type: 'text' as const,
      id: 'apartment',
      name: 'apartment',
      label: 'Apartment, Suite, etc. (Optional)',
      required: false,
      placeholder: 'Apt 4B',
      fullWidth: true
    },
    {
      type: 'text' as const,
      id: 'city',
      name: 'city',
      label: 'City *',
      required: true,
      placeholder: 'New York'
    },
    {
      type: 'select' as const,
      id: 'state',
      name: 'state',
      label: 'State *',
      required: true,
      options: US_STATES.map(state => ({ value: state, label: state })),
      placeholder: 'Select a state'
    },
    {
      type: 'text' as const,
      id: 'postalCode',
      name: 'postalCode',
      label: 'Postal Code *',
      required: true,
      placeholder: '10001'
    },
    {
      type: 'select' as const,
      id: 'country',
      name: 'country',
      label: 'Country *',
      required: true,
      options: COUNTRIES.map(country => ({ value: country, label: country }))
    }
  ];

  // Checkbox fields for address management
  const checkboxFields = showAddressType ? [
    { id: 'isDefault', name: 'isDefault', label: 'Set as default address' },
    { id: 'isShipping', name: 'isShipping', label: 'Use for shipping' },
    { id: 'isBilling', name: 'isBilling', label: 'Use for billing' }
  ] : [];

  // Render form field based on type
  const renderFormField = (field: typeof formFields[0]) => {
    const value = formData[field.name as keyof CheckoutAddress] || '';
    const fieldTouched = touched[field.name];
    const fieldError = errors[field.name];
    const hasError = fieldTouched && fieldError;
    
    const inputClassName = `${styles.input} ${hasError ? styles.inputError : ''}`;
    const fieldClassName = `${styles.formGroup} ${field.fullWidth ? styles.fullWidth : ''}`;

    const commonProps = {
      id: field.id,
      name: field.name,
      value: value as string,
      onChange: handleChange,
      onBlur: handleBlur,
      disabled: isLoading || !isClient,
      className: inputClassName,
      suppressHydrationWarning: true,
      ...(field.required && { required: true })
    };

    return (
      <div key={field.id} className={fieldClassName}>
        <label htmlFor={field.id} className={styles.label}>
          {field.label}
        </label>
        
        {field.type === 'select' ? (
          <select {...commonProps}>
            {field.placeholder && <option value="">{field.placeholder}</option>}
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            placeholder={field.placeholder}
            {...commonProps}
          />
        )}
        
        {hasError && (
          <span className={styles.error}>{fieldError}</span>
        )}
      </div>
    );
  };

  // Render checkbox field
  const renderCheckboxField = (field: typeof checkboxFields[0]) => (
    <div key={field.id} className={styles.formGroup}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name={field.name}
          checked={formData[field.name as keyof CheckoutAddress] as boolean || false}
          onChange={handleChange}
          disabled={isLoading || !isClient}
          suppressHydrationWarning
        />
        {field.label}
      </label>
    </div>
  );

  // Show loading state for SSR
  if (!isClient) {
    return (
      <form className={styles.form} suppressHydrationWarning>
        <h2 className={styles.formTitle}>{title}</h2>
        <div className={styles.formGrid}>
          {formFields.map(field => (
            <div key={field.id} className={`${styles.formGroup} ${field.fullWidth ? styles.fullWidth : ''}`}>
              <label htmlFor={field.id} className={styles.label}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select 
                  className={styles.input} 
                  disabled 
                  suppressHydrationWarning
                >
                  <option value="">Loading...</option>
                </select>
              ) : (
                <input
                  type={field.type}
                  className={styles.input}
                  placeholder={field.placeholder}
                  disabled
                  suppressHydrationWarning
                />
              )}
            </div>
          ))}
        </div>
        <div className={styles.formActions}>
          {onCancel && (
            <button type="button" className={styles.cancelButton} disabled>
              Cancel
            </button>
          )}
          <button type="submit" className={styles.submitButton} disabled>
            Loading...
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} suppressHydrationWarning>
      <h2 className={styles.formTitle}>{title}</h2>

      <div className={styles.formGrid}>
        {formFields.map(renderFormField)}
        {checkboxFields.map(renderCheckboxField)}
      </div>

      <div className={styles.formActions}>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className={styles.cancelButton} 
            disabled={isLoading}
            suppressHydrationWarning
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={isLoading} 
          className={styles.submitButton}
          suppressHydrationWarning
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </form>
  );
};