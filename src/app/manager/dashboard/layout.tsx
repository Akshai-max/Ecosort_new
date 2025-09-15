'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  MapPin, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  AlertTriangle, 
  Bell, 
  FileText, 
  LogOut,
  Recycle,
  User
} from 'lucide-react';
import styles from './dashboard.module.css';

interface ManagerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  zoneId?: string;
}

export default function ManagerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [manager, setManager] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, message: 'New employee assigned to Zone A', type: 'info' },
    { id: 2, message: 'Waste collection completed in Zone B', type: 'success' },
    { id: 3, message: 'Equipment maintenance required', type: 'warning' }
  ]);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        console.log('Fetching manager profile...');
        const response = await fetch('/api/manager/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to login');
            router.push('/manager/login');
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch manager data');
        }
        
        const data = await response.json();
        console.log('Manager data received:', data);
        setManager(data.manager);
      } catch (err: any) {
        console.error('Error fetching manager data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/manager/logout', { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('manager');
        router.push('/manager/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('manager');
      router.push('/manager/login');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.push('/manager/login')} className={styles.button}>
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>EcoSort</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <Link
            href="/manager/dashboard"
            className={`${styles.navItem} ${pathname === '/manager/dashboard' ? styles.active : ''}`}
          >
            <BarChart3 style={{ width: "30px", height: "30px", marginRight: "10px" }} className="w-6 h-6" />
            <span className={styles.navText}>Dashboard</span>
          </Link>

          <Link
            href="/manager/dashboard/zones"
            className={`${styles.navItem} ${pathname === '/manager/dashboard/zones' ? styles.active : ''}`}
          >
            <MapPin style={{ width: "30px", height: "30px", marginRight: "10px" }} className="w-6 h-6"  />
            <span className={styles.navText}>Zones</span>
          </Link>

          <Link
            href="/manager/dashboard/employee"
            className={`${styles.navItem} ${pathname === '/manager/dashboard/employee' ? styles.active : ''}`}
          >
            <Users style={{ width: "30px", height: "30px", marginRight: "10px" }} className="w-6 h-6"  />
            <span className={styles.navText}>Employees</span>
          </Link>

          <Link
            href="/manager/dashboard/tasks"
            className={`${styles.navItem} ${pathname === '/manager/dashboard/tasks' ? styles.active : ''}`}
          >
            <ClipboardList style={{ width: "30px", height: "30px", marginRight: "10px" }} className="w-6 h-6"  />
            <span className={styles.navText}>Tasks</span>
          </Link>

          <Link
            href="/manager/dashboard/analytics"
            className={`${styles.navItem} ${pathname === '/manager/dashboard/analytics' ? styles.active : ''}`}
          >
            <TrendingUp style={{ width: "30px", height: "30px", marginRight: "10px" }} className="w-6 h-6"  />
            <span className={styles.navText}>Analytics</span>
          </Link>

          <Link
            href="/manager/dashboard/issues"
            className={`${styles.navItem} ${pathname === '/manager/dashboard/issues' ? styles.active : ''}`}
          >
            <AlertTriangle style={{ width: "30px", height: "30px", marginRight: "10px" }} className="w-6 h-6"  />
            <span className={styles.navText}>Issues</span>
          </Link>

          <Link
            href="/manager/dashboard/notifications"
            className={`${styles.navItem} ${pathname === '/manager/dashboard/notifications' ? styles.active : ''}`}
          >
            <Bell style={{ width: "30px", height: "30px", marginRight: "10px" }} className="w-6 h-6"  />
            <span className={styles.navText}>Notifications</span>
          </Link>

          <Link
            href="/manager/dashboard/reports"
            className={`${styles.navItem} ${pathname === '/manager/dashboard/reports' ? styles.active : ''}`}
          >
            <FileText style={{ width: "30px", height: "30px", marginRight: "10px" }} className="w-6 h-6"  />
            <span className={styles.navText}>Reports</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut className={styles.navIcon} />
            <span className={styles.navText}>Logout</span>
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Manager Dashboard</h1>
            <p className={styles.headerSubtitle}>Welcome back, {manager?.firstName}!</p>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.notifications}>
              <Bell className={styles.notificationIcon} />
              <span className={styles.notificationBadge}>{notifications.length}</span>
            </div>
            
            <div className={styles.profile}>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>
                  {manager?.firstName} {manager?.lastName}
                </span>
                <span className={styles.profileRole}>{manager?.role}</span>
              </div>
              <div className={styles.profileAvatar}>
                <span className={styles.profileInitials}>
                  {manager?.firstName?.charAt(0)?.toUpperCase()}
                  {manager?.lastName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.canvas}>
          {children}
        </main>
      </div>
    </div>
  );
}
