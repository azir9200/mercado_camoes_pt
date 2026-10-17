'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center bg-slate-100/90 dark:bg-slate-800/80 p-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
      <button
        type="button"
        onClick={() => setLang('pt')}
        aria-label="Português"
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          lang === 'pt'
            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        PT
      </button>
      <span className="text-slate-300 dark:text-slate-600 text-[10px] select-none">•</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-label="English"
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          lang === 'en'
            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  );
};
