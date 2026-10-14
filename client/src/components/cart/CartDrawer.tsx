'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { XIcon, ShoppingBagIcon, MessageCircleIcon, Trash2Icon } from '../common/Icons';
import { generateCartWhatsAppUrl } from '../../lib/api';

export const CartDrawer: React.FC = () => {
  const { lang, t } = useLanguage();
  const { items, totalPrice, totalItems, isCartOpen, setIsCartOpen, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'local_delivery'>('pickup');
  const [notes, setNotes] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    const url = generateCartWhatsAppUrl(
      items,
      customerName,
      customerPhone,
      deliveryOption,
      notes
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-emerald-700 dark:text-emerald-400">
                <ShoppingBagIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.cart.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalItems} {t.cart.itemCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={t.cart.clearCart}
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBagIcon className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                    {t.cart.empty}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    {t.cart.emptySub}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                >
                  {t.cart.continueShopping}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>

                {/* Checkout details form */}
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {t.cart.customerDetails}
                  </h5>

                  <Input
                    label={t.cart.fullName}
                    placeholder={lang === 'pt' ? 'Ex: Maria Silva' : 'e.g. John Doe'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />

                  <Input
                    label={t.cart.phone}
                    placeholder="+351 912 345 678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {lang === 'pt' ? 'Opção de Entrega' : 'Delivery Option'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryOption('pickup')}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-left ${
                          deliveryOption === 'pickup'
                            ? 'bg-white dark:bg-slate-900 border-emerald-600 text-emerald-700 dark:text-emerald-400 shadow-xs'
                            : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        🏪 {t.cart.pickupAtStore}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryOption('local_delivery')}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-left ${
                          deliveryOption === 'local_delivery'
                            ? 'bg-white dark:bg-slate-900 border-emerald-600 text-emerald-700 dark:text-emerald-400 shadow-xs'
                            : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        🛵 {t.cart.localDelivery}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {lang === 'pt' ? 'Observações' : 'Notes'}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t.cart.notesPrompt}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">{t.cart.subtotal}</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageCircleIcon className="w-5 h-5" />
                <span>{t.cart.checkoutWhatsApp}</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                {lang === 'pt'
                  ? 'O pedido será enviado diretamente para o nosso WhatsApp para confirmação.'
                  : 'Order summary will be forwarded directly to our store WhatsApp.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
