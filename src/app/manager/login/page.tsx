'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './manager.module.css';

export default function ManagerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // TODO: Implement actual authentication logic here
      console.log('Manager login attempt with:', formData);
      router.push('/manager/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.brandText}>
        EcoSort
      </div>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <h2 className={styles.title}>Manager Portal</h2>
          <p className={styles.subtitle}>Operations Management</p>
        </div>
        
        <div className={styles.formContent}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Manager Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={styles.input}
                placeholder="Enter manager email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={styles.input}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <label htmlFor="rememberMe" className={styles.label}>
                Remember me
              </label>
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.button}>
              Sign in as Manager
            </button>
          </form>

          <div className={styles.footer}>
            <div className={styles.footerLinks}>
              <Link href="/manager/forgot-password" className={styles.link}>
                Forgot password?
              </Link>
              <span className={styles.divider}>•</span>
              <Link href="/manager/register" className={styles.link}>
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 