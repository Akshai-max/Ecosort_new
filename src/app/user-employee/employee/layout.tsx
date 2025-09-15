'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.css';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  ScanBarcode,
  TrendingUp,
  Bell,
  MessageCircle,
  User,
  LogOut,
  Activity,
  AlertTriangle,
  Trophy,
  Coins
} from "lucide-react";

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  zoneId: string;
  zoneName: string;
  points: number;
  rank: string;
}

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, message: 'New task assigned: Collect waste from Main Street', type: 'info' },
    { id: 2, message: 'Manager announcement: Updated collection schedule', type: 'success' },
    { id: 3, message: 'Equipment maintenance reminder', type: 'warning' }
  ]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch('/api/employee/profile');
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/user-employee/login');
            return;
          }
          throw new Error('Failed to fetch employee data');
        }
        
        const data = await response.json();
        // Add mock data for employee-specific fields
        const employeeWithData = {
          ...data.employee,
          employeeId: 'EMP001',
          zoneId: 'ZONE_A',
          zoneName: 'Downtown Zone',
          points: 1250,
          rank: 'Silver'
        };
        setEmployee(employeeWithData);
      } catch (err) {
        setError('Failed to load employee data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/employee/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      localStorage.removeItem('employee');
      router.push('/user-employee/login');
    } catch (err) {
      console.error('Logout failed:', err);
      router.push('/user-employee/login');
    }
  };

  // Determine the active menu item based on the current path
  const getActiveMenu = () => {
    if (pathname.includes('/dashboard')) return 'dashboard';
    if (pathname.includes('/tasks')) return 'tasks';
    if (pathname.includes('/zone')) return 'zone';
    if (pathname.includes('/scan')) return 'scan';
    if (pathname.includes('/performance')) return 'performance';
    if (pathname.includes('/notifications')) return 'notifications';
    if (pathname.includes('/support')) return 'support';
    if (pathname.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  if (loading) {
    return (
      <div className={styles.container_loading}>
        <div className={styles.loading}>
          <div className={styles.spinner_bouncer}>
            <div className={styles.bounce} style={{ borderColor: '#3b82f6' }}></div>
            <div className={styles.bounce} style={{ borderColor: '#8b5cf6' }}></div>
            <div className={styles.bounce} style={{ borderColor: '#10b981' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.push('/user-employee/login')} className={styles.button}>
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>EcoSort</div>
          <div className={styles.employeeBadge}>
            <span className={styles.badgeText}>Employee Portal</span>
          </div>
        </div>
        
        <nav className={styles.nav}>
          <Link 
            href="/user-employee/employee/dashboard" 
            className={`${styles.navItem} ${getActiveMenu() === 'dashboard' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><LayoutDashboard style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>Dashboard</span>
          </Link>
          
          <Link 
            href="/user-employee/employee/tasks" 
            className={`${styles.navItem} ${getActiveMenu() === 'tasks' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><ClipboardList style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>My Tasks</span>
          </Link>
          
          <Link 
            href="/user-employee/employee/zone" 
            className={`${styles.navItem} ${getActiveMenu() === 'zone' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><MapPin style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>My Zone</span>
          </Link>
          
          <Link 
            href="/user-employee/employee/scan" 
            className={`${styles.navItem} ${getActiveMenu() === 'scan' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><ScanBarcode style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>Scan & Report</span>
          </Link>
          
          <Link 
            href="/user-employee/employee/performance" 
            className={`${styles.navItem} ${getActiveMenu() === 'performance' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><TrendingUp style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>Performance</span>
          </Link>
          
          <Link 
            href="/user-employee/employee/notifications" 
            className={`${styles.navItem} ${getActiveMenu() === 'notifications' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><Bell style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>Notifications</span>
            {notifications.length > 0 && (
              <span className={styles.notificationBadge}>{notifications.length}</span>
            )}
          </Link>
          
          <Link 
            href="/user-employee/employee/support" 
            className={`${styles.navItem} ${getActiveMenu() === 'support' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><MessageCircle style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>Support</span>
          </Link>
          
          <Link 
            href="/user-employee/employee/profile" 
            className={`${styles.navItem} ${getActiveMenu() === 'profile' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><User style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>Profile</span>
          </Link>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className={styles.navIcon}><LogOut style={{ width: "24px", height: "24px" }} /></span>
            <span className={styles.navText}>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>
              {getActiveMenu().charAt(0).toUpperCase() + getActiveMenu().slice(1).replace('_', ' ')}
            </h1>
            <p className={styles.headerSubtitle}>
              Welcome back, <span className={styles.employeeName}>{employee?.name}</span>
            </p>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.employeeInfo}>
              <div className={styles.employeeStats}>
                <div className={styles.statItem}>
                  <Coins className={styles.statIcon} />
                  <span className={styles.statValue}>{employee?.points}</span>
                  <span className={styles.statLabel}>Points</span>
                </div>
                <div className={styles.statItem}>
                  <Trophy className={styles.statIcon} />
                  <span className={styles.statValue}>{employee?.rank}</span>
                  <span className={styles.statLabel}>Rank</span>
                </div>
                <div className={styles.statItem}>
                  <MapPin className={styles.statIcon} />
                  <span className={styles.statValue}>{employee?.zoneName}</span>
                  <span className={styles.statLabel}>Zone</span>
                </div>
              </div>
              
              <div className={styles.profile}>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>
                    {employee?.name}
                  </span>
                  <span className={styles.profileRole}>Employee ID: {employee?.employeeId}</span>
                </div>
                <div className={styles.profileAvatar}>
                  <span className={styles.profileInitials}>
                    {employee?.name?.split(' ').map(n => n.charAt(0).toUpperCase()).join('')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} EcoSort Employee Portal. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
