'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { fetchProducts } from '../../lib/api';
import { Product } from '../../types';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Badge } from '../../components/common/Badge';
import {
  ShoppingBag,
  Luggage,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Wine,
  Sparkles,
  ArrowRight,
  Store,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const { lang, t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isPt = lang === 'pt';

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
      {/* 1. Hero Section (Apple/Stripe Inspired Glow & Glassmorphism) */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 sm:pt-24 pb-24 sm:pb-32">
        {/* Subtle decorative glow & gradient meshes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.3),rgba(255,255,255,0))]" />
        <div className="absolute -top-40 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs font-bold tracking-wide backdrop-blur-md shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-white">
              {t.hero.titleLine1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                {t.hero.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={`/${lang}/products`}
                className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-700/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{t.hero.ctaProducts}</span>
              </Link>

              <Link
                href={`/${lang}/luggage-storage`}
                className="px-6 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Luggage className="w-5 h-5 text-emerald-400" />
                <span>{t.hero.ctaLuggage}</span>
              </Link>

              <a
                href="https://wa.me/351920319177"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5 fill-white text-white" />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Micro pills */}
            <div className="pt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.hoursPill}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.locationPill}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CCTV 24/7 Monitored Storage</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="emerald">{isPt ? 'Quem Somos' : 'About Our Store'}</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.about.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-xs">
              <Wine className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t.about.card1Title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.about.card1Desc}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Luggage className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t.about.card2Title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.about.card2Desc}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366] shadow-xs">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t.about.card3Title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.about.card3Desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="emerald">{isPt ? 'Mercearia Fina & Vinhos' : 'Gourmet Portuguese Groceries'}</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              {t.products.featuredTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              {t.products.featuredSubtitle}
            </p>
          </div>

          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
          >
            <span>{t.products.allProductsTitle}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <ProductGrid products={featuredProducts.slice(0, 8)} />
        )}
      </section>

      {/* 4. Luggage Storage Callout Banner (Porto) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Luggage className="w-4 h-4 text-emerald-400" />
              <span>{isPt ? 'Serviço Oficial de Guarda de Bagagem no Porto' : 'Official Porto Luggage Storage Sanctuary'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {isPt ? 'Explore o Porto sem carregar as suas malas' : 'Explore Porto Hands-Free & Carefree'}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isPt
                ? 'Deixe as suas malas no nosso espaço seguro mesmo na Rua Camões 242 enquanto espera pelo check-in do Airbnb ou pelo voo. Tarifas a partir de €2.50.'
                : 'Drop your bags with our friendly staff at Rua Camões 242 while waiting for your Airbnb check-in or evening train. Hourly and daily rates starting at €2.50.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/${lang}/luggage-storage`}
                className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all hover:scale-105"
              >
                <span>{isPt ? 'Calcular Tarifa & Reservar' : 'Calculate Rates & Book'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isPt ? 'Sem pagamento antecipado • Pague no balcão' : 'Pay in person at drop-off'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
