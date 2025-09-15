'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Recycle, 
  Leaf, 
  Globe, 
  TreePine,
  Trophy,
  Star,
  Sprout,
  Wind,
  Droplets,
  Sun,
  Check,
  ChevronDown
} from 'lucide-react';
import styles from './profile.module.css';

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  points: number;
  timestamp: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  status: 'available' | 'claimed';
  imageUrl?: string;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  dateOfBirth: string;
  gender: string;
  role: string;
  points: number;
  rank: {
    title: string;
    level: number;
    progress: number;
  };
  rewards: Reward[];
  recentActivities: Activity[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data.user);
        setEditedProfile(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedProfile) {
      if (e.target.name.startsWith('address.')) {
        const addressField = e.target.name.split('.')[1];
        setEditedProfile({
          ...editedProfile,
          address: {
            ...editedProfile.address,
            [addressField]: e.target.value
          }
        });
      } else {
        setEditedProfile({
          ...editedProfile,
          [e.target.name]: e.target.value
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setProfile(editedProfile);
      setIsEditing(false);
      
      // Show success notification
      setShowSuccess(true);
      
      // Hide success notification after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className={styles.button}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={styles.container}>
        <div className={styles.editFormContainer}>
          <div className={styles.editFormHeader}>
            <h1 className={styles.editFormTitle}>Edit profile</h1>
            <div className={styles.editFormAvatar}>
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </div>
          </div>
          
          <div className={styles.editFormContent}>
            <div className={styles.editFormGrid}>
              <div className={styles.editFormGroup}>
                <label htmlFor="firstName" className={styles.editFormLabel}>First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={styles.editFormInput}
                  value={editedProfile?.firstName || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.editFormGroup}>
                <label htmlFor="lastName" className={styles.editFormLabel}>Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={styles.editFormInput}
                  value={editedProfile?.lastName || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.editFormGroupFull}>
                <label htmlFor="email" className={styles.editFormLabel}>Email</label>
                <div className={styles.editFormInputWithIcon}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.editFormInput}
                    value={editedProfile?.email || ''}
                    onChange={handleInputChange}
                  />
                  <span className={styles.editFormInputCheck}>
                    <Check size={18} color="#16a34a" />
                  </span>
                </div>
              </div>
              
              <div className={styles.editFormGroupFull}>
                <label htmlFor="address.street" className={styles.editFormLabel}>Address</label>
                <input
                  id="address.street"
                  name="address.street"
                  type="text"
                  className={styles.editFormInput}
                  value={editedProfile?.address?.street || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.editFormGroup}>
                <label htmlFor="phone" className={styles.editFormLabel}>Contact Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={styles.editFormInput}
                  value={editedProfile?.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.editFormGroup}>
                <label htmlFor="address.city" className={styles.editFormLabel}>City</label>
                <div className={styles.editFormSelect}>
                  <input
                    id="address.city"
                    name="address.city"
                    type="text"
                    className={styles.editFormInput}
                    value={editedProfile?.address?.city || ''}
                    onChange={handleInputChange}
                  />
                  <ChevronDown size={18} className={styles.editFormSelectIcon} />
                </div>
              </div>
              
              <div className={styles.editFormGroup}>
                <label htmlFor="address.state" className={styles.editFormLabel}>State</label>
                <div className={styles.editFormSelect}>
                  <input
                    id="address.state"
                    name="address.state"
                    type="text"
                    className={styles.editFormInput}
                    value={editedProfile?.address?.state || ''}
                    onChange={handleInputChange}
                  />
                  <ChevronDown size={18} className={styles.editFormSelectIcon} />
                </div>
              </div>
              
              <div className={styles.editFormGroupFull}>
                <label htmlFor="password" className={styles.editFormLabel}>Password</label>
                <div className={styles.editFormInputWithIcon}>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={styles.editFormInput}
                    value="••••••••••••"
                    disabled
                  />
                  <span className={styles.editFormInputCheck}>
                    <Check size={18} color="#16a34a" />
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.editFormActions}>
              <button
                type="button"
                className={styles.editFormCancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.editFormSaveButton}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.floatingIcon}><Recycle size={36} strokeWidth={1.5} /></div>
          <div className={styles.floatingIcon}><Leaf size={24} strokeWidth={1.5} /></div>
          <div className={styles.floatingIcon}><Globe size={42} strokeWidth={1.5} /></div>
          <div className={styles.floatingIcon}><TreePine size={32} strokeWidth={1.5} /></div>
          <div className={styles.floatingIcon}><Sprout size={28} strokeWidth={1.5} /></div>
          <div className={styles.floatingIcon}><Wind size={34} strokeWidth={1.5} /></div>
          <div className={styles.floatingIcon}><Droplets size={26} strokeWidth={1.5} /></div>
          <div className={styles.floatingIcon}><Sun size={38} strokeWidth={1.5} /></div>
          <div className={styles.floatingIcon}><Star size={30} strokeWidth={1.5} /></div>
          <div className={styles.headerContent}>
            <div className={styles.avatar}>
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </div>
            <div>
              <h1 className={styles.title}>
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className={styles.subtitle}>
                {profile?.email}
              </p>
            </div>
          </div>

          <div className={styles.userStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Points</span>
              <span className={styles.statValue}>{profile?.points || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Current Rank</span>
              <span className={styles.statValue}>{profile?.rank?.title || 'Beginner'}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Level</span>
              <span className={styles.statValue}>{profile?.rank?.level || 1}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.infoContainer}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>First Name</span>
                  <span className={styles.value}>{profile?.firstName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Last Name</span>
                  <span className={styles.value}>{profile?.lastName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{profile?.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{profile?.phone}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Date of Birth</span>
                  <span className={styles.value}>
                    {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Gender</span>
                  <span className={styles.value}>{profile?.gender || 'Not set'}</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Address</h2>
              <div className={styles.addressGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Street</span>
                  <span className={styles.value}>{profile?.address?.street || 'Not set'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>City</span>
                  <span className={styles.value}>{profile?.address?.city || 'Not set'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>State</span>
                  <span className={styles.value}>{profile?.address?.state || 'Not set'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>PIN Code</span>
                  <span className={styles.value}>{profile?.address?.pincode || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Progress</h2>
            <div className={styles.progressContainer}>
              <div className={styles.progressInfo}>
                <span className={styles.progressLabel}>Level {profile?.rank?.level}</span>
                <span className={styles.progressPercentage}>{profile?.rank?.progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${profile?.rank?.progress || 0}%` }}
                ></div>
              </div>
              <p className={styles.progressText}>
                Keep recycling to reach Level {(profile?.rank?.level || 1) + 1}!
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent Activities</h2>
            <div className={styles.activitiesList}>
              {profile?.recentActivities?.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.type === 'recycle' ? 
                      <Recycle size={24} strokeWidth={2.5} /> : 
                      <Trophy size={24} strokeWidth={2.5} />
                    }
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityDescription}>{activity.description}</p>
                    <span className={styles.activityTime}>
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.activityPoints}>
                    +{activity.points} pts
                  </div>
                </div>
              ))}
              {(!profile?.recentActivities || profile.recentActivities.length === 0) && (
                <p className={styles.noActivities}>No recent activities</p>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Rewards</h2>
            <div className={styles.rewardsGrid}>
              {profile?.rewards?.map((reward) => (
                <div key={reward.id} className={styles.rewardCard}>
                  {reward.imageUrl && (
                    <div className={styles.rewardImage}>
                      <img src={reward.imageUrl} alt={reward.name} />
                    </div>
                  )}
                  <div className={styles.rewardContent}>
                    <h3 className={styles.rewardTitle}>{reward.name}</h3>
                    <p className={styles.rewardDescription}>{reward.description}</p>
                    <div className={styles.rewardFooter}>
                      <span className={styles.rewardPoints}>{reward.pointsCost} points</span>
                      <span className={`${styles.rewardStatus} ${styles[reward.status]}`}>
                        {reward.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!profile?.rewards || profile.rewards.length === 0) && (
                <p className={styles.noRewards}>No rewards available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showSuccess && (
        <div className={styles.successNotification}>
          <div className={styles.successIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={styles.successMessage}>
            Profile updated successfully!
          </div>
        </div>
      )}
    </div>
  );
} 