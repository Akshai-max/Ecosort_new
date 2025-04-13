'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.css';
import {
  LayoutDashboard,
  User,
  ScanBarcode,
  Trophy,
  Gift,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  points: number;
  rank: string;
  scannedItems: number;
  rewards: number;
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        // Add placeholder data for points, rank, scannedItems, and rewards
        const userWithStats = {
          ...data.user,
          points: 1250,
          rank: 'Silver',
          scannedItems: 42,
          rewards: 3
        };
        setUser(userWithStats);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/user/logout', { 
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

  // Determine the active menu item based on the current path
  const getActiveMenu = () => {
    if (pathname.includes('/dashboard')) return 'dashboard';
    if (pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/scan')) return 'scan';
    if (pathname.includes('/leaderboard')) return 'leaderboard';
    if (pathname.includes('/rewards')) return 'rewards';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/support')) return 'support';
    return 'dashboard';
  };

  if (loading) {
    return (
      <div className={styles.container_loading}>
        <div className={styles.loading}>
        <div className={styles.spinner_bouncer}>
          <div className={styles.bounce} style={{ borderColor: '#7C74FF' }}></div>
          <div className={styles.bounce} style={{ borderColor: '#00B2FF' }}></div>
          <div className={styles.bounce} style={{ borderColor: '#5CDB95' }}></div>
        </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.push('/login')} className={styles.button}>
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
        </div>
        <nav className={styles.nav}>
          <Link 
            href="/user/dashboard" 
            className={`${styles.navItem} ${getActiveMenu() === 'dashboard' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><LayoutDashboard style={{ width: "30px", height: "30px" }} className="w-6 h-6" /></span>
            <span className={styles.navText}>Dashboard</span>
          </Link>
          <Link 
            href="/user/profile" 
            className={`${styles.navItem} ${getActiveMenu() === 'profile' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><User style={{ width: "30px", height: "30px" }} className="w-6 h-6" /></span>
            <span className={styles.navText}>Profile</span>
          </Link>
          <Link 
            href="/user/scan" 
            className={`${styles.navItem} ${getActiveMenu() === 'scan' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><ScanBarcode style={{ width: "30px", height: "30px" }} className="w-6 h-6" /></span>
            <span className={styles.navText}>Scan Waste</span>
          </Link>
          <Link 
            href="/user/leaderboard" 
            className={`${styles.navItem} ${getActiveMenu() === 'leaderboard' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><Trophy style={{ width: "30px", height: "30px" }} className="w-6 h-6" /></span>
            <span className={styles.navText}>Leaderboard</span>
          </Link>
          <Link 
            href="/user/rewards" 
            className={`${styles.navItem} ${getActiveMenu() === 'rewards' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><Gift style={{ width: "30px", height: "30px" }} className="w-6 h-6" /></span>
            <span className={styles.navText}>Rewards</span>
          </Link>
          <Link 
            href="/user/settings" 
            className={`${styles.navItem} ${getActiveMenu() === 'settings' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><Settings style={{ width: "30px", height: "30px" }} className="w-6 h-6" /></span>
            <span className={styles.navText}>Settings</span>
          </Link>
          <Link 
            href="/user/support" 
            className={`${styles.navItem} ${getActiveMenu() === 'support' ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}><HelpCircle style={{ width: "30px", height: "30px" }} className="w-6 h-6" /></span>
            <span className={styles.navText}>Support</span>
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className={styles.navIcon}><LogOut style={{ width: "30px", height: "30px" }} className="w-6 h-6" /></span>
            <span className={styles.navText}>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>{getActiveMenu().charAt(0).toUpperCase() + getActiveMenu().slice(1)}</h1>
            <p className={styles.welcomeText}>
              Welcome back,<span className={styles.welcomeTextName}> {user?.firstName} {user?.lastName}!</span>
            </p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.firstName}</span>
              <div className={styles.userAvatar}>{user?.firstName.charAt(0)}{user?.lastName.charAt(0)}</div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} EcoSort. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
} 