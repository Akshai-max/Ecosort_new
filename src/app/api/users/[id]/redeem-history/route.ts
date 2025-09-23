import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
	const history = [
		{ id: 'h1', rewardTitle: 'Eco Tote Bag', points: 500, status: 'completed', date: new Date().toISOString() },
		{ id: 'h2', rewardTitle: 'Coffee Voucher', points: 300, status: 'processing', date: new Date().toISOString() },
	];
	return NextResponse.json({ history });
}

