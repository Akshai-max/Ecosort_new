'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './scan.module.css';

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

type WasteType = 'plastic' | 'paper' | 'glass' | 'metal' | 'electronics' | 'other';

interface WasteItem {
  type: WasteType;
  points: number;
  description: string;
}

export default function ScanPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedWasteType, setSelectedWasteType] = useState<WasteType | null>(null);
  const [scanResult, setScanResult] = useState<WasteItem | null>(null);
  const [scanning, setScanning] = useState(false);

  // Waste type definitions with points
  const wasteTypes: Record<WasteType, { points: number; description: string }> = {
    plastic: { points: 10, description: 'Plastic bottles, containers, bags' },
    paper: { points: 5, description: 'Newspapers, magazines, cardboard' },
    glass: { points: 15, description: 'Glass bottles, jars, containers' },
    metal: { points: 20, description: 'Aluminum cans, steel containers' },
    electronics: { points: 30, description: 'Phones, batteries, small appliances' },
    other: { points: 5, description: 'Other recyclable materials' }
  };

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
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  const handleWasteTypeSelect = (type: WasteType) => {
    setSelectedWasteType(type);
  };

  const handleScan = () => {
    if (!selectedWasteType) {
      setError('Please select a waste type before scanning');
      return;
    }

    setScanning(true);
    setError('');

    // Simulate scanning process
    setTimeout(() => {
      const wasteItem: WasteItem = {
        type: selectedWasteType,
        points: wasteTypes[selectedWasteType].points,
        description: wasteTypes[selectedWasteType].description
      };
      
      setScanResult(wasteItem);
      setScanning(false);
      
      // Update user points (in a real app, this would be an API call)
      if (user) {
        setUser({
          ...user,
          points: user.points + wasteItem.points,
          scannedItems: user.scannedItems + 1
        });
      }
    }, 2000);
  };

  const handleReset = () => {
    setSelectedWasteType(null);
    setScanResult(null);
    setError('');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scanContainer}>
      <div className={styles.cameraSection}>
        <div className={styles.cameraPlaceholder}>
          {cameraActive ? (
            <div className={styles.cameraActive}>
              <div className={styles.cameraFrame}></div>
              <div className={styles.cameraOverlay}>
                <div className={styles.scanLine}></div>
              </div>
            </div>
          ) : (
            <div className={styles.cameraInactive}>
              <span className={styles.cameraIcon}>📷</span>
              <p>Camera is inactive</p>
            </div>
          )}
        </div>
        <button 
          className={styles.cameraToggle}
          onClick={toggleCamera}
        >
          {cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
      </div>

      <div className={styles.scanControls}>
        <h2 className={styles.sectionTitle}>Select Waste Type</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.wasteTypeGrid}>
          {Object.entries(wasteTypes).map(([type, info]) => (
            <button
              key={type}
              className={`${styles.wasteTypeButton} ${selectedWasteType === type ? styles.selectedWasteType : ''}`}
              onClick={() => handleWasteTypeSelect(type as WasteType)}
            >
              <span className={styles.wasteTypeIcon}>
                {type === 'plastic' && '🥤'}
                {type === 'paper' && '📄'}
                {type === 'glass' && '🥃'}
                {type === 'metal' && '🥫'}
                {type === 'electronics' && '📱'}
                {type === 'other' && '♻️'}
              </span>
              <span className={styles.wasteTypeName}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              <span className={styles.wasteTypePoints}>{info.points} pts</span>
            </button>
          ))}
        </div>

        {scanResult ? (
          <div className={styles.scanResult}>
            <h3 className={styles.resultTitle}>Scan Result</h3>
            <div className={styles.resultContent}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Waste Type:</span>
                <span className={styles.resultValue}>{scanResult.type.charAt(0).toUpperCase() + scanResult.type.slice(1)}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Description:</span>
                <span className={styles.resultValue}>{scanResult.description}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Points Earned:</span>
                <span className={styles.resultValue}>{scanResult.points}</span>
              </div>
            </div>
            <div className={styles.resultActions}>
              <button className={styles.resetButton} onClick={handleReset}>
                Scan Another Item
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.scanActions}>
            <button 
              className={styles.scanButton}
              onClick={handleScan}
              disabled={!selectedWasteType || scanning}
            >
              {scanning ? 'Scanning...' : 'Scan Item'}
            </button>
          </div>
        )}
      </div>

      <div className={styles.pointsSummary}>
        <h2 className={styles.sectionTitle}>Your Points Summary</h2>
        <div className={styles.pointsGrid}>
          <div className={styles.pointsCard}>
            <div className={styles.pointsIcon}>🏆</div>
            <div className={styles.pointsInfo}>
              <h3 className={styles.pointsTitle}>Current Rank</h3>
              <p className={styles.pointsValue}>{user?.rank || 'Bronze'}</p>
            </div>
          </div>
          <div className={styles.pointsCard}>
            <div className={styles.pointsIcon}>📊</div>
            <div className={styles.pointsInfo}>
              <h3 className={styles.pointsTitle}>Total Points</h3>
              <p className={styles.pointsValue}>{user?.points || 0}</p>
            </div>
          </div>
          <div className={styles.pointsCard}>
            <div className={styles.pointsIcon}>📱</div>
            <div className={styles.pointsInfo}>
              <h3 className={styles.pointsTitle}>Scanned Items</h3>
              <p className={styles.pointsValue}>{user?.scannedItems || 0}</p>
            </div>
          </div>
          <div className={styles.pointsCard}>
            <div className={styles.pointsIcon}>🎁</div>
            <div className={styles.pointsInfo}>
              <h3 className={styles.pointsTitle}>Available Rewards</h3>
              <p className={styles.pointsValue}>{user?.rewards || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 