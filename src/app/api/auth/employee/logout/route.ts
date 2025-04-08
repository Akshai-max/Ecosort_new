import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json(
      { message: 'Employee logged out successfully' },
      { status: 200 }
    );
    
    // Clear the auth token cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });
    
    // Also clear any employee-specific cookies if they exist
    response.cookies.set('employee', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to logout employee' },
      { status: 500 }
    );
  }
} 