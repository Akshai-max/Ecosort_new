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
  Sun
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
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
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(profile);
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className={styles.saveButton}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.infoContainer}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>First Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editedProfile?.firstName || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>{profile?.firstName}</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Last Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editedProfile?.lastName || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>{profile?.lastName}</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email</span>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedProfile?.email || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>{profile?.email}</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Phone</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedProfile?.phone || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>{profile?.phone}</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Date of Birth</span>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editedProfile?.dateOfBirth?.split('T')[0] || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>
                      {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                    </span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Gender</span>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editedProfile?.gender || ''}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  ) : (
                    <span className={styles.value}>{profile?.gender || 'Not set'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Address</h2>
              <div className={styles.addressGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Street</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.street"
                      value={editedProfile?.address?.street || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>{profile?.address?.street || 'Not set'}</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>City</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.city"
                      value={editedProfile?.address?.city || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>{profile?.address?.city || 'Not set'}</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>State</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.state"
                      value={editedProfile?.address?.state || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>{profile?.address?.state || 'Not set'}</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>PIN Code</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.pincode"
                      value={editedProfile?.address?.pincode || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  ) : (
                    <span className={styles.value}>{profile?.address?.pincode || 'Not set'}</span>
                  )}
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
    </div>
  );
} 