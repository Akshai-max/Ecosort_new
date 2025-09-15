'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Play, 
  CheckCircle, 
  X, 
  Bot, 
  FileText, 
  Wine, 
  Package, 
  Smartphone, 
  Recycle
} from 'lucide-react';
import styles from './TaskAssignment.module.css';

interface Task {
  id: string;
  zoneId: string;
  zoneName: string;
  assignedTo: string;
  assignedToName: string;
  wasteType: 'plastic' | 'paper' | 'glass' | 'metal' | 'electronics' | 'other';
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

interface Zone {
  id: string;
  name: string;
  type: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  zoneId: string;
  status: string;
}

interface TaskAssignmentProps {
  managerId?: string;
}

export default function TaskAssignment({ managerId }: TaskAssignmentProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [filters, setFilters] = useState({
    wasteType: 'all',
    status: 'all',
    zone: 'all'
  });
  const [assignFormData, setAssignFormData] = useState({
    zoneId: '',
    assignedTo: '',
    wasteType: 'plastic' as Task['wasteType'],
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [managerId]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchTasks(),
        fetchZones(),
        fetchEmployees()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/tasks/${managerId}`);
    // const data = await response.json();
    
    // Mock data
    setTasks([
      {
        id: 'T001',
        zoneId: 'Z001',
        zoneName: 'Downtown Residential',
        assignedTo: 'E001',
        assignedToName: 'John Doe',
        wasteType: 'plastic',
        description: 'Collect plastic waste from residential buildings',
        priority: 'high',
        status: 'in_progress',
        dueDate: '2024-01-15T14:00:00',
        createdAt: '2024-01-14T09:00:00',
        notes: 'Focus on high-rise buildings'
      },
      {
        id: 'T002',
        zoneId: 'Z002',
        zoneName: 'Business District',
        assignedTo: 'E002',
        assignedToName: 'Jane Smith',
        wasteType: 'paper',
        description: 'Sort paper waste in commercial area',
        priority: 'medium',
        status: 'pending',
        dueDate: '2024-01-16T10:00:00',
        createdAt: '2024-01-14T10:30:00'
      },
      {
        id: 'T003',
        zoneId: 'Z003',
        zoneName: 'Industrial Park',
        assignedTo: 'E003',
        assignedToName: 'Mike Johnson',
        wasteType: 'metal',
        description: 'Collect metal scraps from industrial facilities',
        priority: 'high',
        status: 'completed',
        dueDate: '2024-01-14T16:00:00',
        createdAt: '2024-01-14T08:00:00',
        completedAt: '2024-01-14T15:30:00'
      },
      {
        id: 'T004',
        zoneId: 'Z001',
        zoneName: 'Downtown Residential',
        assignedTo: 'E004',
        assignedToName: 'Sarah Wilson',
        wasteType: 'glass',
        description: 'Sort glass containers from residential waste',
        priority: 'low',
        status: 'cancelled',
        dueDate: '2024-01-13T12:00:00',
        createdAt: '2024-01-12T14:00:00',
        notes: 'Cancelled due to equipment malfunction'
      },
      {
        id: 'T005',
        zoneId: 'Z004',
        zoneName: 'Mixed Use Area',
        assignedTo: 'E005',
        assignedToName: 'Tom Brown',
        wasteType: 'electronics',
        description: 'Collect electronic waste from mixed use buildings',
        priority: 'medium',
        status: 'pending',
        dueDate: '2024-01-17T11:00:00',
        createdAt: '2024-01-14T11:15:00'
      }
    ]);
  };

  const fetchZones = async () => {
    // TODO: Replace with actual API call
    setZones([
      { id: 'Z001', name: 'Downtown Residential', type: 'residential' },
      { id: 'Z002', name: 'Business District', type: 'commercial' },
      { id: 'Z003', name: 'Industrial Park', type: 'industrial' },
      { id: 'Z004', name: 'Mixed Use Area', type: 'mixed' }
    ]);
  };

  const fetchEmployees = async () => {
    // TODO: Replace with actual API call
    setEmployees([
      { id: 'E001', firstName: 'John', lastName: 'Doe', zoneId: 'Z001', status: 'active' },
      { id: 'E002', firstName: 'Jane', lastName: 'Smith', zoneId: 'Z002', status: 'active' },
      { id: 'E003', firstName: 'Mike', lastName: 'Johnson', zoneId: 'Z003', status: 'active' },
      { id: 'E004', firstName: 'Sarah', lastName: 'Wilson', zoneId: 'Z001', status: 'active' },
      { id: 'E005', firstName: 'Tom', lastName: 'Brown', zoneId: 'Z004', status: 'active' }
    ]);
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/task/assign', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...assignFormData, managerId })
      // });
      
      const assignedEmployee = employees.find(emp => emp.id === assignFormData.assignedTo);
      const selectedZone = zones.find(zone => zone.id === assignFormData.zoneId);
      
      const newTask: Task = {
        id: `T${String(tasks.length + 1).padStart(3, '0')}`,
        zoneId: assignFormData.zoneId,
        zoneName: selectedZone?.name || '',
        assignedTo: assignFormData.assignedTo,
        assignedToName: assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : '',
        wasteType: assignFormData.wasteType,
        description: assignFormData.description,
        priority: assignFormData.priority,
        status: 'pending',
        dueDate: assignFormData.dueDate,
        createdAt: new Date().toISOString(),
        notes: assignFormData.notes
      };
      
      setTasks([newTask, ...tasks]);
      setShowAssignForm(false);
      resetForm();
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/tasks/${taskId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
            }
          : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const resetForm = () => {
    setAssignFormData({
      zoneId: '',
      assignedTo: '',
      wasteType: 'plastic',
      description: '',
      priority: 'medium',
      dueDate: '',
      notes: ''
    });
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const wasteTypeMatch = filters.wasteType === 'all' || task.wasteType === filters.wasteType;
      const statusMatch = filters.status === 'all' || task.status === filters.status;
      const zoneMatch = filters.zone === 'all' || task.zoneId === filters.zone;
      
      return wasteTypeMatch && statusMatch && zoneMatch;
    });
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
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

  const getWasteTypeIcon = (wasteType: Task['wasteType']) => {
    switch (wasteType) {
      case 'plastic':
        return <Bot className={styles.wasteIcon} />;
      case 'paper':
        return <FileText className={styles.wasteIcon} />;
      case 'glass':
        return <Wine className={styles.wasteIcon} />;
      case 'metal':
        return <Package className={styles.wasteIcon} />;
      case 'electronics':
        return <Smartphone className={styles.wasteIcon} />;
      case 'other':
        return <Recycle className={styles.wasteIcon} />;
      default:
        return <Recycle className={styles.wasteIcon} />;
    }
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className={styles.taskAssignment}>
      <div className={styles.header}>
        <h2 className={styles.title}>Task Assignment & Scheduling</h2>
        <button 
          className={styles.assignButton}
          onClick={() => setShowAssignForm(true)}
        >
          <Plus className={styles.buttonIcon} />
          Assign New Task
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Waste Type</label>
          <select
            className={styles.filterSelect}
            value={filters.wasteType}
            onChange={(e) => setFilters({ ...filters, wasteType: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="glass">Glass</option>
            <option value="metal">Metal</option>
            <option value="electronics">Electronics</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            className={styles.filterSelect}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Zone</label>
          <select
            className={styles.filterSelect}
            value={filters.zone}
            onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
          >
            <option value="all">All Zones</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>{zone.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Assignment Form Modal */}
      {showAssignForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Assign New Task</h3>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowAssignForm(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAssignTask}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Zone</label>
                  <select
                    className={styles.select}
                    value={assignFormData.zoneId}
                    onChange={(e) => setAssignFormData({ ...assignFormData, zoneId: e.target.value })}
                    required
                  >
                    <option value="">Select Zone</option>
                    {zones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Assign To</label>
                  <select
                    className={styles.select}
                    value={assignFormData.assignedTo}
                    onChange={(e) => setAssignFormData({ ...assignFormData, assignedTo: e.target.value })}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Waste Type</label>
                  <select
                    className={styles.select}
                    value={assignFormData.wasteType}
                    onChange={(e) => setAssignFormData({ ...assignFormData, wasteType: e.target.value as Task['wasteType'] })}
                    required
                  >
                    <option value="plastic">Plastic</option>
                    <option value="paper">Paper</option>
                    <option value="glass">Glass</option>
                    <option value="metal">Metal</option>
                    <option value="electronics">Electronics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Priority</label>
                  <select
                    className={styles.select}
                    value={assignFormData.priority}
                    onChange={(e) => setAssignFormData({ ...assignFormData, priority: e.target.value as Task['priority'] })}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Task Description</label>
                  <textarea
                    className={styles.textarea}
                    value={assignFormData.description}
                    onChange={(e) => setAssignFormData({ ...assignFormData, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Due Date</label>
                  <input
                    type="datetime-local"
                    className={styles.input}
                    value={assignFormData.dueDate}
                    onChange={(e) => setAssignFormData({ ...assignFormData, dueDate: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Notes</label>
                  <textarea
                    className={styles.textarea}
                    value={assignFormData.notes}
                    onChange={(e) => setAssignFormData({ ...assignFormData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowAssignForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div className={styles.tasksTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Task ID</div>
          <div className={styles.tableCell}>Waste Type</div>
          <div className={styles.tableCell}>Description</div>
          <div className={styles.tableCell}>Zone</div>
          <div className={styles.tableCell}>Assigned To</div>
          <div className={styles.tableCell}>Priority</div>
          <div className={styles.tableCell}>Status</div>
          <div className={styles.tableCell}>Due Date</div>
          <div className={styles.tableCell}>Actions</div>
        </div>

        {filteredTasks.map((task) => (
          <div key={task.id} className={styles.tableRow}>
            <div className={styles.tableCell}>{task.id}</div>
            <div className={styles.tableCell}>
              <div className={styles.wasteType}>
                <span className={styles.wasteIcon}>{getWasteTypeIcon(task.wasteType)}</span>
                <span className={styles.wasteName}>{task.wasteType}</span>
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.description}>{task.description}</div>
              {task.notes && (
                <div className={styles.notes}>{task.notes}</div>
              )}
            </div>
            <div className={styles.tableCell}>{task.zoneName}</div>
            <div className={styles.tableCell}>{task.assignedToName}</div>
            <div className={styles.tableCell}>
              <span 
                className={styles.priorityBadge}
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
            </div>
            <div className={styles.tableCell}>
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(task.status) }}
              >
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.dueDate}>
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <div className={styles.dueTime}>
                {new Date(task.dueDate).toLocaleTimeString()}
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.actions}>
                {task.status === 'pending' && (
                  <button 
                    className={styles.startButton}
                    onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                  >
                    <Play className={styles.buttonIcon} />
                    Start
                  </button>
                )}
                {task.status === 'in_progress' && (
                  <button 
                    className={styles.completeButton}
                    onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                  >
                    <CheckCircle className={styles.buttonIcon} />
                    Complete
                  </button>
                )}
                {(task.status === 'pending' || task.status === 'in_progress') && (
                  <button 
                    className={styles.cancelButton}
                    onClick={() => handleUpdateTaskStatus(task.id, 'cancelled')}
                  >
                    <X className={styles.buttonIcon} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileText className={styles.emptyIconSvg} />
          </div>
          <h3>No tasks found</h3>
          <p>Try adjusting your filters or assign a new task.</p>
        </div>
      )}
    </div>
  );
}
