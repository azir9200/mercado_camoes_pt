'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage
}) => {
  const { t } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
          {emptyMessage || t.products.noProducts}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};
