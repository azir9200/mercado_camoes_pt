import React, { Suspense } from 'react';
import { LanguageProvider } from '../../context/LanguageContext';
import { CartProvider } from '../../context/CartContext';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/cart/CartDrawer';
import { Language } from '../../types';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'en' ? 'en' : 'pt';

  return (
    <LanguageProvider initialLang={lang}>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<header className="h-20 bg-white dark:bg-slate-950 border-b" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
