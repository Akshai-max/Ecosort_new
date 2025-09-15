'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Coins, 
  Trophy, 
  ScanBarcode, 
  TrendingUp, 
  ClipboardList,
  Bell,
  MessageCircle,
  Settings
} from 'lucide-react';

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
  tasksAssigned: number;
  tasksCompleted: number;
  pendingIssues: number;
}

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        // Add placeholder data for employee stats
        const employeeWithStats = {
          ...data.employee,
          points: 1250,
          rank: 'Senior Specialist',
          tasksAssigned: 8,
          tasksCompleted: 5,
          pendingIssues: 2
        };
        setEmployee(employeeWithStats);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}>
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
    <div className={styles.dashboardContainer}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ClipboardList style={{ width: "40px", height: "40px" }} className="w-6 h-6 text-green-600" /></div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Tasks Assigned</h3>
            <p className={styles.statValue}>{employee?.tasksAssigned || 0}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><CheckCircle style={{ width: "40px", height: "40px" }} className="w-6 h-6 text-green-600" /></div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Tasks Completed</h3>
            <p className={styles.statValue}>{employee?.tasksCompleted || 0}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><AlertTriangle style={{ width: "40px", height: "40px" }} className="w-6 h-6 text-orange-600" /></div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Pending Issues</h3>
            <p className={styles.statValue}>{employee?.pendingIssues || 0}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Coins style={{ width: "40px", height: "40px" }} className="w-6 h-6 text-green-600" /></div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Points</h3>
            <p className={styles.statValue}>{employee?.points || 0}</p>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Quick Scan</h2>
          <div className={styles.cardContent}>
            <p>Scan waste items and report issues in your assigned zone.</p>
            <div className={styles.scanButtonContainer}>
              <Link href="/user-employee/employee/scan" className={styles.scanButton}>
                <ScanBarcode className={styles.scanIcon} />
                Scan Now
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>My Tasks</h2>
          <div className={styles.cardContent}>
            <p>View and manage your assigned tasks and responsibilities.</p>
            <div className={styles.scanButtonContainer}>
              <Link href="/user-employee/employee/tasks" className={styles.scanButton}>
                <ClipboardList className={styles.scanIcon} />
                View Tasks
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>My Zone</h2>
          <div className={styles.cardContent}>
            <p>View your assigned zone and collection routes.</p>
            <div className={styles.scanButtonContainer}>
              <Link href="/user-employee/employee/zone" className={styles.scanButton}>
                <MapPin className={styles.scanIcon} />
                View Zone
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Performance</h2>
          <div className={styles.cardContent}>
            <p>Track your performance metrics and achievements.</p>
            <div className={styles.scanButtonContainer}>
              <Link href="/user-employee/employee/performance" className={styles.scanButton}>
                <TrendingUp className={styles.scanIcon} />
                View Stats
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Profile</h2>
          <div className={styles.cardContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.userName}>{employee?.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Employee ID:</span>
              <span className={styles.infoValue}>{employee?.employeeId}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Department:</span>
              <span className={styles.infoValue}>{employee?.department}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Zone:</span>
              <span className={styles.infoValue}>{employee?.zoneName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Rank:</span>
              <span className={styles.infoValue}>{employee?.rank}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Points:</span>
              <span className={styles.infoValue}>{employee?.points}</span>
            </div>
          </div>
          <Link href="/user-employee/employee/profile" className={styles.cardLink}>
            View Full Profile
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div className={styles.cardContent}>
            <div className={styles.quickActions}>
              <Link href="/user-employee/employee/notifications" className={styles.quickAction}>
                <Bell className={styles.actionIcon} />
                <span>Notifications</span>
              </Link>
              <Link href="/user-employee/employee/support" className={styles.quickAction}>
                <MessageCircle className={styles.actionIcon} />
                <span>Support</span>
              </Link>
              <Link href="/user-employee/employee/profile" className={styles.quickAction}>
                <Settings className={styles.actionIcon} />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}><CheckCircle className={styles.icon} /></div>
            <div className={styles.activityDetails}>
              <p className={styles.activityText}>Completed equipment maintenance check</p>
              <p className={styles.activityTime}>2 hours ago</p>
            </div>
            <div className={styles.activityPoints}>+40 pts</div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}><ClipboardList className={styles.icon} /></div>
            <div className={styles.activityDetails}>
              <p className={styles.activityText}>New task assigned: Collect waste from Main Street</p>
              <p className={styles.activityTime}>Yesterday</p>
            </div>
            <div className={styles.activityPoints}>+50 pts</div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}><Trophy className={styles.icon} /></div>
            <div className={styles.activityDetails}>
              <p className={styles.activityText}>Unlocked "Task Master" achievement</p>
              <p className={styles.activityTime}>2 days ago</p>
            </div>
            <div className={styles.activityPoints}>+100 pts</div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}><AlertTriangle className={styles.icon} /></div>
            <div className={styles.activityDetails}>
              <p className={styles.activityText}>Reported overflowing waste bin at Station A</p>
              <p className={styles.activityTime}>3 days ago</p>
            </div>
            <div className={styles.activityPoints}>+25 pts</div>
          </div>
        </div>
      </div>
    </div>
  );
}