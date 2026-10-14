'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Badge } from '../../../components/common/Badge';
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '../../../components/common/Icons';

export default function ContactPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="emerald">{lang === 'pt' ? 'Onde Estamos' : 'Where To Find Us'}</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.contact.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
          {t.contact.subtitle}
        </p>
      </div>

      {/* Main Grid: Details + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.contact.addressLabel}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Praça Luís de Camões 22
                </p>
                <p className="text-xs text-slate-400">
                  1200-243 Lisboa, Portugal (Chiado / Bairro Alto)
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href="https://maps.google.com/?q=Praça+Luís+de+Camões+Lisboa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{t.contact.openInMaps}</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0">
                <ClockIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.contact.hoursLabel}
                </h3>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {lang === 'pt' ? 'Segunda a Domingo: 08:00 - 23:00' : 'Monday to Sunday: 08:00 - 23:00'}
                </p>
                <p className="text-xs text-slate-400">
                  {lang === 'pt' ? 'Aberto 365 dias por ano sem interrupção.' : 'Open 365 days a year without interruption.'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircleIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.contact.phoneLabel} & WhatsApp
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  +351 912 345 678 (WhatsApp)
                </p>
                <p className="text-xs text-slate-400">
                  +351 21 345 6789 (Fixo / Landline)
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/351912345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold"
                  >
                    <MessageCircleIcon className="w-3.5 h-3.5" />
                    <span>{t.contact.chatWithUs}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Direction Guidelines */}
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 space-y-2">
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <span>🚃</span>
              <span>{t.contact.directionsTitle}</span>
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed">
              {t.contact.directionsText}
            </p>
          </div>
        </div>

        {/* Interactive Map Embed */}
        <div className="lg:col-span-7 h-[540px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900 relative">
          <iframe
            title="Mercado Camões Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.2389146059635!2d-9.1458!3d38.7107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19347f0d014457%3A0x6b4dbdf69b187515!2sPra%C3%A7a%20Lu%C3%ADs%20de%20Cam%C3%B5es!5e0!3m2!1sen!2spt!4v1700000000000!5m2!1sen!2spt"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[15%] contrast-[105%]"
          />

          {/* Map Overlay Card */}
          <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-sm p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">Mercado Camões</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Praça Luís de Camões 22, Lisboa (ao lado do Elétrico 28)
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://maps.google.com/?q=Praça+Luís+de+Camões+Lisboa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t.contact.openInMaps} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
