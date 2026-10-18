import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Mercado De Camões | Convenience Grocery & Luggage Storage in Chiado, Lisbon',
    template: '%s | Mercado De Camões'
  },
  description: 'Neighborhood convenience grocery store, Portuguese specialties, wines, fresh bread, and secure luggage storage in Praça Luís de Camões, Chiado, Lisbon.',
  keywords: [
    'Mercado De Camões',
    'convenience store Lisbon',
    'luggage storage Chiado',
    'depósito de bagagem Lisboa',
    'mini mercado Praça Luís de Camões',
    'Portuguese wine',
    'pastéis de nata',
    'Airbnb luggage drop'
  ],
  authors: [{ name: 'Mercado De Camões' }],
  metadataBase: new URL('https://mercadocamoes.pt'),
  openGraph: {
    title: 'Mercado De Camões | Lisbon Convenience & Luggage Haven',
    description: 'Fine Portuguese wines, fresh delicacies, everyday groceries & secure luggage storage right on Praça Luís de Camões.',
    url: 'https://mercadocamoes.pt',
    siteName: 'Mercado De Camões',
    locale: 'pt_PT',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
