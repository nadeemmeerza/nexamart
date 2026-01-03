// components/SignupForm.tsx
"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useNotification } from "@/app/context/NotificationContext"
import { createUser } from "@/lib/auth/user-service"
import { authValidators } from "@/app/services/utils/authValidators"
import { PASSWORD_REQUIREMENTS, PASSWORD_REGEX } from "@/app/constants/authConstants"
import { Eye, EyeOff, Check, X, User, Mail, Lock } from "lucide-react"
import styles from "./SignupForm.module.css"


interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const { addNotification } = useNotification()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const {data:session, status} = useSession()


    useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  } 

  // Check password requirements
  const passwordRequirementsMet = useMemo(() => {
    if (!formData.password) return [];

    return [
      formData.password.length >= 8,
      /[A-Z]/.test(formData.password),
      /[a-z]/.test(formData.password),
      /\d/.test(formData.password),
      /[@$!%*?&]/.test(formData.password),
    ];
  }, [formData.password]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const result = authValidators.validateSignupForm(
          name === 'firstName' ? value : formData.firstName,
          name === 'lastName' ? value : formData.lastName,
          name === 'email' ? value : formData.email,
          name === 'password' ? value : formData.password,
          name === 'confirmPassword' ? value : formData.confirmPassword
        );
        setErrors(result.errors);
      }
    },
    [formData, touched]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      setTouched(prev => ({ ...prev, [name]: true }));

      const result = authValidators.validateSignupForm(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      setErrors(result.errors);
    },
    [formData]
  );

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  if (!agreedToTerms) {
    addNotification('Please agree to terms and conditions', 'warning');
    setIsLoading(false);
    return;
  }

  const validation = authValidators.validateSignupForm(
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.password,
    formData.confirmPassword
  );

  if (!validation.isValid) {
    setErrors(validation.errors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setIsLoading(false);
    return;
  }

  try {
    // Call the API route instead of directly using createUser
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create account');
    }

    console.log('Signup successful:', data);

    // Auto-login after signup
    const signInResult = await signIn("credentials", {
      email: formData.email.trim(),
      password: formData.password,
      redirect: false,
    });

    console.log('Sign in result:', signInResult);

    if (signInResult?.error) {
      throw new Error(signInResult.error);
    }

    addNotification("Account created successfully!", "success");
    onSuccess?.();
    router.push("/");
    router.refresh();
  } catch (error: any) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : "Signup failed. Please try again.";
    addNotification(errorMessage, "error");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Form Header */}
      <div className={styles.formHeader}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join us to start shopping</p>
      </div>

      {/* First & Last Name */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>
            First Name
          </label>
          <div className={styles.inputWrapper}>
            <User className={styles.icon} />
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${
                touched.firstName && errors.firstName ? styles.inputError : ''
              }`}
              placeholder="John"
              disabled={isLoading}
              aria-invalid={touched.firstName && !!errors.firstName}
            />
          </div>
          {touched.firstName && errors.firstName && (
            <span className={styles.error} role="alert">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Last Name
          </label>
          <div className={styles.inputWrapper}>
            <User className={styles.icon} />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${
                touched.lastName && errors.lastName ? styles.inputError : ''
              }`}
              placeholder="Doe"
              disabled={isLoading}
              aria-invalid={touched.lastName && !!errors.lastName}
            />
          </div>
          {touched.lastName && errors.lastName && (
            <span className={styles.error} role="alert">
              {errors.lastName}
            </span>
          )}
        </div>
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <div className={styles.inputWrapper}>
          <Mail className={styles.icon} />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${
              touched.email && errors.email ? styles.inputError : ''
            }`}
            placeholder="you@example.com"
            disabled={isLoading}
            aria-invalid={touched.email && !!errors.email}
          />
        </div>
        {touched.email && errors.email && (
          <span className={styles.error} role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Password */}
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.inputWrapper}>
          <Lock className={styles.icon} />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${
              touched.password && errors.password ? styles.inputError : ''
            }`}
            placeholder="••••••••"
            disabled={isLoading}
            aria-invalid={touched.password && !!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {touched.password && errors.password && (
          <span className={styles.error} role="alert">
            {errors.password}
          </span>
        )}

        {/* Password Requirements */}
        {formData.password && (
          <div className={styles.requirements}>
            {PASSWORD_REQUIREMENTS.map((req, idx) => (
              <div
                key={idx}
                className={`${styles.requirement} ${
                  passwordRequirementsMet[idx] ? styles.met : styles.unmet
                }`}
              >
                <span className={styles.requirementIcon}>
                  {passwordRequirementsMet[idx] ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </span>
                <span className={styles.requirementText}>{req}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <div className={styles.inputWrapper}>
          <Lock className={styles.icon} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${
              touched.confirmPassword && errors.confirmPassword
                ? styles.inputError
                : ''
            }`}
            placeholder="••••••••"
            disabled={isLoading}
            aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.togglePassword}
            tabIndex={-1}
            aria-label={
              showConfirmPassword ? 'Hide password' : 'Show password'
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && (
          <span className={styles.error} role="alert">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      {/* Terms & Conditions */}
      <label className={styles.termsCheckbox}>
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          className={styles.checkbox}
          disabled={isLoading}
        />
        <span>
          I agree to the{' '}
          <a href="/terms" className={styles.link}>
            Terms and Conditions
          </a>
        </span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !agreedToTerms}
        className={styles.submitButton}
        aria-busy={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      {/* Login Link */}
      <p className={styles.loginText}>
        Already have an account?{' '}
        <a href="/login" className={styles.loginLink}>
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignupForm;