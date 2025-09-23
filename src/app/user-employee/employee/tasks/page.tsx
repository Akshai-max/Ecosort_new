'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Play,
  Pause,
  Upload,
  Eye,
  Filter,
  Search,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import styles from './tasks.module.css';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedBy: string;
  zone: string;
  category: string;
  estimatedDuration: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  notes?: string;
}

interface TaskFilter {
  status: string;
  priority: string;
  category: string;
}

export default function EmployeeTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, filters]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/employee/tasks', { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 401) {
          return router.push('/user-employee/login');
        }
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      const mapped: Task[] = (data.tasks || []).map((t: any) => ({
        id: t.id || t.taskId,
        title: t.title,
        description: t.description,
        priority: t.priority,
        dueDate: (t.dueDate || '').toString().slice(0, 10),
        status: t.status,
        assignedBy: t.assignedBy,
        zone: t.zoneId,
        category: t.tags?.[0] || 'General',
        estimatedDuration: t.estimatedDuration,
        points: t.points || 0,
        createdAt: (t.createdAt || '').toString().slice(0, 10),
        updatedAt: (t.updatedAt || '').toString().slice(0, 10),
        attachments: t.proofOfWork,
        notes: t.notes,
      }));
      setTasks(mapped);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    setFilteredTasks(filtered);
  };

  const handleTaskAction = async (taskId: string, action: string) => {
    try {
      // Update task status
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          let newStatus = task.status;
          switch (action) {
            case 'start':
              newStatus = 'in_progress';
              break;
            case 'complete':
              newStatus = 'completed';
              break;
            case 'pause':
              newStatus = 'pending';
              break;
          }
          return { ...task, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      
      // TODO: Make API call to update task status
      console.log(`Task ${taskId} ${action}ed`);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#3b82f6';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className={styles.statusIcon} />;
      case 'in_progress':
        return <Clock className={styles.statusIcon} />;
      case 'pending':
        return <AlertTriangle className={styles.statusIcon} />;
      default:
        return <AlertTriangle className={styles.statusIcon} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading tasks...</p>
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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <ClipboardList className={styles.titleIcon} />
            My Tasks
          </h1>
          <p className={styles.subtitle}>Manage your assigned tasks and track progress</p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.taskStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.inProgress}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.pending}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className={styles.filterSelect}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className={styles.filterSelect}
            >
              <option value="all">All Categories</option>
              <option value="Collection">Collection</option>
              <option value="Sorting">Sorting</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Administrative">Administrative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className={styles.tasksContainer}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <ClipboardList className={styles.emptyIcon} />
            <h3>No tasks found</h3>
            <p>No tasks match your current filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className={styles.tasksList}>
            {filteredTasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskTitleSection}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>
                    <div className={styles.taskBadges}>
                      <span 
                        className={styles.priorityBadge}
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority}
                      </span>
                      <span 
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className={styles.taskPoints}>
                    <span className={styles.pointsValue}>+{task.points}</span>
                    <span className={styles.pointsLabel}>points</span>
                  </div>
                </div>

                <div className={styles.taskBody}>
                  <p className={styles.taskDescription}>{task.description}</p>
                  
                  <div className={styles.taskDetails}>
                    <div className={styles.detailItem}>
                      <Calendar className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Due:</span>
                      <span className={styles.detailValue}>{formatDate(task.dueDate)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <User className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Assigned by:</span>
                      <span className={styles.detailValue}>{task.assignedBy}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <MapPin className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Zone:</span>
                      <span className={styles.detailValue}>{task.zone}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <Clock className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Duration:</span>
                      <span className={styles.detailValue}>{task.estimatedDuration}</span>
                    </div>
                  </div>

                  {task.notes && (
                    <div className={styles.taskNotes}>
                      <strong>Notes:</strong> {task.notes}
                    </div>
                  )}

                  {task.attachments && task.attachments.length > 0 && (
                    <div className={styles.taskAttachments}>
                      <strong>Attachments:</strong>
                      <div className={styles.attachmentsList}>
                        {task.attachments.map((attachment, index) => (
                          <span key={index} className={styles.attachmentItem}>
                            {attachment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.taskFooter}>
                  <div className={styles.taskActions}>
                    {task.status === 'pending' && (
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleTaskAction(task.id, 'start')}
                      >
                        <Play className={styles.actionIcon} />
                        Start Task
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <button 
                          className={styles.actionButton}
                          onClick={() => handleTaskAction(task.id, 'complete')}
                        >
                          <CheckCircle className={styles.actionIcon} />
                          Complete
                        </button>
                        <button 
                          className={styles.secondaryButton}
                          onClick={() => handleTaskAction(task.id, 'pause')}
                        >
                          <Pause className={styles.actionIcon} />
                          Pause
                        </button>
                      </>
                    )}
                    <button 
                      className={styles.viewButton}
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskModal(true);
                      }}
                    >
                      <Eye className={styles.actionIcon} />
                      View Details
                    </button>
                    <button className={styles.uploadButton}>
                      <Upload className={styles.actionIcon} />
                      Upload Proof
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <div className={styles.modalOverlay} onClick={() => setShowTaskModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedTask.title}</h2>
              <button 
                className={styles.modalClose}
                onClick={() => setShowTaskModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3>Description</h3>
                <p>{selectedTask.description}</p>
              </div>
              
              <div className={styles.modalSection}>
                <h3>Task Details</h3>
                <div className={styles.modalDetails}>
                  <div className={styles.modalDetailItem}>
                    <strong>Priority:</strong> 
                    <span style={{ color: getPriorityColor(selectedTask.priority) }}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  <div className={styles.modalDetailItem}>
                    <strong>Status:</strong> 
                    <span style={{ color: getStatusColor(selectedTask.status) }}>
                      {selectedTask.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className={styles.modalDetailItem}>
                    <strong>Due Date:</strong> {formatDate(selectedTask.dueDate)}
                  </div>
                  <div className={styles.modalDetailItem}>
                    <strong>Assigned By:</strong> {selectedTask.assignedBy}
                  </div>
                  <div className={styles.modalDetailItem}>
                    <strong>Zone:</strong> {selectedTask.zone}
                  </div>
                  <div className={styles.modalDetailItem}>
                    <strong>Category:</strong> {selectedTask.category}
                  </div>
                  <div className={styles.modalDetailItem}>
                    <strong>Estimated Duration:</strong> {selectedTask.estimatedDuration}
                  </div>
                  <div className={styles.modalDetailItem}>
                    <strong>Points:</strong> {selectedTask.points}
                  </div>
                </div>
              </div>
              
              {selectedTask.notes && (
                <div className={styles.modalSection}>
                  <h3>Notes</h3>
                  <p>{selectedTask.notes}</p>
                </div>
              )}
              
              {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                <div className={styles.modalSection}>
                  <h3>Attachments</h3>
                  <div className={styles.modalAttachments}>
                    {selectedTask.attachments.map((attachment, index) => (
                      <div key={index} className={styles.modalAttachment}>
                        {attachment}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalButton}
                onClick={() => setShowTaskModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
