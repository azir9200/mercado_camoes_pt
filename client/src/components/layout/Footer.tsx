'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Clock, Phone, MessageCircle, ShieldCheck, SlidersHorizontal, Store } from 'lucide-react';

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
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white block">Mercado De Camões</span>
                <span className="text-xs text-emerald-400 font-medium">Baixa • Porto</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-emerald-400 text-xs font-semibold border border-slate-700/60">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'pt' ? 'Bagagem Segura Vigiada 24/7' : 'Monitored 24/7 Bag Storage'}</span>
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
              <li>
                <Link href={`/${lang}/admin`} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-400">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{t.nav.admin}</span>
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
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rua Camões 242, 4000-140 Porto, Portugal</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'pt' ? 'Segunda a Domingo: 11:00 - 23:59' : 'Monday to Sunday: 11:00 - 23:59'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <a href="tel:+351920319177" className="hover:text-white transition-colors font-medium">
                  +351 920 319 177
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Order CTA */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {lang === 'pt' ? 'Atendimento WhatsApp' : 'WhatsApp Support'}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'pt'
                ? 'Faça o seu pedido ou reserve o depósito de malas diretamente connosco.'
                : 'Send your grocery orders or reserve luggage storage directly in seconds.'}
            </p>
            <a
              href="https://wa.me/351920319177"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-all shadow-md active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              <span>+351 920 319 177</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Mercado De Camões Porto. {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}/admin`}
              className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 text-[11px]"
              title="Acesso Reservado ao Administrador"
            >
              <span>🔒</span>
              <span>Acesso Reservado</span>
            </Link>
            <p className="flex items-center gap-1">
              <span>{t.footer.heart}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
