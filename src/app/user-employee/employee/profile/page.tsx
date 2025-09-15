'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  Shield,
  Settings,
  Save,
  Edit,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
  LogOut,
  Key,
  Bell,
  Globe,
  Lock
} from 'lucide-react';
import styles from './profile.module.css';

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  position: string;
  zone: {
    id: string;
    name: string;
    description: string;
  };
  hireDate: string;
  lastLogin: string;
  avatar?: string;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      showProfile: boolean;
      showActivity: boolean;
    };
    language: string;
    timezone: string;
  };
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function EmployeeProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [passwordForm, setPasswordForm] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProfile: EmployeeProfile = {
        id: 'EMP001',
        name: 'John Doe',
        email: 'john.doe@ecosort.com',
        phone: '+1 (555) 123-4567',
        employeeId: 'EMP001',
        department: 'Waste Management',
        position: 'Collection Specialist',
        zone: {
          id: 'ZONE001',
          name: 'Downtown Zone',
          description: 'Central business district collection area'
        },
        hireDate: '2023-01-15',
        lastLogin: '2024-01-15T08:30:00Z',
        avatar: '/avatars/employee-1.jpg',
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          privacy: {
            showProfile: true,
            showActivity: false
          },
          language: 'en',
          timezone: 'America/New_York'
        }
      };
      
      setProfile(mockProfile);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      // TODO: Make API call to update profile
      console.log('Profile updated:', profile);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setSaving(true);
    try {
      // TODO: Make API call to change password
      console.log('Password changed');
      setSuccess('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to change password');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      // TODO: Make API call to logout
      console.log('Logging out...');
      router.push('/user-employee/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.back()} className={styles.button}>
          Go Back
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <User className={styles.titleIcon} />
            Profile & Settings
          </h1>
          <p className={styles.subtitle}>Manage your account information and preferences</p>
        </div>
        
        <div className={styles.headerRight}>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <LogOut className={styles.logoutIcon} />
            Logout
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={styles.successMessage}>
          <CheckCircle className={styles.successIcon} />
          {success}
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>
          <AlertTriangle className={styles.errorIcon} />
          {error}
        </div>
      )}

      {/* Profile Overview */}
      <div className={styles.profileOverview}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt={profile.name}
              className={styles.avatar}
            />
            <button className={styles.avatarEditButton}>
              <Camera className={styles.cameraIcon} />
            </button>
          </div>
          <div className={styles.avatarInfo}>
            <h2 className={styles.employeeName}>{profile.name}</h2>
            <p className={styles.employeePosition}>{profile.position}</p>
            <p className={styles.employeeId}>ID: {profile.employeeId}</p>
          </div>
        </div>
        
        <div className={styles.quickStats}>
          <div className={styles.statItem}>
            <Calendar className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Hired</span>
              <span className={styles.statValue}>{formatDate(profile.hireDate)}</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <MapPin className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Zone</span>
              <span className={styles.statValue}>{profile.zone.name}</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <Clock className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Last Login</span>
              <span className={styles.statValue}>{formatDateTime(profile.lastLogin)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className={styles.tabIcon} />
          Profile
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'security' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield className={styles.tabIcon} />
          Security
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'preferences' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <Settings className={styles.tabIcon} />
          Preferences
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'profile' && (
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <button
                className={styles.editButton}
                onClick={() => setEditing(!editing)}
              >
                <Edit className={styles.editIcon} />
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <div className={styles.profileForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className={styles.formInput}
                    disabled={!editing}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className={styles.formInput}
                    disabled={!editing}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className={styles.formInput}
                    disabled={!editing}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Employee ID</label>
                  <input
                    type="text"
                    value={profile.employeeId}
                    className={styles.formInput}
                    disabled
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department</label>
                  <input
                    type="text"
                    value={profile.department}
                    className={styles.formInput}
                    disabled
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Position</label>
                  <input
                    type="text"
                    value={profile.position}
                    className={styles.formInput}
                    disabled
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Assigned Zone</label>
                <div className={styles.zoneInfo}>
                  <MapPin className={styles.zoneIcon} />
                  <div className={styles.zoneDetails}>
                    <span className={styles.zoneName}>{profile.zone.name}</span>
                    <span className={styles.zoneDescription}>{profile.zone.description}</span>
                  </div>
                </div>
              </div>
              
              {editing && (
                <div className={styles.formActions}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    <Save className={styles.saveIcon} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className={styles.securitySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Security Settings</h2>
            </div>
            
            <div className={styles.passwordForm}>
              <h3 className={styles.formTitle}>Change Password</h3>
              <p className={styles.formDescription}>
                Update your password to keep your account secure. Use a strong password with at least 8 characters.
              </p>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className={styles.formInput}
                      placeholder="Enter current password"
                    />
                    <button
                      className={styles.passwordToggle}
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    >
                      {showPasswords.current ? <EyeOff className={styles.eyeIcon} /> : <Eye className={styles.eyeIcon} />}
                    </button>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>New Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className={styles.formInput}
                      placeholder="Enter new password"
                    />
                    <button
                      className={styles.passwordToggle}
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    >
                      {showPasswords.new ? <EyeOff className={styles.eyeIcon} /> : <Eye className={styles.eyeIcon} />}
                    </button>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Confirm New Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className={styles.formInput}
                      placeholder="Confirm new password"
                    />
                    <button
                      className={styles.passwordToggle}
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    >
                      {showPasswords.confirm ? <EyeOff className={styles.eyeIcon} /> : <Eye className={styles.eyeIcon} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button
                  className={styles.saveButton}
                  onClick={handleChangePassword}
                  disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                >
                  <Key className={styles.saveIcon} />
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
            
            <div className={styles.securityInfo}>
              <h3 className={styles.infoTitle}>
                <Info className={styles.infoIcon} />
                Security Tips
              </h3>
              <ul className={styles.securityTips}>
                <li>Use a strong password with at least 8 characters</li>
                <li>Include uppercase and lowercase letters, numbers, and symbols</li>
                <li>Don't reuse passwords from other accounts</li>
                <li>Log out when using shared computers</li>
                <li>Report any suspicious activity immediately</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className={styles.preferencesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Preferences</h2>
            </div>
            
            <div className={styles.preferencesForm}>
              <div className={styles.preferenceGroup}>
                <h3 className={styles.preferenceTitle}>
                  <Bell className={styles.preferenceIcon} />
                  Notifications
                </h3>
                <div className={styles.preferenceOptions}>
                  <div className={styles.preferenceOption}>
                    <label className={styles.preferenceLabel}>
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications.email}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: {
                              ...profile.preferences.notifications,
                              email: e.target.checked
                            }
                          }
                        })}
                      />
                      <span>Email Notifications</span>
                    </label>
                    <p className={styles.preferenceDescription}>Receive notifications via email</p>
                  </div>
                  
                  <div className={styles.preferenceOption}>
                    <label className={styles.preferenceLabel}>
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications.push}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: {
                              ...profile.preferences.notifications,
                              push: e.target.checked
                            }
                          }
                        })}
                      />
                      <span>Push Notifications</span>
                    </label>
                    <p className={styles.preferenceDescription}>Receive push notifications in browser</p>
                  </div>
                  
                  <div className={styles.preferenceOption}>
                    <label className={styles.preferenceLabel}>
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications.sms}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: {
                              ...profile.preferences.notifications,
                              sms: e.target.checked
                            }
                          }
                        })}
                      />
                      <span>SMS Notifications</span>
                    </label>
                    <p className={styles.preferenceDescription}>Receive notifications via SMS</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.preferenceGroup}>
                <h3 className={styles.preferenceTitle}>
                  <Lock className={styles.preferenceIcon} />
                  Privacy
                </h3>
                <div className={styles.preferenceOptions}>
                  <div className={styles.preferenceOption}>
                    <label className={styles.preferenceLabel}>
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showProfile}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            privacy: {
                              ...profile.preferences.privacy,
                              showProfile: e.target.checked
                            }
                          }
                        })}
                      />
                      <span>Show Profile to Others</span>
                    </label>
                    <p className={styles.preferenceDescription}>Allow other employees to view your profile</p>
                  </div>
                  
                  <div className={styles.preferenceOption}>
                    <label className={styles.preferenceLabel}>
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showActivity}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            privacy: {
                              ...profile.preferences.privacy,
                              showActivity: e.target.checked
                            }
                          }
                        })}
                      />
                      <span>Show Activity Status</span>
                    </label>
                    <p className={styles.preferenceDescription}>Show your online/offline status to others</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.preferenceGroup}>
                <h3 className={styles.preferenceTitle}>
                  <Globe className={styles.preferenceIcon} />
                  Localization
                </h3>
                <div className={styles.preferenceOptions}>
                  <div className={styles.preferenceOption}>
                    <label className={styles.preferenceLabel}>Language</label>
                    <select
                      value={profile.preferences.language}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          language: e.target.value
                        }
                      })}
                      className={styles.preferenceSelect}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  
                  <div className={styles.preferenceOption}>
                    <label className={styles.preferenceLabel}>Timezone</label>
                    <select
                      value={profile.preferences.timezone}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          timezone: e.target.value
                        }
                      })}
                      className={styles.preferenceSelect}
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button
                  className={styles.saveButton}
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  <Save className={styles.saveIcon} />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
