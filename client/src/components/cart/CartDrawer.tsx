'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { PreCheckoutModal } from './PreCheckoutModal';
import {
  X,
  ShoppingBag,
  Trash2,
  MapPin,
  Truck,
  ArrowRight,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { lang, t } = useLanguage();
  const { items, totalPrice, totalItems, isCartOpen, setIsCartOpen, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'local_delivery'>('pickup');
  const [notes, setNotes] = useState('');
  const [isPreCheckoutOpen, setIsPreCheckoutOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isCartOpen) return null;

  const isPt = lang === 'pt';

  const handleStartCheckout = () => {
    if (items.length === 0) return;
    if (!customerName.trim()) {
      setValidationError(isPt ? 'Por favor insira o seu nome' : 'Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setValidationError(isPt ? 'Por favor insira um contacto válido' : 'Please enter a valid phone number');
      return;
    }
    setValidationError('');
    setIsPreCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/70 rounded-2xl text-emerald-700 dark:text-emerald-400 shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {t.cart.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {totalItems} {totalItems === 1 ? (isPt ? 'artigo' : 'item') : t.cart.itemCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={t.cart.clearCart}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {items.length === 0 ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg">
                      {t.cart.empty}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                      {t.cart.emptySub}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    {t.cart.continueShopping}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Items list with quantity steppers */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items.map((item) => (
                      <CartItem key={item.product.id} item={item} />
                    ))}
                  </div>

                  {/* Customer details input card */}
                  <div className="p-4 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        {t.cart.customerDetails}
                      </h5>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        Porto Express
                      </span>
                    </div>

                    {validationError && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{validationError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t.cart.fullName} *
                      </label>
                      <input
                        type="text"
                        placeholder={isPt ? 'Ex: Maria Silva' : 'e.g. John Doe'}
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t.cart.phone} *
                      </label>
                      <input
                        type="tel"
                        placeholder="+351 920 319 177"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {isPt ? 'Modalidade de Receção' : 'Delivery / Pickup Option'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeliveryOption('pickup')}
                          className={`p-2.5 text-xs font-bold rounded-2xl border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                            deliveryOption === 'pickup'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{isPt ? 'Levantamento' : 'Store Pickup'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Rua Camões 242, Porto
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeliveryOption('local_delivery')}
                          className={`p-2.5 text-xs font-bold rounded-2xl border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                            deliveryOption === 'local_delivery'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{isPt ? 'Entrega Local' : 'Local Delivery'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Porto & Alojamentos
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {isPt ? 'Observações' : 'Notes & Instructions'}
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t.cart.notesPrompt}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Total & Pre-Checkout Trigger */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 sticky bottom-0 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {t.cart.subtotal}
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleStartCheckout}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.cart.checkoutWhatsApp}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  {isPt
                    ? 'Validação de dados antes de direcionar para o WhatsApp oficial (+351 920 319 177).'
                    : 'Review order details before connecting to official WhatsApp (+351 920 319 177).'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Pre-Checkout Verification Modal */}
      <PreCheckoutModal
        isOpen={isPreCheckoutOpen}
        onClose={() => setIsPreCheckoutOpen(false)}
        customerName={customerName}
        customerPhone={customerPhone}
        deliveryOption={deliveryOption}
        notes={notes}
      />
    </>
  );
};
