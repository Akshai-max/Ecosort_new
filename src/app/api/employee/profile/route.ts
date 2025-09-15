import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Authenticate the request
    const payload = await authenticateRequest(req as any);
    
    // Find employee by ID
    const employee = await Employee.findById(payload.id);
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Return employee data (excluding sensitive information)
    return NextResponse.json({
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position,
        zoneId: employee.zoneId,
        zoneName: employee.zoneName,
        hireDate: employee.hireDate,
        phone: employee.phone,
        address: employee.address,
        dateOfBirth: employee.dateOfBirth,
        gender: employee.gender,
        points: employee.points,
        rank: employee.rank,
        isActive: employee.isActive,
        lastLogin: employee.lastLogin,
        preferences: employee.preferences
      }
    });
  } catch (error: any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch employee profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    
    // Authenticate the request
    const payload = await authenticateRequest(req as any);
    
    const { name, phone, address, dateOfBirth, gender, preferences } = await req.json();
    
    // Find employee by ID
    const employee = await Employee.findById(payload.id);
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Update employee data
    const updatedEmployee = await Employee.findByIdAndUpdate(
      payload.id,
      {
        name: name || employee.name,
        phone: phone || employee.phone,
        address: address || employee.address,
        dateOfBirth: dateOfBirth || employee.dateOfBirth,
        gender: gender || employee.gender,
        preferences: preferences || employee.preferences,
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      employee: {
        id: updatedEmployee._id,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        employeeId: updatedEmployee.employeeId,
        department: updatedEmployee.department,
        position: updatedEmployee.position,
        zoneId: updatedEmployee.zoneId,
        zoneName: updatedEmployee.zoneName,
        hireDate: updatedEmployee.hireDate,
        phone: updatedEmployee.phone,
        address: updatedEmployee.address,
        dateOfBirth: updatedEmployee.dateOfBirth,
        gender: updatedEmployee.gender,
        points: updatedEmployee.points,
        rank: updatedEmployee.rank,
        isActive: updatedEmployee.isActive,
        lastLogin: updatedEmployee.lastLogin,
        preferences: updatedEmployee.preferences
      }
    });
  } catch (error: any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update employee profile' },
      { status: 500 }
    );
  }
}