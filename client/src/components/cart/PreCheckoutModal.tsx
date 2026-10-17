'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { generateCartWhatsAppUrl, submitDirectOrder, TARGET_WHATSAPP_PHONE } from '../../lib/api';
import { X, CheckCircle2, MessageCircle, Send, ShoppingBag, MapPin, Truck, AlertCircle } from 'lucide-react';

interface PreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerPhone: string;
  deliveryOption: 'pickup' | 'local_delivery';
  notes: string;
}

export const PreCheckoutModal: React.FC<PreCheckoutModalProps> = ({
  isOpen,
  onClose,
  customerName,
  customerPhone,
  deliveryOption,
  notes
}) => {
  const { lang, t } = useLanguage();
  const { items, totalPrice, clearCart, setIsCartOpen } = useCart();
  const [submittingDirect, setSubmittingDirect] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPt = lang === 'pt';

  const handleWhatsAppRedirect = async () => {
    // 1. Log order to backend
    try {
      await submitDirectOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryOption,
        notes,
        items: items.map(item => ({
          productId: item.product.id,
          name: isPt ? item.product.name_pt : item.product.name_en,
          quantity: item.quantity,
          unitPrice: item.product.price
        })),
        orderType: 'WHATSAPP'
      });
    } catch {
      // ignore
    }

    // 2. Open WhatsApp link with pre-filled message
    const url = generateCartWhatsAppUrl(
      items,
      customerName.trim(),
      customerPhone.trim(),
      deliveryOption,
      notes,
      lang
    );
    window.open(url, '_blank', 'noopener,noreferrer');

    clearCart();
    setIsCartOpen(false);
    onClose();
  };

  const handleDirectOrder = async () => {
    setSubmittingDirect(true);
    try {
      const res = await submitDirectOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryOption,
        notes,
        items: items.map(item => ({
          productId: item.product.id,
          name: isPt ? item.product.name_pt : item.product.name_en,
          quantity: item.quantity,
          unitPrice: item.product.price
        })),
        orderType: 'DIRECT'
      });

      setOrderCompleted(res.order.orderNumber);
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDirect(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden"
        >
          {/* Top colored accent line */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {orderCompleted ? (
            /* Success confirmation for Direct Order */
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {t.cart.orderSuccessTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                  {t.cart.orderSuccessMessage}
                </p>
                <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700">
                  Ref: {orderCompleted}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    onClose();
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all"
                >
                  {isPt ? 'Voltar à Loja' : 'Back to Store'}
                </button>
              </div>
            </div>
          ) : (
            /* Verification summary view */
            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="space-y-1 pr-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t.cart.verifyModalTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {t.cart.verifyModalSub}
                </p>
              </div>

              {/* Customer summary box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">{t.cart.fullName}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{customerName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">{t.cart.phone}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{customerPhone}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">{isPt ? 'Modalidade' : 'Option'}:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    {deliveryOption === 'pickup' ? (
                      <>
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Rua Camões 242, Porto</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-3.5 h-3.5" />
                        <span>{t.cart.localDelivery}</span>
                      </>
                    )}
                  </span>
                </div>
                {notes && (
                  <div className="pt-1">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">{isPt ? 'Notas:' : 'Notes:'}</span>
                    <span className="italic text-slate-700 dark:text-slate-300 text-xs block mt-0.5">{notes}</span>
                  </div>
                )}
              </div>

              {/* Items summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isPt ? 'Resumo dos Artigos' : 'Items Ordered'} ({items.length})</span>
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-40 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.product.id} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[260px]">
                        {isPt ? item.product.name_pt : item.product.name_en} <span className="text-emerald-600 dark:text-emerald-400 font-bold">×{item.quantity}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 text-sm">{t.cart.subtotal}</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp vs Non-WhatsApp Fallback */}
              <div className="space-y-3 pt-2">
                {/* 1. WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                  <span>{t.cart.sendViaWhatsApp}</span>
                </button>

                {/* 2. Direct Fallback Button (Non-WhatsApp users) */}
                <button
                  type="button"
                  disabled={submittingDirect}
                  onClick={handleDirectOrder}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{submittingDirect ? (isPt ? 'A processar...' : 'Submitting...') : t.cart.submitDirectOrder}</span>
                </button>

                <p className="text-[11px] text-center text-slate-400 pt-1">
                  {isPt
                    ? 'Receberá confirmação imediata da nossa equipa na Rua Camões 242, Porto.'
                    : 'Immediate confirmation from our team at Rua Camões 242, Porto.'}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
