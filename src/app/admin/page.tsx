'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Shield, LogIn, BarChart3, ArrowLeft, AlertCircle, Clock } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminHomePage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const adminModules = [
    {
      id: 'login',
      title: 'Admin Login',
      description: 'Secure admin authentication and access control',
      icon: LogIn,
      path: '/app/admin/login',
      color: '#ef4444',
      routes: [
        'Secure Authentication',
        'Multi-factor Authentication',
        'Session Management',
        'Access Logs'
      ]
    },
    {
      id: 'dashboard',
      title: 'Admin Dashboard',
      description: 'System-wide management and analytics dashboard',
      icon: BarChart3,
      path: '/app/admin/dashboard',
      color: '#8b5cf6',
      routes: [
        'System Overview',
        'User Management',
        'Manager Management',
        'Global Analytics',
        'System Settings',
        'Audit Logs',
        'Performance Monitoring'
      ],
      comingSoon: true
    }
  ];

  const handleModuleClick = (path: string, comingSoon: boolean = false) => {
    if (comingSoon) {
      alert('This module is coming soon!');
      return;
    }
    router.push(path);
  };

  const handleBackToApp = () => {
    router.push('/app');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={handleBackToApp}
        >
          <ArrowLeft className={styles.backIcon} />
          Back to App Portal
        </button>
        
        <h1 className={styles.title}>Admin Portal</h1>
        <p className={styles.subtitle}>
          System administration and global management tools
        </p>
      </div>

      <div className={styles.warningSection}>
        <div className={styles.warningBox}>
          <AlertCircle className={styles.warningIcon} />
          <div>
            <h3>Under Development</h3>
            <p>Admin portal features are currently under development. Some modules may not be fully functional.</p>
          </div>
        </div>
      </div>

      <div className={styles.modulesGrid}>
        {adminModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.id}
              className={`${styles.moduleCard} ${module.comingSoon ? styles.comingSoon : ''}`}
              onClick={() => handleModuleClick(module.path, module.comingSoon)}
              onMouseEnter={() => setHoveredCard(module.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                '--card-color': module.color,
                transform: hoveredCard === module.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredCard === module.id 
                  ? `0 8px 25px ${module.color}20` 
                  : '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className={styles.cardHeader}>
                <div 
                  className={styles.iconContainer}
                  style={{ backgroundColor: `${module.color}15` }}
                >
                  <IconComponent 
                    className={styles.icon}
                    style={{ color: module.color }}
                  />
                </div>
                <div className={styles.cardTitle}>
                  <h3>{module.title}</h3>
                  {module.comingSoon && (
                    <span className={styles.comingSoonBadge}>
                      <Clock className={styles.badgeIcon} />
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              <p className={styles.description}>{module.description}</p>

              <div className={styles.routesList}>
                <h4>Available Features:</h4>
                <ul>
                  {module.routes.map((route, index) => (
                    <li key={index} className={styles.routeItem}>
                      {route}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.pathText}>{module.path}</span>
                <div className={styles.arrow}>
                  →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Planned Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <Shield className={styles.featureIcon} />
            <h4>System Security</h4>
            <p>Advanced security controls and monitoring</p>
          </div>
          <div className={styles.featureCard}>
            <BarChart3 className={styles.featureIcon} />
            <h4>Global Analytics</h4>
            <p>System-wide performance and usage analytics</p>
          </div>
          <div className={styles.featureCard}>
            <LogIn className={styles.featureIcon} />
            <h4>User Management</h4>
            <p>Comprehensive user and role management</p>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          EcoSort Admin Portal
        </p>
        <p className={styles.versionText}>Version 1.0.0 - Under Development</p>
      </div>
    </div>
  );
}
