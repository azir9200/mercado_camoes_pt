"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLuggageWhatsAppMessage = exports.formatOrderWhatsAppMessage = exports.buildWhatsAppUrl = void 0;
const index_js_1 = require("../config/index.js");
/**
 * Builds a direct WhatsApp click-to-chat URL with pre-filled message text.
 */
const buildWhatsAppUrl = (phone, text) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};
exports.buildWhatsAppUrl = buildWhatsAppUrl;
/**
 * Generates formatted order message for WhatsApp
 */
const formatOrderWhatsAppMessage = (order) => {
    const total = order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const itemList = order.items
        .map((item, idx) => `${idx + 1}. ${item.name} x${item.quantity} - €${(item.unitPrice * item.quantity).toFixed(2)}`)
        .join('\n');
    const text = `🛍️ *NOVA ENCOMENDA / NEW ORDER - Mercado Camões*
----------------------------------------
👤 *Cliente / Customer:* ${order.customerName}
📞 *Contacto / Phone:* ${order.customerPhone}
🚚 *Tipo / Type:* ${order.deliveryOption === 'pickup' ? 'Levantamento na Loja (Store Pickup)' : 'Entrega Local (Local Delivery)'}
${order.notes ? `📝 *Notas / Notes:* ${order.notes}\n` : ''}
🛒 *Artigos / Items:*
${itemList}

💰 *TOTAL:* €${total.toFixed(2)}
----------------------------------------
Obrigado! Por favor confirme a disponibilidade do pedido.
Thank you! Please confirm order availability.`;
    return (0, exports.buildWhatsAppUrl)(index_js_1.config.store.whatsapp, text);
};
exports.formatOrderWhatsAppMessage = formatOrderWhatsAppMessage;
/**
 * Generates formatted luggage storage reservation message for WhatsApp
 */
const formatLuggageWhatsAppMessage = (booking) => {
    const dropoff = new Date(booking.dropoffTime).toLocaleString('pt-PT', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
    const pickup = new Date(booking.pickupTime).toLocaleString('pt-PT', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
    const text = `🧳 *RESERVA DE BAGAGEM / LUGGAGE STORAGE*
*Mercado Camões - Lisboa*
----------------------------------------
🔖 *Ref:* ${booking.bookingReference}
👤 *Nome / Name:* ${booking.customerName}
📱 *WhatsApp/Tel:* ${booking.customerPhone}
💼 *Malas / Bags:* ${booking.bagCount}
⏱️ *Duração / Duration:* ${booking.durationType} (${booking.durationHours}h)
📥 *Entrega / Drop-off:* ${dropoff}
📤 *Recolha / Pick-up:* ${pickup}
💵 *Valor Previsto / Total Price:* €${booking.totalPrice.toFixed(2)}
${booking.notes ? `📝 *Notas:* ${booking.notes}\n` : ''}
----------------------------------------
📍 *Morada / Address:* Praça Luís de Camões 22, Lisboa
Por favor confirmem a minha reserva. / Please confirm my booking.`;
    return (0, exports.buildWhatsAppUrl)(index_js_1.config.store.whatsapp, text);
};
exports.formatLuggageWhatsAppMessage = formatLuggageWhatsAppMessage;
