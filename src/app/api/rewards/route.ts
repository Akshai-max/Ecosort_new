import { NextRequest, NextResponse } from 'next/server';

const REWARDS = [
	{ id: 'r1', title: 'Eco Tote Bag', points: 500, stock: 120, category: 'Physical', image: '/public/ecosort-logo.png', description: 'Reusable eco-friendly tote.' },
	{ id: 'r2', title: 'Coffee Voucher', points: 300, stock: 80, category: 'Vouchers', image: '/public/ecosort-logo.png', description: 'Rs. 100 coffee voucher.' },
	{ id: 'r3', title: 'Tree Planting Donation', points: 200, stock: 9999, category: 'Donations', image: '/public/ecosort-logo.png', description: 'Donate for planting trees.' },
];

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const category = searchParams.get('category') || undefined;
	const rewards = category ? REWARDS.filter(r => r.category.toLowerCase() === category.toLowerCase()) : REWARDS;
	return NextResponse.json({ rewards });
}

