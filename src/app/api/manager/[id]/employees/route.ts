import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const managerId = params.id;
    
    // Verify the manager is accessing their own data or has permission
    if (payload.id !== managerId) {
      return NextResponse.json(
        { error: 'Access denied. Cannot access other manager data.' },
        { status: 403 }
      );
    }

    // Get employees assigned to this manager
    // In a real implementation, you'd have a relationship between managers and employees
    // For now, we'll get all employees with role 'user' (assuming they report to managers)
    const employees = await User.find({ 
      role: { $in: ['user', 'employee'] },
      // Add manager assignment logic here when implemented
    }).select('-password');

    // Group employees by teams/zones (mock implementation)
    const teams = [
      {
        id: 'T001',
        name: 'Downtown Team',
        employees: employees.slice(0, 2),
        totalTasks: 25,
        completedTasks: 22
      },
      {
        id: 'T002',
        name: 'Business District Team',
        employees: employees.slice(2, 4),
        totalTasks: 18,
        completedTasks: 15
      },
      {
        id: 'T003',
        name: 'Industrial Team',
        employees: employees.slice(4, 6),
        totalTasks: 30,
        completedTasks: 28
      }
    ];

    return NextResponse.json({
      employees: employees.map(emp => ({
        id: emp._id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        role: emp.role,
        status: 'active', // Mock status
        zoneId: 'Z001', // Mock zone assignment
        zoneName: 'Downtown Residential', // Mock zone name
        joinDate: emp.createdAt,
        performance: {
          tasksCompleted: Math.floor(Math.random() * 50) + 20,
          efficiency: Math.floor(Math.random() * 20) + 80,
          rating: (Math.random() * 2 + 3).toFixed(1)
        }
      })),
      teams
    });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
