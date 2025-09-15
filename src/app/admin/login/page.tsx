'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Mail, Lock, AlertCircle, Clock } from 'lucide-react';
import styles from './admin-login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

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
      
      alert('Admin login functionality is coming soon!');
      router.push('/app/admin');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/app/admin');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft className={styles.backIcon} />
          Back to Admin Portal
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.warningBox}>
          <AlertCircle className={styles.warningIcon} />
          <div>
            <h3>Under Development</h3>
            <p>Admin login functionality is currently under development. This is a placeholder page.</p>
          </div>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.iconContainer}>
              <Shield className={styles.icon} />
            </div>
            <h1 className={styles.title}>Admin Login</h1>
            <p className={styles.subtitle}>
              Secure access to system administration
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Admin Email
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
                  placeholder="admin@ecosort.com"
                  disabled
                />
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
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
                  placeholder="Enter your password"
                  disabled
                />
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className={styles.checkbox}
                disabled
              />
              <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || true}
            >
              <Clock className={styles.buttonIcon} />
              {isSubmitting ? 'Signing In...' : 'Coming Soon'}
            </button>
          </form>

          <div className={styles.loginFooter}>
            <p className={styles.footerText}>
              Admin access requires special permissions and approval.
            </p>
            <p className={styles.contactText}>
              Contact system administrator for access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
