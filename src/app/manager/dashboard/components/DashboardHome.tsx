'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardList, 
  Recycle, 
  AlertTriangle,
  TrendingUp,
  PieChart,
  Activity
} from 'lucide-react';
import styles from './DashboardHome.module.css';

interface DashboardStats {
  totalEmployees: number;
  activeTasksToday: number;
  wasteCollectedThisWeek: number;
  pendingIssues: number;
}

interface WeeklyTrend {
  day: string;
  waste: number;
}

interface WasteCategory {
  category: string;
  percentage: number;
  amount: number;
}

interface Task {
  id: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
}

interface Issue {
  id: string;
  description: string;
  zone: string;
  reportedBy: string;
  status: 'open' | 'assigned' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

interface DashboardHomeProps {
  managerId?: string;
}

interface ManagerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  zoneId?: string;
}

export default function DashboardHome({ managerId }: DashboardHomeProps = {}) {
  const [, setManager] = useState<ManagerData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeTasksToday: 0,
    wasteCollectedThisWeek: 0,
    pendingIssues: 0
  });
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrend[]>([]);
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch manager data if not provided as prop
        if (!managerId) {
          const managerResponse = await fetch('/api/manager/profile', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (managerResponse.ok) {
            const managerData = await managerResponse.json();
            setManager(managerData.manager);
          }
        }

        // Simulate API calls - replace with actual service calls
        await Promise.all([
          fetchStats(),
          fetchWeeklyTrend(),
          fetchWasteCategories(),
          fetchRecentTasks(),
          fetchRecentIssues()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [managerId]);

  const fetchStats = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/manager/${managerId}/stats`);
    // const data = await response.json();
    
    // Mock data
    setStats({
      totalEmployees: 24,
      activeTasksToday: 18,
      wasteCollectedThisWeek: 1250,
      pendingIssues: 7
    });
  };

  const fetchWeeklyTrend = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/analytics/${managerId}/weekly`);
    // const data = await response.json();
    
    // Mock data
    setWeeklyTrend([
      { day: 'Mon', waste: 180 },
      { day: 'Tue', waste: 220 },
      { day: 'Wed', waste: 195 },
      { day: 'Thu', waste: 250 },
      { day: 'Fri', waste: 210 },
      { day: 'Sat', waste: 175 },
      { day: 'Sun', waste: 160 }
    ]);
  };

  const fetchWasteCategories = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/analytics/${managerId}/categories`);
    // const data = await response.json();
    
    // Mock data
    setWasteCategories([
      { category: 'Plastic', percentage: 35, amount: 437 },
      { category: 'Paper', percentage: 25, amount: 312 },
      { category: 'Glass', percentage: 20, amount: 250 },
      { category: 'Metal', percentage: 15, amount: 187 },
      { category: 'Other', percentage: 5, amount: 64 }
    ]);
  };

  const fetchRecentTasks = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/tasks/${managerId}/recent`);
    // const data = await response.json();
    
    // Mock data
    setRecentTasks([
      {
        id: 'T001',
        description: 'Collect waste from Zone A',
        assignedTo: 'John Doe',
        status: 'in_progress',
        dueDate: '2024-01-15'
      },
      {
        id: 'T002',
        description: 'Sort recyclables in Zone B',
        assignedTo: 'Jane Smith',
        status: 'pending',
        dueDate: '2024-01-16'
      },
      {
        id: 'T003',
        description: 'Maintain sorting equipment',
        assignedTo: 'Mike Johnson',
        status: 'completed',
        dueDate: '2024-01-14'
      },
      {
        id: 'T004',
        description: 'Update waste inventory',
        assignedTo: 'Sarah Wilson',
        status: 'in_progress',
        dueDate: '2024-01-17'
      },
      {
        id: 'T005',
        description: 'Clean collection vehicles',
        assignedTo: 'Tom Brown',
        status: 'pending',
        dueDate: '2024-01-18'
      }
    ]);
  };

  const fetchRecentIssues = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/issues/${managerId}/recent`);
    // const data = await response.json();
    
    // Mock data
    setRecentIssues([
      {
        id: 'I001',
        description: 'Sorting machine malfunction in Zone A',
        zone: 'Zone A',
        reportedBy: 'John Doe',
        status: 'open',
        priority: 'high'
      },
      {
        id: 'I002',
        description: 'Insufficient collection bins in Zone B',
        zone: 'Zone B',
        reportedBy: 'Jane Smith',
        status: 'assigned',
        priority: 'medium'
      },
      {
        id: 'I003',
        description: 'Vehicle breakdown during collection',
        zone: 'Zone C',
        reportedBy: 'Mike Johnson',
        status: 'resolved',
        priority: 'high'
      },
      {
        id: 'I004',
        description: 'Schedule conflict with waste pickup',
        zone: 'Zone D',
        reportedBy: 'Sarah Wilson',
        status: 'open',
        priority: 'low'
      },
      {
        id: 'I005',
        description: 'Equipment maintenance overdue',
        zone: 'Zone E',
        reportedBy: 'Tom Brown',
        status: 'assigned',
        priority: 'medium'
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      case 'open':
        return '#ef4444';
      case 'assigned':
        return '#3b82f6';
      case 'resolved':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users className={styles.icon} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Total Employees</h3>
            <p className={styles.statValue}>{stats.totalEmployees}</p>
          </div>  
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <ClipboardList className={styles.icon} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Active Tasks Today</h3>
            <p className={styles.statValue}>{stats.activeTasksToday}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Recycle className={styles.icon} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Waste Collected</h3>
            <p className={styles.statValue}>{stats.wasteCollectedThisWeek} kg</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AlertTriangle className={styles.icon} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Pending Issues</h3>
            <p className={styles.statValue}>{stats.pendingIssues}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <TrendingUp className={styles.chartIcon} />
            Weekly Waste Trend
          </h3>
          <div className={styles.weeklyChart}>
            <div className={styles.chartContainer}>
              {/* Simple Bar Chart */}
              {weeklyTrend.map((point) => (
                <div key={point.day} className={styles.barGroup}>
                  <div className={styles.barValueTop}>{point.waste}kg</div>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.bar}
                      style={{ height: `${(point.waste / 300) * 100}%` }}
                    ></div>
                  </div>
                  <div className={styles.barLabel}>{point.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <PieChart className={styles.chartIcon} />
            Waste Category Breakdown
          </h3>
          <div className={styles.pieChart}>
            <div className={styles.pieContainer}>
              <svg className={styles.pieSvg} viewBox="0 0 200 200">
                {wasteCategories.map((category, index) => {
                  const colors = ['#ef4444', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6'];
                  const startAngle = index === 0 ? 0 : wasteCategories.slice(0, index).reduce((sum, cat) => sum + (cat.percentage * 3.6), 0);
                  const endAngle = startAngle + (category.percentage * 3.6);
                  const largeArcFlag = category.percentage > 50 ? 1 : 0;
                  const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                  const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
                  const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                  
                  return (
                    <path
                      key={category.category}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      className={styles.pieSegment}
                    />
                  );
                })}
              </svg>
              <div className={styles.pieLegend}>
                {wasteCategories.map((category, index) => {
                  const colors = ['#ef4444', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6'];
                  return (
                    <div key={category.category} className={styles.legendItem}>
                      <div 
                        className={styles.legendColor}
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className={styles.legendLabel}>{category.category}</span>
                      <span className={styles.legendPercentage}>{category.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Tables */}
      <div className={styles.tablesSection}>
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>
            <Activity className={styles.tableIcon} />
            Ongoing Tasks
          </h3>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Task ID</div>
              <div className={styles.tableCell}>Description</div>
              <div className={styles.tableCell}>Assigned To</div>
              <div className={styles.tableCell}>Status</div>
              <div className={styles.tableCell}>Due Date</div>
            </div>
            {recentTasks.map((task) => (
              <div key={task.id} className={styles.tableRow}>
                <div className={styles.tableCell}>{task.id}</div>
                <div className={styles.tableCell}>{task.description}</div>
                <div className={styles.tableCell}>{task.assignedTo}</div>
                <div className={styles.tableCell}>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <div className={styles.tableCell}>{task.dueDate}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>
            <AlertTriangle className={styles.tableIcon} />
            Recent Issues
          </h3>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Issue ID</div>
              <div className={styles.tableCell}>Description</div>
              <div className={styles.tableCell}>Zone</div>
              <div className={styles.tableCell}>Priority</div>
              <div className={styles.tableCell}>Status</div>
            </div>
            {recentIssues.map((issue) => (
              <div key={issue.id} className={styles.tableRow}>
                <div className={styles.tableCell}>{issue.id}</div>
                <div className={styles.tableCell}>{issue.description}</div>
                <div className={styles.tableCell}>{issue.zone}</div>
                <div className={styles.tableCell}>
                  <span 
                    className={styles.priorityBadge}
                    style={{ backgroundColor: getPriorityColor(issue.priority) }}
                  >
                    {issue.priority}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(issue.status) }}
                  >
                    {issue.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
