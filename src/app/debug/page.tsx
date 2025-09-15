'use client';

import { useState } from 'react';
import styles from './debug.module.css';

export default function DebugPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any, error?: string) => {
    setResults(prev => [...prev, {
      test,
      result,
      error,
      timestamp: new Date().toLocaleTimeString()
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
        }),
        credentials: 'include'
      });
      const data = await response.json();
      addResult('Manager Login', data, response.ok ? undefined : data.error);
    } catch (error: any) {
      addResult('Manager Login', null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testManagerProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/manager/profile', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      addResult('Manager Profile', data, response.ok ? undefined : data.error);
    } catch (error: any) {
      addResult('Manager Profile', null, error.message);
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
      <h1 className={styles.title}>Debug Panel</h1>
      
      <div className={styles.actions}>
        <button onClick={testDatabaseConnection} disabled={loading} className={styles.button}>
          Test DB Connection
        </button>
        <button onClick={seedDatabase} disabled={loading} className={styles.button}>
          Seed Database
        </button>
        <button onClick={testManagerLogin} disabled={loading} className={styles.button}>
          Test Manager Login
        </button>
        <button onClick={testManagerProfile} disabled={loading} className={styles.button}>
          Test Manager Profile
        </button>
        <button onClick={clearResults} className={styles.button}>
          Clear Results
        </button>
      </div>

      <div className={styles.results}>
        {results.map((result, index) => (
          <div key={index} className={styles.result}>
            <div className={styles.resultHeader}>
              <span className={styles.testName}>{result.test}</span>
              <span className={styles.timestamp}>{result.timestamp}</span>
            </div>
            {result.error ? (
              <div className={styles.error}>
                <strong>Error:</strong> {result.error}
              </div>
            ) : (
              <pre className={styles.success}>
                {JSON.stringify(result.result, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}





