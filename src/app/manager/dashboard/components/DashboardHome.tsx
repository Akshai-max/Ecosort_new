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
import { Profiles, Manager as ManagerAPI, Analytics, Tasks as TasksAPI, Issues as IssuesAPI } from '@/services/api';

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
  const [manager, setManager] = useState<ManagerData | null>(null);
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
          const data = await Profiles.manager();
          setManager(data.manager as any);
        }

        // Use manager info to drive downstream calls
        const zoneId = manager?.zoneId || 'Z001';
        await Promise.all([
          fetchStats(),
          fetchWeeklyTrend(zoneId),
          fetchWasteCategories(zoneId),
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
    try {
      // Employees count
      try {
        const { manager } = await Profiles.manager();
        // Fetch employees under this manager
        const employeesRes = await ManagerAPI.employees(manager.id);
        let totalEmployees = 0;
        totalEmployees = employeesRes.employees?.length || 0;

        // Active tasks (manager-scoped) and pending issues
        const [tasksRes, issuesRes] = await Promise.all([
          TasksAPI.list(),
          IssuesAPI.list(),
        ]);
        let activeTasksToday = 0;
        activeTasksToday = (tasksRes.tasks || []).filter((t: any) => t.status !== 'completed' && t.status !== 'cancelled').length;
        let pendingIssues = 0;
        pendingIssues = (issuesRes.issues || []).filter((i: any) => i.status === 'open' || i.status === 'assigned').length;

        // Waste collected this week can be derived from analytics weekly endpoint sum
        let wasteCollectedThisWeek = 0;
        try {
          const weekly = await Analytics.weekly(manager.zoneId || 'Z001');
          wasteCollectedThisWeek = weekly.totalWaste || 0;
        } catch {}

        setStats({ totalEmployees, activeTasksToday, wasteCollectedThisWeek, pendingIssues });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWeeklyTrend = async (zoneId: string) => {
    try {
      const data = await Analytics.weekly(zoneId);
      setWeeklyTrend((data.weeklyData || []).map((d: any) => ({ day: d.day, waste: d.waste })));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWasteCategories = async (zoneId: string) => {
    try {
      const data = await Analytics.categories(zoneId);
      const total = data.totalWaste || 0;
      const categories = (data.categories || []).map((c: any) => ({
        category: c.category,
        percentage: total ? Math.round((c.amount / total) * 100) : c.percentage || 0,
        amount: c.amount,
      }));
      setWasteCategories(categories);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecentTasks = async () => {
    try {
      const data = await TasksAPI.list();
      const tasks = (data.tasks || []).slice(0, 5).map((t: any) => ({
        id: t.id || t.taskId,
        description: t.description || t.title,
        assignedTo: t.assignedToName || t.assignedTo || '—',
        status: t.status,
        dueDate: (t.dueDate || '').toString().slice(0, 10),
      }));
      setRecentTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecentIssues = async () => {
    try {
      const data = await IssuesAPI.list();
      const issues = (data.issues || []).slice(0, 5).map((i: any) => ({
        id: i.id,
        description: i.description || i.title,
        zone: i.zoneName || i.zoneId,
        reportedBy: i.reportedByName || i.reportedBy,
        status: i.status,
        priority: i.priority,
      }));
      setRecentIssues(issues);
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      case 'cancelled':
        return '#9ca3af';
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

  const toTitleCase = (value: string) => {
    if (!value) return '';
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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
                    {toTitleCase(task.status)}
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
                    {toTitleCase(issue.priority)}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(issue.status) }}
                  >
                    {toTitleCase(issue.status)}
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
