'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

export interface Translations {
  nav: {
    home: string;
    products: string;
    luggageStorage: string;
    contact: string;
    cart: string;
    orderWhatsApp: string;
    switchLang: string;
    admin: string;
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
    calculatorSub: string;
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
    directBookingFallback: string;
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
    getDirections: string;
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
    verifyModalTitle: string;
    verifyModalSub: string;
    sendViaWhatsApp: string;
    submitDirectOrder: string;
    dontHaveWhatsApp: string;
    orderSuccessTitle: string;
    orderSuccessMessage: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    legal: string;
    rights: string;
    heart: string;
  };
  admin: {
    title: string;
    subtitle: string;
    tabs: {
      products: string;
      categories: string;
      rates: string;
      orders: string;
    };
    stats: {
      totalProducts: string;
      totalOrders: string;
      activeBookings: string;
      totalRevenue: string;
    };
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
      switchLang: 'Português',
      admin: 'Admin CMS'
    },
    hero: {
      badge: '📍 Downtown Porto • Rua Camões 242',
      titleLine1: 'Your Porto Gourmet Grocery &',
      titleHighlight: 'Secure Luggage Sanctuary',
      subtitle: 'Artisan Portuguese wines, regional cheeses, fresh delicacies, daily essentials, and monitored luggage storage on Rua Camões 242, Porto.',
      ctaProducts: 'Browse Store Catalog',
      ctaLuggage: 'Book Luggage Storage',
      hoursPill: 'Open Daily 08:00 - 23:00',
      locationPill: 'Rua Camões 242, Porto'
    },
    about: {
      title: 'Authentic Local Flavors, Modern City Convenience',
      subtitle: 'Situated in the vibrant center of Porto, Mercado Camões caters to local residents, travelers, and food connoisseurs seeking quality groceries and trusted services.',
      card1Title: 'Traditional Portuguese Goods',
      card1Desc: 'Crisp Vinho Verde, robust Douro reds, extra-virgin olive oils, artisanal tinned fish, and traditional cheeses.',
      card2Title: 'Secure Luggage Storage',
      card2Desc: 'Explore Porto hands-free! Leave your suitcases securely with us while waiting for your Airbnb check-in or evening train.',
      card3Title: 'Express WhatsApp Orders',
      card3Desc: 'Message us your grocery list or place a custom order for instant store pickup or local Porto accommodation delivery.'
    },
    products: {
      featuredTitle: 'Featured Local Specialties',
      featuredSubtitle: 'Hand-picked Portuguese favorites, chilled wines, and everyday essentials ready for immediate order.',
      allProductsTitle: 'View Full Catalog',
      allCategories: 'All Categories',
      addToCart: 'Add to Cart',
      addedToCart: 'Added!',
      viewDetails: 'View Details',
      inStock: 'In Stock',
      perUnit: 'per',
      searchPlaceholder: 'Search products by name, wine, cheese, etc...',
      noProducts: 'No products found matching your search.',
      filterByCategory: 'Categories'
    },
    storage: {
      title: 'Secure Luggage Storage in Porto',
      subtitle: 'Drop your bags at Rua Camões 242 while exploring the historic streets, churches, and riverbanks of Porto. Simple transparent pricing from €2.50.',
      whyUs: 'Why Store Bags with Mercado Camões?',
      safeSecure: 'Safe & Monitored Storage',
      safeSecureDesc: 'Your bags are stored in a monitored, climate-controlled space with staff on-site 7 days a week from 08:00 to 23:00.',
      pricing1h: '€2.50 / hour per bag',
      pricing3h: '€5.00 / 3 hours per bag',
      pricing1d: '€8.00 / full day per bag',
      calculatorTitle: 'Rate Calculator & Instant Reservation',
      calculatorSub: 'Select duration and number of bags to see live dynamic pricing.',
      bagsLabel: 'Number of Bags / Suitcases',
      durationLabel: 'Duration of Storage',
      dropoffLabel: 'Estimated Drop-off Time',
      nameLabel: 'Your Full Name',
      phoneLabel: 'WhatsApp / Phone Number',
      emailLabel: 'Email Address (Optional)',
      notesLabel: 'Special Instructions / Flight Details',
      totalEst: 'Total Estimated Cost',
      reserveBtn: 'Reserve via WhatsApp',
      reserveSuccess: 'Reservation recorded! See you soon at Rua Camões 242.',
      instantWhatsAppNote: 'No prepayment required. Pay at drop-off in person by card or cash.',
      directBookingFallback: 'Submit Direct Booking (Without WhatsApp)'
    },
    contact: {
      title: 'Visit Us in Downtown Porto',
      subtitle: 'Conveniently located at Rua Camões 242, near Trindade and Faria Guimarães metro stations.',
      addressLabel: 'Store Address',
      hoursLabel: 'Opening Hours',
      phoneLabel: 'Phone & WhatsApp',
      emailLabel: 'Email Support',
      directionsTitle: 'How to Reach Us',
      directionsText: 'We are situated on Rua Camões 242, just a 5-minute walk from Trindade Metro Station. Easily accessible from anywhere in Porto.',
      openInMaps: 'Open in Google Maps',
      getDirections: 'Get Directions / Navigation',
      chatWithUs: 'Chat on WhatsApp'
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      emptySub: 'Discover our Portuguese wines, fresh treats, and local groceries to start adding items.',
      subtotal: 'Subtotal',
      checkoutWhatsApp: 'Send Order via WhatsApp',
      continueShopping: 'Continue Shopping',
      clearCart: 'Clear Cart',
      itemCount: 'items',
      customerDetails: 'Delivery / Pickup Details',
      fullName: 'Full Name',
      phone: 'Phone / WhatsApp Number',
      pickupAtStore: 'Store Pickup (Rua Camões 242)',
      localDelivery: 'Local Delivery (Porto)',
      notesPrompt: 'Special requests, room number, or delivery instructions...',
      verifyModalTitle: 'Verify Your Order',
      verifyModalSub: 'Please review your items and details before submitting.',
      sendViaWhatsApp: 'Send via WhatsApp (+351 920 319 177)',
      submitDirectOrder: 'Submit Direct Order (No WhatsApp)',
      dontHaveWhatsApp: "Don't have WhatsApp? Submit Order Direct",
      orderSuccessTitle: 'Order Placed Successfully!',
      orderSuccessMessage: 'Your order has been recorded in our system. Our team will contact you shortly to confirm and prepare your items.'
    },
    footer: {
      tagline: 'Gourmet Portuguese groceries, wines, fresh bread & trusted luggage storage in Porto.',
      quickLinks: 'Quick Links',
      legal: 'Legal & Terms',
      rights: 'All rights reserved.',
      heart: 'Made with passion in Porto, Portugal.'
    },
    admin: {
      title: 'Mercado Camões CMS',
      subtitle: 'Manage inventory, categories, luggage storage rates, and incoming customer orders.',
      tabs: {
        products: 'Products',
        categories: 'Categories',
        rates: 'Luggage Rates',
        orders: 'Orders & Bookings'
      },
      stats: {
        totalProducts: 'Active Products',
        totalOrders: 'Total Orders',
        activeBookings: 'Luggage Bookings',
        totalRevenue: 'Estimated Volume'
      }
    }
  },
  pt: {
    nav: {
      home: 'Início',
      products: 'Produtos',
      luggageStorage: 'Guarda de Bagagem',
      contact: 'Contactos & Localização',
      cart: 'Carrinho',
      orderWhatsApp: 'Encomenda WhatsApp',
      switchLang: 'English',
      admin: 'Painel CMS'
    },
    hero: {
      badge: '📍 Baixa do Porto • Rua Camões 242',
      titleLine1: 'A sua Mercearia Fina, Vinhos e',
      titleHighlight: 'Guarda de Bagagem no Porto',
      subtitle: 'Vinhos das melhores castas, queijos típicos, artigos do dia-a-dia e depósito seguro de malas na Rua Camões 242, Porto.',
      ctaProducts: 'Ver Produtos da Loja',
      ctaLuggage: 'Reservar Guarda de Malas',
      hoursPill: 'Aberto Diariamente: 08:00 - 23:00',
      locationPill: 'Rua Camões 242, Porto'
    },
    about: {
      title: 'Bem-vindo ao Mercado Camões Porto',
      subtitle: 'A sua loja de conveniência e mercearia de bairro que serve residentes, turistas e amantes da gastronomia portuguesa com produtos de excelência.',
      card1Title: 'Sabores Tradicionais Portugueses',
      card1Desc: 'Vinho Verde estaladiço, tintos do Douro, azeite virgem extra, conservas artesanais e queijos da serra selecionados.',
      card2Title: 'Guarda de Bagagem 5 Estrelas',
      card2Desc: 'Deixe as suas malas em total segurança enquanto aguarda o check-in ou passeia pela Invicta sem peso e sem preocupações.',
      card3Title: 'Encomendas Rápidas por WhatsApp',
      card3Desc: 'Faça o seu pedido antecipado para levantamento rápido no balcão ou entrega no seu alojamento no Porto.'
    },
    products: {
      featuredTitle: 'Especialidades em Destaque',
      featuredSubtitle: 'Seleção cuidada de produtos locais, bebidas frescas e artigos de conveniência prontos para levar.',
      allProductsTitle: 'Catálogo Completo',
      allCategories: 'Todas as Categorias',
      addToCart: 'Adicionar',
      addedToCart: 'Adicionado!',
      viewDetails: 'Ver Detalhes',
      inStock: 'Em Stock',
      perUnit: 'por',
      searchPlaceholder: 'Pesquisar por nome de produto, vinho, queijo...',
      noProducts: 'Nenhum produto encontrado.',
      filterByCategory: 'Categorias'
    },
    storage: {
      title: 'Depósito & Guarda de Bagagem no Porto',
      subtitle: 'Deixe as suas malas no nosso espaço seguro mesmo na Rua Camões 242 enquanto espera pelo check-in do Airbnb ou pelo voo. Tarifas a partir de €2.50.',
      whyUs: 'Vantagens do Nosso Serviço de Malas',
      safeSecure: 'Espaço Protegido e Monitorizado',
      safeSecureDesc: 'O seu depósito é vigiado por funcionários presenciais todos os dias da semana, das 08:00 às 23:00.',
      pricing1h: '€2.50 / hora por mala',
      pricing3h: '€5.00 / 3 horas por mala',
      pricing1d: '€8.00 / dia inteiro por mala',
      calculatorTitle: 'Calculadora de Tarifas & Reserva Imediata',
      calculatorSub: 'Escolha a duração e a quantidade de malas para ver o cálculo em tempo real.',
      bagsLabel: 'Número de Malas / Mochilas',
      durationLabel: 'Tempo de Guarda',
      dropoffLabel: 'Hora Prevista de Entrega',
      nameLabel: 'Nome Completo',
      phoneLabel: 'Número de WhatsApp / Telemóvel',
      emailLabel: 'Email (Opcional)',
      notesLabel: 'Notas ou Detalhes do Voo',
      totalEst: 'Valor Previsto a Pagar',
      reserveBtn: 'Reservar via WhatsApp',
      reserveSuccess: 'Reserva registada com sucesso! Aguardamos por si na Rua Camões 242.',
      instantWhatsAppNote: 'Sem pagamento antecipado obrigatório. Pague no balcão em numerário ou cartão.',
      directBookingFallback: 'Enviar Reserva Direta (Sem WhatsApp)'
    },
    contact: {
      title: 'Visite-nos na Rua Camões 242, Porto',
      subtitle: 'Localização central junto à estação de metro da Trindade e Faria Guimarães.',
      addressLabel: 'Morada da Loja',
      hoursLabel: 'Horário de Atendimento',
      phoneLabel: 'Telefone e WhatsApp',
      emailLabel: 'Email de Contacto',
      directionsTitle: 'Como Chegar',
      directionsText: 'Estamos situados na Rua Camões 242, a cerca de 5 minutos a pé da estação Trindade. Ponto de fácil acesso no coração do Porto.',
      openInMaps: 'Ver no Google Maps',
      getDirections: 'Como Chegar / Navegação GPS',
      chatWithUs: 'Conversar no WhatsApp'
    },
    cart: {
      title: 'O Seu Carrinho de Compras',
      empty: 'O seu carrinho está vazio',
      emptySub: 'Explore o nosso catálogo de vinhos, queijos e mercearia para adicionar artigos.',
      subtotal: 'Subtotal',
      checkoutWhatsApp: 'Enviar Encomenda por WhatsApp',
      continueShopping: 'Continuar a Comprar',
      clearCart: 'Limpar Carrinho',
      itemCount: 'artigos',
      customerDetails: 'Dados para Entrega / Levantamento',
      fullName: 'Nome Completo',
      phone: 'Número de Telemóvel / WhatsApp',
      pickupAtStore: 'Levantamento na Loja (Rua Camões 242)',
      localDelivery: 'Entrega no Alojamento (Porto)',
      notesPrompt: 'Instruções especiais, andar do Airbnb, ou preferências...',
      verifyModalTitle: 'Verificação do Pedido',
      verifyModalSub: 'Confirme os seus dados e artigos antes de enviar.',
      sendViaWhatsApp: 'Confirmar e Enviar por WhatsApp (+351 920 319 177)',
      submitDirectOrder: 'Enviar Pedido Direto (Sem WhatsApp)',
      dontHaveWhatsApp: 'Não tem WhatsApp? Enviar Pedido Direto',
      orderSuccessTitle: 'Pedido Registado com Sucesso!',
      orderSuccessMessage: 'O seu pedido foi gravado no nosso sistema. Entraremos em contacto consigo muito em breve para confirmar e preparar a entrega.'
    },
    footer: {
      tagline: 'Mercearia de conveniência, sabores autênticos de Portugal e serviço seguro de guarda de bagagem no Porto.',
      quickLinks: 'Ligações Rápidas',
      legal: 'Informações Legais',
      rights: 'Todos os direitos reservados.',
      heart: 'Feito com orgulho e dedicação no Porto, Portugal.'
    },
    admin: {
      title: 'Painel de Gestão Mercado Camões',
      subtitle: 'Controle de stock, categorias de produtos, tarifas de bagagem e encomendas recebidas.',
      tabs: {
        products: 'Produtos',
        categories: 'Categorias',
        rates: 'Tarifas de Bagagem',
        orders: 'Encomendas & Reservas'
      },
      stats: {
        totalProducts: 'Produtos Ativos',
        totalOrders: 'Total de Encomendas',
        activeBookings: 'Depósitos de Bagagem',
        totalRevenue: 'Volume Estimado'
      }
    }
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
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
  const [lang, setLangState] = useState<Language>(initialLang);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mc_locale', newLang);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('mc_locale') as Language;
    if (saved && (saved === 'en' || saved === 'pt')) {
      setLangState(saved);
    }
  }, []);

  const value = {
    lang,
    setLang,
    t: translations[lang] || translations.pt
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
