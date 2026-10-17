import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '../../../../lib/serverStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined;
  const search = searchParams.get('search') || undefined;

  const products = serverStore.getProducts({ category, featured, search });
  return NextResponse.json({ success: true, data: products, total: products.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = serverStore.createProduct(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Invalid product payload' }, { status: 400 });
  }
}
