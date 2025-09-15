import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';

// Mock reports data - in a real implementation, this would be stored in MongoDB
let mockReports = [
  {
    id: 'R001',
    name: 'Weekly Waste Collection Summary',
    type: 'waste_summary',
    format: 'pdf',
    status: 'ready',
    generatedAt: '2024-01-15T10:30:00',
    generatedBy: 'manager123',
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
    generatedBy: 'manager123',
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
    generatedBy: 'manager123',
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
    generatedBy: 'manager123',
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
  }
];

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Authenticate the request
    const payload = await authenticateRequest(req as any);
    
    // Check if user is a manager
    if (payload.role !== 'manager') {
      return NextResponse.json(
        { error: 'Access denied. Manager role required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get('managerId');
    const type = searchParams.get('type');
    const format = searchParams.get('format');
    const status = searchParams.get('status');

    let filteredReports = mockReports;

    // Filter by manager
    if (managerId) {
      filteredReports = filteredReports.filter(r => r.generatedBy === managerId);
    }
    if (type) {
      filteredReports = filteredReports.filter(r => r.type === type);
    }
    if (format) {
      filteredReports = filteredReports.filter(r => r.format === format);
    }
    if (status) {
      filteredReports = filteredReports.filter(r => r.status === status);
    }

    return NextResponse.json({
      reports: filteredReports
    });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Authenticate the request
    const payload = await authenticateRequest(req as any);
    
    // Check if user is a manager
    if (payload.role !== 'manager') {
      return NextResponse.json(
        { error: 'Access denied. Manager role required.' },
        { status: 403 }
      );
    }

    const reportData = await req.json();
    
    // Generate new report ID
    const newReportId = `R${String(mockReports.length + 1).padStart(3, '0')}`;
    
    const newReport = {
      id: newReportId,
      name: reportData.name,
      type: reportData.type,
      format: reportData.format,
      status: 'generating',
      generatedAt: new Date().toISOString(),
      generatedBy: payload.id,
      generatedByName: 'Manager',
      size: '0 MB',
      description: reportData.description || `Generated ${reportData.type.replace('_', ' ')} report`,
      period: reportData.period,
      parameters: reportData.parameters || {},
      downloadCount: 0
    };

    // Add to mock data
    mockReports.push(newReport);

    // Simulate report generation (in real implementation, this would be async)
    setTimeout(() => {
      const reportIndex = mockReports.findIndex(r => r.id === newReportId);
      if (reportIndex !== -1) {
        mockReports[reportIndex].status = 'ready';
        mockReports[reportIndex].size = '2.1 MB';
      }
    }, 5000);

    return NextResponse.json({
      report: newReport
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
