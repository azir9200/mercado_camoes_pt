'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { Badge } from '../../../components/common/Badge';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  ExternalLink,
  Train,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { TARGET_WHATSAPP_PHONE, STORE_ADDRESS_PORTO } from '../../../lib/api';

export default function ContactPage() {
  const { lang, t } = useLanguage();
  const isPt = lang === 'pt';

  const googleMapsDirectionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Rua+de+Cam%C3%B5es+242,+4000-140+Porto,+Portugal';
  const googleMapsViewUrl =
    'https://www.google.com/maps/search/?api=1&query=Rua+de+Cam%C3%B5es+242,+4000-140+Porto,+Portugal';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <Badge variant="emerald">{isPt ? 'Onde Estamos' : 'Where To Find Us'}</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.contact.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
          {t.contact.subtitle}
        </p>
      </motion.div>

      {/* Main Grid: Details + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-5 space-y-5"
        >
          {/* Card 1: Address & GPS Directions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t.contact.addressLabel}
                </h3>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Rua Camões 242
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  4000-140 Porto, Portugal (Baixa / Trindade)
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 dark:border-slate-800">
              {/* Primary Directions Button */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.contact.getDirections}</span>
              </a>

              <a
                href={googleMapsViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              >
                <span>{t.contact.openInMaps}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Hours */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Clock className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t.contact.hoursLabel}
                </h3>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {isPt ? 'Segunda a Domingo: 08:00 - 23:00' : 'Monday to Sunday: 08:00 - 23:00'}
                </p>
                <p className="text-xs text-slate-400">
                  {isPt ? 'Aberto 365 dias por ano sem interrupção.' : 'Open 365 days a year without interruption.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: WhatsApp & Telephone */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 shadow-2xs">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t.contact.phoneLabel}
                </h3>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  +351 920 319 177
                </p>
                <p className="text-xs text-slate-400">
                  {isPt ? 'Atendimento rápido por mensagem e chamadas' : 'Quick response for orders & storage inquiries'}
                </p>

                <div className="pt-3">
                  <a
                    href="https://wa.me/351920319177"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{t.contact.chatWithUs}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Metro & Transit Directions */}
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800 text-slate-700 dark:text-slate-300 space-y-2.5">
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Train className="w-4 h-4 text-emerald-600" />
              <span>{t.contact.directionsTitle}</span>
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed">
              {t.contact.directionsText}
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{isPt ? 'Zona central e segura do Porto' : 'Safe central Porto neighborhood'}</span>
            </div>
          </div>
        </motion.div>

        {/* Interactive Styled Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="lg:col-span-7 h-[580px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900 relative"
        >
          <iframe
            title="Mercado De Camões Porto - Rua Camões 242"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3004.143015486518!2d-8.610023623438814!3d41.15570081049386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2464e1c2d0f367%3A0xb30e8c14828f0ee0!2sRua%20de%20Cam%C3%B5es%20242%2C%204000-140%20Porto!5e0!3m2!1sen!2spt!4v1710000000000!5m2!1sen!2spt"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full contrast-[105%]"
          />

          {/* Floating Map Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  Mercado De Camões Porto
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Aberto / Open
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Rua Camões 242, 4000-140 Porto (Perto da Trindade)
            </p>

            <div className="pt-1 flex items-center gap-3">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isPt ? 'Como Chegar (GPS)' : 'Get Directions'}</span>
              </a>

              <a
                href="https://wa.me/351920319177"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
