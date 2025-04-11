'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { Coins, Trophy, ScanBarcode, BadgeCheck } from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  points: number;
  rank: string;
  scannedItems: number;
  rewards: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        // Add placeholder data for points, rank, scannedItems, and rewards
        const userWithStats = {
          ...data.user,
          points: 1250,
          rank: 'Silver',
          scannedItems: 42,
          rewards: 3
        };
        setUser(userWithStats);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}>
        </div>
      </div>
      
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.push('/login')} className={styles.button}>
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Coins style={{ width: "40px", height: "40px" }} className="w-6 h-6 text-yellow-500" /></div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Total Points</h3>
            <p className={styles.statValue}>{user?.points || 0}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Trophy style={{ width: "40px", height: "40px" }} className="w-6 h-6 text-amber-600" /></div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Rank</h3>
            <p className={styles.statValue}>{user?.rank || 'Bronze'}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ScanBarcode style={{ width: "40px", height: "40px" }} className="w-6 h-6 text-green-600" /></div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Scanned Items</h3>
            <p className={styles.statValue}>{user?.scannedItems || 0}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><BadgeCheck style={{ width: "40px", height: "40px" }}className="w-6 h-6 text-purple-600" /></div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Rewards</h3>
            <p className={styles.statValue}>{user?.rewards || 0}</p>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Quick Scan</h2>
          <div className={styles.cardContent}>
            <p>Scan your waste items to earn points and contribute to a cleaner environment.</p>
            <div className={styles.scanButtonContainer}>
              <Link href="/user/scan" className={styles.scanButton}>
                Scan Now
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Profile</h2>
          <div className={styles.cardContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.userName}>{user?.firstName} {user?.lastName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user?.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Rank:</span>
              <span className={styles.infoValue}>{user?.rank}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Points:</span>
              <span className={styles.infoValue}>{user?.points}</span>
            </div>
          </div>
          <Link href="/user/profile" className={styles.cardLink}>
            View Full Profile
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Leaderboard</h2>
          <div className={styles.cardContent}>
            <div className={styles.leaderboardPreview}>
              <div className={styles.leaderboardItem}>
                <span className={styles.rank}>1</span>
                <span className={styles.name}>John Doe</span>
                <span className={styles.points}>2500 pts</span>
              </div>
              <div className={styles.leaderboardItem}>
                <span className={styles.rank}>2</span>
                <span className={styles.name}>Jane Smith</span>
                <span className={styles.points}>2100 pts</span>
              </div>
              <div className={styles.leaderboardItem}>
                <span className={styles.rank}>3</span>
                <span className={styles.name}>Bob Johnson</span>
                <span className={styles.points}>1800 pts</span>
              </div>
            </div>
          </div>
          <Link href="/user/leaderboard" className={styles.cardLink}>
            View Full Leaderboard
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Available Rewards</h2>
          <div className={styles.cardContent}>
            <div className={styles.rewardsPreview}>
              <div className={styles.rewardItem}>
                <span className={styles.rewardName}>Eco-Friendly Water Bottle</span>
                <span className={styles.rewardPoints}>500 pts</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardName}>Reusable Shopping Bag</span>
                <span className={styles.rewardPoints}>300 pts</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardName}>Plant a Tree Certificate</span>
                <span className={styles.rewardPoints}>1000 pts</span>
              </div>
            </div>
          </div>
          <Link href="/user/rewards" className={styles.cardLink}>
            View All Rewards
          </Link>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>♻️</div>
            <div className={styles.activityDetails}>
              <p className={styles.activityText}>Scanned plastic bottle</p>
              <p className={styles.activityTime}>2 hours ago</p>
            </div>
            <div className={styles.activityPoints}>+10 pts</div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>📦</div>
            <div className={styles.activityDetails}>
              <p className={styles.activityText}>Scanned cardboard box</p>
              <p className={styles.activityTime}>Yesterday</p>
            </div>
            <div className={styles.activityPoints}>+15 pts</div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🥤</div>
            <div className={styles.activityDetails}>
              <p className={styles.activityText}>Scanned aluminum can</p>
              <p className={styles.activityTime}>2 days ago</p>
            </div>
            <div className={styles.activityPoints}>+20 pts</div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🎁</div>
            <div className={styles.activityDetails}>
              <p className={styles.activityText}>Redeemed reward: Eco-Friendly Water Bottle</p>
              <p className={styles.activityTime}>3 days ago</p>
            </div>
            <div className={styles.activityPoints}>-500 pts</div>
          </div>
        </div>
      </div>
    </div>
  );
}