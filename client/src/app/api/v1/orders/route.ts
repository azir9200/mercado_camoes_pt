import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '../../../../lib/serverStore';

export async function GET() {
  const orders = serverStore.getOrders();
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = serverStore.createOrder(body);
    return NextResponse.json({ success: true, data: { order: created } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
