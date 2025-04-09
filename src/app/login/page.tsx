'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (formData.rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      router.push('/user/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
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
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <Image
            src="/ecosort-logo.png"
            alt="EcoSort Logo"
            width={100}
            height={100}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>Welcome to EcoSort</h1>
          <p className={styles.subtitle}>
            Join us in revolutionizing waste management through smart technology and sustainable solutions
          </p>
          
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>Smart waste sorting technology</li>
            <li className={styles.featureItem}>Eco-friendly waste management</li>
            <li className={styles.featureItem}>24/7 customer support</li>
          </ul>

          <Link href="/employee-login" className={styles.employeeLoginLink}>
            <span>Employee Portal</span>
            <span>→</span>
          </Link>
        </div>
        
        <div className={styles.mainContent}>
          <h2 className={styles.userLoginTitle}>User Login</h2>
          <div className={styles.formContent}>
            {error && <div className={styles.error}>{error}</div>}
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={styles.input}
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
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
                <label htmlFor="rememberMe" className={`${styles.label} ${styles.rememberMeLabel}`}>
                  Remember me
                </label>
              </div>
              
              <button 
                type="submit" 
                className={`${styles.button} ${loading ? styles.buttonLoading : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <div className={styles.footer}>
                <Link href="/forgot-password" className={styles.link}>
                  Forgot your password?
                </Link>
                <p className={styles.footer}>
                  Don't have an account?{' '}
                  <Link href="/register/user" className={styles.link}>
                    Create One
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 