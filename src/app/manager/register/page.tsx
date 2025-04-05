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
  department: string;
  designation: string;
  panCard: string;
  aadharCard: string;
  dateOfBirth: string;
  gender: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

const STEPS = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'address', title: 'Address Details' },
  { id: 'professional', title: 'Professional Information' },
  { id: 'identity', title: 'Identity Documents' },
  { id: 'security', title: 'Account Security' },
];

export default function ManagerRegisterPage() {
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
    department: '',
    designation: '',
    panCard: '',
    aadharCard: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');

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

      case 2: // Professional Information
        if (!formData.department) {
          setError('Department is required');
          return false;
        }
        if (!formData.designation.trim()) {
          setError('Designation is required');
          return false;
        }
        break;

      case 3: // Identity Documents
        if (!formData.panCard.trim()) {
          setError('PAN card number is required');
          return false;
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) {
          setError('Please enter a valid PAN card number');
          return false;
        }
        if (!formData.aadharCard.trim()) {
          setError('Aadhar card number is required');
          return false;
        }
        if (!/^\d{12}$/.test(formData.aadharCard)) {
          setError('Please enter a valid 12-digit Aadhar card number');
          return false;
        }
        break;

      case 4: // Account Security
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

    try {
      // TODO: Implement actual registration logic here
      console.log('Manager registration attempt with:', formData);
      router.push('/manager/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
              <label htmlFor="department" className={styles.label}>
                Department
              </label>
              <select
                id="department"
                name="department"
                required
                className={`${styles.input} ${styles.departmentInput}`}
                value={formData.department}
                onChange={handleChange}
              >
                <option value="operations">Operations</option>
                <option value="logistics">Logistics</option>
                <option value="quality">Quality Control</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="designation" className={styles.label}>
                Designation
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                required
                className={styles.input}
                placeholder="Enter designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="panCard" className={styles.label}>
                PAN Card Number
              </label>
              <input
                id="panCard"
                name="panCard"
                type="text"
                required
                className={styles.input}
                placeholder="Enter PAN card number"
                value={formData.panCard}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="aadharCard" className={styles.label}>
                Aadhar Card Number
              </label>
              <input
                id="aadharCard"
                name="aadharCard"
                type="text"
                required
                className={styles.input}
                placeholder="Enter Aadhar card number"
                value={formData.aadharCard}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      case 4:
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
      <Link href="/" className={styles.brandText}>
        EcoSort
      </Link>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <h2 className={styles.title}>Manager Registration</h2>
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
                >
                  Previous
                </button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={styles.button}
                >
                  Next
                </button>
              ) : (
                <button type="submit" className={styles.button}>
                  Create Account
                </button>
              )}
            </div>
          </form>

          <div className={styles.footer}>
            Already have an account?{' '}
            <Link href="/manager/login" className={styles.link}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 