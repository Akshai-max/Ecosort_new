import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    console.log('🔍 Manager profile API called');
    
    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not found in environment variables');
      return NextResponse.json(
        { error: 'Authentication configuration missing' },
        { status: 500 }
      );
    }

    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    console.log('🔐 Authenticating request...');
    // Authenticate the request
    const payload = await authenticateRequest(req as any);
    console.log('✅ Authentication successful:', { id: payload.id, role: payload.role });
    
    // Check if user is a manager
    if (payload.role !== 'manager') {
      console.log('❌ Access denied - user is not a manager');
      return NextResponse.json(
        { error: 'Access denied. Manager role required.' },
        { status: 403 }
      );
    }

    console.log('👤 Finding manager by ID:', payload.id);
    // Find manager by ID
    const manager = await User.findById(payload.id);
    if (!manager) {
      console.log('❌ Manager not found in database');
      return NextResponse.json(
        { error: 'Manager not found. Please contact administrator.' },
        { status: 404 }
      );
    }

    console.log('✅ Manager found:', { id: manager._id, name: `${manager.firstName} ${manager.lastName}` });

    return NextResponse.json({
      manager: {
        id: manager._id,
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        role: manager.role,
        phone: manager.phone,
        address: manager.address,
        dateOfBirth: manager.dateOfBirth,
        gender: manager.gender,
        createdAt: manager.createdAt,
        updatedAt: manager.updatedAt
      }
    });
  } catch (error: any) {
    console.error('❌ Error fetching manager profile:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
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

    const updateData = await req.json();
    
    // Update manager profile
    const manager = await User.findByIdAndUpdate(
      payload.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!manager) {
      return NextResponse.json(
        { error: 'Manager not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      manager: {
        id: manager._id,
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        role: manager.role,
        phone: manager.phone,
        address: manager.address,
        dateOfBirth: manager.dateOfBirth,
        gender: manager.gender,
        updatedAt: manager.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error updating manager profile:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
