'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutGrid } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedSlug,
  onSelect
}) => {
  const { lang, t } = useLanguage();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-2xs ${
          selectedSlug === null
            ? 'bg-emerald-600 text-white shadow-emerald-700/20 shadow-md scale-105'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>{t.products.allCategories}</span>
      </button>

      {categories.map((category) => {
        const isSelected = selectedSlug === category.slug;
        const name = lang === 'pt' ? category.name_pt : category.name_en;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.slug)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 cursor-pointer shadow-2xs ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-emerald-700/20 shadow-md scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};
