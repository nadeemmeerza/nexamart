// src/components/checkout/CheckoutForm/PaymentForm.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { validators } from '@/app/services/utils/validators';
import { CreditCard, Lock } from 'lucide-react';
import styles from './CheckoutForm.module.css';

interface PaymentFormProps {
  onSubmit: (paymentData: any) => void;
  isLoading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let { name, value } = e.target;

      // Format card number with spaces
      if (name === 'cardNumber') {
        value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      }

      // Limit CVV to 4 digits
      if (name === 'cvv') {
        value = value.replace(/\D/g, '').slice(0, 4);
      }

      setFormData(prev => ({ ...prev, [name]: value }));

      if (touched[name]) {
        validateField(name, value);
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
      case 'cardholderName': {
        const result = validators.requiredField(value);
        error = result.error || '';
        break;
      }
      case 'cardNumber': {
        const result = validators.cardNumber(value);
        error = result.error || '';
        break;
      }
      case 'cvv': {
        const result = validators.cvv(value);
        error = result.error || '';
        break;
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validate all fields
      const newErrors: Record<string, string> = {};

      const cardholderResult = validators.requiredField(formData.cardholderName);
      if (!cardholderResult.isValid) newErrors.cardholderName = cardholderResult.error || '';

      const cardResult = validators.cardNumber(formData.cardNumber);
      if (!cardResult.isValid) newErrors.cardNumber = cardResult.error || '';

      const cvvResult = validators.cvv(formData.cvv);
      if (!cvvResult.isValid) newErrors.cvv = cvvResult.error || '';

      if (!formData.expiryMonth || !formData.expiryYear) {
        newErrors.expiry = 'Please select expiry date';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setTouched({
          cardholderName: true,
          cardNumber: true,
          expiryMonth: true,
          expiryYear: true,
          cvv: true,
        });
        return;
      }

      onSubmit({
        type: 'card',
        cardholderName: formData.cardholderName,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiry: `${formData.expiryMonth}/${formData.expiryYear}`,
        cvv: formData.cvv,
      });
    },
    [formData, onSubmit]
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.securityBadge}>
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Cardholder Name */}
      <div className={styles.formGroup}>
        <label htmlFor="cardholderName" className={styles.label}>
          Cardholder Name *
        </label>
        <input
          type="text"
          id="cardholderName"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${styles.input} ${touched.cardholderName && errors.cardholderName ? styles.inputError : ''}`}
          placeholder="John Doe"
          disabled={isLoading}
        />
        {touched.cardholderName && errors.cardholderName && (
          <span className={styles.error}>{errors.cardholderName}</span>
        )}
      </div>

      {/* Card Number */}
      <div className={styles.formGroup}>
        <label htmlFor="cardNumber" className={styles.label}>
          <CreditCard className="w-4 h-4 inline mr-2" />
          Card Number *
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${styles.input} ${touched.cardNumber && errors.cardNumber ? styles.inputError : ''}`}
          placeholder="4532 1234 5678 9010"
          maxLength={23}
          disabled={isLoading}
        />
        {touched.cardNumber && errors.cardNumber && (
          <span className={styles.error}>{errors.cardNumber}</span>
        )}
      </div>

      {/* Expiry & CVV */}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="expiryMonth" className={styles.label}>
            Expiry Date *
          </label>
          <div className={styles.expiryInputs}>
            <select
              id="expiryMonth"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${styles.expirySelect}`}
              disabled={isLoading}
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={String(month).padStart(2, '0')}>
                  {String(month).padStart(2, '0')}
                </option>
              ))}
            </select>
            <select
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${styles.expirySelect}`}
              disabled={isLoading}
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year} value={String(year).slice(-2)}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {touched.expiryMonth && errors.expiry && (
            <span className={styles.error}>{errors.expiry}</span>
          )}
        </div>

        {/* CVV */}
        <div className={styles.formGroup}>
          <label htmlFor="cvv" className={styles.label}>
            CVV *
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${touched.cvv && errors.cvv ? styles.inputError : ''}`}
            placeholder="123"
            maxLength={4}
            disabled={isLoading}
          />
          {touched.cvv && errors.cvv && (
            <span className={styles.error}>{errors.cvv}</span>
          )}
        </div>
      </div>

      <button type="submit" disabled={isLoading} className={styles.submitButton}>
        {isLoading ? 'Processing Payment...' : 'Pay Now'}
      </button>
    </form>
  );
};

