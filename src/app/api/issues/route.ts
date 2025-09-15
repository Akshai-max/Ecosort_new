import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';

// Mock issues data - in a real implementation, this would be stored in MongoDB
let mockIssues = [
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
    const zoneId = searchParams.get('zoneId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');

    let filteredIssues = mockIssues;

    // Apply filters
    if (zoneId) {
      filteredIssues = filteredIssues.filter(issue => issue.zoneId === zoneId);
    }
    if (status) {
      filteredIssues = filteredIssues.filter(issue => issue.status === status);
    }
    if (priority) {
      filteredIssues = filteredIssues.filter(issue => issue.priority === priority);
    }
    if (category) {
      filteredIssues = filteredIssues.filter(issue => issue.category === category);
    }

    return NextResponse.json({
      issues: filteredIssues
    });
  } catch (error: any) {
    console.error('Error fetching issues:', error);
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

    const issueData = await req.json();
    
    // Generate new issue ID
    const newIssueId = `I${String(mockIssues.length + 1).padStart(3, '0')}`;
    
    const newIssue = {
      id: newIssueId,
      title: issueData.title,
      description: issueData.description,
      zoneId: issueData.zoneId,
      zoneName: issueData.zoneName || 'Unknown Zone',
      reportedBy: payload.id,
      reportedByName: 'Manager',
      status: 'open',
      priority: issueData.priority || 'medium',
      category: issueData.category || 'other',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: issueData.notes
    };

    // Add to mock data
    mockIssues.push(newIssue);

    return NextResponse.json({
      issue: newIssue
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
