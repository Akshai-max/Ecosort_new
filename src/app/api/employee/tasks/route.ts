import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';
import Task from '@/models/Task';

export async function GET(req: Request) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req as any);

    // Only employees can fetch their own tasks
    if (payload.role !== 'employee') {
      return NextResponse.json(
        { error: 'Access denied. Employee role required.' },
        { status: 403 }
      );
    }

    const tasks = await Task.find({ assignedTo: payload.id })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = tasks.map((t: any) => ({
      id: t.taskId,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      assignedBy: t.assignedBy,
      zoneId: t.zoneId,
      estimatedDuration: t.estimatedDuration,
      points: t.points,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      completedAt: t.completedAt,
      notes: t.notes,
      tags: t.tags,
      proofOfWork: t.proofOfWork,
    }));

    return NextResponse.json({ tasks: mapped });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

