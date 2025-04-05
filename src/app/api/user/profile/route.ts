import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Authenticate the request
    const payload = await authenticateRequest(req as any);
    
    // Find user by ID
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data (excluding sensitive information)
    return NextResponse.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        role: user.role,
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
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 