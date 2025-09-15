'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Trophy, 
  Coins, 
  Target,
  Calendar,
  BarChart3,
  Award,
  Star,
  Medal,
  Crown,
  Zap,
  CheckCircle,
  Clock,
  Users,
  Activity,
  Flame
} from 'lucide-react';
import styles from './performance.module.css';

interface PerformanceData {
  currentRank: string;
  currentPoints: number;
  monthlyRank: number;
  totalEmployees: number;
  monthlyPoints: number;
  weeklyPoints: number;
  dailyPoints: number;
  tasksCompleted: number;
  tasksAssigned: number;
  completionRate: number;
  averageTaskTime: number;
  streak: number;
  achievements: Achievement[];
  monthlyHistory: MonthlyData[];
  weeklyHistory: WeeklyData[];
  leaderboard: LeaderboardEntry[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: string;
  category: 'task' | 'scan' | 'streak' | 'social' | 'special';
}

interface MonthlyData {
  month: string;
  points: number;
  tasksCompleted: number;
  rank: number;
}

interface WeeklyData {
  week: string;
  points: number;
  tasksCompleted: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  tasksCompleted: number;
  completionRate: number;
  isCurrentUser: boolean;
}

export default function EmployeePerformancePage() {
  const router = useRouter();
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: PerformanceData = {
        currentRank: 'Silver',
        currentPoints: 1250,
        monthlyRank: 3,
        totalEmployees: 24,
        monthlyPoints: 450,
        weeklyPoints: 120,
        dailyPoints: 25,
        tasksCompleted: 18,
        tasksAssigned: 22,
        completionRate: 82,
        averageTaskTime: 45,
        streak: 7,
        achievements: [
          {
            id: 'A001',
            title: 'First Task',
            description: 'Complete your first task',
            icon: '🎯',
            points: 50,
            unlockedAt: '2024-01-01',
            category: 'task'
          },
          {
            id: 'A002',
            title: 'Task Master',
            description: 'Complete 10 tasks',
            icon: '⭐',
            points: 100,
            unlockedAt: '2024-01-05',
            category: 'task'
          },
          {
            id: 'A003',
            title: 'Scanner Pro',
            description: 'Scan 50 waste items',
            icon: '📱',
            points: 150,
            unlockedAt: '2024-01-10',
            category: 'scan'
          },
          {
            id: 'A004',
            title: 'Week Warrior',
            description: 'Complete 5 tasks in a week',
            icon: '🔥',
            points: 200,
            unlockedAt: '2024-01-12',
            category: 'streak'
          },
          {
            id: 'A005',
            title: 'Silver Rank',
            description: 'Reach Silver rank',
            icon: '🥈',
            points: 300,
            unlockedAt: '2024-01-15',
            category: 'special'
          }
        ],
        monthlyHistory: [
          { month: 'Oct 2023', points: 320, tasksCompleted: 12, rank: 5 },
          { month: 'Nov 2023', points: 380, tasksCompleted: 15, rank: 4 },
          { month: 'Dec 2023', points: 420, tasksCompleted: 16, rank: 3 },
          { month: 'Jan 2024', points: 450, tasksCompleted: 18, rank: 3 }
        ],
        weeklyHistory: [
          { week: 'Week 1', points: 95, tasksCompleted: 4 },
          { week: 'Week 2', points: 110, tasksCompleted: 5 },
          { week: 'Week 3', points: 105, tasksCompleted: 4 },
          { week: 'Week 4', points: 120, tasksCompleted: 5 }
        ],
        leaderboard: [
          { rank: 1, name: 'Sarah Wilson', points: 1850, tasksCompleted: 28, completionRate: 93, isCurrentUser: false },
          { rank: 2, name: 'Mike Johnson', points: 1650, tasksCompleted: 25, completionRate: 89, isCurrentUser: false },
          { rank: 3, name: 'John Doe', points: 1250, tasksCompleted: 18, completionRate: 82, isCurrentUser: true },
          { rank: 4, name: 'Jane Smith', points: 1150, tasksCompleted: 17, completionRate: 78, isCurrentUser: false },
          { rank: 5, name: 'Tom Brown', points: 980, tasksCompleted: 15, completionRate: 75, isCurrentUser: false }
        ]
      };
      
      setPerformanceData(mockData);
    } catch (err) {
      setError('Failed to load performance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze':
        return <Medal className={styles.rankIcon} style={{ color: '#cd7f32' }} />;
      case 'silver':
        return <Medal className={styles.rankIcon} style={{ color: '#c0c0c0' }} />;
      case 'gold':
        return <Crown className={styles.rankIcon} style={{ color: '#ffd700' }} />;
      case 'platinum':
        return <Star className={styles.rankIcon} style={{ color: '#e5e4e2' }} />;
      default:
        return <Trophy className={styles.rankIcon} />;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze':
        return '#cd7f32';
      case 'silver':
        return '#c0c0c0';
      case 'gold':
        return '#ffd700';
      case 'platinum':
        return '#e5e4e2';
      default:
        return '#6b7280';
    }
  };

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'task':
        return <Target className={styles.achievementIcon} />;
      case 'scan':
        return <Zap className={styles.achievementIcon} />;
      case 'streak':
        return <Flame className={styles.achievementIcon} />;
      case 'social':
        return <Users className={styles.achievementIcon} />;
      case 'special':
        return <Award className={styles.achievementIcon} />;
      default:
        return <Star className={styles.achievementIcon} />;
    }
  };

  const getPeriodData = () => {
    if (!performanceData) return { points: 0, tasks: 0 };
    
    switch (selectedPeriod) {
      case 'daily':
        return { points: performanceData.dailyPoints, tasks: 1 };
      case 'weekly':
        return { points: performanceData.weeklyPoints, tasks: 5 };
      case 'monthly':
        return { points: performanceData.monthlyPoints, tasks: performanceData.tasksCompleted };
      default:
        return { points: 0, tasks: 0 };
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading performance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.back()} className={styles.button}>
          Go Back
        </button>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>No performance data available</div>
        <button onClick={() => router.back()} className={styles.button}>
          Go Back
        </button>
      </div>
    );
  }

  const periodData = getPeriodData();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <TrendingUp className={styles.titleIcon} />
            Performance Dashboard
          </h1>
          <p className={styles.subtitle}>Track your progress and achievements</p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.rankDisplay}>
            <div className={styles.rankInfo}>
              {getRankIcon(performanceData.currentRank)}
              <div className={styles.rankDetails}>
                <h3 className={styles.rankTitle}>{performanceData.currentRank} Rank</h3>
                <p className={styles.rankSubtitle}>#{performanceData.monthlyRank} of {performanceData.totalEmployees}</p>
              </div>
            </div>
            <div className={styles.pointsDisplay}>
              <Coins className={styles.pointsIcon} />
              <span className={styles.pointsValue}>{performanceData.currentPoints}</span>
              <span className={styles.pointsLabel}>Total Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className={styles.periodSelector}>
        <h3 className={styles.selectorTitle}>Performance Period</h3>
        <div className={styles.periodButtons}>
          <button
            className={`${styles.periodButton} ${selectedPeriod === 'daily' ? styles.activePeriod : ''}`}
            onClick={() => setSelectedPeriod('daily')}
          >
            <Calendar className={styles.periodIcon} />
            Daily
          </button>
          <button
            className={`${styles.periodButton} ${selectedPeriod === 'weekly' ? styles.activePeriod : ''}`}
            onClick={() => setSelectedPeriod('weekly')}
          >
            <BarChart3 className={styles.periodIcon} />
            Weekly
          </button>
          <button
            className={`${styles.periodButton} ${selectedPeriod === 'monthly' ? styles.activePeriod : ''}`}
            onClick={() => setSelectedPeriod('monthly')}
          >
            <TrendingUp className={styles.periodIcon} />
            Monthly
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Coins className={styles.icon} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Points</h3>
            <p className={styles.statValue}>{periodData.points}</p>
            <p className={styles.statSubtext}>Points earned this {selectedPeriod}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle className={styles.icon} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Tasks Completed</h3>
            <p className={styles.statValue}>{periodData.tasks}</p>
            <p className={styles.statSubtext}>{performanceData.completionRate}% completion rate</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock className={styles.icon} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Avg. Task Time</h3>
            <p className={styles.statValue}>{performanceData.averageTaskTime}m</p>
            <p className={styles.statSubtext}>Average completion time</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Zap className={styles.icon} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Current Streak</h3>
            <p className={styles.statValue}>{performanceData.streak}</p>
            <p className={styles.statSubtext}>Days in a row</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Leaderboard */}
        <div className={styles.leaderboardSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Trophy className={styles.sectionIcon} />
              Employee Leaderboard
            </h2>
            <span className={styles.sectionSubtitle}>Monthly Rankings</span>
          </div>
          
          <div className={styles.leaderboardList}>
            {performanceData.leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`${styles.leaderboardItem} ${entry.isCurrentUser ? styles.currentUser : ''}`}
              >
                <div className={styles.rankPosition}>
                  {entry.rank <= 3 ? (
                    <div className={styles.topRank}>
                      {entry.rank === 1 && <Crown className={styles.crownIcon} />}
                      {entry.rank === 2 && <Medal className={styles.medalIcon} />}
                      {entry.rank === 3 && <Medal className={styles.medalIcon} />}
                    </div>
                  ) : (
                    <span className={styles.rankNumber}>#{entry.rank}</span>
                  )}
                </div>
                
                <div className={styles.playerInfo}>
                  <h3 className={styles.playerName}>{entry.name}</h3>
                  <div className={styles.playerStats}>
                    <span className={styles.playerPoints}>{entry.points} pts</span>
                    <span className={styles.playerTasks}>{entry.tasksCompleted} tasks</span>
                    <span className={styles.playerRate}>{entry.completionRate}%</span>
                  </div>
                </div>
                
                {entry.isCurrentUser && (
                  <div className={styles.currentUserBadge}>You</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className={styles.achievementsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Award className={styles.sectionIcon} />
              Achievements
            </h2>
            <span className={styles.sectionSubtitle}>{performanceData.achievements.length} unlocked</span>
          </div>
          
          <div className={styles.achievementsGrid}>
            {performanceData.achievements.map((achievement) => (
              <div key={achievement.id} className={styles.achievementCard}>
                <div className={styles.achievementIcon}>
                  {getAchievementIcon(achievement.category)}
                </div>
                <div className={styles.achievementInfo}>
                  <h3 className={styles.achievementTitle}>{achievement.title}</h3>
                  <p className={styles.achievementDescription}>{achievement.description}</p>
                  <div className={styles.achievementMeta}>
                    <span className={styles.achievementPoints}>+{achievement.points} pts</span>
                    <span className={styles.achievementDate}>
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance History */}
      <div className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <BarChart3 className={styles.sectionIcon} />
            Performance History
          </h2>
          <span className={styles.sectionSubtitle}>Last 4 {selectedPeriod}s</span>
        </div>
        
        <div className={styles.historyChart}>
          <div className={styles.chartContainer}>
            {selectedPeriod === 'monthly' ? (
              <div className={styles.barChart}>
                {performanceData.monthlyHistory.map((data, index) => (
                  <div key={index} className={styles.barGroup}>
                    <div className={styles.barValue}>{data.points}</div>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.bar}
                        style={{ height: `${(data.points / 500) * 100}%` }}
                      ></div>
                    </div>
                    <div className={styles.barLabel}>{data.month}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.barChart}>
                {performanceData.weeklyHistory.map((data, index) => (
                  <div key={index} className={styles.barGroup}>
                    <div className={styles.barValue}>{data.points}</div>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.bar}
                        style={{ height: `${(data.points / 150) * 100}%` }}
                      ></div>
                    </div>
                    <div className={styles.barLabel}>{data.week}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Goals */}
      <div className={styles.goalsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Target className={styles.sectionIcon} />
            Progress Goals
          </h2>
        </div>
        
        <div className={styles.goalsGrid}>
          <div className={styles.goalCard}>
            <div className={styles.goalIcon}>
              <Trophy className={styles.icon} />
            </div>
            <div className={styles.goalInfo}>
              <h3 className={styles.goalTitle}>Next Rank: Gold</h3>
              <p className={styles.goalDescription}>Earn 500 more points to reach Gold rank</p>
              <div className={styles.goalProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${(performanceData.currentPoints / 1750) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {performanceData.currentPoints}/1750 points
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.goalCard}>
            <div className={styles.goalIcon}>
              <CheckCircle className={styles.icon} />
            </div>
            <div className={styles.goalInfo}>
              <h3 className={styles.goalTitle}>Monthly Target</h3>
              <p className={styles.goalDescription}>Complete 20 tasks this month</p>
              <div className={styles.goalProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${(performanceData.tasksCompleted / 20) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {performanceData.tasksCompleted}/20 tasks
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.goalCard}>
            <div className={styles.goalIcon}>
              <Zap className={styles.icon} />
            </div>
            <div className={styles.goalInfo}>
              <h3 className={styles.goalTitle}>Streak Goal</h3>
              <p className={styles.goalDescription}>Maintain a 10-day streak</p>
              <div className={styles.goalProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${(performanceData.streak / 10) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {performanceData.streak}/10 days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
