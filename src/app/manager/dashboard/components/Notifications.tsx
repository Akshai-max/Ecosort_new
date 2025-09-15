'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Info, 
  AlertTriangle, 
  X, 
  CheckCircle, 
  AlertCircle,
  Send,
  CheckCheck
} from 'lucide-react';
import styles from './Notifications.module.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
  sender: string;
  senderName: string;
  recipient: string;
  recipientName: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: {
    zoneId?: string;
    taskId?: string;
    issueId?: string;
  };
}

interface NotificationsProps {
  managerId?: string;
}

export default function Notifications({ managerId }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    status: 'all'
  });
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendFormData, setSendFormData] = useState({
    recipient: '',
    title: '',
    message: '',
    type: 'info' as Notification['type'],
    priority: 'medium' as Notification['priority'],
    actionRequired: false
  });

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [managerId]);

  const fetchNotifications = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/notifications/${managerId}`);
      // const data = await response.json();
      
      // Mock data
      setNotifications([
        {
          id: 'N001',
          title: 'Equipment Maintenance Required',
          message: 'Sorting machine in Zone A requires immediate maintenance. Error code E-404 detected.',
          type: 'urgent',
          priority: 'critical',
          sender: 'system',
          senderName: 'System Alert',
          recipient: managerId || '',
          recipientName: 'Manager',
          isRead: false,
          createdAt: '2024-01-15T10:30:00',
          actionRequired: true,
          actionUrl: '/manager/dashboard?canvas=issues',
          metadata: { zoneId: 'Z001', issueId: 'I001' }
        },
        {
          id: 'N002',
          title: 'Task Completed',
          message: 'John Doe has completed the plastic waste collection task in Zone A.',
          type: 'success',
          priority: 'low',
          sender: 'E001',
          senderName: 'John Doe',
          recipient: managerId || '',
          recipientName: 'Manager',
          isRead: true,
          createdAt: '2024-01-15T09:15:00',
          actionRequired: false,
          metadata: { taskId: 'T001' }
        },
        {
          id: 'N003',
          title: 'Shift Update',
          message: 'Sarah Wilson has requested a shift change for tomorrow. Please review and approve.',
          type: 'info',
          priority: 'medium',
          sender: 'E004',
          senderName: 'Sarah Wilson',
          recipient: managerId || '',
          recipientName: 'Manager',
          isRead: false,
          createdAt: '2024-01-15T08:45:00',
          actionRequired: true,
          actionUrl: '/manager/dashboard?canvas=employees'
        },
        {
          id: 'N004',
          title: 'Weekly Report Ready',
          message: 'Your weekly waste collection report is ready for review and download.',
          type: 'info',
          priority: 'low',
          sender: 'system',
          senderName: 'Report Generator',
          recipient: managerId || '',
          recipientName: 'Manager',
          isRead: true,
          createdAt: '2024-01-15T07:00:00',
          actionRequired: false,
          actionUrl: '/manager/dashboard?canvas=reports'
        },
        {
          id: 'N005',
          title: 'Safety Alert',
          message: 'Broken glass reported in Zone A. Area has been cordoned off for safety.',
          type: 'warning',
          priority: 'high',
          sender: 'E001',
          senderName: 'John Doe',
          recipient: managerId || '',
          recipientName: 'Manager',
          isRead: false,
          createdAt: '2024-01-15T06:30:00',
          actionRequired: true,
          metadata: { zoneId: 'Z001', issueId: 'I005' }
        },
        {
          id: 'N006',
          title: 'Collection Schedule Updated',
          message: 'The collection schedule for Zone B has been updated due to local event.',
          type: 'info',
          priority: 'medium',
          sender: 'system',
          senderName: 'Schedule Manager',
          recipient: managerId || '',
          recipientName: 'Manager',
          isRead: true,
          createdAt: '2024-01-14T16:20:00',
          actionRequired: false,
          metadata: { zoneId: 'Z002' }
        }
      ]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/notifications/send', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...sendFormData, senderId: managerId })
      // });
      
      const newNotification: Notification = {
        id: `N${String(notifications.length + 1).padStart(3, '0')}`,
        title: sendFormData.title,
        message: sendFormData.message,
        type: sendFormData.type,
        priority: sendFormData.priority,
        sender: managerId || '',
        senderName: 'Manager',
        recipient: sendFormData.recipient,
        recipientName: 'Employee',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionRequired: sendFormData.actionRequired
      };
      
      setNotifications([newNotification, ...notifications]);
      setShowSendModal(false);
      setSendFormData({
        recipient: '',
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        actionRequired: false
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/notifications/${notificationId}/read`, {
      //   method: 'PATCH'
      // });
      
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/notifications/${managerId}/read-all`, {
      //   method: 'PATCH'
      // });
      
      setNotifications(notifications.map(notification => 
        ({ ...notification, isRead: true })
      ));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      const typeMatch = filters.type === 'all' || notification.type === filters.type;
      const priorityMatch = filters.priority === 'all' || notification.priority === filters.priority;
      const statusMatch = filters.status === 'all' || 
        (filters.status === 'read' && notification.isRead) ||
        (filters.status === 'unread' && !notification.isRead);
      
      return typeMatch && priorityMatch && statusMatch;
    });
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className={styles.typeIcon} />;
      case 'warning':
        return <AlertTriangle className={styles.typeIcon} />;
      case 'error':
        return <X className={styles.typeIcon} />;
      case 'success':
        return <CheckCircle className={styles.typeIcon} />;
      case 'urgent':
        return <AlertCircle className={styles.typeIcon} />;
      default:
        return <Bell className={styles.typeIcon} />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return '#3b82f6';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      case 'success':
        return '#10b981';
      case 'urgent':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return '#dc2626';
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className={styles.notifications}>
      <div className={styles.header}>
        <h2 className={styles.title}>Notifications</h2>
        <div className={styles.headerActions}>
          <div className={styles.unreadCount}>
            {unreadCount} unread
          </div>
          <button 
            className={styles.markAllReadButton}
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className={styles.buttonIcon} />
            Mark All Read
          </button>
          <button 
            className={styles.sendButton}
            onClick={() => setShowSendModal(true)}
          >
            <Send className={styles.buttonIcon} />
            Send Notification
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Type</label>
          <select
            className={styles.filterSelect}
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Priority</label>
          <select
            className={styles.filterSelect}
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            className={styles.filterSelect}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className={styles.notificationsList}>
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            <div className={styles.notificationIcon}>
              <span 
                className={styles.typeIcon}
                style={{ color: getTypeColor(notification.type) }}
              >
                {getTypeIcon(notification.type)}
              </span>
            </div>
            
            <div className={styles.notificationContent}>
              <div className={styles.notificationHeader}>
                <h3 className={styles.notificationTitle}>{notification.title}</h3>
                <div className={styles.notificationMeta}>
                  <span 
                    className={styles.priorityBadge}
                    style={{ backgroundColor: getPriorityColor(notification.priority) }}
                  >
                    {notification.priority}
                  </span>
                  <span className={styles.timestamp}>
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
              </div>
              
              <p className={styles.notificationMessage}>{notification.message}</p>
              
              <div className={styles.notificationFooter}>
                <div className={styles.notificationSender}>
                  From: {notification.senderName}
                </div>
                {notification.actionRequired && (
                  <div className={styles.actionRequired}>
                    Action Required
                  </div>
                )}
              </div>
            </div>
            
            {!notification.isRead && (
              <div className={styles.unreadIndicator}></div>
            )}
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Bell className={styles.emptyIconSvg} />
          </div>
          <h3>No notifications found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      )}

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Send Notification</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowSendModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSendNotification}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Recipient</label>
                  <select
                    className={styles.select}
                    value={sendFormData.recipient}
                    onChange={(e) => setSendFormData({ ...sendFormData, recipient: e.target.value })}
                    required
                  >
                    <option value="">Select Employee</option>
                    <option value="E001">John Doe</option>
                    <option value="E002">Jane Smith</option>
                    <option value="E003">Mike Johnson</option>
                    <option value="E004">Sarah Wilson</option>
                    <option value="E005">Tom Brown</option>
                    <option value="all">All Employees</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Type</label>
                  <select
                    className={styles.select}
                    value={sendFormData.type}
                    onChange={(e) => setSendFormData({ ...sendFormData, type: e.target.value as Notification['type'] })}
                    required
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="success">Success</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Priority</label>
                  <select
                    className={styles.select}
                    value={sendFormData.priority}
                    onChange={(e) => setSendFormData({ ...sendFormData, priority: e.target.value as Notification['priority'] })}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={sendFormData.title}
                    onChange={(e) => setSendFormData({ ...sendFormData, title: e.target.value })}
                    required
                    placeholder="Enter notification title"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Message</label>
                  <textarea
                    className={styles.textarea}
                    value={sendFormData.message}
                    onChange={(e) => setSendFormData({ ...sendFormData, message: e.target.value })}
                    required
                    rows={4}
                    placeholder="Enter notification message"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={sendFormData.actionRequired}
                      onChange={(e) => setSendFormData({ ...sendFormData, actionRequired: e.target.checked })}
                      className={styles.checkbox}
                    />
                    Action Required
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowSendModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
