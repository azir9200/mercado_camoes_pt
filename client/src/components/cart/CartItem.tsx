'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { PlusIcon, MinusIcon, Trash2Icon } from '../common/Icons';

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
    <div className="flex items-center gap-3.5 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-800">
        <img
          src={primaryImg}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {productName}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          €{product.price.toFixed(2)} / {product.unit}
        </p>
        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Increase quantity"
            >
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-900 dark:text-white">
            €{(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeItem(product.id)}
        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        aria-label="Remove item"
      >
        <Trash2Icon className="w-4 h-4" />
      </button>
    </div>
  );
};
