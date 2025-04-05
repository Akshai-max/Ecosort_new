import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password, employeeId } = await req.json();

    // TODO: Implement employee-specific authentication logic
    // This should check for employee-specific credentials and permissions
    
    // For now, we'll use the same logic as user login but with a role check
    const user = await User.findOne({ email, role: 'employee' }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid employee credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid employee credentials' },
        { status: 401 }
      );
    }

    // TODO: Verify employee ID if needed
    // This would be a separate check for employee-specific authentication

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Create response with user data and token
    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
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
    return NextResponse.json(
      { error: error.message || 'Employee login failed' },
      { status: 500 }
    );
  }
} 