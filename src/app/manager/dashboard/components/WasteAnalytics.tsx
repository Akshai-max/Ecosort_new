'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Bot, 
  FileText, 
  Wine, 
  Package, 
  Smartphone, 
  Recycle,
  BarChart3,
  Download
} from 'lucide-react';
import styles from './WasteAnalytics.module.css';

interface WasteCategoryData {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface WeeklyData {
  week: string;
  total: number;
  plastic: number;
  paper: number;
  glass: number;
  metal: number;
  electronics: number;
  other: number;
}

interface MonthlyData {
  month: string;
  total: number;
  efficiency: number;
  cost: number;
  revenue: number;
}

interface Report {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'custom';
  generatedAt: string;
  format: 'json' | 'csv' | 'pdf';
  size: string;
  status: 'ready' | 'generating' | 'failed';
}

interface WasteAnalyticsProps {
  managerId?: string;
}

export default function WasteAnalytics({ managerId }: WasteAnalyticsProps) {
  const [wasteCategories, setWasteCategories] = useState<WasteCategoryData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormData, setExportFormData] = useState({
    reportType: 'waste_summary' as 'waste_summary' | 'efficiency' | 'cost_analysis' | 'trend_analysis',
    format: 'pdf' as 'json' | 'csv' | 'pdf',
    period: 'week' as 'week' | 'month' | 'quarter',
    includeCharts: true
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [managerId, selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      await Promise.all([
        fetchWasteCategories(),
        fetchWeeklyData(),
        fetchMonthlyData(),
        fetchReports()
      ]);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWasteCategories = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/analytics/${managerId}/categories`);
    // const data = await response.json();
    
    // Mock data
    setWasteCategories([
      { category: 'Plastic', amount: 1250, percentage: 35, trend: 'up', change: 12 },
      { category: 'Paper', amount: 890, percentage: 25, trend: 'down', change: -5 },
      { category: 'Glass', amount: 720, percentage: 20, trend: 'stable', change: 0 },
      { category: 'Metal', amount: 540, percentage: 15, trend: 'up', change: 8 },
      { category: 'Electronics', amount: 180, percentage: 5, trend: 'up', change: 25 }
    ]);
  };

  const fetchWeeklyData = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/analytics/${managerId}/weekly`);
    // const data = await response.json();
    
    // Mock data - Daily data for the week
    setWeeklyData([
      { week: 'MON', total: 180, plastic: 63, paper: 45, glass: 36, metal: 27, electronics: 9, other: 0 },
      { week: 'TUE', total: 220, plastic: 77, paper: 55, glass: 44, metal: 33, electronics: 11, other: 0 },
      { week: 'WED', total: 195, plastic: 68, paper: 49, glass: 39, metal: 29, electronics: 10, other: 0 },
      { week: 'THU', total: 250, plastic: 88, paper: 63, glass: 50, metal: 38, electronics: 11, other: 0 },
      { week: 'FRI', total: 210, plastic: 74, paper: 53, glass: 42, metal: 32, electronics: 9, other: 0 },
      { week: 'SAT', total: 175, plastic: 61, paper: 44, glass: 35, metal: 26, electronics: 9, other: 0 },
      { week: 'SUN', total: 160, plastic: 56, paper: 40, glass: 32, metal: 24, electronics: 8, other: 0 }
    ]);
  };

  const fetchMonthlyData = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/analytics/${managerId}/monthly`);
    // const data = await response.json();
    
    // Mock data
    setMonthlyData([
      { month: 'Jan', total: 12800, efficiency: 85, cost: 2500, revenue: 3200 },
      { month: 'Feb', total: 13200, efficiency: 87, cost: 2400, revenue: 3400 },
      { month: 'Mar', total: 13500, efficiency: 89, cost: 2300, revenue: 3600 },
      { month: 'Apr', total: 13800, efficiency: 91, cost: 2200, revenue: 3800 }
    ]);
  };

  const fetchReports = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/reports/${managerId}`);
    // const data = await response.json();
    
