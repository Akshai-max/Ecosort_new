import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';

// Mock tasks data - in a real implementation, this would be stored in MongoDB
let mockTasks = [
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
    const wasteType = searchParams.get('wasteType');

    let filteredTasks = mockTasks;

    // Apply filters
    if (zoneId) {
      filteredTasks = filteredTasks.filter(task => task.zoneId === zoneId);
    }
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    if (wasteType) {
      filteredTasks = filteredTasks.filter(task => task.wasteType === wasteType);
    }

    return NextResponse.json({
      tasks: filteredTasks
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
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

    const taskData = await req.json();
    
    // Generate new task ID
    const newTaskId = `T${String(mockTasks.length + 1).padStart(3, '0')}`;
    
    const newTask = {
      id: newTaskId,
      zoneId: taskData.zoneId,
      zoneName: taskData.zoneName || 'Unknown Zone',
      assignedTo: taskData.assignedTo,
      assignedToName: taskData.assignedToName || 'Unknown Employee',
      wasteType: taskData.wasteType,
      description: taskData.description,
      priority: taskData.priority || 'medium',
      status: 'pending',
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      notes: taskData.notes
    };

    // Add to mock data
    mockTasks.push(newTask);

    return NextResponse.json({
      task: newTask
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
