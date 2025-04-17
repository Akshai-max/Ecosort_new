'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './register.module.css';
import { BiBarChartAlt2, BiGroup, BiLeaf } from 'react-icons/bi';
import { BsLightning } from 'react-icons/bs';

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
  area: string;
  shift: string;
  wasteType: string;
  teamSize: string;
  availableForTemporaryAssignments: boolean;
  preferredEventTypes: string[];
};

const STEPS = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'address', title: 'Address Details' },
  { id: 'professional', title: 'Professional Info' },
  { id: 'identity', title: 'Identity Documents' },
  { id: 'security', title: 'Account Security' },
];

const isPasswordValid = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

const getPasswordStrength = (password: string): string => {
  if (!password) return '';
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return 'Weak';
  if (score <= 4) return 'Medium';
  return 'Strong';
};

const getPasswordStrengthClass = (password: string): string => {
  const strength = getPasswordStrength(password);
  return strength.toLowerCase();
};

const getPasswordStrengthPercentage = (password: string): number => {
  const strength = getPasswordStrength(password);
  switch (strength) {
    case 'Weak': return 33.33;
    case 'Medium': return 66.66;
    case 'Strong': return 100;
    default: return 0;
  }
};

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
    area: '',
    shift: '',
    wasteType: '',
    teamSize: '',
    availableForTemporaryAssignments: false,
    preferredEventTypes: [],
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
        if (!formData.area) {
          setError('Management Area/Zone is required');
          return false;
        }
        if (!formData.shift) {
          setError('Work Shift is required');
          return false;
        }
        if (!formData.wasteType) {
          setError('Waste Type is required');
          return false;
        }
        if (!formData.teamSize || Number(formData.teamSize) < 1) {
          setError('Team Size must be at least 1');
          return false;
        }
        if (formData.availableForTemporaryAssignments && formData.preferredEventTypes.length === 0) {
          setError('Please select at least one preferred event type');
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
        if (!/^\d{4}\s\d{4}\s\d{4}$/.test(formData.aadharCard)) {
          setError('Please enter a valid 12-digit Aadhar card number ');
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
    setFormSubmitted(true);

    if (!isPasswordValid(formData.password)) {
      setError('Please ensure your password meets all requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms to continue');
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
            <div className={styles.nameInputs}>
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

              <div className={`${styles.inputGroup} ${styles.lastNameInput}`}>
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

            <div className={styles.phoneGenderInputs}>
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

            <div className={styles.inputGroup}>
              <label className={styles.label}>Date of Birth</label>
              <div className={styles.dateOfBirthInputs}>
                <div className={styles.inputGroup}>
                  <input
                    id="date"
                    name="date"
                    type="number"
                    min="1"
                    max="31"
                    required
                    className={styles.input}
                    placeholder="DD"
                    value={formData.dateOfBirth.split('-')[2] ? 
                      (parseInt(formData.dateOfBirth.split('-')[2]) < 10 ? 
                        `${formData.dateOfBirth.split('-')[2]}` : 
                        formData.dateOfBirth.split('-')[2]) : 
                      ''}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && 
                          !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const cleanValue = e.target.value.replace(/[^\d]/g, '');
                      const [year, month] = formData.dateOfBirth.split('-');
                      let maxDays = 31;
                      if (month) {
                        if (['04', '06', '09', '11'].includes(month)) {
                          maxDays = 30;
                        } else if (month === '02') {
                          maxDays = year && parseInt(year) % 4 === 0 ? 29 : 28;
                        }
                      }
                      const parsedValue = parseInt(cleanValue) < 10 ? parseInt('0' + cleanValue) : parseInt(cleanValue);
                      const value = parsedValue > maxDays ? maxDays : parsedValue;
                      setFormData(prev => ({
                        ...prev,
                        dateOfBirth: `${year || ''}-${month || ''}-${value < 10 ? `0${value}` : value}`
                      }));
                    }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <select
                    id="month"
                    name="month"
                    required
                    className={styles.input}
                    value={formData.dateOfBirth.split('-')[1] || ''}
                    onChange={(e) => {
                      const [year] = formData.dateOfBirth.split('-');
                      const date = formData.dateOfBirth.split('-')[2] || '';
                      setFormData(prev => ({
                        ...prev,
                        dateOfBirth: `${year || ''}-${e.target.value}-${date}`
                      }));
                    }}
                  >
                    <option value="">Select month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    id="year"
                    name="year"
                    type="number"
                    min={new Date().getFullYear() - 100}
                    max={new Date().getFullYear()}
                    required
                    className={styles.input}
                    placeholder="YYYY"
                    value={formData.dateOfBirth.split('-')[0] || ''}
                    onChange={(e) => {
                      const cleanValue = e.target.value.replace(/[^\d]/g, '');
                      if (cleanValue === e.target.value) {
                        const maxYear = new Date().getFullYear();
                        const parsedValue = parseInt(cleanValue);
                        const value = parsedValue > maxYear ? maxYear : parsedValue;
                        
                        const [, month, date] = formData.dateOfBirth.split('-');
                        setFormData(prev => ({
                          ...prev,
                          dateOfBirth: `${value || ''}-${month || ''}-${date || ''}`
                        }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (!/[\d]|Backspace|Delete|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
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
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="availableForTemporaryAssignments"
                  name="availableForTemporaryAssignments"
                  checked={formData.availableForTemporaryAssignments}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      availableForTemporaryAssignments: e.target.checked,
                      preferredEventTypes: e.target.checked ? prev.preferredEventTypes : []
                    }));
                  }}
                  className={styles.checkbox}
                />
                <label htmlFor="availableForTemporaryAssignments" className={styles.checkboxLabel}>
                  Available for Temporary Assignments
                </label>
              </div>
            </div>

            {formData.availableForTemporaryAssignments ? (
              <div className={styles.wasteTeamContainer}>
                <div className={styles.inputGroup}>
                  <label htmlFor="area" className={styles.label}>
                    Management Zone
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="Enter your assigned zone"
                    value={formData.area}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="shift" className={styles.label}>
                    Work Shift
                  </label>
                  <select
                    id="shift"
                    name="shift"
                    required
                    className={styles.input}
                    value={formData.shift}
                    onChange={handleChange}
                  >
                    <option value="">Select shift</option>
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="area" className={styles.label}>
                    Management Area/Zone
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="Enter your assigned area or zone"
                    value={formData.area}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="shift" className={styles.label}>
                    Work Shift
                  </label>
                  <select
                    id="shift"
                    name="shift"
                    required
                    className={styles.input}
                    value={formData.shift}
                    onChange={handleChange}
                  >
                    <option value="">Select shift</option>
                    <option value="morning">Morning (6:00 AM - 2:00 PM)</option>
                    <option value="evening">Evening (2:00 PM - 10:00 PM)</option>
                    <option value="night">Night (10:00 PM - 6:00 AM)</option>
                  </select>
                </div>
              </>
            )}

            <div className={styles.wasteTeamContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="wasteType" className={styles.label}>
                  Waste Type
                </label>
                <select
                  id="wasteType"
                  name="wasteType"
                  required
                  className={styles.input}
                  value={formData.wasteType}
                  onChange={handleChange}
                >
                  <option value="">Select waste type</option>
                  <option value="dry">Dry Waste</option>
                  <option value="wet">Wet Waste</option>
                  <option value="hazardous">Hazardous Waste</option>
                  <option value="mixed">Mixed Waste</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="teamSize" className={styles.label}>
                  Team Size
                </label>
                <input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  min="1"
                  max="50"
                  required
                  className={styles.input}
                  placeholder="Enter number of workers"
                  value={formData.teamSize}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 50) {
                      e.target.value = "50";
                    }
                    handleChange(e);
                  }}
                  onKeyDown={(e) => {
                    if (!/[0-9]|\./g.test(e.key) && 
                        e.key !== 'Backspace' && 
                        e.key !== 'Delete' && 
                        e.key !== 'ArrowLeft' && 
                        e.key !== 'ArrowRight' &&
                        e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>

            {formData.availableForTemporaryAssignments && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Preferred Event Types</label>
                <div className={styles.eventTypesGroup}>
                  {['Festivals', 'Protests', 'Sports Events', 'Concerts', 'Public Gatherings'].map((eventType) => (
                    <div key={eventType} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        id={`event-${eventType.toLowerCase()}`}
                        checked={formData.preferredEventTypes.includes(eventType)}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            preferredEventTypes: e.target.checked
                              ? [...prev.preferredEventTypes, eventType]
                              : prev.preferredEventTypes.filter(type => type !== eventType)
                          }));
                        }}
                        className={styles.checkbox}
                      />
                      <label htmlFor={`event-${eventType.toLowerCase()}`} className={styles.checkboxLabel}>
                        {eventType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <div className={styles.labelWithTooltip}>
                <label htmlFor="panCard" className={styles.label}>
                  PAN Card Number
                  <span className={styles.requiredStar}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <div className={styles.helpIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12" y2="17"/>
                    </svg>
                  </div>
                  <div className={styles.tooltip}>
                    Permanent Account Number (PAN) is required for tax purposes and financial transactions. It serves as a unique identifier for all your financial activities.
                  </div>
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="panCard"
                  name="panCard"
                  type="text"
                  required
                  aria-required="true"
                  aria-describedby="panCardHint panCardError"
                  className={`${styles.input} ${formData.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard) ? styles.inputError : ''}`}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={formData.panCard}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (value.length <= 10) {
                      if (/^[A-Z0-9]*$/.test(value)) {
                        setFormData(prev => ({
                          ...prev,
                          panCard: value
                        }));
                      }
                    }
                  }}
                />
                <span id="panCardHint" className={styles.inputHint}>
                  Format: ABCDE1234F
                </span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelWithTooltip}>
                <label htmlFor="aadharCard" className={styles.label}>
                  Aadhar Card Number
                  <span className={styles.requiredStar}>*</span>
                </label>
                <div className={styles.tooltipContainer}>
                  <div className={styles.helpIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12" y2="17"/>
                    </svg>
                  </div>
                  <div className={styles.tooltip}>
                    Aadhar is your unique identification number issued by UIDAI. It's required for identity verification and accessing government services.
                  </div>
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="aadharCard"
                  name="aadharCard"
                  type="text"
                  required
                  aria-required="true"
                  aria-describedby="aadharHint aadharError"
                  className={`${styles.input} ${formData.aadharCard && !/^\d{12}$/.test(formData.aadharCard.replace(/\s/g, '')) ? styles.inputError : ''}`}
                  placeholder="1234 5678 9123"
                  maxLength={14}
                  value={formData.aadharCard}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (value.length <= 12) {
                      if (/^\d*$/.test(value)) {
                        const formattedValue = value
                          .replace(/(\d{4})/g, '$1 ')
                          .trim();
                        setFormData(prev => ({
                          ...prev,
                          aadharCard: formattedValue
                        }));
                      }
                    }
                  }}
                />
                <span id="aadharHint" className={styles.inputHint}>
                  Enter 12-digit Aadhar number
                </span>
              </div>
            </div>

            <div className={styles.securityNote}>
              <div className={styles.securityIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <p>Your information is securely stored and encrypted. We follow strict data protection guidelines.</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Create Password
                <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  aria-required="true"
                  aria-label="Password must contain at least 8 characters, including uppercase, lowercase, number and symbol"
                  className={`${styles.input} ${formData.password && !isPasswordValid(formData.password) ? styles.inputError : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      password: e.target.value
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthLabel}>
                    Password Strength: 
                    <span className={styles[getPasswordStrengthClass(formData.password)]}>
                      {getPasswordStrength(formData.password)}
                    </span>
                  </div>
                  <div className={styles.strengthBar}>
                    <div 
                      className={`${styles.strengthIndicator} ${styles[getPasswordStrengthClass(formData.password)]}`}
                      style={{ width: `${getPasswordStrengthPercentage(formData.password)}%` }}
                    />
                  </div>
                  <ul className={styles.passwordCriteria}>
                    <li className={formData.password.length >= 8 ? styles.met : ''}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? styles.met : ''}>
                      Contains uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? styles.met : ''}>
                      Contains lowercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? styles.met : ''}>
                      Contains number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? styles.met : ''}>
                      Contains special character
                    </li>
                  </ul>
                </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
                <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  aria-required="true"
                  aria-label="Confirm your password"
                  className={`${styles.input} ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword 
                    ? styles.inputError 
                    : ''
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.passwordToggle}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <span className={styles.inputError} role="alert">
                  Passwords do not match
                </span>
              )}
            </div>

            <div className={styles.termsGroup}>
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    agreeToTerms: e.target.checked
                  }));
                }}
                className={styles.checkbox}
                aria-required="true"
              />
              <label htmlFor="agreeToTerms" className={styles.termsLabel}>
                I agree to the{' '}
                <a 
                  href="/terms" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    // Open terms modal or new tab
                    window.open('/terms', '_blank');
                  }}
                >
                  Terms of Service
                </a>
                {' '}and{' '}
                <a 
                  href="/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    // Open privacy modal or new tab
                    window.open('/privacy', '_blank');
                  }}
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {!formData.agreeToTerms && formSubmitted && (
              <span className={styles.inputError} role="alert">
                You must agree to the terms to continue
              </span>
            )}
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
      <Link href="/" className={styles.brandText}>
        EcoSort
      </Link>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <div className={styles.logoSection}>
            <div className={styles.logoWrapper}>
              <Image
                src="/ecosort-logo.png"
                alt="EcoSort Logo"
                width={120}
                height={120}
                className={styles.logo}
                priority
              />
              <div className={styles.logoGlow}></div>
            </div>
            <div className={styles.logoText}>
              <h1 className={styles.title}>Join Our Management Team</h1>
              <p className={styles.subtitle}>
                Become a part of our mission to revolutionize waste management through efficient operations and sustainable practices
              </p>
            </div>
          </div>

          <div className={styles.benefitsContainer}>
            <h3 className={styles.benefitsTitle}>Why Join Us?</h3>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>
                  <BiBarChartAlt2 size={24} />
                </span>
                <span className={styles.benefitText}>Data-Driven Decisions</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>
                  <BsLightning size={24} />
                </span>
                <span className={styles.benefitText}>Efficient Operations</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>
                  <BiLeaf size={24} />
                </span>
                <span className={styles.benefitText}>Sustainable Impact</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>
                  <BiGroup size={24} />
                </span>
                <span className={styles.benefitText}>Team Collaboration</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.formContent}>
          <div className={styles.stepCounter}>
            Step {currentStep + 1} of {STEPS.length}
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