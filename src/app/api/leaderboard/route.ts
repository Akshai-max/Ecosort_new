import { NextRequest, NextResponse } from 'next/server';

// Mock data for scaffolding; replace with DB queries later.
const USERS = Array.from({ length: 250 }).map((_, i) => ({
	id: `u${i + 1}`,
	name: `User ${i + 1}`,
	avatar: `/api/placeholder/avatar/${(i % 10) + 1}`,
	points: Math.floor(Math.random() * 5000),
	zone: ['North', 'South', 'East', 'West'][i % 4],
})).sort((a, b) => b.points - a.points);

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const page = Number(searchParams.get('page') || '1');
	const pageSize = Number(searchParams.get('pageSize') || '20');
	const zone = searchParams.get('zone') || undefined;
	const range = (searchParams.get('range') || 'all') as 'week' | 'month' | 'all';

	let filtered = USERS;
	if (zone) filtered = filtered.filter(u => u.zone === zone);
	// range ignored in mock; hook into time series later

	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const top = filtered.slice(start, end).map((u, idx) => ({
		rank: start + idx + 1,
		id: u.id,
		name: u.name,
		avatar: u.avatar,
		points: u.points,
	}));

	const summary = {
		rank: 42,
		points: 1234,
		weeklyGain: range === 'week' ? 120 : 0,
	};

	return NextResponse.json({ top, total: filtered.length, summary });
}

