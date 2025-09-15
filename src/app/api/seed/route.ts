import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST(req: Request) {
  try {
    console.log('🌱 Seeding database...');
    await seedDatabase();
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      manager: {
        email: 'manager@ecosort.com',
        password: 'Manager123!'
      }
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { checkManagerExists } = await import('@/lib/seed');
    const managerExists = await checkManagerExists();
    
    return NextResponse.json({
      managerExists,
      message: managerExists ? 'Manager exists in database' : 'No manager found in database'
    });
  } catch (error: any) {
    console.error('Error checking manager existence:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check manager existence' },
      { status: 500 }
    );
  }
}





