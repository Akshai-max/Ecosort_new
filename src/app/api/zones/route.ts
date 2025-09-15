import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';

// Mock zones data - in a real implementation, this would be stored in MongoDB
const mockZones = [
  {
    id: 'Z001',
    name: 'Downtown Residential',
    type: 'residential',
    employeesAssigned: 5,
    totalCapacity: 1000,
    currentWaste: 750,
    status: 'active',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    createdAt: '2024-01-01',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'Z002',
    name: 'Business District',
    type: 'commercial',
    employeesAssigned: 8,
    totalCapacity: 2000,
    currentWaste: 1200,
    status: 'active',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    createdAt: '2024-01-02',
    lastUpdated: '2024-01-14'
  },
  {
    id: 'Z003',
    name: 'Industrial Park',
    type: 'industrial',
    employeesAssigned: 12,
    totalCapacity: 5000,
    currentWaste: 3200,
    status: 'active',
    coordinates: { lat: 40.6782, lng: -73.9442 },
    createdAt: '2024-01-03',
    lastUpdated: '2024-01-13'
  },
  {
    id: 'Z004',
    name: 'Mixed Use Area',
    type: 'mixed',
    employeesAssigned: 6,
    totalCapacity: 1500,
    currentWaste: 900,
    status: 'maintenance',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    createdAt: '2024-01-04',
    lastUpdated: '2024-01-12'
  }
];

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get('managerId');

    // In a real implementation, filter zones by manager
    // For now, return all zones
    return NextResponse.json({
      zones: mockZones
    });
  } catch (error: any) {
    console.error('Error fetching zones:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const zoneData = await req.json();
    
    // Generate new zone ID
    const newZoneId = `Z${String(mockZones.length + 1).padStart(3, '0')}`;
    
    const newZone = {
      id: newZoneId,
      name: zoneData.name,
      type: zoneData.type,
      employeesAssigned: 0,
      totalCapacity: zoneData.totalCapacity,
      currentWaste: 0,
      status: 'active',
      coordinates: zoneData.coordinates,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    // In a real implementation, save to MongoDB
    mockZones.push(newZone);

    return NextResponse.json({
      zone: newZone
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating zone:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
