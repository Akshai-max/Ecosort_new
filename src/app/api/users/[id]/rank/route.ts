import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
	// Mocked rank; integrate with real leaderboard later
	return NextResponse.json({ rank: 42, points: 1234 });
}

