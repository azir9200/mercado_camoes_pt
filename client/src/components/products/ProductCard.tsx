'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';
import { ShoppingBagIcon, CheckIcon } from '../common/Icons';

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
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300">
      {/* Product Image Frame */}
      <Link href={`/${lang}/products/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block">
        <img
          src={primaryImg}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Tag */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3">
            <Badge variant="emerald">
              {lang === 'pt' ? 'Destaque' : 'Featured'}
            </Badge>
          </div>
        )}

        {/* Stock status badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-700 dark:text-slate-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.products.inStock}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div className="space-y-1.5">
          <Link href={`/${lang}/products/${product.id}`} className="block">
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              {t.products.perUnit} {product.unit}
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              €{product.price.toFixed(2)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
              isAdded
                ? 'bg-emerald-700 text-white shadow-emerald-800/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
            }`}
          >
            {isAdded ? (
              <>
                <CheckIcon className="w-4 h-4 text-emerald-200" />
                <span>{t.products.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingBagIcon className="w-4 h-4" />
                <span>{t.products.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
