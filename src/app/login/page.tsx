'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

      // Show success notification
      setShowSuccess(true);
      
      // Redirect after showing the notification
      setTimeout(() => {
        router.push('/user/dashboard');
      }, 2000);
      
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
        <div className={`${styles.logoContainer} ${isEmployeeLogin ? styles.slideRight : ''}`}>
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

          <button 
            onClick={() => {
              setIsEmployeeLogin(!isEmployeeLogin);
              const logoContainer = document.querySelector(`.${styles.logoContainer}`);
              logoContainer?.classList.add(styles.slideRight);
              const mainContent = document.querySelector(`.${styles.mainContent}`); 
              mainContent?.classList.add();
            }}
            className={styles.employeeLoginLink}
          >
            <span style={{
              opacity: isEmployeeLogin ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}>←</span>
            <span>{isEmployeeLogin ? 'User Portal' : 'Employee Portal'}</span>
            <span style={{
              opacity: !isEmployeeLogin ? 1 : 0, 
              transition: 'opacity 0.3s ease'
            }}>→</span>
          </button>
        </div>
        
        <div className={`${styles.mainContent} ${isEmployeeLogin ? styles.fadeOut : ''}`}>
            <>
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
            </>
        </div>

        <div className={`${styles.employeeContent} ${isEmployeeLogin ? styles.fadeIn : ''}`}>
            <>
              <h2 className={styles.userLoginTitle}>Employee Login</h2>
              <div className={styles.formContent}>
                {error && <div className={styles.error}>{error}</div>}
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="employeeId" className={styles.label}>
                      Employee ID
                    </label>
                    <input
                      id="employeeId"
                      name="email"
                      type="text"
                      autoComplete="username"
                      required
                      className={styles.input}
                      placeholder="Enter your employee ID"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="employeePassword" className={styles.label}>
                      Password
                    </label>
                    <input
                      id="employeePassword"
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
                      id="employeeRememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className={styles.checkbox}
                      disabled={loading}
                    />
                    <label htmlFor="employeeRememberMe" className={`${styles.label} ${styles.rememberMeLabel}`}>
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
                      <Link href="/register/employee" className={styles.link}>
                        Create One
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </>
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
            Login successful ! Redirecting to dashboard...
          </div>
        </div>
      )}
    </div>
  );
} 