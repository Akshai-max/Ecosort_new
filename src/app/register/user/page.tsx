'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './register.module.css';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  dateOfBirth: string;
  gender: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

const STEPS = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'address', title: 'Address Details' },
  { id: 'security', title: 'Account Security' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateStep = (step: number): boolean => {
    setError('');
    
    switch (step) {
      case 0: // Personal Information
        if (!formData.firstName.trim()) {
          setError('First name is required');
          return false;
        }
        if (!formData.lastName.trim()) {
          setError('Last name is required');
          return false;
        }
        if (!formData.email.trim()) {
          setError('Email is required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!formData.phone.trim()) {
          setError('Phone number is required');
          return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
          setError('Please enter a valid 10-digit phone number');
          return false;
        }
        if (!formData.dateOfBirth) {
          setError('Date of birth is required');
          return false;
        }
        if (!formData.gender) {
          setError('Gender is required');
          return false;
        }
        break;

      case 1: // Address Details
        if (!formData.address.street.trim()) {
          setError('Street address is required');
          return false;
        }
        if (!formData.address.city.trim()) {
          setError('City is required');
          return false;
        }
        if (!formData.address.state.trim()) {
          setError('State is required');
          return false;
        }
        if (!formData.address.pincode.trim()) {
          setError('PIN code is required');
          return false;
        }
        if (!/^\d{6}$/.test(formData.address.pincode)) {
          setError('Please enter a valid 6-digit PIN code');
          return false;
        }
        break;

      case 2: // Account Security
        if (!formData.password) {
          setError('Password is required');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (!formData.agreeToTerms) {
          setError('You must agree to the terms and conditions');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Show success notification
      setShowSuccess(true);
      
      // Redirect after showing the notification
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address' && (child === 'street' || child === 'city' || child === 'state' || child === 'pincode')) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      } as FormData));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError('');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName" className={styles.label}>
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className={styles.input}
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className={styles.input}
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={styles.input}
                placeholder="Enter work email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={styles.input}
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="dateOfBirth" className={styles.label}>
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className={styles.input}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="gender" className={styles.label}>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                className={`${styles.input} ${styles.genderInput}`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="address.street" className={styles.label}>
                Street Address
              </label>
              <input
                id="address.street"
                name="address.street"
                type="text"
                required
                className={styles.input}
                placeholder="Enter street address"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="address.city" className={styles.label}>
                City
              </label>
              <input
                id="address.city"
                name="address.city"
                type="text"
                required
                className={styles.input}
                placeholder="Enter city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="address.state" className={styles.label}>
                State
              </label>
              <input
                id="address.state"
                name="address.state"
                type="text"
                required
                className={styles.input}
                placeholder="Enter state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="address.pincode" className={styles.label}>
                PIN Code
              </label>
              <input
                id="address.pincode"
                name="address.pincode"
                type="text"
                required
                className={styles.input}
                placeholder="Enter PIN code"
                value={formData.address.pincode}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={styles.input}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={styles.input}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className={styles.termsGroup}>
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={styles.checkbox}
                required
              />
              <label htmlFor="agreeToTerms" className={styles.termsLabel}>
                I agree to the <Link href="/terms" className={styles.link}>Terms of Service</Link> and <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bubbles}>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
      </div>
      <div className={styles.brandText}>
        EcoSort
      </div>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <h2 className={styles.title}>User Registration</h2>
          <p className={styles.subtitle}>Create Your Account</p>
        </div>
        
        <div className={styles.formContent}>
          <div className={styles.progressBar} data-step={currentStep}>
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.progressStep} ${
                  index === currentStep ? styles.active : ''
                } ${index < currentStep ? styles.completed : ''}`}
                style={{ '--progress': index === currentStep ? '360deg' : '0deg' } as React.CSSProperties}
              >
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepTitle}>{step.title}</div>
              </div>
            ))}
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>{STEPS[currentStep].title}</h3>
              {renderStepContent()}
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.navigationButtons}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className={`${styles.button} ${styles.secondaryButton}`}
                  disabled={isLoading}
                >
                  Previous
                </button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={styles.button}
                  disabled={isLoading}
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className={styles.button}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          <div className={styles.footer}>
            Already have an account?{' '}
            <Link href="/login" className={styles.link}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
      
      {showSuccess && (
        <div className={styles.successNotification}>
          <div className={styles.successIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={styles.successMessage}>
            Registration successful! Redirecting to login page...
          </div>
        </div>
      )}
    </div>
  );
} 