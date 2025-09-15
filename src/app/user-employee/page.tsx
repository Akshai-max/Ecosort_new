'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User, UserCheck, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import styles from './user-employee.module.css';

export default function UserEmployeeHomePage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const userEmployeeModules = [
    {
      id: 'user',
      title: 'User Portal',
      description: 'Access your personal dashboard, scan waste, view profile and rewards',
      icon: User,
      path: '/user-employee/user',
      color: '#10b981',
      routes: [
        'Dashboard',
        'Profile',
        'Scan Waste',
        'Leaderboard (Coming Soon)',
        'Rewards (Coming Soon)',
        'Settings (Coming Soon)',
        'Support (Coming Soon)'
      ]
    },
    {
      id: 'employee',
      title: 'Employee Portal',
      description: 'Employee management and task assignment (Coming Soon)',
      icon: UserCheck,
      path: '/user-employee/employee',
      color: '#3b82f6',
      routes: [
        'Employee Dashboard (Coming Soon)',
        'Task Management (Coming Soon)',
        'Zone Assignment (Coming Soon)',
        'Performance Tracking (Coming Soon)'
      ],
      comingSoon: true
    },
    {
      id: 'login',
      title: 'Combined Login',
      description: 'Login for both users and employees with role-based access',
      icon: LogIn,
      path: '/user-employee/login',
      color: '#8b5cf6',
      routes: [
        'User Login',
        'Employee Login',
        'Role Selection',
        'Password Recovery'
      ]
    },
    {
      id: 'register-user',
      title: 'User Registration',
      description: 'Create a new user account to start using EcoSort',
      icon: UserPlus,
      path: '/user-employee/register-user',
      color: '#f59e0b',
      routes: [
        'Account Creation',
        'Profile Setup',
        'Email Verification',
        'Welcome Onboarding'
      ]
    },
    {
      id: 'register-employee',
      title: 'Employee Registration',
      description: 'Register as an employee for waste management operations',
      icon: UserCheck,
      path: '/user-employee/register-employee',
      color: '#ef4444',
      routes: [
        'Employee Account Creation',
        'Manager Approval Required',
        'Role Assignment',
        'Training Materials'
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
        
        <h1 className={styles.title}>User & Employee Portal</h1>
        <p className={styles.subtitle}>
          Choose your role and access the appropriate portal
        </p>
      </div>

      <div className={styles.modulesGrid}>
        {userEmployeeModules.map((module) => {
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

      <div className={styles.footer}>
        <p className={styles.footerText}>
          EcoSort User & Employee Portal
        </p>
        <p className={styles.versionText}>Version 1.0.0</p>
      </div>
    </div>
  );
}
