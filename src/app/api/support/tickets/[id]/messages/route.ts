import { NextRequest, NextResponse } from 'next/server';

const STORE: Record<string, any[]> = {};

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
	return NextResponse.json({ messages: STORE[params.id] || [] });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
	const body = await req.json().catch(() => null);
	if (!body?.text) return NextResponse.json({ error: 'Message text required' }, { status: 400 });
	const arr = STORE[params.id] || (STORE[params.id] = []);
	arr.push({ id: `m_${Date.now()}`, text: body.text, at: new Date().toISOString(), from: 'user' });
	return NextResponse.json({ success: true });
}

