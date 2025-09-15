import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { zoneId: string } }
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

    const zoneId = params.zoneId;
    
    // Mock category data - in a real implementation, this would be calculated from actual data
    const categoryData = [
      { category: 'Plastic', amount: 1250, percentage: 35, trend: 'up', change: 12 },
      { category: 'Paper', amount: 890, percentage: 25, trend: 'down', change: -5 },
      { category: 'Glass', amount: 720, percentage: 20, trend: 'stable', change: 0 },
      { category: 'Metal', amount: 540, percentage: 15, trend: 'up', change: 8 },
      { category: 'Electronics', amount: 180, percentage: 5, trend: 'up', change: 25 }
    ];

    const totalWaste = categoryData.reduce((sum, cat) => sum + cat.amount, 0);

    return NextResponse.json({
      zoneId,
      categories: categoryData,
      totalWaste,
      period: {
        start: '2024-01-08',
        end: '2024-01-14'
      }
    });
  } catch (error: any) {
    console.error('Error fetching category analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
