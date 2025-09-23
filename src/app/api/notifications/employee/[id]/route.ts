import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';
import Notification from '@/models/Notification';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const payload = await authenticateRequest(req as any);

    const { id } = await params;
    if (payload.role !== 'employee' || payload.id !== id) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query: any = { recipientId: id, recipientRole: 'employee' };
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
      unreadCount: notifications.filter(n => !n.isRead).length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

