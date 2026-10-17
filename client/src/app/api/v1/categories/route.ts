import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '../../../../lib/serverStore';

export async function GET() {
  const categories = serverStore.getCategories();
  return NextResponse.json({ success: true, data: categories });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = serverStore.createCategory(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
