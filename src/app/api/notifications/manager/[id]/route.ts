import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';
import Notification from '@/models/Notification';

// Now backed by MongoDB via Notification model

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: managerId } = await params;
    
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

    const query: any = { recipientId: managerId, recipientRole: 'manager' };
    if (type) query.type = type;
    if (priority) query.priority = priority;
    if (status === 'read') query.isRead = true; else if (status === 'unread') query.isRead = false;

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      notifications: notifications.map(n => ({
        id: n.notificationId,
        title: n.title,
        message: n.message,
        status: n.isRead ? 'read' : 'unread',
        timestamp: n.createdAt,
        type: n.type,
        priority: n.priority,
        actionRequired: n.actionRequired,
        actionUrl: n.actionUrl,
        metadata: n.metadata,
      })),
      unreadCount: notifications.filter(n => !n.isRead).length
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id: managerId } = await params;
    const notificationData = await req.json();
    
    // Create new notification document
    const count = await Notification.estimatedDocumentCount();
    const newDoc = await Notification.create({
      notificationId: `N${String((count || 0) + 1).padStart(3, '0')}`,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      priority: notificationData.priority || 'medium',
      recipientId: notificationData.recipient,
      recipientRole: 'employee',
      senderId: payload.id,
      senderName: 'Manager',
      actionRequired: notificationData.actionRequired || false,
      actionUrl: notificationData.actionUrl,
      metadata: notificationData.metadata,
    });

    return NextResponse.json({
      notification: {
        id: newDoc.notificationId,
        title: newDoc.title,
        message: newDoc.message,
        status: 'unread',
        timestamp: newDoc.createdAt,
        type: newDoc.type,
        priority: newDoc.priority,
        actionRequired: newDoc.actionRequired,
        actionUrl: newDoc.actionUrl,
        metadata: newDoc.metadata,
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}