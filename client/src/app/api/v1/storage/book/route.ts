import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '../../../../../lib/serverStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const booking = serverStore.createBooking(body);

    const dropoff = new Date(booking.dropoffTime).toLocaleString('pt-PT');
    const text = `🧳 *RESERVA DE BAGAGEM / LUGGAGE STORAGE*
*Mercado De Camões - Porto*
----------------------------------------
🔖 *Ref:* ${booking.bookingReference}
👤 *Nome / Name:* ${booking.customerName}
📱 *WhatsApp/Tel:* ${body.customerPhone || 'N/A'}
💼 *Malas / Bags:* ${booking.bagCount}
⏱️ *Duração / Duration:* ${booking.durationType} (${booking.durationHours}h)
📥 *Entrega / Drop-off:* ${dropoff}
💰 *Total Previsto:* €${booking.totalPrice.toFixed(2)}
${booking.notes ? `📝 *Notas:* ${booking.notes}\n` : ''}
📍 *Morada / Address:* Rua Camões 242, 4000-140 Porto
Por favor confirmem a minha reserva. / Please confirm my booking.`;

    const whatsappUrl = `https://wa.me/351920319177?text=${encodeURIComponent(text)}`;

    return NextResponse.json({
      success: true,
      data: {
        booking,
        whatsappUrl
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
