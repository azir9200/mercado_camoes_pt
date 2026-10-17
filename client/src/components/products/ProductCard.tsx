'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';
import { ShoppingBag, Check, Sparkles, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const title = lang === 'pt' ? product.name_pt : product.name_en;
  const description = lang === 'pt' ? product.description_pt : product.description_en;
  const primaryImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300"
    >
      {/* Product Image Frame */}
      <Link href={`/${lang}/products/${product.id}`} className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block">
        <img
          src={primaryImg}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Featured Tag */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-emerald-500 text-white shadow-md shadow-emerald-600/30">
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'pt' ? 'Destaque' : 'Featured'}</span>
            </span>
          </div>
        )}

        {/* Stock status badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.products.inStock}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 justify-between space-y-4">
        <div className="space-y-1.5">
          {product.category && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {lang === 'pt' ? product.category.name_pt : product.category.name_en}
            </span>
          )}
          <Link href={`/${lang}/products/${product.id}`} className="block">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/90 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {t.products.perUnit} {product.unit}
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              €{product.price.toFixed(2)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
              isAdded
                ? 'bg-emerald-700 text-white shadow-emerald-800/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/20 hover:shadow-emerald-600/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>{t.products.addedToCart}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.products.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
