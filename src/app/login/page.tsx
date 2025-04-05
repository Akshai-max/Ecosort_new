'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './login.module.css';

type UserType = 'user' | 'employee';

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    employeeId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '/api/auth/login';
      
      // For employee login, we'll use the employee-specific endpoint
      if (userType === 'employee') {
        endpoint = '/api/auth/employee/login';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: userType,
          employeeId: userType === 'employee' ? formData.employeeId : undefined,
        }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data in localStorage if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect based on user type
      if (userType === 'user') {
        router.push('/user/dashboard');
      } else {
        // TODO: Implement employee dashboard
        router.push('/employee/dashboard');
      }
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

  const renderUserForm = () => (
    <div className={`${styles.formWrapper} ${userType === 'user' ? styles.formWrapperActive : ''}`}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="userEmail" className={styles.label}>
            Email address
          </label>
          <input
            id="userEmail"
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
          <label htmlFor="userPassword" className={styles.label}>
            Password
          </label>
          <input
            id="userPassword"
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
            id="userRememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className={styles.checkbox}
            disabled={loading}
          />
          <label htmlFor="userRememberMe" className={styles.label}>
            Remember me
          </label>
        </div>
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in as User'}
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
  );

  const renderEmployeeForm = () => (
    <div className={`${styles.formWrapper} ${styles.employeeForm} ${userType === 'employee' ? styles.formWrapperActive : ''}`}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.employeeNote}>
          For employee access, please use your work email and employee ID provided by EcoSort.
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="employeeEmail" className={styles.label}>
            Work Email
          </label>
          <input
            id="employeeEmail"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={styles.input}
            placeholder="Enter your work email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="employeeId" className={styles.label}>
            Employee ID
          </label>
          <input
            id="employeeId"
            name="employeeId"
            type="text"
            required
            className={styles.input}
            placeholder="Enter your employee ID"
            value={formData.employeeId}
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
          <label htmlFor="employeeRememberMe" className={styles.label}>
            Remember me
          </label>
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in as Employee'}
        </button>

        <div className={styles.footer}>
          <Link href="/forgot-password" className={styles.link}>
            Forgot your password?
          </Link>
          <p className={styles.footer}>
            New employee?{' '}
            <Link href="/employee-register" className={styles.link}>
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <h2 className={styles.title}>Welcome to EcoSort</h2>
        </div>
        
        <div className={`${styles.formContent} ${userType === 'employee' ? styles.employeeFormContent : ''}`}>
          <div className={styles.toggleContainer} data-state={userType}>
            <button
              type="button"
              className={`${styles.toggleButton} ${userType === 'user' ? styles.toggleButtonActive : ''}`}
              onClick={() => setUserType('user')}
              disabled={loading}
            >
              User
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${userType === 'employee' ? styles.toggleButtonActive : ''}`}
              onClick={() => setUserType('employee')}
              disabled={loading}
            >
              Employee
            </button>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {renderUserForm()}
          {renderEmployeeForm()}
        </div>
      </div>
    </div>
  );
} 