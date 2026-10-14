'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShoppingBagIcon, LuggageIcon, MessageCircleIcon, MenuIcon, XIcon, ClockIcon } from '../common/Icons';

export const Navbar: React.FC = () => {
  const { lang, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/products`, label: t.nav.products },
    { href: `/${lang}/luggage-storage`, label: t.nav.luggageStorage, badge: '€2.50+' },
    { href: `/${lang}/contact`, label: t.nav.contact }
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}` && (pathname === `/${lang}` || pathname === '/')) return true;
    return pathname.startsWith(href) && href !== `/${lang}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
      {/* Top micro bar: Store opening hours and quick location */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'pt' ? 'Seg - Dom: 08:00 - 23:00' : 'Mon - Sun: 08:00 - 23:00 (Open 7 Days)'}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Praça Luís de Camões 22, Lisboa (Chiado)</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/351912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
            >
              <MessageCircleIcon className="w-3.5 h-3.5" />
              <span>WhatsApp: +351 912 345 678</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl font-black tracking-tight">MC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Mercado Camões
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                Convenience & Luggage
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                    active
                      ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Language, Cart, WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Shopping Cart"
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Action */}
            <a
              href="https://wa.me/351912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircleIcon className="w-4 h-4" />
              <span>{t.nav.orderWhatsApp}</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between ${
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="pt-2">
                <a
                  href="https://wa.me/351912345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2"
                >
                  <MessageCircleIcon className="w-5 h-5" />
                  <span>{t.nav.orderWhatsApp}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
