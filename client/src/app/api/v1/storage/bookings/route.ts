import { NextResponse } from 'next/server';
import { serverStore } from '../../../../../lib/serverStore';

export async function GET() {
  const bookings = serverStore.getBookings();
  return NextResponse.json({ success: true, data: bookings });
}
