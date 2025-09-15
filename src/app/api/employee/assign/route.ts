import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';

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

    const assignmentData = await req.json();
    const { employeeId, taskId, taskDescription, priority, dueDate, notes } = assignmentData;

    // In a real implementation, you would:
    // 1. Validate that the employee exists and is available
    // 2. Create a task assignment record in the database
    // 3. Send notification to the employee
    // 4. Update employee's current task status

    // Mock response
    const assignment = {
      id: `A${Date.now()}`,
      employeeId,
      taskId,
      taskDescription,
      priority,
      dueDate,
      notes,
      assignedBy: payload.id,
      assignedAt: new Date().toISOString(),
      status: 'assigned'
    };

    return NextResponse.json({
      assignment,
      message: 'Task assigned successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error assigning task:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
