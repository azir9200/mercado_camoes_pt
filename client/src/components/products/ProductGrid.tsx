'use client';

import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingBagIcon } from '../common/Icons';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage
}) => {
  const { t } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-3">
          <ShoppingBagIcon className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {emptyMessage || t.products.noProducts}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
