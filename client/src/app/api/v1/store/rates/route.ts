import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '../../../../../lib/serverStore';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const rates = serverStore.updateRates(body);
    return NextResponse.json({ success: true, data: rates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
