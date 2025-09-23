import { NextResponse } from 'next/server';

export async function GET() {
	const faq = [
		{ id: 'f1', q: 'How to scan waste?', a: 'Go to Scan Waste and follow on-screen instructions.', category: 'scan' },
		{ id: 'f2', q: 'How to redeem rewards?', a: 'Open Rewards, choose an item, and confirm.', category: 'reward' },
	];
	return NextResponse.json({ faq });
}

