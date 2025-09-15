'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  ClipboardList,
  MapPin,
  ScanBarcode,
  TrendingUp,
  X,
  Filter,
  Eye,
  Trash2,
  Settings
} from 'lucide-react';
import styles from './notifications.module.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'task_completed' | 'issue_reported' | 'announcement' | 'reminder' | 'achievement' | 'system';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
  sender?: string;
  metadata?: any;
}

export default function EmployeeNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filter, typeFilter]);

  const fetchNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: 'N001',
          title: 'New Task Assigned',
          message: 'You have been assigned a new task: "Collect waste from Main Street". Due date: Today at 2:00 PM',
          type: 'task_assigned',
          priority: 'high',
          isRead: false,
          createdAt: '2024-01-15T10:30:00Z',
          actionUrl: '/user-employee/employee/tasks',
          actionText: 'View Task',
          sender: 'Manager Smith'
        },
        {
          id: 'N002',
          title: 'Task Completed Successfully',
          message: 'Great job! You completed the task "Sort recyclables at Station B" and earned 30 points.',
          type: 'task_completed',
          priority: 'medium',
          isRead: false,
          createdAt: '2024-01-15T09:15:00Z',
          actionUrl: '/user-employee/employee/performance',
          actionText: 'View Performance',
          sender: 'System'
        },
        {
          id: 'N003',
          title: 'Manager Announcement',
          message: 'Important: Collection schedule has been updated for this week. Please check your zone map for new routes.',
          type: 'announcement',
          priority: 'high',
          isRead: true,
          createdAt: '2024-01-14T16:00:00Z',
          actionUrl: '/user-employee/employee/zone',
          actionText: 'View Zone',
          sender: 'Manager Johnson'
        },
        {
          id: 'N004',
          title: 'Equipment Maintenance Reminder',
          message: 'Reminder: Sorting machine at Station A requires maintenance. Please report any issues immediately.',
          type: 'reminder',
          priority: 'medium',
          isRead: false,
          createdAt: '2024-01-14T14:30:00Z',
          actionUrl: '/user-employee/employee/scan',
          actionText: 'Report Issue',
          sender: 'System'
        },
        {
          id: 'N005',
          title: 'Achievement Unlocked!',
          message: 'Congratulations! You have unlocked the "Task Master" achievement for completing 10 tasks.',
          type: 'achievement',
          priority: 'low',
          isRead: true,
          createdAt: '2024-01-13T11:45:00Z',
          actionUrl: '/user-employee/employee/performance',
          actionText: 'View Achievement',
          sender: 'System'
        },
        {
          id: 'N006',
          title: 'Issue Reported in Your Zone',
          message: 'A new issue has been reported in Downtown Zone: "Overflowing waste bin at Main Square". Please investigate.',
          type: 'issue_reported',
          priority: 'high',
          isRead: false,
          createdAt: '2024-01-13T08:20:00Z',
          actionUrl: '/user-employee/employee/zone',
          actionText: 'View Zone',
          sender: 'Citizen Report'
        },
        {
          id: 'N007',
          title: 'Weekly Performance Summary',
          message: 'Your weekly performance: 5 tasks completed, 120 points earned. You are ranked #3 among employees.',
          type: 'system',
          priority: 'low',
          isRead: true,
          createdAt: '2024-01-12T18:00:00Z',
          actionUrl: '/user-employee/employee/performance',
          actionText: 'View Performance',
          sender: 'System'
        },
        {
          id: 'N008',
          title: 'Schedule Change',
          message: 'Your collection schedule for tomorrow has been updated. New start time: 8:30 AM instead of 8:00 AM.',
          type: 'announcement',
          priority: 'medium',
          isRead: false,
          createdAt: '2024-01-12T15:30:00Z',
          actionUrl: '/user-employee/employee/zone',
          actionText: 'View Schedule',
          sender: 'Manager Wilson'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Filter by read status
    if (filter === 'unread') {
      filtered = filtered.filter(notification => !notification.isRead);
    } else if (filter === 'read') {
      filtered = filtered.filter(notification => notification.isRead);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      setNotifications(updatedNotifications);
      
      // TODO: Make API call to mark notification as read
      console.log(`Marked notification ${notificationId} as read`);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notification =>
        ({ ...notification, isRead: true })
      );
      setNotifications(updatedNotifications);
      
      // TODO: Make API call to mark all notifications as read
      console.log('Marked all notifications as read');
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      setNotifications(updatedNotifications);
      
      // TODO: Make API call to delete notification
      console.log(`Deleted notification ${notificationId}`);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return <ClipboardList className={styles.notificationIcon} />;
      case 'task_completed':
        return <CheckCircle className={styles.notificationIcon} />;
      case 'issue_reported':
        return <AlertTriangle className={styles.notificationIcon} />;
      case 'announcement':
        return <Bell className={styles.notificationIcon} />;
      case 'reminder':
        return <Clock className={styles.notificationIcon} />;
      case 'achievement':
        return <TrendingUp className={styles.notificationIcon} />;
      case 'system':
        return <Info className={styles.notificationIcon} />;
      default:
        return <Bell className={styles.notificationIcon} />;
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return '#3b82f6';
      case 'task_completed':
        return '#10b981';
      case 'issue_reported':
        return '#ef4444';
      case 'announcement':
        return '#8b5cf6';
      case 'reminder':
        return '#f59e0b';
      case 'achievement':
        return '#f97316';
      case 'system':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getNotificationStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const read = notifications.filter(n => n.isRead).length;
    
    return { total, unread, read };
  };

  const stats = getNotificationStats();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.back()} className={styles.button}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <Bell className={styles.titleIcon} />
            Notifications
          </h1>
          <p className={styles.subtitle}>Stay updated with your tasks and announcements</p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.notificationStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.unread}</span>
              <span className={styles.statLabel}>Unread</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.read}</span>
              <span className={styles.statLabel}>Read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
            className={styles.filterSelect}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="task_assigned">Task Assigned</option>
            <option value="task_completed">Task Completed</option>
            <option value="issue_reported">Issue Reported</option>
            <option value="announcement">Announcement</option>
            <option value="reminder">Reminder</option>
            <option value="achievement">Achievement</option>
            <option value="system">System</option>
          </select>
        </div>
        
        <div className={styles.actionButtons}>
          <button
            className={styles.actionButton}
            onClick={markAllAsRead}
            disabled={stats.unread === 0}
          >
            <Eye className={styles.actionIcon} />
            Mark All Read
          </button>
          
          <button className={styles.settingsButton}>
            <Settings className={styles.actionIcon} />
            Settings
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className={styles.notificationsContainer}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell className={styles.emptyIcon} />
            <h3>No notifications found</h3>
            <p>No notifications match your current filters. Try adjusting your filter criteria.</p>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationCard} ${!notification.isRead ? styles.unreadNotification : ''}`}
              >
                <div className={styles.notificationHeader}>
                  <div className={styles.notificationIconContainer}>
                    <div 
                      className={styles.iconContainer}
                      style={{ backgroundColor: getTypeColor(notification.type) }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    {!notification.isRead && (
                      <div className={styles.unreadIndicator}></div>
                    )}
                  </div>
                  
                  <div className={styles.notificationInfo}>
                    <div className={styles.notificationTitleRow}>
                      <h3 className={styles.notificationTitle}>{notification.title}</h3>
                      <div className={styles.notificationBadges}>
                        <span 
                          className={styles.priorityBadge}
                          style={{ backgroundColor: getPriorityColor(notification.priority) }}
                        >
                          {notification.priority}
                        </span>
                        <span 
                          className={styles.typeBadge}
                          style={{ backgroundColor: getTypeColor(notification.type) }}
                        >
                          {notification.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <p className={styles.notificationMessage}>{notification.message}</p>
                    
                    <div className={styles.notificationMeta}>
                      <div className={styles.metaItem}>
                        <Clock className={styles.metaIcon} />
                        <span>{formatTime(notification.createdAt)}</span>
                      </div>
                      {notification.sender && (
                        <div className={styles.metaItem}>
                          <User className={styles.metaIcon} />
                          <span>{notification.sender}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.notificationActions}>
                  {notification.actionUrl && notification.actionText && (
                    <button
                      className={styles.actionButton}
                      onClick={() => router.push(notification.actionUrl!)}
                    >
                      {notification.actionText}
                    </button>
                  )}
                  
                  {!notification.isRead && (
                    <button
                      className={styles.markReadButton}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckCircle className={styles.actionIcon} />
                      Mark Read
                    </button>
                  )}
                  
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className={styles.actionIcon} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Settings Modal (Placeholder) */}
      <div className={styles.settingsPlaceholder}>
        <div className={styles.settingsCard}>
          <h3 className={styles.settingsTitle}>
            <Settings className={styles.settingsIcon} />
            Notification Settings
          </h3>
          <p className={styles.settingsDescription}>
            Configure your notification preferences to stay informed about important updates.
          </p>
          <div className={styles.settingsOptions}>
            <div className={styles.settingOption}>
              <label className={styles.settingLabel}>
                <input type="checkbox" defaultChecked />
                <span>Task Assignments</span>
              </label>
            </div>
            <div className={styles.settingOption}>
              <label className={styles.settingLabel}>
                <input type="checkbox" defaultChecked />
                <span>Manager Announcements</span>
              </label>
            </div>
            <div className={styles.settingOption}>
              <label className={styles.settingLabel}>
                <input type="checkbox" defaultChecked />
                <span>Achievement Notifications</span>
              </label>
            </div>
            <div className={styles.settingOption}>
              <label className={styles.settingLabel}>
                <input type="checkbox" />
                <span>System Updates</span>
              </label>
            </div>
          </div>
          <div className={styles.settingsActions}>
            <button className={styles.saveButton}>Save Settings</button>
            <button className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
