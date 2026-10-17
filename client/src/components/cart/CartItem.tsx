'use client';

import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { lang } = useLanguage();
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const productName = lang === 'pt' ? product.name_pt : product.name_en;
  const primaryImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 last:border-0 group">
      {/* Product Image */}
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <img
          src={primaryImg}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info & Quantity */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
          {productName}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          €{product.price.toFixed(2)} / {product.unit}
        </p>

        <div className="flex items-center justify-between pt-1">
          {/* Dynamic Quantity Stepper */}
          <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/80 shadow-2xs">
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-1 sm:p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-black text-slate-800 dark:text-slate-200 min-w-6 text-center select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="p-1 sm:p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            €{(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => removeItem(product.id)}
        className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
