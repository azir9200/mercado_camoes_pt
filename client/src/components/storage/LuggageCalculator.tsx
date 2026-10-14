'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageDurationOption, LuggageBookingFormData } from '../../types';
import { createLuggageBooking } from '../../lib/api';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { LuggageIcon, ClockIcon, ShieldCheckIcon, MessageCircleIcon, CheckIcon } from '../common/Icons';

export const LuggageCalculator: React.FC = () => {
  const { lang, t } = useLanguage();

  const [bagCount, setBagCount] = useState<number>(2);
  const [durationType, setDurationType] = useState<StorageDurationOption>('3h');
  const [customHours, setCustomHours] = useState<number>(5);
  const [dropoffTime, setDropoffTime] = useState<string>('2026-10-13T10:00');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    setDropoffTime(d.toISOString().slice(0, 16));
  }, []);

  // Pricing calculations
  const quote = useMemo(() => {
    let ratePerBag = 5.00;
    let effectiveHours = 3;

    if (durationType === '1h') {
      ratePerBag = 2.50;
      effectiveHours = 1;
    } else if (durationType === '3h') {
      ratePerBag = 5.00;
      effectiveHours = 3;
    } else if (durationType === '1d') {
      ratePerBag = 8.00;
      effectiveHours = 24;
    } else {
      // custom
      effectiveHours = Math.max(1, customHours);
      if (effectiveHours <= 1) ratePerBag = 2.50;
      else if (effectiveHours <= 3) ratePerBag = 5.00;
      else if (effectiveHours <= 24) ratePerBag = 8.00;
      else {
        const days = Math.floor(effectiveHours / 24);
        const remHours = effectiveHours % 24;
        ratePerBag = days * 8.00 + Math.min(remHours * 1.50, 8.00);
      }
    }

    const total = ratePerBag * bagCount;

    return {
      ratePerBag,
      effectiveHours,
      total: Number(total.toFixed(2))
    };
  }, [bagCount, durationType, customHours]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingData: LuggageBookingFormData = {
      customerName: customerName || (lang === 'pt' ? 'Cliente Visitante' : 'Guest Traveler'),
      customerEmail: 'guest@mercadocamoes.pt',
      customerPhone: customerPhone || '+351',
      bagCount,
      durationType,
      durationHours: quote.effectiveHours,
      dropoffTime: new Date(dropoffTime).toISOString(),
      notes
    };

    try {
      const result = await createLuggageBooking(bookingData);
      setIsSuccess(true);
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/15 backdrop-blur-xs rounded-2xl">
            <LuggageIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {t.storage.calculatorTitle}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {lang === 'pt'
                ? 'Preço transparente por mala sem taxas escondidas.'
                : 'Transparent pricing per bag with no hidden cancellation fees.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Number of Bags */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {t.storage.bagsLabel}
          </label>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setBagCount(num)}
                className={`py-3 px-2 rounded-xl text-sm font-extrabold transition-all duration-200 border cursor-pointer ${
                  bagCount === num
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {num} {num === 1 ? (lang === 'pt' ? 'Mala' : 'Bag') : (lang === 'pt' ? 'Malas' : 'Bags')}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {t.storage.durationLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setDurationType('1h')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                durationType === '1h'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">1 Hora</div>
              <div className="text-base font-black text-slate-900 dark:text-white mt-1">€2.50</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'pt' ? 'por mala' : 'per bag'}</div>
            </button>

            <button
              type="button"
              onClick={() => setDurationType('3h')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                durationType === '3h'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-600 text-[9px] font-bold text-white rounded-full">
                Popular
              </span>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">3 Horas</div>
              <div className="text-base font-black text-slate-900 dark:text-white mt-1">€5.00</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'pt' ? 'por mala' : 'per bag'}</div>
            </button>

            <button
              type="button"
              onClick={() => setDurationType('1d')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                durationType === '1d'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{lang === 'pt' ? '1 Dia (24h)' : '1 Day (24h)'}</div>
              <div className="text-base font-black text-slate-900 dark:text-white mt-1">€8.00</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'pt' ? 'por mala' : 'per bag'}</div>
            </button>

            <button
              type="button"
              onClick={() => setDurationType('custom')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                durationType === 'custom'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{lang === 'pt' ? 'Personalizado' : 'Custom'}</div>
              <div className="text-base font-black text-slate-900 dark:text-white mt-1">Flexível</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'pt' ? 'várias horas/dias' : 'multi-hour/day'}</div>
            </button>
          </div>

          {durationType === 'custom' && (
            <div className="mt-3 flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {lang === 'pt' ? 'Quantas horas no total?' : 'Total hours needed:'}
              </span>
              <input
                type="number"
                min={1}
                max={168}
                value={customHours}
                onChange={(e) => setCustomHours(parseInt(e.target.value, 10) || 1)}
                className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white text-center"
              />
              <span className="text-xs text-slate-500">horas / hours</span>
            </div>
          )}
        </div>

        {/* Drop-off Date & Time */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {t.storage.dropoffLabel}
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t.storage.nameLabel}
            placeholder={lang === 'pt' ? 'Ex: João Santos' : 'e.g. Alex Miller'}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <Input
            label={t.storage.phoneLabel}
            placeholder="+351 912 345 678"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            {t.storage.notesLabel}
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={lang === 'pt' ? 'Ex: 2 malas grandes e 1 mochila; chegamos de elétrico.' : 'e.g. 2 large suitcases; arriving by Tram 28.'}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Price Breakdown Summary */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t.storage.totalEst}
            </span>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
              €{quote.total.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              €{quote.ratePerBag.toFixed(2)} × {bagCount} {bagCount === 1 ? 'mala' : 'malas'} ({durationType})
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircleIcon className="w-5 h-5" />
            <span>{isSubmitting ? (lang === 'pt' ? 'A preparar...' : 'Preparing...') : t.storage.reserveBtn}</span>
          </button>
        </div>

        {/* Reassurance text */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 justify-center">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t.storage.instantWhatsAppNote}</span>
        </div>
      </form>
    </div>
  );
};
