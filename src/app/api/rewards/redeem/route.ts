import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null);
	if (!body?.userId || !body?.rewardId || !body?.quantity) {
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
	}
	// Mock success
	return NextResponse.json({ success: true, remainingPoints: 900, orderId: `ord_${Date.now()}` });
}

