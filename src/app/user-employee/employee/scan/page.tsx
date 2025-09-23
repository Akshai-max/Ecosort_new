'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ScanBarcode, 
  Camera, 
  Upload, 
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle,
  X,
  Plus,
  Trash2,
  FileText,
  Image as ImageIcon,
  Send
} from 'lucide-react';
import styles from './scan.module.css';

interface WasteItem {
  id: string;
  category: string;
  subcategory: string;
  weight: number;
  points: number;
  scannedAt: string;
  location: string;
  image?: string;
}

interface Issue {
  id: string;
  type: string;
  description: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'reported' | 'resolved';
  reportedAt: string;
  image?: string;
}

interface ScanSession {
  id: string;
  startTime: string;
  endTime?: string;
  location: string;
  items: WasteItem[];
  issues: Issue[];
  totalPoints: number;
  status: 'active' | 'completed';
}

export default function EmployeeScanPage() {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<ScanSession | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'waste' | 'issue'>('waste');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [wasteForm, setWasteForm] = useState({
    category: '',
    subcategory: '',
    weight: '',
    location: '',
    notes: ''
  });

  const [issueForm, setIssueForm] = useState({
    type: '',
    description: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: ''
  });

  const wasteCategories = [
    { value: 'plastic', label: 'Plastic', subcategories: ['Bottles', 'Containers', 'Bags', 'Packaging'], points: 10 },
    { value: 'paper', label: 'Paper', subcategories: ['Newspaper', 'Cardboard', 'Office Paper', 'Magazines'], points: 8 },
    { value: 'metal', label: 'Metal', subcategories: ['Aluminum Cans', 'Steel Cans', 'Scrap Metal', 'Foil'], points: 15 },
    { value: 'glass', label: 'Glass', subcategories: ['Bottles', 'Jars', 'Broken Glass', 'Mirrors'], points: 12 },
    { value: 'organic', label: 'Organic', subcategories: ['Food Waste', 'Garden Waste', 'Compost', 'Wood'], points: 5 },
    { value: 'electronic', label: 'Electronic', subcategories: ['Batteries', 'Phones', 'Computers', 'Appliances'], points: 25 },
    { value: 'hazardous', label: 'Hazardous', subcategories: ['Chemicals', 'Paint', 'Oil', 'Medical'], points: 30 }
  ];

  const issueTypes = [
    { value: 'blocked_route', label: 'Blocked Route', priority: 'high' },
    { value: 'broken_bin', label: 'Broken Bin', priority: 'medium' },
    { value: 'overflowing_waste', label: 'Overflowing Waste', priority: 'high' },
    { value: 'equipment_malfunction', label: 'Equipment Malfunction', priority: 'high' },
    { value: 'safety_hazard', label: 'Safety Hazard', priority: 'high' },
    { value: 'schedule_conflict', label: 'Schedule Conflict', priority: 'low' },
    { value: 'other', label: 'Other', priority: 'medium' }
  ];

  useEffect(() => {
    // Initialize or resume scan session
    initializeScanSession();
  }, []);

  const initializeScanSession = async () => {
    try {
      // Check for existing active session or create new one
      const existingSession = localStorage.getItem('currentScanSession');
      if (existingSession) {
        setCurrentSession(JSON.parse(existingSession));
      } else {
        const newSession: ScanSession = {
          id: `SESSION_${Date.now()}`,
          startTime: new Date().toISOString(),
          location: 'Downtown Zone', // Get from employee data
          items: [],
          issues: [],
          totalPoints: 0,
          status: 'active'
        };
        setCurrentSession(newSession);
        localStorage.setItem('currentScanSession', JSON.stringify(newSession));
      }
    } catch (err) {
      console.error('Failed to initialize scan session:', err);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setShowCamera(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setShowCamera(false);
  };

  const handleWasteScan = async () => {
    try {
      setLoading(true);
      
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock scanned item
      const scannedItem: WasteItem = {
        id: `ITEM_${Date.now()}`,
        category: wasteForm.category,
        subcategory: wasteForm.subcategory,
        weight: parseFloat(wasteForm.weight) || 0,
        points: wasteCategories.find(cat => cat.value === wasteForm.category)?.points || 0,
        scannedAt: new Date().toISOString(),
        location: wasteForm.location || 'Current Location'
      };

      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          items: [...currentSession.items, scannedItem],
          totalPoints: currentSession.totalPoints + scannedItem.points
        };
        setCurrentSession(updatedSession);
        localStorage.setItem('currentScanSession', JSON.stringify(updatedSession));
      }

      // Reset form
      setWasteForm({
        category: '',
        subcategory: '',
        weight: '',
        location: '',
        notes: ''
      });

      setShowCamera(false);
      setIsScanning(false);
    } catch (err) {
      setError('Failed to scan waste item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueReport = async () => {
    try {
      setLoading(true);
      
      const newIssue: Issue = {
        id: `ISSUE_${Date.now()}`,
        type: issueForm.type,
        description: issueForm.description,
        location: issueForm.location || 'Current Location',
        priority: issueForm.priority,
        status: 'reported',
        reportedAt: new Date().toISOString()
      };

      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          issues: [...currentSession.issues, newIssue]
        };
        setCurrentSession(updatedSession);
        localStorage.setItem('currentScanSession', JSON.stringify(updatedSession));
      }

      // Reset form
      setIssueForm({
        type: '',
        description: '',
        location: '',
        priority: 'medium',
        notes: ''
      });

      // TODO: Send issue report to manager
      console.log('Issue reported:', newIssue);
    } catch (err) {
      setError('Failed to report issue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async () => {
    try {
      if (!currentSession) return;

      setLoading(true);
      
      const completedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        status: 'completed' as const
      };

      // TODO: Submit session to backend
      console.log('Session completed:', completedSession);
      
      // Clear session
      setCurrentSession(null);
      localStorage.removeItem('currentScanSession');
      
      // Show success message
      alert(`Session completed! Total points earned: ${completedSession.totalPoints}`);
      
    } catch (err) {
      setError('Failed to complete session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (itemId: string) => {
    if (!currentSession) return;
    
    const item = currentSession.items.find(item => item.id === itemId);
    if (!item) return;

    const updatedSession = {
      ...currentSession,
      items: currentSession.items.filter(item => item.id !== itemId),
      totalPoints: currentSession.totalPoints - item.points
    };
    
    setCurrentSession(updatedSession);
    localStorage.setItem('currentScanSession', JSON.stringify(updatedSession));
  };

  const removeIssue = (issueId: string) => {
    if (!currentSession) return;
    
    const updatedSession = {
      ...currentSession,
      issues: currentSession.issues.filter(issue => issue.id !== issueId)
    };
    
    setCurrentSession(updatedSession);
    localStorage.setItem('currentScanSession', JSON.stringify(updatedSession));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Processing...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <ScanBarcode className={styles.titleIcon} />
            Scan & Report
          </h1>
          <p className={styles.subtitle}>Scan waste items and report issues in your zone</p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.sessionInfo}>
            <div className={styles.sessionStat}>
              <span className={styles.statValue}>{currentSession?.items.length || 0}</span>
              <span className={styles.statLabel}>Items Scanned</span>
            </div>
            <div className={styles.sessionStat}>
              <span className={styles.statValue}>{currentSession?.issues.length || 0}</span>
              <span className={styles.statLabel}>Issues Reported</span>
            </div>
            <div className={styles.sessionStat}>
              <span className={styles.statValue}>{currentSession?.totalPoints || 0}</span>
              <span className={styles.statLabel}>Points Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeButton} ${scanMode === 'waste' ? styles.activeMode : ''}`}
          onClick={() => setScanMode('waste')}
        >
          <ScanBarcode className={styles.modeIcon} />
          Scan Waste
        </button>
        <button
          className={`${styles.modeButton} ${scanMode === 'issue' ? styles.activeMode : ''}`}
          onClick={() => setScanMode('issue')}
        >
          <AlertTriangle className={styles.modeIcon} />
          Report Issue
        </button>
      </div>

      {/* Scan Interface */}
      <div className={styles.scanInterface}>
        {scanMode === 'waste' ? (
          <div className={styles.wasteScanForm}>
            <h2 className={styles.formTitle}>Waste Item Scan</h2>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category *</label>
                <select
                  value={wasteForm.category}
                  onChange={(e) => {
                    setWasteForm({...wasteForm, category: e.target.value, subcategory: ''});
                  }}
                  className={styles.formSelect}
                  required
                >
                  <option value="">Select Category</option>
                  {wasteCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label} (+{category.points} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subcategory *</label>
                <select
                  value={wasteForm.subcategory}
                  onChange={(e) => setWasteForm({...wasteForm, subcategory: e.target.value})}
                  className={styles.formSelect}
                  required
                  disabled={!wasteForm.category}
                >
                  <option value="">Select Subcategory</option>
                  {wasteForm.category && wasteCategories
                    .find(cat => cat.value === wasteForm.category)
                    ?.subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))
                  }
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={wasteForm.weight}
                  onChange={(e) => setWasteForm({...wasteForm, weight: e.target.value})}
                  className={styles.formInput}
                  placeholder="0.0"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location</label>
                <input
                  type="text"
                  value={wasteForm.location}
                  onChange={(e) => setWasteForm({...wasteForm, location: e.target.value})}
                  className={styles.formInput}
                  placeholder="Current location or specific address"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Notes</label>
              <textarea
                value={wasteForm.notes}
                onChange={(e) => setWasteForm({...wasteForm, notes: e.target.value})}
                className={styles.formTextarea}
                placeholder="Additional notes about the waste item..."
                rows={3}
              />
            </div>

            <div className={styles.scanActions}>
              <button
                className={styles.cameraButton}
                onClick={startScanning}
                disabled={!wasteForm.category || !wasteForm.subcategory || !wasteForm.weight}
              >
                <Camera className={styles.actionIcon} />
                {isScanning ? 'Scanning...' : 'Scan Item'}
              </button>
              
              <button
                className={styles.manualButton}
                onClick={handleWasteScan}
                disabled={!wasteForm.category || !wasteForm.subcategory || !wasteForm.weight}
              >
                <Plus className={styles.actionIcon} />
                Add Manually
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.issueReportForm}>
            <h2 className={styles.formTitle}>Issue Report</h2>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Issue Type *</label>
                <select
                  value={issueForm.type}
                  onChange={(e) => {
                    const selectedType = issueTypes.find(type => type.value === e.target.value);
                    setIssueForm({
                      ...issueForm, 
                      type: e.target.value,
                      priority: (selectedType?.priority as 'low' | 'medium' | 'high') || 'medium'
                    });
                  }}
                  className={styles.formSelect}
                  required
                >
                  <option value="">Select Issue Type</option>
                  {issueTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Priority *</label>
                <select
                  value={issueForm.priority}
                  onChange={(e) => setIssueForm({...issueForm, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className={styles.formSelect}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location</label>
                <input
                  type="text"
                  value={issueForm.location}
                  onChange={(e) => setIssueForm({...issueForm, location: e.target.value})}
                  className={styles.formInput}
                  placeholder="Specific location of the issue"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description *</label>
              <textarea
                value={issueForm.description}
                onChange={(e) => setIssueForm({...issueForm, description: e.target.value})}
                className={styles.formTextarea}
                placeholder="Describe the issue in detail..."
                rows={4}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Additional Notes</label>
              <textarea
                value={issueForm.notes}
                onChange={(e) => setIssueForm({...issueForm, notes: e.target.value})}
                className={styles.formTextarea}
                placeholder="Any additional information..."
                rows={2}
              />
            </div>

            <div className={styles.scanActions}>
              <button
                className={styles.cameraButton}
                onClick={() => setShowCamera(true)}
                disabled={!issueForm.type || !issueForm.description}
              >
                <Camera className={styles.actionIcon} />
                Take Photo
              </button>
              
              <button
                className={styles.reportButton}
                onClick={handleIssueReport}
                disabled={!issueForm.type || !issueForm.description}
              >
                <Send className={styles.actionIcon} />
                Report Issue
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Current Session */}
      {currentSession && (currentSession.items.length > 0 || currentSession.issues.length > 0) && (
        <div className={styles.sessionSummary}>
          <div className={styles.summaryHeader}>
            <h2 className={styles.summaryTitle}>Current Session</h2>
            <div className={styles.sessionTime}>
              <Clock className={styles.timeIcon} />
              Started at {formatTime(currentSession.startTime)}
            </div>
          </div>

          {/* Scanned Items */}
          {currentSession.items.length > 0 && (
            <div className={styles.itemsSection}>
              <h3 className={styles.sectionTitle}>Scanned Items ({currentSession.items.length})</h3>
              <div className={styles.itemsList}>
                {currentSession.items.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemTitle}>
                        {wasteCategories.find(cat => cat.value === item.category)?.label} - {item.subcategory}
                      </h4>
                      <p className={styles.itemDetails}>
                        Weight: {item.weight}kg • Location: {item.location} • {formatTime(item.scannedAt)}
                      </p>
                    </div>
                    <div className={styles.itemActions}>
                      <span className={styles.itemPoints}>+{item.points} pts</span>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className={styles.removeIcon} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reported Issues */}
          {currentSession.issues.length > 0 && (
            <div className={styles.issuesSection}>
              <h3 className={styles.sectionTitle}>Reported Issues ({currentSession.issues.length})</h3>
              <div className={styles.issuesList}>
                {currentSession.issues.map((issue) => (
                  <div key={issue.id} className={styles.issueCard}>
                    <div className={styles.issueInfo}>
                      <h4 className={styles.issueTitle}>
                        {issueTypes.find(type => type.value === issue.type)?.label}
                      </h4>
                      <p className={styles.issueDescription}>{issue.description}</p>
                      <p className={styles.issueDetails}>
                        Location: {issue.location} • {formatTime(issue.reportedAt)}
                      </p>
                    </div>
                    <div className={styles.issueActions}>
                      <span 
                        className={styles.priorityBadge}
                        style={{ backgroundColor: getPriorityColor(issue.priority) }}
                      >
                        {issue.priority}
                      </span>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeIssue(issue.id)}
                      >
                        <Trash2 className={styles.removeIcon} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session Actions */}
          <div className={styles.sessionActions}>
            <button
              className={styles.completeButton}
              onClick={completeSession}
            >
              <CheckCircle className={styles.actionIcon} />
              Complete Session ({currentSession.totalPoints} points)
            </button>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className={styles.cameraModal}>
          <div className={styles.cameraOverlay} onClick={() => setShowCamera(false)}>
            <div className={styles.cameraContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.cameraHeader}>
                <h3>Camera</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowCamera(false)}
                >
                  <X className={styles.closeIcon} />
                </button>
              </div>
              <div className={styles.cameraBody}>
                <div className={styles.cameraPlaceholder}>
                  <Camera className={styles.cameraIcon} />
                  <p>Camera functionality would be implemented here</p>
                  <p>For now, this is a placeholder</p>
                </div>
              </div>
              <div className={styles.cameraFooter}>
                <button 
                  className={styles.captureButton}
                  onClick={() => {
                    setShowCamera(false);
                    // Handle photo capture
                  }}
                >
                  Capture Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={styles.errorBanner}>
          <AlertTriangle className={styles.errorIcon} />
          <span>{error}</span>
          <button 
            className={styles.errorClose}
            onClick={() => setError('')}
          >
            <X className={styles.closeIcon} />
          </button>
        </div>
      )}
    </div>
  );
}
