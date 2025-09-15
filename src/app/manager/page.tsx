'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserCheck, LogIn, UserPlus, BarChart3, MapPin, Users, ClipboardList, TrendingUp, AlertTriangle, Bell, FileText, ArrowLeft } from 'lucide-react';
import styles from './manager.module.css';

export default function ManagerHomePage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const managerModules = [
    {
      id: 'login',
      title: 'Manager Login',
      description: 'Access your manager dashboard with comprehensive management tools',
      icon: LogIn,
      path: '/manager/login',
      color: '#3b82f6',
      routes: [
        'Secure Authentication',
        'Role-based Access',
        'Session Management',
        'Password Recovery'
      ]
    },
    {
      id: 'register',
      title: 'Manager Registration',
      description: 'Register as a new manager (requires admin approval)',
      icon: UserPlus,
      path: '/manager/register',
      color: '#8b5cf6',
      routes: [
        'Account Creation',
        'Admin Approval Required',
        'Zone Assignment',
        'Permission Setup'
      ]
    },
    {
      id: 'dashboard',
      title: 'Manager Dashboard',
      description: 'Comprehensive management dashboard with all tools and analytics',
      icon: BarChart3,
      path: '/manager/dashboard',
      color: '#10b981',
      routes: [
        'Dashboard Overview',
        'Zone Management',
        'Employee Management',
        'Task Assignment',
        'Waste Analytics',
        'Issue Management',
        'Notifications',
        'Reports & Insights'
      ]
    }
  ];

  const dashboardFeatures = [
    {
      id: 'zones',
      title: 'Zone Management',
      icon: MapPin,
      description: 'Manage waste collection zones and assignments',
      color: '#ef4444'
    },
    {
      id: 'employees',
      title: 'Employee Management',
      icon: Users,
      description: 'Manage employee accounts and assignments',
      color: '#3b82f6'
    },
    {
      id: 'tasks',
      title: 'Task Assignment',
      icon: ClipboardList,
      description: 'Assign and track waste collection tasks',
      color: '#f59e0b'
    },
    {
      id: 'analytics',
      title: 'Waste Analytics',
      icon: TrendingUp,
      description: 'View detailed analytics and insights',
      color: '#10b981'
    },
    {
      id: 'issues',
      title: 'Issue Management',
      icon: AlertTriangle,
      description: 'Handle maintenance and operational issues',
      color: '#ef4444'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage system notifications and alerts',
      color: '#8b5cf6'
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: FileText,
      description: 'Generate and download reports',
      color: '#6b7280'
    }
  ];

  const handleModuleClick = (path: string) => {
    router.push(path);
  };

  const handleBackToApp = () => {
    router.push('/');
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
        
        <h1 className={styles.title}>Manager Portal</h1>
        <p className={styles.subtitle}>
          Comprehensive management tools for waste collection operations
        </p>
      </div>

      <div className={styles.modulesGrid}>
        {managerModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.id}
              className={styles.moduleCard}
              onClick={() => handleModuleClick(module.path)}
              onMouseEnter={() => setHoveredCard(module.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                // @ts-ignore
                ['--card-color' as any]: module.color,
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
        <h2 className={styles.featuresTitle}>Dashboard Features</h2>
        <div className={styles.featuresGrid}>
          {dashboardFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={styles.featureCard}
                style={{} as React.CSSProperties}
              >
                <div 
                  className={styles.featureIcon}
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <IconComponent 
                    className={styles.featureIconSvg}
                    style={{ color: feature.color }}
                  />
                </div>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          EcoSort Manager Portal
        </p>
        <p className={styles.versionText}>Version 1.0.0</p>
      </div>
    </div>
  );
}
