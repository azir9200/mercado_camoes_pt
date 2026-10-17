'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { StorageDurationOption, LuggageBookingFormData } from '../../types';
import { createLuggageBooking, fetchStoreInfo, TARGET_WHATSAPP_PHONE, STORE_ADDRESS_PORTO } from '../../lib/api';
import {
  Luggage,
  Clock,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  FileText,
  Send,
  AlertCircle,
  MapPin,
  Sparkles
} from 'lucide-react';

export const LuggageCalculator: React.FC = () => {
  const { lang, t } = useLanguage();

  const [bagCount, setBagCount] = useState<number>(2);
  const [durationType, setDurationType] = useState<StorageDurationOption>('3h');
  const [customHours, setCustomHours] = useState<number>(5);
  const [dropoffTime, setDropoffTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [directSuccess, setDirectSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [rates, setRates] = useState({
    oneHour: 2.50,
    threeHours: 5.00,
    oneDay: 8.00,
    extraHour: 1.50
  });

  const isPt = lang === 'pt';

  useEffect(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    setDropoffTime(d.toISOString().slice(0, 16));

    fetchStoreInfo()
      .then((info) => {
        if (info?.luggageRates) {
          setRates(info.luggageRates);
        }
      })
      .catch(() => {});
  }, []);

  // Pricing calculations using dynamic store rates
  const quote = useMemo(() => {
    let ratePerBag = rates.threeHours;
    let effectiveHours = 3;

    if (durationType === '1h') {
      ratePerBag = rates.oneHour;
      effectiveHours = 1;
    } else if (durationType === '3h') {
      ratePerBag = rates.threeHours;
      effectiveHours = 3;
    } else if (durationType === '1d') {
      ratePerBag = rates.oneDay;
      effectiveHours = 24;
    } else {
      effectiveHours = Math.max(1, customHours);
      if (effectiveHours <= 1) ratePerBag = rates.oneHour;
      else if (effectiveHours <= 3) ratePerBag = rates.threeHours;
      else if (effectiveHours <= 24) ratePerBag = rates.oneDay;
      else {
        const days = Math.floor(effectiveHours / 24);
        const remHours = effectiveHours % 24;
        ratePerBag = days * rates.oneDay + Math.min(remHours * rates.extraHour, rates.oneDay);
      }
    }

    const total = ratePerBag * bagCount;

    return {
      ratePerBag,
      effectiveHours,
      total: Number(total.toFixed(2))
    };
  }, [bagCount, durationType, customHours, rates]);

  const handleOpenVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setValidationError(isPt ? 'Por favor insira o seu nome' : 'Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setValidationError(isPt ? 'Por favor insira um contacto válido' : 'Please enter a valid phone number');
      return;
    }
    setValidationError('');
    setShowVerifyModal(true);
  };

  const handleWhatsAppBooking = async () => {
    setIsSubmitting(true);
    const bookingData: LuggageBookingFormData = {
      customerName: customerName.trim(),
      customerEmail: 'guest@mercadocamoes.pt',
      customerPhone: customerPhone.trim(),
      bagCount,
      durationType,
      durationHours: quote.effectiveHours,
      dropoffTime: new Date(dropoffTime).toISOString(),
      notes
    };

    try {
      const result = await createLuggageBooking(bookingData);
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
      setShowVerifyModal(false);
      setDirectSuccess(result.booking.bookingReference);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectBooking = async () => {
    setIsSubmitting(true);
    const bookingData: LuggageBookingFormData = {
      customerName: customerName.trim(),
      customerEmail: 'guest@mercadocamoes.pt',
      customerPhone: customerPhone.trim(),
      bagCount,
      durationType,
      durationHours: quote.effectiveHours,
      dropoffTime: new Date(dropoffTime).toISOString(),
      notes
    };

    try {
      const result = await createLuggageBooking(bookingData);
      setShowVerifyModal(false);
      setDirectSuccess(result.booking.bookingReference);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xs">
              <Luggage className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {t.storage.calculatorTitle}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                {t.storage.calculatorSub}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/40 border border-white/20 text-xs font-bold backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>Rua Camões 242, Porto</span>
          </div>
        </div>
      </div>

      {directSuccess ? (
        /* Success message */
        <div className="p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              {t.storage.reserveSuccess}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isPt
                ? 'A sua reserva está confirmada. Ao chegar à Rua Camões 242 basta indicar o seu nome ou o código de referência.'
                : 'Your luggage storage spot is reserved. Simply present your name or reference code upon arrival at Rua Camões 242.'}
            </p>
            <div className="inline-block mt-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-sm font-bold border border-slate-200 dark:border-slate-700">
              Ref: {directSuccess}
            </div>
          </div>

          <button
            onClick={() => setDirectSuccess(null)}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            {isPt ? 'Fazer Nova Reserva' : 'Calculate Another Booking'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleOpenVerify} className="p-6 sm:p-8 space-y-8">
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Bag Count Selector (Clean Toggle Buttons) */}
          <div className="space-y-3">
            <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Luggage className="w-4 h-4 text-emerald-500" />
              <span>{t.storage.bagsLabel}</span>
            </label>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setBagCount(count)}
                  className={`py-3 sm:py-3.5 rounded-2xl font-extrabold text-sm sm:text-base border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    bagCount === count
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-700/25 scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>{count}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    {count === 1 ? (isPt ? 'Mala' : 'Bag') : (isPt ? 'Malas' : 'Bags')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Duration Selector (Apple-Style Segmented Cards) */}
          <div className="space-y-3">
            <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>{t.storage.durationLabel}</span>
            </label>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { type: '1h' as StorageDurationOption, label: '1 Hora', rate: '€2.50', sub: isPt ? 'Paragem Rápida' : 'Quick Stop' },
                { type: '3h' as StorageDurationOption, label: '3 Horas', rate: '€5.00', sub: isPt ? 'Mais Popular' : 'Most Popular', highlight: true },
                { type: '1d' as StorageDurationOption, label: '1 Dia (24h)', rate: '€8.00', sub: isPt ? 'Melhor Valor' : 'Best Value' },
                { type: 'custom' as StorageDurationOption, label: isPt ? 'Personalizado' : 'Custom', rate: isPt ? 'Ajustável' : 'Flexible', sub: isPt ? 'Vários Dias' : 'Multi-Day' }
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setDurationType(opt.type)}
                  className={`relative p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between min-h-[90px] ${
                    durationType === opt.type
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {opt.highlight && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                      Popular
                    </span>
                  )}
                  <div>
                    <span className="font-extrabold text-sm block">{opt.label}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{opt.sub}</span>
                  </div>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-2">
                    {opt.rate}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom hours slider if Custom is selected */}
            {durationType === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <span>{isPt ? 'Duração Desejada:' : 'Selected Duration:'}</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{customHours} {isPt ? 'horas' : 'hours'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="72"
                  value={customHours}
                  onChange={(e) => setCustomHours(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1h</span>
                  <span>24h (1d)</span>
                  <span>48h (2d)</span>
                  <span>72h (3d)</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* 3. Dropoff & Customer Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.storage.nameLabel} *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={isPt ? 'Ex: João Santos' : 'e.g. John Doe'}
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.storage.phoneLabel} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+351 920 319 177"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.storage.dropoffLabel}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="datetime-local"
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.storage.notesLabel}
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={isPt ? 'Ex: 2 malas grandes, chego de comboio' : 'e.g. 2 large bags, train arrival'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Live Pricing & Instant Summary Card */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{t.storage.totalEst}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {bagCount} {bagCount === 1 ? (isPt ? 'mala' : 'bag') : (isPt ? 'malas' : 'bags')} × €{quote.ratePerBag.toFixed(2)} ({quote.effectiveHours}h)
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                €{quote.total.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">EUR</span>
            </div>
          </div>

          {/* Submit Button Trigger */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.storage.reserveBtn}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.storage.instantWhatsAppNote}</span>
            </div>
          </div>
        </form>
      )}

      {/* Luggage Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                {isPt ? 'Confirmar Reserva de Bagagem' : 'Confirm Luggage Storage'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isPt ? 'Verifique os detalhes da sua reserva antes de enviar.' : 'Review your booking details before sending.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400">{isPt ? 'Cliente:' : 'Customer:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400">{isPt ? 'Telemóvel:' : 'Phone:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{customerPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400">{isPt ? 'Malas:' : 'Bags:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{bagCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400">{isPt ? 'Duração:' : 'Duration:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{quote.effectiveHours}h ({durationType})</span>
              </div>
              <div className="flex justify-between py-1 pt-2 text-sm font-black text-slate-900 dark:text-white">
                <span>{isPt ? 'Total Previsto:' : 'Total Cost:'}</span>
                <span className="text-emerald-600 dark:text-emerald-400">€{quote.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleWhatsAppBooking}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isPt ? 'Confirmar via WhatsApp (+351 920 319 177)' : 'Confirm via WhatsApp'}</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDirectBooking}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.storage.directBookingFallback}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {isPt ? 'Cancelar e Editar' : 'Cancel & Edit'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
