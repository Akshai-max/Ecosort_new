'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Shield, BarChart3, Users, Settings, AlertCircle, Clock, Database, FileText, Activity } from 'lucide-react';
import styles from './admin-dashboard.module.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const adminFeatures = [
    {
      id: 'system-overview',
      title: 'System Overview',
      description: 'Global system status and health monitoring',
      icon: Activity,
      color: '#10b981',
      comingSoon: false
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage all users, roles, and permissions',
      icon: Users,
      color: '#3b82f6',
      comingSoon: true
    },
    {
      id: 'manager-management',
      title: 'Manager Management',
      description: 'Oversee manager accounts and zone assignments',
      icon: Shield,
      color: '#8b5cf6',
      comingSoon: true
    },
    {
      id: 'global-analytics',
      title: 'Global Analytics',
      description: 'System-wide analytics and performance metrics',
      icon: BarChart3,
      color: '#f59e0b',
      comingSoon: true
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure global system parameters',
      icon: Settings,
      color: '#6b7280',
      comingSoon: true
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'View and analyze system activity logs',
      icon: FileText,
      color: '#ef4444',
      comingSoon: true
    },
    {
      id: 'database-management',
      title: 'Database Management',
      description: 'Database administration and maintenance',
      icon: Database,
      color: '#8b5cf6',
      comingSoon: true
    },
    {
      id: 'performance-monitoring',
      title: 'Performance Monitoring',
      description: 'Real-time system performance monitoring',
      icon: Activity,
      color: '#10b981',
      comingSoon: true
    }
  ];

  const handleFeatureClick = (feature: any) => {
    if (feature.comingSoon) {
      alert('This feature is coming soon!');
      return;
    }
    // Handle feature navigation
    console.log('Navigate to:', feature.id);
  };

  const handleBackToAdmin = () => {
    router.push('/app/admin');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={handleBackToAdmin}
        >
          <ArrowLeft className={styles.backIcon} />
          Back to Admin Portal
        </button>
        
        <div className={styles.titleSection}>
          <div className={styles.iconContainer}>
            <Shield className={styles.icon} />
          </div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>
            System administration and global management
          </p>
        </div>
      </div>

      <div className={styles.warningSection}>
        <div className={styles.warningBox}>
          <AlertCircle className={styles.warningIcon} />
          <div>
            <h3>Under Development</h3>
            <p>Admin dashboard features are currently under development. Most functionality is not yet available.</p>
          </div>
        </div>
      </div>

      <div className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>System Overview</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users className={styles.statIconSvg} />
            </div>
            <div className={styles.statContent}>
              <h3>Total Users</h3>
              <p className={styles.statValue}>1,247</p>
              <p className={styles.statChange}>+12% this month</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Shield className={styles.statIconSvg} />
            </div>
            <div className={styles.statContent}>
              <h3>Active Managers</h3>
              <p className={styles.statValue}>23</p>
              <p className={styles.statChange}>+2 this month</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Activity className={styles.statIconSvg} />
            </div>
            <div className={styles.statContent}>
              <h3>System Uptime</h3>
              <p className={styles.statValue}>99.9%</p>
              <p className={styles.statChange}>Last 30 days</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Database className={styles.statIconSvg} />
            </div>
            <div className={styles.statContent}>
              <h3>Data Processed</h3>
              <p className={styles.statValue}>2.4TB</p>
              <p className={styles.statChange}>+8% this month</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Administrative Features</h2>
        <div className={styles.featuresGrid}>
          {adminFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`${styles.featureCard} ${feature.comingSoon ? styles.comingSoon : ''}`}
                onClick={() => handleFeatureClick(feature)}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  // @ts-ignore
                  '--feature-color': feature.color,
                  transform: hoveredCard === feature.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === feature.id 
                    ? `0 8px 25px ${feature.color}20` 
                    : '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className={styles.featureHeader}>
                  <div 
                    className={styles.featureIcon}
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <IconComponent 
                      className={styles.featureIconSvg}
                      style={{ color: feature.color }}
                    />
                  </div>
                  {feature.comingSoon && (
                    <div className={styles.comingSoonBadge}>
                      <Clock className={styles.badgeIcon} />
                      Coming Soon
                    </div>
                  )}
                </div>
                
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                
                <div className={styles.featureFooter}>
                  <span className={styles.featureStatus}>
                    {feature.comingSoon ? 'Under Development' : 'Available'}
                  </span>
                  <div className={styles.featureArrow}>→</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          EcoSort Admin Dashboard
        </p>
        <p className={styles.versionText}>Version 1.0.0 - Under Development</p>
      </div>
    </div>
  );
}
