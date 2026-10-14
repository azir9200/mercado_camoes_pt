'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { LuggageCalculator } from '../../../components/storage/LuggageCalculator';
import { Badge } from '../../../components/common/Badge';
import {
  LuggageIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  CheckIcon,
  StarIcon
} from '../../../components/common/Icons';

export default function LuggageStoragePage() {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* Header Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="emerald">
          {lang === 'pt' ? 'Guarda de Bagagem no Chiado' : 'Chiado Luggage Storage'}
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.storage.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.storage.subtitle}
        </p>

        {/* Feature Pills */}
        <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            <span>24/7 CCTV Monitored</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <ClockIcon className="w-4 h-4 text-emerald-600" />
            <span>Open 08:00 - 23:00 Daily</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <MapPinIcon className="w-4 h-4 text-emerald-600" />
            <span>Praça Luís de Camões 22</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calculator & Step Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Interactive Calculator */}
        <div className="lg:col-span-7">
          <LuggageCalculator />
        </div>

        {/* Right Column: Pricing Cards & Steps */}
        <div className="lg:col-span-5 space-y-8">
          {/* Rate Cards */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'pt' ? 'Tabela de Tarifas Oficiais' : 'Official Rate Card'}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">
                    {lang === 'pt' ? '1 Hora' : '1 Hour (Short Stop)'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {lang === 'pt' ? 'Ideal para um almoço ou compras rápidas' : 'Ideal for lunch or quick errand'}
                  </span>
                </div>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  €2.50
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 shadow-xs relative">
                <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {lang === 'pt' ? 'Mais Popular' : 'Most Popular'}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">
                    {lang === 'pt' ? '3 Horas' : '3 Hours (Half Day)'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {lang === 'pt' ? 'Perfeito para passeio pelo Bairro Alto' : 'Perfect for exploring Chiado & Tram 28'}
                  </span>
                </div>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  €5.00
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">
                    {lang === 'pt' ? 'Dia Inteiro (até 24h)' : 'Full Day (up to 24h)'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {lang === 'pt' ? 'Espera pelo voo ou check-in tardio' : 'Late check-in or evening flight'}
                  </span>
                </div>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  €8.00
                </span>
              </div>
            </div>
          </div>

          {/* How It Works (3 Steps) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'pt' ? 'Como Funciona?' : 'How Does It Work?'}
            </h3>

            <div className="space-y-3">
              <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {lang === 'pt' ? 'Reserve Online ou no Balcão' : 'Book Online or Walk-In'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'pt'
                      ? 'Envie a sua reserva por WhatsApp sem necessidade de pagamento com cartão adiantado.'
                      : 'Send your reservation via WhatsApp or simply walk in. No upfront card payment required.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {lang === 'pt' ? 'Deixe as suas Malas' : 'Drop Off Your Bags'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'pt'
                      ? 'A nossa equipa etiqueta e sela cada mala num espaço interior vigiado por câmaras 24/7.'
                      : 'Our team seals and tags every item in our supervised indoor luggage space with CCTV surveillance.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {lang === 'pt' ? 'Recolha com Total Facilidade' : 'Collect Anytime Until 23:00'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'pt'
                      ? 'Apresente o seu comprovativo digital e recolha a sua mala a qualquer momento até às 23:00.'
                      : 'Show your digital reference tag and pick up your belongings anytime before 23:00.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
