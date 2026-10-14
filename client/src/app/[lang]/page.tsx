'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { fetchProducts } from '../../lib/api';
import { Product } from '../../types';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Badge } from '../../components/common/Badge';
import {
  ShoppingBagIcon,
  LuggageIcon,
  MessageCircleIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  WineIcon,
  SparklesIcon,
  ArrowRightIcon,
  StarIcon
} from '../../components/common/Icons';

export default function HomePage() {
  const { lang, t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prods = await fetchProducts({ featured: true });
        setFeaturedProducts(prods);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 sm:pt-24 pb-24 sm:pb-32">
        {/* Subtle decorative glow & pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.25),rgba(255,255,255,0))]" />
        <div className="absolute -top-40 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs font-bold tracking-wide backdrop-blur-xs">
              <MapPinIcon className="w-4 h-4 text-emerald-400" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
              {t.hero.titleLine1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={`/${lang}/products`}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-700/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>{t.hero.ctaProducts}</span>
              </Link>

              <Link
                href={`/${lang}/luggage-storage`}
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LuggageIcon className="w-5 h-5 text-emerald-400" />
                <span>{t.hero.ctaLuggage}</span>
              </Link>

              <a
                href="https://wa.me/351912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
              >
                <MessageCircleIcon className="w-5 h-5" />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Micro pills */}
            <div className="pt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <ClockIcon className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.hoursPill}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <MapPinIcon className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.locationPill}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                <span>CCTV 24/7 Monitored Storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Shop / Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="emerald">{lang === 'pt' ? 'Quem Somos' : 'About Our Store'}</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.about.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-xs">
              <WineIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.about.card1Title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.about.card1Desc}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <LuggageIcon className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.about.card2Title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.about.card2Desc}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366] shadow-xs">
              <MessageCircleIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.about.card3Title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.about.card3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="emerald">{lang === 'pt' ? 'Mercearia Fina' : 'Gourmet Groceries'}</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              {t.products.featuredTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              {t.products.featuredSubtitle}
            </p>
          </div>

          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
          >
            <span>{t.products.allProductsTitle}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <ProductGrid products={featuredProducts.slice(0, 8)} />
        )}
      </section>

      {/* 4. Luggage Storage Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <LuggageIcon className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'pt' ? 'Serviço Oficial de Guarda de Bagagem' : 'Official Chiado Luggage Lockers'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {lang === 'pt' ? 'Explore Lisboa sem carregar as suas malas' : 'Explore Lisbon Hands-Free & Carefree'}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {lang === 'pt'
                ? 'Deixe as suas malas no nosso espaço seguro mesmo na Praça Luís de Camões enquanto espera pelo check-in do Airbnb ou pelo voo. Tarifas a partir de €2.50.'
                : 'Drop your bags with our friendly staff at Praça Luís de Camões while waiting for your Airbnb check-in or evening flight. Hourly and daily rates starting at €2.50.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/${lang}/luggage-storage`}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all hover:scale-105"
              >
                <span>{lang === 'pt' ? 'Calcular Tarifa & Reservar' : 'Calculate Rates & Book'}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'pt' ? 'Sem pagamento antecipado' : 'Pay in person at drop-off'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
