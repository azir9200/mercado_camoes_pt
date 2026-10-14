'use client';

import React from 'react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

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
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
          selectedSlug === null
            ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-slate-900/10'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        {t.products.allCategories}
      </button>

      {categories.map((category) => {
        const isSelected = selectedSlug === category.slug;
        const name = lang === 'pt' ? category.name_pt : category.name_en;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.slug)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-emerald-700/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};
