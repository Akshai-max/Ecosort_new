'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  Wrench, 
  Shield, 
  Truck, 
  Leaf,
  FileText,
  UserPlus,
  Play,
  CheckCircle,
  X
} from 'lucide-react';
import styles from './IssuesMaintenance.module.css';

interface Issue {
  id: string;
  title: string;
  description: string;
  zoneId: string;
  zoneName: string;
  reportedBy: string;
  reportedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'equipment' | 'safety' | 'logistics' | 'environmental' | 'other';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachments?: string[];
  notes?: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  zoneId: string;
  status: string;
}

interface IssuesMaintenanceProps {
  managerId?: string;
}

export default function IssuesMaintenance({ managerId }: IssuesMaintenanceProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    zone: 'all'
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [assignFormData, setAssignFormData] = useState({
    assignedTo: '',
    notes: '',
    priority: 'medium' as Issue['priority']
  });

  useEffect(() => {
    fetchData();
  }, [managerId, fetchData]);

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        fetchIssues(),
        fetchEmployees()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  const fetchIssues = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/issues/${managerId}`);
    // const data = await response.json();
    
    // Mock data
    setIssues([
      {
        id: 'I001',
        title: 'Sorting Machine Malfunction',
        description: 'The plastic sorting machine in Zone A is not properly separating materials. Error code E-404 displayed.',
        zoneId: 'Z001',
        zoneName: 'Downtown Residential',
        reportedBy: 'E001',
        reportedByName: 'John Doe',
        assignedTo: 'E003',
        assignedToName: 'Mike Johnson',
        status: 'assigned',
        priority: 'high',
        category: 'equipment',
        createdAt: '2024-01-14T09:30:00',
        updatedAt: '2024-01-14T10:15:00',
        notes: 'Waiting for replacement parts to arrive'
      },
      {
        id: 'I002',
        title: 'Insufficient Collection Bins',
        description: 'Not enough collection bins in Zone B commercial area. Bins are overflowing.',
        zoneId: 'Z002',
        zoneName: 'Business District',
        reportedBy: 'E002',
        reportedByName: 'Jane Smith',
        status: 'open',
        priority: 'medium',
        category: 'logistics',
        createdAt: '2024-01-14T11:45:00',
        updatedAt: '2024-01-14T11:45:00'
      },
      {
        id: 'I003',
        title: 'Vehicle Breakdown',
        description: 'Collection vehicle broke down during route. Engine overheating issue.',
        zoneId: 'Z003',
        zoneName: 'Industrial Park',
        reportedBy: 'E003',
        reportedByName: 'Mike Johnson',
        assignedTo: 'E005',
        assignedToName: 'Tom Brown',
        status: 'resolved',
        priority: 'critical',
        category: 'equipment',
        createdAt: '2024-01-13T14:20:00',
        updatedAt: '2024-01-13T16:30:00',
        resolvedAt: '2024-01-13T16:30:00',
        notes: 'Vehicle repaired and back in service'
      },
      {
        id: 'I004',
        title: 'Schedule Conflict',
        description: 'Waste pickup schedule conflicts with local event. Need to reschedule.',
        zoneId: 'Z004',
        zoneName: 'Mixed Use Area',
        reportedBy: 'E004',
        reportedByName: 'Sarah Wilson',
        status: 'open',
        priority: 'low',
        category: 'logistics',
        createdAt: '2024-01-14T08:15:00',
        updatedAt: '2024-01-14T08:15:00'
      },
      {
        id: 'I005',
        title: 'Safety Hazard',
        description: 'Broken glass scattered near collection point. Safety risk for employees.',
        zoneId: 'Z001',
        zoneName: 'Downtown Residential',
        reportedBy: 'E001',
        reportedByName: 'John Doe',
        assignedTo: 'E004',
        assignedToName: 'Sarah Wilson',
        status: 'in_progress',
        priority: 'high',
        category: 'safety',
        createdAt: '2024-01-14T13:00:00',
        updatedAt: '2024-01-14T13:30:00',
        notes: 'Cleaning in progress, area cordoned off'
      }
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

  const handleAssignIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/issues/${selectedIssue.id}/assign`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(assignFormData)
      // });
      
      const assignedEmployee = employees.find(emp => emp.id === assignFormData.assignedTo);
      
      setIssues(issues.map(issue => 
        issue.id === selectedIssue.id 
          ? { 
              ...issue, 
              assignedTo: assignFormData.assignedTo,
              assignedToName: assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : '',
              status: 'assigned',
              priority: assignFormData.priority,
              notes: assignFormData.notes,
              updatedAt: new Date().toISOString()
            }
          : issue
      ));
      
      setShowAssignModal(false);
      setSelectedIssue(null);
      setAssignFormData({
        assignedTo: '',
        notes: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error assigning issue:', error);
    }
  };

  const handleUpdateStatus = async (issueId: string, newStatus: Issue['status']) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/issues/${issueId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      setIssues(issues.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              status: newStatus,
              resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined,
              updatedAt: new Date().toISOString()
            }
          : issue
      ));
    } catch (error) {
      console.error('Error updating issue status:', error);
    }
  };

  const getFilteredIssues = () => {
    return issues.filter(issue => {
      const statusMatch = filters.status === 'all' || issue.status === filters.status;
      const priorityMatch = filters.priority === 'all' || issue.priority === filters.priority;
      const categoryMatch = filters.category === 'all' || issue.category === filters.category;
      const zoneMatch = filters.zone === 'all' || issue.zoneId === filters.zone;
      
      return statusMatch && priorityMatch && categoryMatch && zoneMatch;
    });
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return '#ef4444';
      case 'assigned':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'critical':
        return '#dc2626';
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

  const getCategoryIcon = (category: Issue['category']) => {
    switch (category) {
      case 'equipment':
        return <Wrench className={styles.categoryIcon} />;
      case 'safety':
        return <Shield className={styles.categoryIcon} />;
      case 'logistics':
        return <Truck className={styles.categoryIcon} />;
      case 'environmental':
        return <Leaf className={styles.categoryIcon} />;
      case 'other':
        return <FileText className={styles.categoryIcon} />;
      default:
        return <FileText className={styles.categoryIcon} />;
    }
  };

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className={styles.statusIcon} />;
      case 'assigned':
        return <UserPlus className={styles.statusIcon} />;
      case 'in_progress':
        return <Play className={styles.statusIcon} />;
      case 'resolved':
        return <CheckCircle className={styles.statusIcon} />;
      case 'closed':
        return <X className={styles.statusIcon} />;
      default:
        return <AlertTriangle className={styles.statusIcon} />;
    }
  };

  const filteredIssues = getFilteredIssues();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading issues...</p>
      </div>
    );
  }

  return (
    <div className={styles.issuesMaintenance}>
      <div className={styles.header}>
        <h2 className={styles.title}>Issues & Maintenance</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{issues.length}</span>
            <span className={styles.statLabel}>Total Issues</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{issues.filter(i => i.status === 'open').length}</span>
            <span className={styles.statLabel}>Open</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{issues.filter(i => i.priority === 'critical' || i.priority === 'high').length}</span>
            <span className={styles.statLabel}>High Priority</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            className={styles.filterSelect}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Priority</label>
          <select
            className={styles.filterSelect}
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Category</label>
          <select
            className={styles.filterSelect}
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            <option value="equipment">Equipment</option>
            <option value="safety">Safety</option>
            <option value="logistics">Logistics</option>
            <option value="environmental">Environmental</option>
            <option value="other">Other</option>
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
            <option value="Z001">Downtown Residential</option>
            <option value="Z002">Business District</option>
            <option value="Z003">Industrial Park</option>
            <option value="Z004">Mixed Use Area</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className={styles.issuesTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Issue ID</div>
          <div className={styles.tableCell}>Title</div>
          <div className={styles.tableCell}>Category</div>
          <div className={styles.tableCell}>Zone</div>
          <div className={styles.tableCell}>Reported By</div>
          <div className={styles.tableCell}>Assigned To</div>
          <div className={styles.tableCell}>Priority</div>
          <div className={styles.tableCell}>Status</div>
          <div className={styles.tableCell}>Actions</div>
        </div>

        {filteredIssues.map((issue) => (
          <div key={issue.id} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <div className={styles.issueId}>{issue.id}</div>
              <div className={styles.issueDate}>
                {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.issueTitle}>{issue.title}</div>
              <div className={styles.issueDescription}>{issue.description}</div>
              {issue.notes && (
                <div className={styles.issueNotes}>
                  <strong>Notes:</strong> {issue.notes}
                </div>
              )}
            </div>
            <div className={styles.tableCell}>
              <div className={styles.category}>
                <span className={styles.categoryIcon}>{getCategoryIcon(issue.category)}</span>
                <span className={styles.categoryName}>{issue.category}</span>
              </div>
            </div>
            <div className={styles.tableCell}>{issue.zoneName}</div>
            <div className={styles.tableCell}>{issue.reportedByName}</div>
            <div className={styles.tableCell}>
              {issue.assignedToName || 'Unassigned'}
            </div>
            <div className={styles.tableCell}>
              <span 
                className={styles.priorityBadge}
                style={{ backgroundColor: getPriorityColor(issue.priority) }}
              >
                {issue.priority}
              </span>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.status}>
                <span className={styles.statusIcon}>{getStatusIcon(issue.status)}</span>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.actions}>
                {issue.status === 'open' && (
                  <button 
                    className={styles.assignButton}
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowAssignModal(true);
                    }}
                  >
                    <UserPlus className={styles.buttonIcon} />
                    Assign
                  </button>
                )}
                {issue.status === 'assigned' && (
                  <button 
                    className={styles.startButton}
                    onClick={() => handleUpdateStatus(issue.id, 'in_progress')}
                  >
                    <Play className={styles.buttonIcon} />
                    Start
                  </button>
                )}
                {issue.status === 'in_progress' && (
                  <button 
                    className={styles.resolveButton}
                    onClick={() => handleUpdateStatus(issue.id, 'resolved')}
                  >
                    <CheckCircle className={styles.buttonIcon} />
                    Resolve
                  </button>
                )}
                {issue.status === 'resolved' && (
                  <button 
                    className={styles.closeButton}
                    onClick={() => handleUpdateStatus(issue.id, 'closed')}
                  >
                    <X className={styles.buttonIcon} />
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileText className={styles.emptyIconSvg} />
          </div>
          <h3>No issues found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      )}

      {/* Assign Issue Modal */}
      {showAssignModal && selectedIssue && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Assign Issue: {selectedIssue.title}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedIssue(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAssignIssue}>
              <div className={styles.formGrid}>
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
                  <label className={styles.label}>Priority</label>
                  <select
                    className={styles.select}
                    value={assignFormData.priority}
                    onChange={(e) => setAssignFormData({ ...assignFormData, priority: e.target.value as Issue['priority'] })}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Notes</label>
                  <textarea
                    className={styles.textarea}
                    value={assignFormData.notes}
                    onChange={(e) => setAssignFormData({ ...assignFormData, notes: e.target.value })}
                    rows={3}
                    placeholder="Add any additional notes or instructions..."
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedIssue(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Assign Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
