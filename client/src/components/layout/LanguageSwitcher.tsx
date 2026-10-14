'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { GlobeIcon } from '../common/Icons';

export const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <span className="sr-only">Select language</span>
      <button
        type="button"
        onClick={() => setLang('pt')}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1 ${
          lang === 'pt'
            ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span>🇵🇹</span>
        <span>PT</span>
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1 ${
          lang === 'en'
            ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};
