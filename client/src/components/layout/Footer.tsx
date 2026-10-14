'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { MapPinIcon, ClockIcon, PhoneIcon, MessageCircleIcon, ShieldCheckIcon } from '../common/Icons';

export const Footer: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                MC
              </div>
              <div>
                <span className="text-xl font-bold text-white block">Mercado Camões</span>
                <span className="text-xs text-emerald-400 font-medium">Chiado • Lisboa</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 text-xs font-semibold">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>{lang === 'pt' ? 'Bagagem Segura Vigiada' : 'Monitored Bag Storage'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${lang}`} className="hover:text-emerald-400 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/products`} className="hover:text-emerald-400 transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/luggage-storage`} className="hover:text-emerald-400 transition-colors">
                  {t.nav.luggageStorage}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="hover:text-emerald-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {lang === 'pt' ? 'Localização & Horário' : 'Location & Hours'}
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPinIcon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Praça Luís de Camões 22, 1200-243 Lisboa, Portugal</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ClockIcon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'pt' ? 'Segunda a Domingo: 08:00 - 23:00' : 'Monday to Sunday: 08:00 - 23:00'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                <a href="tel:+351213456789" className="hover:text-white transition-colors">
                  +351 21 345 6789
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Order CTA */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {lang === 'pt' ? 'Atendimento WhatsApp' : 'WhatsApp Support'}
            </h4>
            <p className="text-sm text-slate-400">
              {lang === 'pt'
                ? 'Faça o seu pedido ou reserve o depósito de malas diretamente connosco.'
                : 'Send your grocery orders or reserve luggage storage directly in seconds.'}
            </p>
            <a
              href="https://wa.me/351912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-all shadow-md"
            >
              <MessageCircleIcon className="w-4 h-4" />
              <span>+351 912 345 678</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Mercado Camões. {t.footer.rights}</p>
          <p className="flex items-center gap-1">
            <span>{t.footer.heart}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
