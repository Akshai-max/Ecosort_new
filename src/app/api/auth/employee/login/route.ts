import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();

    const { employeeId, password } = await req.json();

    // Find employee by employeeId
    const employee = await Employee.findOne({ 
      employeeId: employeeId.trim()
    }).select('+password');
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 401 }
      );
    }

    // Check if employee is active
    if (!employee.isActive) {
      return NextResponse.json(
        { error: 'Employee account is deactivated' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await employee.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Update last login
    await employee.updateLastLogin();

    // Generate token
    const token = generateToken({
      id: employee._id.toString(),
      email: employee.email,
      role: 'employee',
    });

    // Create response with employee data and token
    const response = NextResponse.json(
      {
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
        },
        token,
      },
      { status: 200 }
    );

    // Set token in cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.log('Employee login error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}