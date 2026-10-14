'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { fetchProducts, fetchCategories } from '../../../lib/api';
import { Product, Category } from '../../../types';
import { ProductGrid } from '../../../components/products/ProductGrid';
import { CategoryFilter } from '../../../components/products/CategoryFilter';
import { Badge } from '../../../components/common/Badge';
import { SearchIcon } from '../../../components/common/Icons';

function ProductsContent() {
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setCategories(cats);
        setProducts(prods);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter(
        (p) => p.categoryId === selectedCategory || p.category?.slug === selectedCategory
      );
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const name = lang === 'pt' ? p.name_pt : p.name_en;
        const desc = lang === 'pt' ? p.description_pt : p.description_en;
        return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
      });
    }

    return result;
  }, [products, selectedCategory, searchQuery, lang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <Badge variant="emerald">{lang === 'pt' ? 'Conveniência & Mercearia' : 'Groceries & Essentials'}</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.products.allProductsTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl">
            {lang === 'pt'
              ? 'Produtos frescos, queijos, vinhos portugueses, artigos de higiene e conveniência diária em Lisboa.'
              : 'Fresh baked treats, Portuguese wines, artisanal cheeses, personal care and everyday provisions.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.products.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          {t.products.filterByCategory}
        </span>
        <CategoryFilter
          categories={categories}
          selectedSlug={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Product Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          emptyMessage={t.products.noProducts}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
