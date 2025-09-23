import { NextRequest, NextResponse } from 'next/server';

let TICKETS: any[] = [];

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null);
	if (!body?.subject || !body?.category || !body?.description) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}
	const ticket = { id: `t_${Date.now()}`, status: 'open', createdAt: new Date().toISOString(), ...body };
	TICKETS.unshift(ticket);
	return NextResponse.json({ ticketId: ticket.id, status: ticket.status });
}

export async function GET() {
	return NextResponse.json({ tickets: TICKETS });
}

