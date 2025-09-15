import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';

// Mock notifications data - in a real implementation, this would be stored in MongoDB
let mockNotifications = [
  {
    id: 'N001',
    title: 'Equipment Maintenance Required',
    message: 'Sorting machine in Zone A requires immediate maintenance. Error code E-404 detected.',
    type: 'urgent',
    priority: 'critical',
    sender: 'system',
    senderName: 'System Alert',
    recipient: 'manager123',
    recipientName: 'Manager',
    isRead: false,
    createdAt: '2024-01-15T10:30:00',
    actionRequired: true,
    actionUrl: '/manager/dashboard?canvas=issues',
    metadata: { zoneId: 'Z001', issueId: 'I001' }
  },
  {
    id: 'N002',
    title: 'Task Completed',
    message: 'John Doe has completed the plastic waste collection task in Zone A.',
    type: 'success',
    priority: 'low',
    sender: 'E001',
    senderName: 'John Doe',
    recipient: 'manager123',
    recipientName: 'Manager',
    isRead: true,
    createdAt: '2024-01-15T09:15:00',
    actionRequired: false,
    metadata: { taskId: 'T001' }
  },
  {
    id: 'N003',
    title: 'Shift Update',
    message: 'Sarah Wilson has requested a shift change for tomorrow. Please review and approve.',
    type: 'info',
    priority: 'medium',
    sender: 'E004',
    senderName: 'Sarah Wilson',
    recipient: 'manager123',
    recipientName: 'Manager',
    isRead: false,
    createdAt: '2024-01-15T08:45:00',
    actionRequired: true,
    actionUrl: '/manager/dashboard?canvas=employees'
  },
  {
    id: 'N004',
    title: 'Weekly Report Ready',
    message: 'Your weekly waste collection report is ready for review and download.',
    type: 'info',
    priority: 'low',
    sender: 'system',
    senderName: 'Report Generator',
    recipient: 'manager123',
    recipientName: 'Manager',
    isRead: true,
    createdAt: '2024-01-15T07:00:00',
    actionRequired: false,
    actionUrl: '/manager/dashboard?canvas=reports'
  },
  {
    id: 'N005',
    title: 'Safety Alert',
    message: 'Broken glass reported in Zone A. Area has been cordoned off for safety.',
    type: 'warning',
    priority: 'high',
    sender: 'E001',
    senderName: 'John Doe',
    recipient: 'manager123',
    recipientName: 'Manager',
    isRead: false,
    createdAt: '2024-01-15T06:30:00',
    actionRequired: true,
    metadata: { zoneId: 'Z001', issueId: 'I005' }
  }
];

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

    const managerId = params.id;
    
    // Verify the manager is accessing their own data
    if (payload.id !== managerId) {
      return NextResponse.json(
        { error: 'Access denied. Cannot access other manager data.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');

    let filteredNotifications = mockNotifications.filter(n => n.recipient === managerId);

    // Apply filters
    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }
    if (priority) {
      filteredNotifications = filteredNotifications.filter(n => n.priority === priority);
    }
    if (status === 'read') {
      filteredNotifications = filteredNotifications.filter(n => n.isRead);
    } else if (status === 'unread') {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    }

    return NextResponse.json({
      notifications: filteredNotifications,
      unreadCount: filteredNotifications.filter(n => !n.isRead).length
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
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

    const managerId = params.id;
    const notificationData = await req.json();
    
    // Generate new notification ID
    const newNotificationId = `N${String(mockNotifications.length + 1).padStart(3, '0')}`;
    
    const newNotification = {
      id: newNotificationId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      priority: notificationData.priority || 'medium',
      sender: payload.id,
      senderName: 'Manager',
      recipient: notificationData.recipient,
      recipientName: notificationData.recipientName || 'Employee',
      isRead: false,
      createdAt: new Date().toISOString(),
      actionRequired: notificationData.actionRequired || false,
      actionUrl: notificationData.actionUrl,
      metadata: notificationData.metadata
    };

    // Add to mock data
    mockNotifications.push(newNotification);

    return NextResponse.json({
      notification: newNotification
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}