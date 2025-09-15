'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './manager.module.css';

export default function ManagerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'manager@ecosort.com',
    password: 'Manager123!',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Manager login attempt with:', formData);
      
      const response = await fetch('/api/auth/manager/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Manager login successful:', data);
      
      // Store manager data in localStorage for quick access
      localStorage.setItem('manager', JSON.stringify(data.manager));
      
      // Redirect to dashboard
      router.push('/manager/dashboard');
    } catch (err: any) {
      console.error('Manager login error:', err);
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
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
          <Image
            src="/ecosort-logo.png"
            alt="EcoSort Logo"
            width={120}
            height={120}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in to access your manager dashboard and manage operations
          </p>
          
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>Operations Management</li>
            <li className={styles.featureItem}>Team Coordination</li>
            <li className={styles.featureItem}>Performance Analytics</li>
            <li className={styles.featureItem}>Resource Allocation</li>
            <li className={styles.featureItem}>Real-time Monitoring</li>
          </ul>
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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

              <button
                type="submit"
              className={`${styles.button} ${loading ? styles.buttonLoading : ''}`}
                disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in as Manager'}
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