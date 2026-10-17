'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../../context/LanguageContext';
import { useCart } from '../../../../context/CartContext';
import { fetchProductById, fetchProducts } from '../../../../lib/api';
import { Product } from '../../../../types';
import { Badge } from '../../../../components/common/Badge';
import { Button } from '../../../../components/common/Button';
import { ProductCard } from '../../../../components/products/ProductCard';
import {
  ShoppingBagIcon,
  CheckIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  MessageCircleIcon,
  PlusIcon,
  MinusIcon
} from '../../../../components/common/Icons';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { addItem } = useCart();

  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const prod = await fetchProductById(id);
        setProduct(prod);

        if (prod) {
          const all = await fetchProducts({ category: prod.categoryId });
          setRelatedProducts(all.filter((p) => p.id !== prod.id).slice(0, 4));
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {lang === 'pt' ? 'Produto não encontrado' : 'Product Not Found'}
        </h2>
        <Button onClick={() => router.push(`/${lang}/products`)}>
          {lang === 'pt' ? 'Voltar aos Produtos' : 'Back to Products'}
        </Button>
      </div>
    );
  }

  const title = lang === 'pt' ? product.name_pt : product.name_en;
  const description = lang === 'pt' ? product.description_pt : product.description_en;
  const primaryImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href={`/${lang}`} className="hover:text-slate-800 dark:hover:text-slate-200">
          {t.nav.home}
        </Link>
        <span>/</span>
        <Link href={`/${lang}/products`} className="hover:text-slate-800 dark:hover:text-slate-200">
          {t.nav.products}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white truncate max-w-xs">{title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Gallery / Image Frame */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <img
            src={primaryImg}
            alt={title}
            className="w-full h-full object-cover"
          />
          {product.isFeatured && (
            <div className="absolute top-4 left-4">
              <Badge variant="emerald">
                {lang === 'pt' ? 'Especialidade' : 'Specialty'}
              </Badge>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {product.category ? (lang === 'pt' ? product.category.name_pt : product.category.name_en) : 'Mercado Camões'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <div className="flex items-center gap-3 pt-1">
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                €{product.price.toFixed(2)}
              </div>
              <span className="text-xs text-slate-400">
                / {product.unit}
              </span>
              <div className="ml-auto">
                <Badge variant="emerald">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                  {t.products.inStock}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-bold text-slate-900 dark:text-white min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckIcon className="w-5 h-5 text-emerald-200" />
                    <span>{t.products.addedToCart}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="w-5 h-5" />
                    <span>{t.products.addToCart}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp Ordering Alternative */}
            <a
              href={`https://wa.me/351920319177?text=${encodeURIComponent(`Olá! Gostaria de encomendar ${quantity}x ${title} (€${(product.price * quantity).toFixed(2)}) para levantar no Mercado Camões (Rua Camões 242, Porto).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircleIcon className="w-4 h-4" />
              <span>{lang === 'pt' ? 'Pedir Imediatamente por WhatsApp' : 'Order Instantly via WhatsApp'}</span>
            </a>
          </div>

          {/* Reassurance pills */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'pt' ? 'Qualidade garantida' : 'Guaranteed fresh quality'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏪</span>
              <span>{lang === 'pt' ? 'Rua Camões 242, Porto' : 'Pickup at Rua Camões 242, Porto'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'pt' ? 'Produtos Relacionados' : 'Related Products in this Category'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Loading...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
