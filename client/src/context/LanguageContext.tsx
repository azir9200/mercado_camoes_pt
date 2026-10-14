'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  nav: {
    home: string;
    products: string;
    luggageStorage: string;
    contact: string;
    cart: string;
    orderWhatsApp: string;
    switchLang: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    subtitle: string;
    ctaProducts: string;
    ctaLuggage: string;
    hoursPill: string;
    locationPill: string;
  };
  about: {
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  products: {
    featuredTitle: string;
    featuredSubtitle: string;
    allProductsTitle: string;
    allCategories: string;
    addToCart: string;
    addedToCart: string;
    viewDetails: string;
    inStock: string;
    perUnit: string;
    searchPlaceholder: string;
    noProducts: string;
    filterByCategory: string;
  };
  storage: {
    title: string;
    subtitle: string;
    whyUs: string;
    safeSecure: string;
    safeSecureDesc: string;
    pricing1h: string;
    pricing3h: string;
    pricing1d: string;
    calculatorTitle: string;
    bagsLabel: string;
    durationLabel: string;
    dropoffLabel: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    notesLabel: string;
    totalEst: string;
    reserveBtn: string;
    reserveSuccess: string;
    instantWhatsAppNote: string;
  };
  contact: {
    title: string;
    subtitle: string;
    addressLabel: string;
    hoursLabel: string;
    phoneLabel: string;
    emailLabel: string;
    directionsTitle: string;
    directionsText: string;
    openInMaps: string;
    chatWithUs: string;
  };
  cart: {
    title: string;
    empty: string;
    emptySub: string;
    subtotal: string;
    checkoutWhatsApp: string;
    continueShopping: string;
    clearCart: string;
    itemCount: string;
    customerDetails: string;
    fullName: string;
    phone: string;
    pickupAtStore: string;
    localDelivery: string;
    notesPrompt: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    legal: string;
    rights: string;
    heart: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      luggageStorage: 'Luggage Storage',
      contact: 'Contact & Location',
      cart: 'Cart',
      orderWhatsApp: 'WhatsApp Order',
      switchLang: 'Português'
    },
    hero: {
      badge: '📍 Heart of Chiado & Bairro Alto, Lisbon',
      titleLine1: 'Your Lisbon Grocery, Wine &',
      titleHighlight: 'Secure Luggage Haven',
      subtitle: 'Fresh pastries, local cheeses, regional wines, everyday essentials, and hassle-free luggage storage right on Praça Luís de Camões.',
      ctaProducts: 'Browse Store Catalog',
      ctaLuggage: 'Book Luggage Storage',
      hoursPill: 'Open Daily 08:00 - 23:00',
      locationPill: 'Praça Luís de Camões 22'
    },
    about: {
      title: 'Welcome to Mercado Camões',
      subtitle: 'A modern neighborhood convenience grocery store catering to Lisbon residents, travelers, and food lovers.',
      card1Title: 'Authentic Portuguese Flavors',
      card1Desc: 'From crisp Vinho Verde and Douro reds to fresh pastéis de nata, artisanal cheeses, and fine olive oils.',
      card2Title: '5-Star Secure Luggage Storage',
      card2Desc: 'Drop your bags safely while waiting for your Airbnb check-in or exploring Tram 28 and Bairro Alto hands-free.',
      card3Title: 'Instant WhatsApp Direct Orders',
      card3Desc: 'Order beverages, snacks, or daily supplies ahead for fast pickup or accommodation delivery.'
    },
    products: {
      featuredTitle: 'Featured Portuguese Specialties',
      featuredSubtitle: 'Hand-picked delicacies, local beverages, and essentials available for immediate pickup.',
      allProductsTitle: 'Store Catalog & Groceries',
      allCategories: 'All Categories',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Bag',
      viewDetails: 'View Details',
      inStock: 'In Stock',
      perUnit: 'per',
      searchPlaceholder: 'Search products (e.g. olive oil, wine, bread)...',
      noProducts: 'No products found matching your search.',
      filterByCategory: 'Filter by Department'
    },
    storage: {
      title: 'Luggage Storage in Chiado, Lisbon',
      subtitle: 'Drop off your bags safely at Praça Luís de Camões. Enjoy Lisbon hands-free with transparent, hourly and daily rates.',
      whyUs: 'Why Store With Mercado Camões?',
      safeSecure: 'Monitored & Secure',
      safeSecureDesc: 'Indoor supervised storage with 24/7 CCTV surveillance and friendly English/Portuguese staff.',
      pricing1h: '€2.50 / bag (1 Hour)',
      pricing3h: '€5.00 / bag (3 Hours)',
      pricing1d: '€8.00 / bag (Full Day)',
      calculatorTitle: 'Instant Fare Calculator & Reservation',
      bagsLabel: 'Number of Bags / Suitcases',
      durationLabel: 'Storage Duration',
      dropoffLabel: 'Estimated Drop-off Time',
      nameLabel: 'Your Full Name',
      phoneLabel: 'WhatsApp / Mobile Number',
      emailLabel: 'Email Address',
      notesLabel: 'Special Notes / Bag Details (Optional)',
      totalEst: 'Total Estimated Price',
      reserveBtn: 'Reserve via WhatsApp',
      reserveSuccess: 'Reservation Prepared! Directing you to WhatsApp...',
      instantWhatsAppNote: 'No advance card required. Pay on drop-off via Cash, Multibanco, MBWay, Visa, or Mastercard.'
    },
    contact: {
      title: 'Visit Us in Lisbon',
      subtitle: 'Ideally situated right next to Bairro Alto, Chiado, and the iconic Tram 28 stop.',
      addressLabel: 'Store Address',
      hoursLabel: 'Opening Hours',
      phoneLabel: 'Direct Phone',
      emailLabel: 'Email Support',
      directionsTitle: 'How to Get Here',
      directionsText: 'Take the Baixa-Chiado Metro (Blue/Green Line) and take the Largo do Chiado exit. Walk 2 minutes up to Praça Luís de Camões. We are on the square next to the tram stop.',
      openInMaps: 'Open in Google Maps',
      chatWithUs: 'Chat on WhatsApp'
    },
    cart: {
      title: 'Your Shopping Bag',
      empty: 'Your shopping cart is empty',
      emptySub: 'Browse our groceries and regional specialties to add items to your cart.',
      subtotal: 'Estimated Total',
      checkoutWhatsApp: 'Send Order via WhatsApp',
      continueShopping: 'Continue Shopping',
      clearCart: 'Empty Cart',
      itemCount: 'items',
      customerDetails: 'Pickup / Delivery Details',
      fullName: 'Your Name',
      phone: 'WhatsApp / Phone Number',
      pickupAtStore: 'Store Pickup (Praça Camões)',
      localDelivery: 'Local Lisbon Delivery',
      notesPrompt: 'Any delivery instructions or preferred time?'
    },
    footer: {
      tagline: 'Authentic Lisbon convenience store, local delicacies, and secure luggage storage.',
      quickLinks: 'Quick Links',
      legal: 'Legal & Info',
      rights: 'All rights reserved.',
      heart: 'Made with passion in Lisbon, Portugal.'
    }
  },
  pt: {
    nav: {
      home: 'Início',
      products: 'Produtos',
      luggageStorage: 'Guarda de Bagagem',
      contact: 'Contactos & Localização',
      cart: 'Carrinho',
      orderWhatsApp: 'Pedido WhatsApp',
      switchLang: 'English'
    },
    hero: {
      badge: '📍 No Coração do Chiado & Bairro Alto, Lisboa',
      titleLine1: 'A sua Mercearia, Vinhos e',
      titleHighlight: 'Guarda de Bagagem Segura',
      subtitle: 'Pastéis de nata quentinhos, queijos típicos, vinhos portugueses, artigos do dia-a-dia e depósito de malas na Praça Luís de Camões.',
      ctaProducts: 'Ver Produtos da Loja',
      ctaLuggage: 'Reservar Guarda de Malas',
      hoursPill: 'Aberto Todos os Dias 08:00 - 23:00',
      locationPill: 'Praça Luís de Camões 22'
    },
    about: {
      title: 'Bem-vindo ao Mercado Camões',
      subtitle: 'A sua loja de conveniência e mercearia de bairro que serve residentes, turistas e amantes da boa gastronomia portuguesa.',
      card1Title: 'Sabores Tradicionais Portugueses',
      card1Desc: 'Vinho Verde estaladiço, tintos do Douro, azeite virgem extra, conservas artesanais e queijos da serra.',
      card2Title: 'Guarda de Bagagem 5 Estrelas',
      card2Desc: 'Deixe as suas malas em total segurança enquanto aguarda o check-in ou passeia pelo Chiado sem peso.',
      card3Title: 'Encomendas Diretas por WhatsApp',
      card3Desc: 'Faça o seu pedido antecipado para levantamento rápido no balcão ou entrega no seu alojamento.',
    },
    products: {
      featuredTitle: 'Especialidades em Destaque',
      featuredSubtitle: 'Seleção cuidada de produtos locais, bebidas frescas e artigos de conveniência prontos para levar.',
      allProductsTitle: 'Catálogo de Produtos & Mercearia',
      allCategories: 'Todas as Categorias',
      addToCart: 'Adicionar',
      addedToCart: 'Adicionado',
      viewDetails: 'Ver Detalhes',
      inStock: 'Em Stock',
      perUnit: 'por',
      searchPlaceholder: 'Pesquisar produtos (ex: azeite, vinho, queijo)...',
      noProducts: 'Nenhum produto encontrado com estes critérios.',
      filterByCategory: 'Filtrar por Secção'
    },
    storage: {
      title: 'Guarda de Bagagem no Chiado, Lisboa',
      subtitle: 'Guarde as suas malas em segurança na Praça Luís de Camões. Desfrute de Lisboa sem carregar peso com tarifas horárias e diárias simples.',
      whyUs: 'Porquê Guardar no Mercado Camões?',
      safeSecure: 'Vigiado e 100% Seguro',
      safeSecureDesc: 'Armazenamento interior monitorizado com videovigilância 24/7 e atendimento acolhedor em Português e Inglês.',
      pricing1h: '€2.50 / mala (1 Hora)',
      pricing3h: '€5.00 / mala (3 Horas)',
      pricing1d: '€8.00 / mala (Dia Inteiro)',
      calculatorTitle: 'Calculadora de Tarifas & Reserva Imediata',
      bagsLabel: 'Quantidade de Malas / Mochilas',
      durationLabel: 'Duração do Depósito',
      dropoffLabel: 'Hora Prevista de Entrega',
      nameLabel: 'Nome Completo',
      phoneLabel: 'Número de WhatsApp / Telemóvel',
      emailLabel: 'Endereço de Email',
      notesLabel: 'Observações / Descrição das malas (Opcional)',
      totalEst: 'Valor Total Estimado',
      reserveBtn: 'Reservar via WhatsApp',
      reserveSuccess: 'Reserva preparada! A reencaminhar para o WhatsApp...',
      instantWhatsAppNote: 'Sem pagamento antecipado por cartão. Pague no ato da entrega em Numerário, Multibanco, MBWay, Visa ou Mastercard.'
    },
    contact: {
      title: 'Visite-nos em Lisboa',
      subtitle: 'Localização privilegiada entre o Bairro Alto e o Chiado, junto à paragem do emblemático Elétrico 28.',
      addressLabel: 'Endereço da Loja',
      hoursLabel: 'Horário de Funcionamento',
      phoneLabel: 'Telefone Fixo',
      emailLabel: 'Email de Apoio',
      directionsTitle: 'Como Chegar',
      directionsText: 'Apanhe o Metro Baixa-Chiado (Linha Azul ou Verde) e saia pelo Largo do Chiado. Suba 2 minutos até à Praça Luís de Camões. Estamos situados na própria praça.',
      openInMaps: 'Abrir no Google Maps',
      chatWithUs: 'Falar pelo WhatsApp'
    },
    cart: {
      title: 'O Seu Carrinho de Compras',
      empty: 'O seu carrinho está vazio',
      emptySub: 'Explore os nossos produtos e vinhos regionais para adicionar itens à sua cesta.',
      subtotal: 'Total Estimado',
      checkoutWhatsApp: 'Enviar Encomenda por WhatsApp',
      continueShopping: 'Continuar a Comprar',
      clearCart: 'Limpar Carrinho',
      itemCount: 'artigos',
      customerDetails: 'Dados para Levantamento / Entrega',
      fullName: 'O Seu Nome',
      phone: 'Contacto Telefónico / WhatsApp',
      pickupAtStore: 'Levantamento na Loja (Praça Camões)',
      localDelivery: 'Entrega Local em Lisboa',
      notesPrompt: 'Instruções especiais ou horário preferido de recolha?'
    },
    footer: {
      tagline: 'Mercearia de conveniência, sabores autênticos de Lisboa e serviço de guarda de bagagem.',
      quickLinks: 'Ligações Rápidas',
      legal: 'Informações Legais',
      rights: 'Todos os direitos reservados.',
      heart: 'Feito com orgulho em Lisboa, Portugal.'
    }
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLang = 'pt'
}: {
  children: React.ReactNode;
  initialLang?: Language;
}) {
  const [lang, setLang] = useState<Language>(initialLang);

  useEffect(() => {
    // Check localStorage preference on mount
    const saved = localStorage.getItem('mc_lang') as Language;
    if (saved && (saved === 'en' || saved === 'pt')) {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('mc_lang', newLang);
  };

  const toggleLang = () => {
    handleSetLang(lang === 'en' ? 'pt' : 'en');
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        toggleLang,
        t: translations[lang]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
