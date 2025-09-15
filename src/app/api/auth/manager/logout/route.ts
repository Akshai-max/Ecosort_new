import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Create response
    const response = NextResponse.json(
      { message: 'Manager logged out successfully' },
      { status: 200 }
    );

    // Clear token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
