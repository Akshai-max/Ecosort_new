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
    
    // Mock weekly data - in a real implementation, this would be calculated from actual data
    const weeklyData = [
      { day: 'Mon', waste: 180, date: '2024-01-08' },
      { day: 'Tue', waste: 220, date: '2024-01-09' },
      { day: 'Wed', waste: 195, date: '2024-01-10' },
      { day: 'Thu', waste: 250, date: '2024-01-11' },
      { day: 'Fri', waste: 210, date: '2024-01-12' },
      { day: 'Sat', waste: 175, date: '2024-01-13' },
      { day: 'Sun', waste: 160, date: '2024-01-14' }
    ];

    return NextResponse.json({
      zoneId,
      weeklyData,
      totalWaste: weeklyData.reduce((sum, day) => sum + day.waste, 0),
      averageDaily: Math.round(weeklyData.reduce((sum, day) => sum + day.waste, 0) / weeklyData.length),
      trend: 'up', // up, down, stable
      changePercentage: 8.5
    });
  } catch (error: any) {
    console.error('Error fetching weekly analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
