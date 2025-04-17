import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json(
      { message: 'User logged out successfully' },
      { status: 200 }
    );
    
    // Clear the auth token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });
    
    // Also clear any user-specific data from localStorage (this will be handled client-side)
    // The client should clear localStorage when calling this endpoint
    
    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to logout user' },
      { status: 500 }
    );
  }
} 