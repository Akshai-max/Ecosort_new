'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Key, 
  ArrowLeft,
  Loader2,
  Settings,
  Shield,
  Users
} from 'lucide-react';
import styles from './seed.module.css';

export default function SeedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [managerExists, setManagerExists] = useState<boolean | null>(null);

  const handleSeedDatabase = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to seed database');
      }

      setMessage(`Database seeded successfully! Manager credentials:
        Email: ${data.manager.email}
        Password: ${data.manager.password}`);
      setManagerExists(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckManager = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/seed', {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check manager');
      }

      setMessage(data.message);
      setManagerExists(data.managerExists);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/manager/login');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <div className={styles.logo}>
          <Database className={styles.logoIcon} />
          <span className={styles.logoText}>EcoSort</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconContainer}>
              <Settings className={styles.headerIcon} />
            </div>
            <h1 className={styles.title}>Database Initialization</h1>
            <p className={styles.description}>
              Initialize your EcoSort database with default manager account and essential data.
            </p>
          </div>

          {/* Status Card */}
          {managerExists !== null && (
            <div className={`${styles.statusCard} ${managerExists ? styles.statusSuccess : styles.statusWarning}`}>
              <div className={styles.statusIcon}>
                {managerExists ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              </div>
              <div className={styles.statusContent}>
                <h3 className={styles.statusTitle}>
                  {managerExists ? 'Manager Account Exists' : 'No Manager Found'}
                </h3>
                <p className={styles.statusDescription}>
                  {managerExists 
                    ? 'A manager account is already configured in the database.'
                    : 'No manager account found. Please seed the database to create one.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              onClick={handleCheckManager}
              disabled={loading}
              className={styles.button}
            >
              {loading ? (
                <Loader2 className={styles.buttonIcon} size={20} />
              ) : (
                <Shield className={styles.buttonIcon} size={20} />
              )}
              {loading ? 'Checking...' : 'Check Manager Status'}
            </button>

            <button
              onClick={handleSeedDatabase}
              disabled={loading}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {loading ? (
                <Loader2 className={styles.buttonIcon} size={20} />
              ) : (
                <Database className={styles.buttonIcon} size={20} />
              )}
              {loading ? 'Seeding...' : 'Initialize Database'}
            </button>

            {managerExists && (
              <button
                onClick={handleGoToLogin}
                className={`${styles.button} ${styles.successButton}`}
              >
                <Users className={styles.buttonIcon} size={20} />
                Go to Manager Login
              </button>
            )}
          </div>

          {/* Results */}
          {message && (
            <div className={styles.message}>
              <div className={styles.messageHeader}>
                <CheckCircle className={styles.messageIcon} size={20} />
                <h3>Success</h3>
              </div>
              <pre className={styles.messageContent}>{message}</pre>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <div className={styles.errorHeader}>
                <AlertCircle className={styles.errorIcon} size={20} />
                <h3>Error</h3>
              </div>
              <p className={styles.errorContent}>{error}</p>
            </div>
          )}

          {/* Credentials Info */}
          <div className={styles.info}>
            <div className={styles.infoHeader}>
              <User className={styles.infoIcon} size={20} />
              <h3>Default Manager Credentials</h3>
            </div>
            <div className={styles.credentials}>
              <div className={styles.credentialItem}>
                <User className={styles.credentialIcon} size={16} />
                <span className={styles.credentialLabel}>Email:</span>
                <span className={styles.credentialValue}>manager@ecosort.com</span>
              </div>
              <div className={styles.credentialItem}>
                <Key className={styles.credentialIcon} size={16} />
                <span className={styles.credentialLabel}>Password:</span>
                <span className={styles.credentialValue}>Manager123!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
