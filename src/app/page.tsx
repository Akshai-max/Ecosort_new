'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Users, UserCheck, Shield, Settings, Database, Bug } from 'lucide-react';
import styles from './app.module.css';

export default function AppHomePage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const appModules = [
    {
      id: 'user-employee',
      title: 'User & Employee Portal',
      description: 'Access user dashboard, employee management, and combined login system',
      icon: Users,
      path: '/user-employee',
      color: '#10b981',
      routes: [
        'User Dashboard',
        'Employee Dashboard (Coming Soon)',
        'Combined Login',
        'User Registration',
        'Employee Registration'
      ]
    },
    {
      id: 'manager',
      title: 'Manager Portal',
      description: 'Comprehensive management dashboard with analytics and controls',
      icon: UserCheck,
      path: '/manager',
      color: '#3b82f6',
      routes: [
        'Manager Dashboard',
        'Zone Management',
        'Employee Management',
        'Task Assignment',
        'Analytics & Reports',
        'Issue Management',
        'Notifications'
      ]
    },
    {
      id: 'admin',
      title: 'Admin Portal',
      description: 'System administration and global management (Coming Soon)',
      icon: Shield,
      path: '/admin',
      color: '#ef4444',
      routes: [
        'Admin Dashboard (Coming Soon)',
        'System Settings (Coming Soon)',
        'Global Analytics (Coming Soon)'
      ],
      comingSoon: true
    },
    {
      id: 'api',
      title: 'API Documentation',
      description: 'RESTful API endpoints and documentation',
      icon: Settings,
      path: '/api',
      color: '#8b5cf6',
      routes: [
        'Authentication APIs',
        'User Management APIs',
        'Manager APIs',
        'Analytics APIs',
        'Notification APIs'
      ]
    },
    {
      id: 'seed',
      title: 'Database Seeding',
      description: 'Initialize database with sample data and test users',
      icon: Database,
      path: '/seed',
      color: '#f59e0b',
      routes: [
        'Seed Database',
        'Create Test Users',
        'Generate Sample Data'
      ]
    },
    {
      id: 'debug',
      title: 'Debug Tools',
      description: 'Development and debugging utilities',
      icon: Bug,
      path: '/debug',
      color: '#6b7280',
      routes: [
        'API Testing',
        'Database Connection',
        'Authentication Testing',
        'Error Logs'
      ]
    }
  ];

  const handleModuleClick = (path: string, comingSoon: boolean = false) => {
    if (comingSoon) {
      alert('This module is coming soon!');
      return;
    }
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>EcoSort Application Portal</h1>
        <p className={styles.subtitle}>
          Choose a module to access different parts of the application
        </p>
      </div>

      <div className={styles.modulesGrid}>
        {appModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.id}
              className={`${styles.moduleCard} ${module.comingSoon ? styles.comingSoon : ''}`}
              onClick={() => handleModuleClick(module.path, module.comingSoon)}
              onMouseEnter={() => setHoveredCard(module.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                // @ts-ignore
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
                    <span className={styles.comingSoonBadge}>Coming Soon</span>
                  )}
                </div>
              </div>

              <p className={styles.description}>{module.description}</p>

              <div className={styles.routesList}>
                <h4>Available Routes:</h4>
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

      <div className={styles.footer}>
        <p className={styles.footerText}>
          EcoSort - Smart Waste Management System
        </p>
        <p className={styles.versionText}>Version 1.0.0</p>
      </div>
    </div>
  );
}