    // Mock data
    setReports([
      {
        id: 'R001',
        name: 'Weekly Waste Summary',
        type: 'weekly',
        generatedAt: '2024-01-15T10:30:00',
        format: 'pdf',
        size: '2.3 MB',
        status: 'ready'
      },
      {
        id: 'R002',
        name: 'Monthly Efficiency Report',
        type: 'monthly',
        generatedAt: '2024-01-10T14:20:00',
        format: 'csv',
        size: '1.8 MB',
        status: 'ready'
      },
      {
        id: 'R003',
        name: 'Q4 Cost Analysis',
        type: 'quarterly',
        generatedAt: '2024-01-05T09:15:00',
        format: 'json',
        size: '3.1 MB',
        status: 'ready'
      }
    ]);
  };

  const handleExportReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/reports/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...exportFormData, managerId })
      // });
      
      const newReport: Report = {
        id: `R${String(reports.length + 1).padStart(3, '0')}`,
        name: `${exportFormData.reportType.replace('_', ' ')} Report`,
        type: exportFormData.period as any,
        generatedAt: new Date().toISOString(),
        format: exportFormData.format,
        size: '0 MB',
        status: 'generating'
      };
      
      setReports([newReport, ...reports]);
      setShowExportModal(false);
      
      // Simulate report generation
      setTimeout(() => {
        setReports(reports.map(r => 
          r.id === newReport.id 
            ? { ...r, status: 'ready', size: '2.5 MB' }
            : r
        ));
      }, 3000);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const downloadReport = async (reportId: string) => {
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
      
      console.log(`Downloading report ${reportId}`);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const getTrendIcon = (trend: WasteCategoryData['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className={styles.trendIcon} />;
      case 'down':
        return <TrendingDown className={styles.trendIcon} />;
      case 'stable':
        return <Minus className={styles.trendIcon} />;
      default:
        return <Minus className={styles.trendIcon} />;
    }
  };

  const getTrendColor = (trend: WasteCategoryData['trend']) => {
    switch (trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      case 'stable':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'plastic':
        return <Bot className={styles.categoryIcon} />;
      case 'paper':
        return <FileText className={styles.categoryIcon} />;
      case 'glass':
        return <Wine className={styles.categoryIcon} />;
      case 'metal':
        return <Package className={styles.categoryIcon} />;
      case 'electronics':
        return <Smartphone className={styles.categoryIcon} />;
      default:
        return <Recycle className={styles.categoryIcon} />;
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

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className={styles.wasteAnalytics}>
      <div className={styles.header}>
        <h2 className={styles.title}>Waste Analytics & Reports</h2>
        <div className={styles.headerActions}>
          <select
            className={styles.periodSelect}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button 
            className={styles.exportButton}
            onClick={() => setShowExportModal(true)}
          >
            <BarChart3 className={styles.buttonIcon} />
            Export Report
          </button>
        </div>
      </div>

      {/* Waste Category Breakdown */}
      <div className={styles.categoryBreakdown}>
        <h3 className={styles.sectionTitle}>
          <Recycle className={styles.chartIcon} />
          Waste Category Breakdown
        </h3>
        <div className={styles.pieChart}>
          <div className={styles.pieChartContainer}>
            <div className={styles.pieChartVisual}>
              <div className={styles.pieChartSvg}>
                <svg viewBox="0 0 200 200" className={styles.pieSvg}>
                  {wasteCategories.map((category, index) => {
                    const colors = ['#ef4444', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6'];
                    const total = wasteCategories.reduce((sum, cat) => sum + cat.percentage, 0);
                    const percentage = (category.percentage / total) * 100;
                    const angle = (wasteCategories.slice(0, index).reduce((sum, cat) => sum + cat.percentage, 0) / total) * 360;
                    const radius = 80;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -angle * (circumference / 360);
                    
                    return (
                      <circle
                        key={category.category}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={colors[index % colors.length]}
                        strokeWidth="40"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform={`rotate(${angle} 100 100)`}
                        className={styles.pieSlice}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className={styles.pieLegend}>
              {wasteCategories.map((category, index) => {
                const colors = ['#ef4444', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6'];
                return (
                  <div key={category.category} className={styles.legendItem}>
                    <div 
                      className={styles.legendColor}
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <div className={styles.legendInfo}>
                      <span className={styles.legendName}>{category.category}</span>
                      <span className={styles.legendPercentage}>{category.percentage}%</span>
                    </div>
                    <div className={styles.legendAmount}>{category.amount} kg</div>
                    <div className={styles.legendTrend}>
                      <span 
                        className={styles.trendIcon}
                        style={{ color: getTrendColor(category.trend) }}
                      >
                        {getTrendIcon(category.trend)}
                      </span>
                      <span 
                        className={styles.trendText}
                        style={{ color: getTrendColor(category.trend) }}
                      >
                        {category.change > 0 ? '+' : ''}{category.change}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        <div className={styles.lineChart}>
          <h3 className={styles.chartTitle}>
            <TrendingUp className={styles.chartIcon} />
            Weekly Waste Trend
          </h3>
          <div className={styles.chartContainer}>
            <div className={styles.combinedChart}>
              {/* Line Chart */}
              <div className={styles.lineChartSvg}>
                <svg viewBox="0 0 400 200" className={styles.lineSvg}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area under the line */}
                  <path
                    d={`M 0,${200 - (weeklyData[0].total / 300) * 200} ${weeklyData.map((week, index) => 
                      `L ${(index + 1) * (400 / weeklyData.length)},${200 - (week.total / 300) * 200}`
                    ).join(' ')} L ${400},200 L 0,200 Z`}
                    fill="url(#lineGradient)"
                    className={styles.areaPath}
                  />
                  
                  {/* Line */}
                  <path
                    d={`M 0,${200 - (weeklyData[0].total / 300) * 200} ${weeklyData.map((week, index) => 
                      `L ${(index + 1) * (400 / weeklyData.length)},${200 - (week.total / 300) * 200}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    className={styles.linePath}
                  />
                  
                  {/* Data points */}
                  {weeklyData.map((week, index) => (
                    <circle
                      key={`point-${week.week}`}
                      cx={(index + 1) * (400 / weeklyData.length)}
                      cy={200 - (week.total / 300) * 200}
                      r="4"
                      fill="#10b981"
                      className={styles.dataPoint}
                    />
                  ))}
                </svg>
              </div>
              
              {/* Bar Chart */}
              <div className={styles.chartBars}>
                {weeklyData.map((week, index) => (
                  <div key={week.week} className={styles.barGroup}>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.bar}
                        style={{ height: `${(week.total / 300) * 100}%` }}
                      ></div>
                    </div>
                    <div className={styles.barLabel}>{week.week}</div>
                    <div className={styles.barValue}>{week.total}kg</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h4 className={styles.metricTitle}>Total Waste Collected</h4>
            <p className={styles.metricValue}>
              {wasteCategories.reduce((sum, cat) => sum + cat.amount, 0)} kg
            </p>
            <div className={styles.metricTrend}>
              <span className={styles.trendIcon}>📈</span>
              <span className={styles.trendText}>+8% from last period</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <h4 className={styles.metricTitle}>Collection Efficiency</h4>
            <p className={styles.metricValue}>92%</p>
            <div className={styles.metricTrend}>
              <span className={styles.trendIcon}>📈</span>
              <span className={styles.trendText}>+3% from last period</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <h4 className={styles.metricTitle}>Cost per kg</h4>
            <p className={styles.metricValue}>$0.15</p>
            <div className={styles.metricTrend}>
              <span className={styles.trendIcon}>📉</span>
              <span className={styles.trendText}>-5% from last period</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <h4 className={styles.metricTitle}>Revenue Generated</h4>
            <p className={styles.metricValue}>$3,200</p>
            <div className={styles.metricTrend}>
              <span className={styles.trendIcon}>📈</span>
              <span className={styles.trendText}>+12% from last period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className={styles.reportsSection}>
        <h3 className={styles.sectionTitle}>Generated Reports</h3>
        <div className={styles.reportsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell}>Report Name</div>
            <div className={styles.tableCell}>Type</div>
            <div className={styles.tableCell}>Format</div>
            <div className={styles.tableCell}>Size</div>
            <div className={styles.tableCell}>Generated</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCell}>Actions</div>
          </div>

          {reports.map((report) => (
            <div key={report.id} className={styles.tableRow}>
              <div className={styles.tableCell}>
                <div className={styles.reportName}>{report.name}</div>
                <div className={styles.reportId}>ID: {report.id}</div>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.typeBadge}>{report.type}</span>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.formatBadge}>{report.format.toUpperCase()}</span>
              </div>
              <div className={styles.tableCell}>{report.size}</div>
              <div className={styles.tableCell}>
                {new Date(report.generatedAt).toLocaleDateString()}
              </div>
              <div className={styles.tableCell}>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(report.status) }}
                >
                  {report.status}
                </span>
              </div>
              <div className={styles.tableCell}>
                <button 
                  className={styles.downloadButton}
                  onClick={() => downloadReport(report.id)}
                  disabled={report.status !== 'ready'}
                >
                  <Download className={styles.buttonIcon} />
                  {report.status === 'generating' ? 'Generating...' : 'Download'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Export Report</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowExportModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleExportReport}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Report Type</label>
                  <select
                    className={styles.select}
                    value={exportFormData.reportType}
                    onChange={(e) => setExportFormData({ ...exportFormData, reportType: e.target.value as any })}
                    required
                  >
                    <option value="waste_summary">Waste Summary</option>
                    <option value="efficiency">Efficiency Report</option>
                    <option value="cost_analysis">Cost Analysis</option>
                    <option value="trend_analysis">Trend Analysis</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Format</label>
                  <select
                    className={styles.select}
                    value={exportFormData.format}
                    onChange={(e) => setExportFormData({ ...exportFormData, format: e.target.value as any })}
                    required
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Period</label>
                  <select
                    className={styles.select}
                    value={exportFormData.period}
                    onChange={(e) => setExportFormData({ ...exportFormData, period: e.target.value as any })}
                    required
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={exportFormData.includeCharts}
                      onChange={(e) => setExportFormData({ ...exportFormData, includeCharts: e.target.checked })}
                      className={styles.checkbox}
                    />
                    Include Charts
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowExportModal(false)}
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
