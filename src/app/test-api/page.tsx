'use client';

import { useState } from 'react';
import { Database, User, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './test-api.module.css';

export default function TestApiPage() {
  const [results, setResults] = useState<Array<{
    test: string;
    status: 'success' | 'error' | 'loading';
    data?: any;
    error?: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, data: any, error?: string) => {
    setResults(prev => [...prev, {
      test,
      status: error ? 'error' : 'success',
      data,
      error
    }]);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seed', { method: 'GET' });
      const data = await response.json();
      addResult('Database Connection', data, response.ok ? undefined : data.error);
    } catch (error: any) {
      addResult('Database Connection', null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testManagerLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/manager/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'manager@ecosort.com',
          password: 'Manager123!'
        })
      });
      const data = await response.json();
      addResult('Manager Login', data, response.ok ? undefined : data.error);
    } catch (error: any) {
      addResult('Manager Login', null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testUserRegistration = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'Test123!',
          phone: '1234567890',
          address: {
            street: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            pincode: '123456'
          },
          dateOfBirth: '1990-01-01',
          gender: 'male'
        })
      });
      const data = await response.json();
      addResult('User Registration', data, response.ok ? undefined : data.error);
    } catch (error: any) {
      addResult('User Registration', null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      addResult('Seed Database', data, response.ok ? undefined : data.error);
    } catch (error: any) {
      addResult('Seed Database', null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>API Test Dashboard</h1>
        <p className={styles.subtitle}>
          Test all API endpoints to ensure proper functionality
        </p>
      </div>

      <div className={styles.controls}>
        <button 
          className={styles.button}
          onClick={testDatabaseConnection}
          disabled={loading}
        >
          <Database className={styles.icon} />
          Test Database Connection
        </button>
        
        <button 
          className={styles.button}
          onClick={seedDatabase}
          disabled={loading}
        >
          <Database className={styles.icon} />
          Seed Database
        </button>
        
        <button 
          className={styles.button}
          onClick={testManagerLogin}
          disabled={loading}
        >
          <UserCheck className={styles.icon} />
          Test Manager Login
        </button>
        
        <button 
          className={styles.button}
          onClick={testUserRegistration}
          disabled={loading}
        >
          <User className={styles.icon} />
          Test User Registration
        </button>
        
        <button 
          className={styles.clearButton}
          onClick={clearResults}
        >
          Clear Results
        </button>
      </div>

      <div className={styles.results}>
        <h2 className={styles.resultsTitle}>Test Results</h2>
        {results.length === 0 ? (
          <p className={styles.noResults}>No tests run yet. Click a button above to test an API endpoint.</p>
        ) : (
          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div key={index} className={`${styles.resultItem} ${styles[result.status]}`}>
                <div className={styles.resultHeader}>
                  {result.status === 'success' ? (
                    <CheckCircle className={styles.statusIcon} />
                  ) : (
                    <AlertCircle className={styles.statusIcon} />
                  )}
                  <h3 className={styles.resultTitle}>{result.test}</h3>
                </div>
                
                {result.error && (
                  <div className={styles.errorMessage}>
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.data && (
                  <div className={styles.resultData}>
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Make sure MongoDB is running and environment variables are set correctly.
        </p>
      </div>
    </div>
  );
}
