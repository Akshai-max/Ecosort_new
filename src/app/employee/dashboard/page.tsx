'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';

interface EmployeeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // TODO: Implement employee profile API endpoint
        // For now, we'll use a placeholder
        const response = await fetch('/api/employee/profile');
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch employee data');
        }
        
        const data = await response.json();
        setEmployee(data.employee);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Important to include cookies
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Clear any local storage or state if needed
      localStorage.removeItem('user');
      
      // Redirect to login page
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Still redirect to login page even if the API call fails
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.push('/login')} className={styles.button}>
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>EcoSort</div>
        <nav className={styles.nav}>
          <Link href="/employee/dashboard" className={`${styles.link} ${styles.activeLink}`}>
            Dashboard
          </Link>
          <Link href="/employee/orders" className={styles.link}>
            Orders
          </Link>
          <Link href="/employee/customers" className={styles.link}>
            Customers
          </Link>
          <Link href="/employee/reports" className={styles.link}>
            Reports
          </Link>
        </nav>
        <div className={styles.userInfo}>
          <span className={styles.userName}>
            {employee?.firstName} {employee?.lastName}
          </span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {employee?.firstName}!
          </h1>
          <p className={styles.welcomeText}>
            Here's an overview of your tasks and activities for today.
          </p>
        </div>

        <div className={styles.dashboardGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Pending Orders</h2>
            <div className={styles.cardContent}>
              <p className={styles.cardValue}>0</p>
              <p className={styles.cardLabel}>Orders need attention</p>
            </div>
            <Link href="/employee/orders" className={styles.cardLink}>
              View All Orders
            </Link>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Today's Pickups</h2>
            <div className={styles.cardContent}>
              <p className={styles.cardValue}>0</p>
              <p className={styles.cardLabel}>Scheduled pickups</p>
            </div>
            <Link href="/employee/pickups" className={styles.cardLink}>
              View Schedule
            </Link>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Customer Support</h2>
            <div className={styles.cardContent}>
              <p className={styles.cardValue}>0</p>
              <p className={styles.cardLabel}>Open tickets</p>
            </div>
            <Link href="/employee/support" className={styles.cardLink}>
              View Tickets
            </Link>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Performance</h2>
            <div className={styles.cardContent}>
              <p className={styles.cardValue}>0%</p>
              <p className={styles.cardLabel}>Monthly target achieved</p>
            </div>
            <Link href="/employee/performance" className={styles.cardLink}>
              View Details
            </Link>
          </div>
        </div>

        <div className={styles.todoSection}>
          <h2 className={styles.sectionTitle}>TODO</h2>
          <div className={styles.todoList}>
            <div className={styles.todoItem}>
              <input type="checkbox" id="todo1" className={styles.todoCheckbox} />
              <label htmlFor="todo1" className={styles.todoLabel}>
                Implement employee-specific features
              </label>
            </div>
            <div className={styles.todoItem}>
              <input type="checkbox" id="todo2" className={styles.todoCheckbox} />
              <label htmlFor="todo2" className={styles.todoLabel}>
                Create employee profile management
              </label>
            </div>
            <div className={styles.todoItem}>
              <input type="checkbox" id="todo3" className={styles.todoCheckbox} />
              <label htmlFor="todo3" className={styles.todoLabel}>
                Add order management functionality
              </label>
            </div>
            <div className={styles.todoItem}>
              <input type="checkbox" id="todo4" className={styles.todoCheckbox} />
              <label htmlFor="todo4" className={styles.todoLabel}>
                Implement reporting and analytics
              </label>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} EcoSort. All rights reserved.</p>
      </footer>
    </div>
  );
} 