import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';
import Task from '@/models/Task';
import Employee from '@/models/Employee';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const payload = await authenticateRequest(req as any);

    if (payload.role !== 'employee' || payload.id !== params.id) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const employee = await Employee.findById(params.id).lean();
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const tasks = await Task.find({ assignedTo: params.id }).lean();
    const tasksAssigned = tasks.length;
    const tasksCompleted = tasks.filter(t => t.status === 'completed').length;
    const completionRate = tasksAssigned ? Math.round((tasksCompleted / tasksAssigned) * 100) : 0;

    const points = employee.points || 0;
    const rank = employee.rank || 'Employee';

    // Simple weekly aggregation by createdAt week label
    const weeklyMap = new Map<string, { points: number; tasksCompleted: number }>();
    tasks.forEach(t => {
      const d = new Date(t.createdAt as any);
      const week = `W${getWeekNumber(d)}`;
      const e = weeklyMap.get(week) || { points: 0, tasksCompleted: 0 };
      if (t.status === 'completed') e.tasksCompleted += 1;
      e.points += t.points || 0;
      weeklyMap.set(week, e);
    });

    const weeklyHistory = Array.from(weeklyMap.entries()).map(([week, v]) => ({ week, points: v.points, tasksCompleted: v.tasksCompleted }));

    return NextResponse.json({
      performance: {
        currentRank: rank,
        currentPoints: points,
        monthlyRank: 0,
        totalEmployees: 0,
        monthlyPoints: 0,
        weeklyPoints: weeklyHistory.reduce((s, w) => s + w.points, 0),
        dailyPoints: 0,
        tasksCompleted,
        tasksAssigned,
        completionRate,
        averageTaskTime: 0,
        streak: 0,
        achievements: [],
        monthlyHistory: [],
        weeklyHistory,
        leaderboard: [],
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date as any) - (yearStart as any)) / 86400000 + 1) / 7);
}

