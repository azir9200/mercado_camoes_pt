import { NextResponse } from 'next/server';
import { serverStore } from '../../../../../lib/serverStore';

export async function GET() {
  const storeInfo = serverStore.getStoreInfo();
  return NextResponse.json({ success: true, data: storeInfo });
}
