'use client';

import { useState } from 'react';
import { ArrowLeft, UserCheck, Mail, Lock, Building, MapPin, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './register-employee.module.css';

export default function RegisterEmployeePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    zone: '',
    experience: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.zone) newErrors.zone = 'Zone assignment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Employee registration submitted! Your account will be activated after manager approval.');
      router.push('/app/user-employee/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/app/user-employee');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft className={styles.backIcon} />
          Back to User & Employee Portal
        </button>
        
        <div className={styles.titleSection}>
          <div className={styles.iconContainer}>
            <UserCheck className={styles.icon} />
          </div>
          <h1 className={styles.title}>Employee Registration</h1>
          <p className={styles.subtitle}>
            Register as an employee for waste management operations
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.warningBox}>
          <AlertCircle className={styles.warningIcon} />
          <div>
            <h3>Manager Approval Required</h3>
            <p>Your employee account will need to be approved by a manager before you can access the system.</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address *
                </label>
                <div className={styles.inputWithIcon}>
                  <Mail className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Account Security</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password *
                </label>
                <div className={styles.inputWithIcon}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Create a strong password"
                  />
                </div>
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password *
                </label>
                <div className={styles.inputWithIcon}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Work Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="department" className={styles.label}>
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.department ? styles.inputError : ''}`}
                >
                  <option value="">Select Department</option>
                  <option value="waste-collection">Waste Collection</option>
                  <option value="recycling">Recycling</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="supervision">Supervision</option>
                  <option value="administration">Administration</option>
                </select>
                {errors.department && <span className={styles.errorText}>{errors.department}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="zone" className={styles.label}>
                  Preferred Zone *
                </label>
                <select
                  id="zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.zone ? styles.inputError : ''}`}
                >
                  <option value="">Select Zone</option>
                  <option value="zone-a">Zone A - Downtown</option>
                  <option value="zone-b">Zone B - Residential North</option>
                  <option value="zone-c">Zone C - Residential South</option>
                  <option value="zone-d">Zone D - Industrial</option>
                  <option value="zone-e">Zone E - Commercial</option>
                </select>
                {errors.zone && <span className={styles.errorText}>{errors.zone}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="experience" className={styles.label}>
                  Years of Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="">Select Experience Level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Emergency Contact</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="emergencyContact" className={styles.label}>
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="emergencyPhone" className={styles.label}>
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter emergency contact phone"
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleBack}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
