'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  ShoppingBag,
  MessageCircle,
  Menu,
  X,
  Clock,
  MapPin,
  Store,
  ShieldCheck
} from 'lucide-react';
import { isStoredAdminAuthenticated } from '../../lib/api';

export const Navbar: React.FC = () => {
  const { lang, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setIsAdminLoggedIn(isStoredAdminAuthenticated());
  }, [pathname]);

  // Clean customer navigation without internal CMS exposure
  const navLinks = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/products`, label: t.nav.products },
    { href: `/${lang}/luggage-storage`, label: t.nav.luggageStorage },
    { href: `/${lang}/contact`, label: t.nav.contact }
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}` && (pathname === `/${lang}` || pathname === '/')) return true;
    return pathname.startsWith(href) && href !== `/${lang}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/70 dark:border-slate-800/80 transition-colors shadow-2xs">
      {/* Top subtle info bar: opening hours, location & WhatsApp */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 hidden sm:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'pt' ? 'Seg - Dom: 08:00 - 23:59' : 'Mon - Sun: 10:00 - 23:59'}</span>
            </span>
            <span className="text-slate-700 select-none">•</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rua Camões 242, 4000-140 Porto</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/351920319177"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>+351 920 319 177</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Mercado De Camões
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                Porto
              </span>
            </div>
          </Link>

          {/* Desktop Clean Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 ${active
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Discreet Admin link ONLY visible when admin is logged in */}
            {isAdminLoggedIn && (
              <Link
                href={`/${lang}/admin`}
                className="ml-2 px-3 py-1 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin CMS</span>
              </Link>
            )}
          </nav>

          {/* Right Action Controls: Language, Cart, WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Carrinho"
              className="relative p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* WhatsApp Quick Action */}
            <a
              href="https://wa.me/351920319177"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs hover:shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${isActive(link.href)
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}

            {isAdminLoggedIn && (
              <Link
                href={`/${lang}/admin`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Painel Admin CMS</span>
              </Link>
            )}
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/351920319177"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: +351 920 319 177</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
