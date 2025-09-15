'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Settings,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import styles from './Reports.module.css';

interface Report {
  id: string;
  name: string;
  type: 'waste_summary' | 'efficiency' | 'cost_analysis' | 'trend_analysis' | 'employee_performance' | 'custom';
  format: 'json' | 'csv' | 'pdf' | 'excel';
  status: 'ready' | 'generating' | 'failed';
  generatedAt: string;
  generatedBy: string;
  generatedByName: string;
  size: string;
  description: string;
  period: {
    start: string;
    end: string;
  };
  parameters?: {
    zones?: string[];
    wasteTypes?: string[];
    employees?: string[];
    includeCharts?: boolean;
  };
  downloadCount: number;
  lastDownloaded?: string;
}

interface ReportsProps {
  managerId?: string;
}

export default function Reports({ managerId }: ReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateFormData, setGenerateFormData] = useState({
    name: '',
    type: 'waste_summary' as Report['type'],
    format: 'pdf' as Report['format'],
    period: {
      start: '',
      end: ''
    },
    zones: [] as string[],
    wasteTypes: [] as string[],
    employees: [] as string[],
    includeCharts: true
  });
  const [filters, setFilters] = useState({
    type: 'all',
    format: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchReports();
  }, [managerId]);

  const fetchReports = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/reports/${managerId}`);
      // const data = await response.json();
      
      // Mock data
      setReports([
        {
          id: 'R001',
          name: 'Weekly Waste Collection Summary',
          type: 'waste_summary',
          format: 'pdf',
          status: 'ready',
          generatedAt: '2024-01-15T10:30:00',
          generatedBy: managerId || '',
          generatedByName: 'Manager',
          size: '2.3 MB',
          description: 'Comprehensive weekly report of waste collection activities across all zones',
          period: {
            start: '2024-01-08',
            end: '2024-01-14'
          },
          parameters: {
            zones: ['Z001', 'Z002', 'Z003', 'Z004'],
            wasteTypes: ['plastic', 'paper', 'glass', 'metal', 'electronics'],
            includeCharts: true
          },
          downloadCount: 5,
          lastDownloaded: '2024-01-15T14:20:00'
        },
        {
          id: 'R002',
          name: 'Employee Performance Analysis',
          type: 'employee_performance',
          format: 'excel',
          status: 'ready',
          generatedAt: '2024-01-14T16:45:00',
          generatedBy: managerId || '',
          generatedByName: 'Manager',
          size: '1.8 MB',
          description: 'Detailed analysis of employee performance metrics and efficiency ratings',
          period: {
            start: '2024-01-01',
            end: '2024-01-14'
          },
          parameters: {
            employees: ['E001', 'E002', 'E003', 'E004', 'E005'],
            includeCharts: false
          },
          downloadCount: 3,
          lastDownloaded: '2024-01-15T09:15:00'
        },
        {
          id: 'R003',
          name: 'Cost Analysis Report',
          type: 'cost_analysis',
          format: 'csv',
          status: 'ready',
          generatedAt: '2024-01-13T11:20:00',
          generatedBy: managerId || '',
          generatedByName: 'Manager',
          size: '1.2 MB',
          description: 'Financial analysis of waste collection costs and revenue generation',
          period: {
            start: '2023-12-01',
            end: '2023-12-31'
          },
          parameters: {
            zones: ['Z001', 'Z002', 'Z003', 'Z004'],
            includeCharts: true
          },
          downloadCount: 8,
          lastDownloaded: '2024-01-14T16:30:00'
        },
        {
          id: 'R004',
          name: 'Monthly Trend Analysis',
          type: 'trend_analysis',
          format: 'pdf',
          status: 'generating',
          generatedAt: '2024-01-15T15:00:00',
          generatedBy: managerId || '',
          generatedByName: 'Manager',
          size: '0 MB',
          description: 'Monthly trend analysis showing waste collection patterns and efficiency trends',
          period: {
            start: '2023-12-01',
            end: '2024-01-01'
          },
          parameters: {
            zones: ['Z001', 'Z002', 'Z003', 'Z004'],
            wasteTypes: ['plastic', 'paper', 'glass', 'metal'],
            includeCharts: true
          },
          downloadCount: 0
        },
        {
          id: 'R005',
          name: 'Custom Zone Report',
          type: 'custom',
          format: 'json',
          status: 'failed',
          generatedAt: '2024-01-15T12:30:00',
          generatedBy: managerId || '',
          generatedByName: 'Manager',
          size: '0 MB',
          description: 'Custom report for specific zone analysis',
          period: {
            start: '2024-01-10',
            end: '2024-01-15'
          },
          parameters: {
            zones: ['Z001'],
            wasteTypes: ['plastic', 'paper'],
            includeCharts: false
          },
          downloadCount: 0
        }
      ]);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/reports/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...generateFormData, generatedBy: managerId })
      // });
      
      const newReport: Report = {
        id: `R${String(reports.length + 1).padStart(3, '0')}`,
        name: generateFormData.name,
        type: generateFormData.type,
        format: generateFormData.format,
        status: 'generating',
        generatedAt: new Date().toISOString(),
        generatedBy: managerId || '',
        generatedByName: 'Manager',
        size: '0 MB',
        description: `Generated ${generateFormData.type.replace('_', ' ')} report`,
        period: generateFormData.period,
        parameters: {
          zones: generateFormData.zones,
          wasteTypes: generateFormData.wasteTypes,
          employees: generateFormData.employees,
          includeCharts: generateFormData.includeCharts
        },
        downloadCount: 0
      };
      
      setReports([newReport, ...reports]);
      setShowGenerateModal(false);
      setGenerateFormData({
        name: '',
        type: 'waste_summary',
        format: 'pdf',
        period: { start: '', end: '' },
        zones: [],
        wasteTypes: [],
        employees: [],
        includeCharts: true
      });
      
      // Simulate report generation
      setTimeout(() => {
        setReports(reports.map(r => 
          r.id === newReport.id 
            ? { ...r, status: 'ready', size: '2.1 MB' }
            : r
        ));
      }, 5000);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/reports/${reportId}/download`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `report-${reportId}.${reports.find(r => r.id === reportId)?.format}`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
      
      // Update download count
      setReports(reports.map(r => 
        r.id === reportId 
          ? { 
              ...r, 
              downloadCount: r.downloadCount + 1,
              lastDownloaded: new Date().toISOString()
            }
          : r
      ));
      
      console.log(`Downloading report ${reportId}`);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/reports/${reportId}`, {
      //   method: 'DELETE'
      // });
      
      setReports(reports.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const getFilteredReports = () => {
    return reports.filter(report => {
      const typeMatch = filters.type === 'all' || report.type === filters.type;
      const formatMatch = filters.format === 'all' || report.format === filters.format;
      const statusMatch = filters.status === 'all' || report.status === filters.status;
      
      return typeMatch && formatMatch && statusMatch;
    });
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'waste_summary':
        return <FileText className={styles.typeIcon} />;
      case 'efficiency':
        return <BarChart3 className={styles.typeIcon} />;
      case 'cost_analysis':
        return <DollarSign className={styles.typeIcon} />;
      case 'trend_analysis':
        return <TrendingUp className={styles.typeIcon} />;
      case 'employee_performance':
        return <Users className={styles.typeIcon} />;
      case 'custom':
        return <Settings className={styles.typeIcon} />;
      default:
        return <FileText className={styles.typeIcon} />;
    }
  };

  const getFormatIcon = (format: Report['format']) => {
    switch (format) {
      case 'pdf':
        return <FileText className={styles.formatIcon} />;
      case 'csv':
        return <BarChart3 className={styles.formatIcon} />;
      case 'excel':
        return <TrendingUp className={styles.formatIcon} />;
      case 'json':
        return <Settings className={styles.formatIcon} />;
      default:
        return <FileText className={styles.formatIcon} />;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return '#10b981';
      case 'generating':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className={styles.statusIcon} />;
      case 'generating':
        return <Clock className={styles.statusIcon} />;
      case 'failed':
        return <X className={styles.statusIcon} />;
      default:
        return <CheckCircle className={styles.statusIcon} />;
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = getFilteredReports();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className={styles.reports}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reports</h2>
        <button 
          className={styles.generateButton}
          onClick={() => setShowGenerateModal(true)}
        >
          <BarChart3 className={styles.buttonIcon} />
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Type</label>
          <select
            className={styles.filterSelect}
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="waste_summary">Waste Summary</option>
            <option value="efficiency">Efficiency</option>
            <option value="cost_analysis">Cost Analysis</option>
            <option value="trend_analysis">Trend Analysis</option>
            <option value="employee_performance">Employee Performance</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Format</label>
          <select
            className={styles.filterSelect}
            value={filters.format}
            onChange={(e) => setFilters({ ...filters, format: e.target.value })}
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="json">JSON</option>
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
            <option value="ready">Ready</option>
            <option value="generating">Generating</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className={styles.reportsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Report</div>
          <div className={styles.tableCell}>Type</div>
          <div className={styles.tableCell}>Format</div>
          <div className={styles.tableCell}>Size</div>
          <div className={styles.tableCell}>Generated</div>
          <div className={styles.tableCell}>Status</div>
          <div className={styles.tableCell}>Downloads</div>
          <div className={styles.tableCell}>Actions</div>
        </div>

        {filteredReports.map((report) => (
          <div key={report.id} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <div className={styles.reportInfo}>
                <div className={styles.reportName}>{report.name}</div>
                <div className={styles.reportDescription}>{report.description}</div>
                <div className={styles.reportPeriod}>
                  {formatDate(report.period.start)} - {formatDate(report.period.end)}
                </div>
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.typeInfo}>
                <span className={styles.typeIcon}>{getTypeIcon(report.type)}</span>
                <span className={styles.typeName}>{report.type.replace('_', ' ')}</span>
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.formatInfo}>
                <span className={styles.formatIcon}>{getFormatIcon(report.format)}</span>
                <span className={styles.formatName}>{report.format.toUpperCase()}</span>
              </div>
            </div>
            <div className={styles.tableCell}>{formatFileSize(report.size)}</div>
            <div className={styles.tableCell}>
              <div className={styles.generatedInfo}>
                <div className={styles.generatedDate}>{formatDate(report.generatedAt)}</div>
                <div className={styles.generatedBy}>by {report.generatedByName}</div>
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.statusInfo}>
                <span className={styles.statusIcon}>{getStatusIcon(report.status)}</span>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(report.status) }}
                >
                  {report.status}
                </span>
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.downloadInfo}>
                <div className={styles.downloadCount}>{report.downloadCount}</div>
                {report.lastDownloaded && (
                  <div className={styles.lastDownloaded}>
                    Last: {formatDate(report.lastDownloaded)}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.actions}>
                <button 
                  className={styles.downloadButton}
                  onClick={() => handleDownloadReport(report.id)}
                  disabled={report.status !== 'ready'}
                >
                  <Download className={styles.buttonIcon} />
                  {report.status === 'generating' ? 'Generating...' : 'Download'}
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDeleteReport(report.id)}
                >
                  <Trash2 className={styles.buttonIcon} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <BarChart3 className={styles.emptyIconSvg} />
          </div>
          <h3>No reports found</h3>
          <p>Try adjusting your filters or generate a new report.</p>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Generate New Report</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowGenerateModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleGenerateReport}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Report Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={generateFormData.name}
                    onChange={(e) => setGenerateFormData({ ...generateFormData, name: e.target.value })}
                    required
                    placeholder="Enter report name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Report Type</label>
                  <select
                    className={styles.select}
                    value={generateFormData.type}
                    onChange={(e) => setGenerateFormData({ ...generateFormData, type: e.target.value as Report['type'] })}
                    required
                  >
                    <option value="waste_summary">Waste Summary</option>
                    <option value="efficiency">Efficiency Report</option>
                    <option value="cost_analysis">Cost Analysis</option>
                    <option value="trend_analysis">Trend Analysis</option>
                    <option value="employee_performance">Employee Performance</option>
                    <option value="custom">Custom Report</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Format</label>
                  <select
                    className={styles.select}
                    value={generateFormData.format}
                    onChange={(e) => setGenerateFormData({ ...generateFormData, format: e.target.value as Report['format'] })}
                    required
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={generateFormData.period.start}
                    onChange={(e) => setGenerateFormData({ 
                      ...generateFormData, 
                      period: { ...generateFormData.period, start: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>End Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={generateFormData.period.end}
                    onChange={(e) => setGenerateFormData({ 
                      ...generateFormData, 
                      period: { ...generateFormData.period, end: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Zones (Optional)</label>
                  <div className={styles.checkboxGroup}>
                    {['Z001', 'Z002', 'Z003', 'Z004'].map(zone => (
                      <label key={zone} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={generateFormData.zones.includes(zone)}
                          onChange={(e) => {
                            const zones = e.target.checked
                              ? [...generateFormData.zones, zone]
                              : generateFormData.zones.filter(z => z !== zone);
                            setGenerateFormData({ ...generateFormData, zones });
                          }}
                          className={styles.checkbox}
                        />
                        Zone {zone}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Waste Types (Optional)</label>
                  <div className={styles.checkboxGroup}>
                    {['plastic', 'paper', 'glass', 'metal', 'electronics', 'other'].map(type => (
                      <label key={type} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={generateFormData.wasteTypes.includes(type)}
                          onChange={(e) => {
                            const wasteTypes = e.target.checked
                              ? [...generateFormData.wasteTypes, type]
                              : generateFormData.wasteTypes.filter(t => t !== type);
                            setGenerateFormData({ ...generateFormData, wasteTypes });
                          }}
                          className={styles.checkbox}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={generateFormData.includeCharts}
                      onChange={(e) => setGenerateFormData({ ...generateFormData, includeCharts: e.target.checked })}
                      className={styles.checkbox}
                    />
                    Include Charts and Visualizations
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowGenerateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
