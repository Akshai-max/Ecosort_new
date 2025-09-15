'use client';

import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  User
} from 'lucide-react';
import styles from './EmployeeManagement.module.css';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shift: 'morning' | 'afternoon' | 'night';
  currentTask: string | null;
  status: 'active' | 'inactive' | 'on_break' | 'off_duty';
  zoneId: string;
  zoneName: string;
  role: 'collector' | 'sorter' | 'supervisor';
  joinDate: string;
  performance: {
    tasksCompleted: number;
    efficiency: number;
    rating: number;
  };
}

interface Team {
  id: string;
  name: string;
  supervisor: Employee | null;
  employees: Employee[];
  totalTasks: number;
  completedTasks: number;
}

interface EmployeeManagementProps {
  managerId?: string;
}

export default function EmployeeManagement({ managerId }: EmployeeManagementProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [assignFormData, setAssignFormData] = useState({
    taskId: '',
    taskDescription: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, [managerId]);

  const fetchEmployees = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/manager/${managerId}/employees`);
      // const data = await response.json();
      
      // Mock data
      const mockEmployees: Employee[] = [
        {
          id: 'E001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@ecosort.com',
          phone: '555-0101',
          shift: 'morning',
          currentTask: 'Collect waste from Zone A',
          status: 'active',
          zoneId: 'Z001',
          zoneName: 'Downtown Residential',
          role: 'collector',
          joinDate: '2023-06-15',
          performance: { tasksCompleted: 45, efficiency: 92, rating: 4.5 }
        },
        {
          id: 'E002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@ecosort.com',
          phone: '555-0102',
          shift: 'afternoon',
          currentTask: null,
          status: 'on_break',
          zoneId: 'Z002',
          zoneName: 'Business District',
          role: 'sorter',
          joinDate: '2023-08-20',
          performance: { tasksCompleted: 38, efficiency: 88, rating: 4.2 }
        },
        {
          id: 'E003',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@ecosort.com',
          phone: '555-0103',
          shift: 'night',
          currentTask: 'Maintain sorting equipment',
          status: 'active',
          zoneId: 'Z003',
          zoneName: 'Industrial Park',
          role: 'supervisor',
          joinDate: '2023-03-10',
          performance: { tasksCompleted: 67, efficiency: 95, rating: 4.8 }
        },
        {
          id: 'E004',
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@ecosort.com',
          phone: '555-0104',
          shift: 'morning',
          currentTask: null,
          status: 'off_duty',
          zoneId: 'Z001',
          zoneName: 'Downtown Residential',
          role: 'collector',
          joinDate: '2023-09-05',
          performance: { tasksCompleted: 29, efficiency: 85, rating: 4.0 }
        },
        {
          id: 'E005',
          firstName: 'Tom',
          lastName: 'Brown',
          email: 'tom.brown@ecosort.com',
          phone: '555-0105',
          shift: 'afternoon',
          currentTask: 'Update waste inventory',
          status: 'active',
          zoneId: 'Z004',
          zoneName: 'Mixed Use Area',
          role: 'sorter',
          joinDate: '2023-11-12',
          performance: { tasksCompleted: 22, efficiency: 90, rating: 4.3 }
        }
      ];

      setEmployees(mockEmployees);
      
      // Group employees by teams (mock team structure)
      const mockTeams: Team[] = [
        {
          id: 'T001',
          name: 'Downtown Team',
          supervisor: mockEmployees.find(e => e.id === 'E003') || null,
          employees: mockEmployees.filter(e => e.zoneId === 'Z001'),
          totalTasks: 25,
          completedTasks: 22
        },
        {
          id: 'T002',
          name: 'Business District Team',
          supervisor: null,
          employees: mockEmployees.filter(e => e.zoneId === 'Z002'),
          totalTasks: 18,
          completedTasks: 15
        },
        {
          id: 'T003',
          name: 'Industrial Team',
          supervisor: null,
          employees: mockEmployees.filter(e => e.zoneId === 'Z003'),
          totalTasks: 30,
          completedTasks: 28
        },
        {
          id: 'T004',
          name: 'Mixed Use Team',
          supervisor: null,
          employees: mockEmployees.filter(e => e.zoneId === 'Z004'),
          totalTasks: 20,
          completedTasks: 18
        }
      ];

      setTeams(mockTeams);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/employee/assign', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     employeeId: selectedEmployee.id,
      //     ...assignFormData
      //   })
      // });
      
      // Update employee with new task
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, currentTask: assignFormData.taskDescription }
          : emp
      ));
      
      setShowAssignForm(false);
      setSelectedEmployee(null);
      setAssignFormData({
        taskId: '',
        taskDescription: '',
        priority: 'medium',
        dueDate: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'on_break':
        return '#f59e0b';
      case 'off_duty':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getShiftColor = (shift: Employee['shift']) => {
    switch (shift) {
      case 'morning':
        return '#3b82f6';
      case 'afternoon':
        return '#8b5cf6';
      case 'night':
        return '#1f2937';
      default:
        return '#6b7280';
    }
  };

  const getRoleColor = (role: Employee['role']) => {
    switch (role) {
      case 'supervisor':
        return '#f59e0b';
      case 'collector':
        return '#10b981';
      case 'sorter':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div className={styles.employeeManagement}>
      <div className={styles.header}>
        <h2 className={styles.title}>Employee Management</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{employees.length}</span>
            <span className={styles.statLabel}>Total Employees</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{employees.filter(e => e.status === 'active').length}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{teams.length}</span>
            <span className={styles.statLabel}>Teams</span>
          </div>
        </div>
      </div>

      {/* Employee Tree */}
      <div className={styles.employeeTree}>
        <h3 className={styles.sectionTitle}>Team Structure</h3>
        <div className={styles.treeContainer}>
          {teams.map((team) => (
            <div key={team.id} className={styles.teamNode}>
              <div className={styles.teamHeader}>
                <div className={styles.teamInfo}>
                  <h4 className={styles.teamName}>{team.name}</h4>
                  <div className={styles.teamStats}>
                    <span>{team.employees.length} employees</span>
                    <span>•</span>
                    <span>{team.completedTasks}/{team.totalTasks} tasks</span>
                  </div>
                </div>
                {team.supervisor && (
                  <div className={styles.supervisor}>
                    <span className={styles.supervisorLabel}>Supervisor:</span>
                    <span className={styles.supervisorName}>
                      {team.supervisor.firstName} {team.supervisor.lastName}
                    </span>
                  </div>
                )}
              </div>
              
              <div className={styles.employeesList}>
                {team.employees.map((employee) => (
                  <div key={employee.id} className={styles.employeeNode}>
                    <div className={styles.employeeInfo}>
                      <div className={styles.employeeAvatar}>
                        <User className={styles.avatarIcon} />
                      </div>
                      <div className={styles.employeeDetails}>
                        <div className={styles.employeeName}>
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className={styles.employeeMeta}>
                          <span 
                            className={styles.roleBadge}
                            style={{ backgroundColor: getRoleColor(employee.role) }}
                          >
                            {employee.role}
                          </span>
                          <span 
                            className={styles.shiftBadge}
                            style={{ backgroundColor: getShiftColor(employee.shift) }}
                          >
                            {employee.shift}
                          </span>
                          <span 
                            className={styles.statusBadge}
                            style={{ backgroundColor: getStatusColor(employee.status) }}
                          >
                            {employee.status.replace('_', ' ')}
                          </span>
                        </div>
                        {employee.currentTask && (
                          <div className={styles.currentTask}>
                            <strong>Current Task:</strong> {employee.currentTask}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.employeeActions}>
                      <button 
                        className={styles.assignButton}
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowAssignForm(true);
                        }}
                      >
                        <UserPlus className={styles.buttonIcon} />
                        Assign Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Table */}
      <div className={styles.employeeTable}>
        <h3 className={styles.sectionTitle}>All Employees</h3>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell}>Name</div>
            <div className={styles.tableCell}>Role</div>
            <div className={styles.tableCell}>Shift</div>
            <div className={styles.tableCell}>Zone</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCell}>Performance</div>
            <div className={styles.tableCell}>Actions</div>
          </div>

          {employees.map((employee) => (
            <div key={employee.id} className={styles.tableRow}>
              <div className={styles.tableCell}>
                <div className={styles.employeeName}>{employee.firstName} {employee.lastName}</div>
                <div className={styles.employeeEmail}>{employee.email}</div>
              </div>
              <div className={styles.tableCell}>
                <span 
                  className={styles.roleBadge}
                  style={{ backgroundColor: getRoleColor(employee.role) }}
                >
                  {employee.role}
                </span>
              </div>
              <div className={styles.tableCell}>
                <span 
                  className={styles.shiftBadge}
                  style={{ backgroundColor: getShiftColor(employee.shift) }}
                >
                  {employee.shift}
                </span>
              </div>
              <div className={styles.tableCell}>{employee.zoneName}</div>
              <div className={styles.tableCell}>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(employee.status) }}
                >
                  {employee.status.replace('_', ' ')}
                </span>
              </div>
              <div className={styles.tableCell}>
                <div className={styles.performance}>
                  <div className={styles.performanceItem}>
                    <span className={styles.performanceLabel}>Tasks:</span>
                    <span className={styles.performanceValue}>{employee.performance.tasksCompleted}</span>
                  </div>
                  <div className={styles.performanceItem}>
                    <span className={styles.performanceLabel}>Efficiency:</span>
                    <span className={styles.performanceValue}>{employee.performance.efficiency}%</span>
                  </div>
                  <div className={styles.performanceItem}>
                    <span className={styles.performanceLabel}>Rating:</span>
                    <span className={styles.performanceValue}>{employee.performance.rating}/5</span>
                  </div>
                </div>
              </div>
              <div className={styles.tableCell}>
                <button 
                  className={styles.assignButton}
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowAssignForm(true);
                  }}
                >
                  <UserPlus className={styles.buttonIcon} />
                  Assign Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Task Modal */}
      {showAssignForm && selectedEmployee && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Assign Task to {selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowAssignForm(false);
                  setSelectedEmployee(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAssignTask}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Task ID</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={assignFormData.taskId}
                    onChange={(e) => setAssignFormData({ ...assignFormData, taskId: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Task Description</label>
                  <textarea
                    className={styles.textarea}
                    value={assignFormData.taskDescription}
                    onChange={(e) => setAssignFormData({ ...assignFormData, taskDescription: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Priority</label>
                  <select
                    className={styles.select}
                    value={assignFormData.priority}
                    onChange={(e) => setAssignFormData({ ...assignFormData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
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
                    setSelectedEmployee(null);
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
    </div>
  );
}
