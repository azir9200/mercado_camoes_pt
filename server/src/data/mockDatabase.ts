import { CategoryDTO, ProductDTO, LuggageBookingDTO, OrderDTO } from '../types/index.js';

export const mockCategories: CategoryDTO[] = [
  {
    id: 'cat-food-grocery',
    slug: 'food-grocery',
    name_en: 'Food & Grocery',
    name_pt: 'Alimentação e Mercearia',
    description_en: 'Artisan Portuguese bread, olive oils, canned sardines, snacks and pantry staples.',
    description_pt: 'Pão artesanal, azeites virgem extra, conservas tradicionais e produtos de despensa.',
    icon: 'ShoppingBag',
    displayOrder: 1
  },
  {
    id: 'cat-drinks',
    slug: 'drinks',
    name_en: 'Drinks & Beverages',
    name_pt: 'Bebidas e Vinhos',
    description_en: 'Portuguese wines, craft beers, refreshing mineral waters, sodas, and espresso beans.',
    description_pt: 'Vinhos portugueses, cervejas artesanais, águas minerais, sumos e café em grão.',
    icon: 'Wine',
    displayOrder: 2
  },
  {
    id: 'cat-dairy',
    slug: 'dairy',
    name_en: 'Dairy & Eggs',
    name_pt: 'Laticínios e Ovos',
    description_en: 'Fresh milk, Azorean butter, Serra da Estrela cheeses, yogurts, and farm-fresh eggs.',
    description_pt: 'Leite fresco, manteiga dos Açores, queijos da Serra da Estrela, iogurtes e ovos do campo.',
    icon: 'Milk',
    displayOrder: 3
  },
  {
    id: 'cat-kitchen-household',
    slug: 'kitchen-household',
    name_en: 'Kitchen & Household',
    name_pt: 'Cozinha e Lar',
    description_en: 'Everyday convenience items, coffee filters, foil, napkins, and travel essentials.',
    description_pt: 'Artigos de conveniência diária, filtros de café, guardanapos e essenciais de viagem.',
    icon: 'Utensils',
    displayOrder: 4
  },
  {
    id: 'cat-personal-care',
    slug: 'personal-care',
    name_en: 'Personal Care',
    name_pt: 'Cuidados Pessoais',
    description_en: 'Toothpaste, shampoo, sun protection, travel toiletries, and grooming items.',
    description_pt: 'Dentífricos, champôs, protetor solar, produtos de higiene pessoal e viagem.',
    icon: 'HeartHandshake',
    displayOrder: 5
  },
  {
    id: 'cat-cleaning-products',
    slug: 'cleaning-products',
    name_en: 'Cleaning Products',
    name_pt: 'Produtos de Limpeza',
    description_en: 'Disinfectants, multi-surface sprays, dish soaps, detergents, and paper towels.',
    description_pt: 'Desinfetantes, detergentes de loiça, limpa-vidros e rolos de papel absorvente.',
    icon: 'Sparkles',
    displayOrder: 6
  }
];

export const mockProducts: ProductDTO[] = [
  // Food & Grocery
  {
    id: 'prod-olive-oil-extra-virgin',
    sku: 'MC-OIL-01',
    name_en: 'Portuguese Extra Virgin Olive Oil (500ml)',
    name_pt: 'Azeite Virgem Extra Português (500ml)',
    description_en: 'Cold-pressed premium olive oil with balanced fruitiness and peppery finish, sourced from Alentejo groves.',
    description_pt: 'Azeite premium de prensagem a frio com notas frutadas e final suave, produzido no Alentejo.',
    price: 6.95,
    stock: 45,
    unit: 'bottle',
    isFeatured: true,
    categoryId: 'cat-food-grocery',
    images: [
      {
        id: 'img-oil-1',
        url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Bottle of extra virgin olive oil',
        alt_pt: 'Garrafa de azeite virgem extra',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-sardines-olive-oil',
    sku: 'MC-FISH-02',
    name_en: 'Traditional Portuguese Sardines in Olive Oil',
    name_pt: 'Conservas de Sardinhas Tradicionais em Azeite',
    description_en: 'Wild-caught Atlantic sardines hand-packed in golden olive oil. A Lisbon classic delicacy.',
    description_pt: 'Sardinhas do Atlântico embaladas à mão em azeite puro. Um clássico da gastronomia de Lisboa.',
    price: 3.40,
    stock: 80,
    unit: 'can',
    isFeatured: true,
    categoryId: 'cat-food-grocery',
    images: [
      {
        id: 'img-sardines-1',
        url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Canned sardines in olive oil',
        alt_pt: 'Lata de sardinhas em azeite',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-pastel-de-nata-box',
    sku: 'MC-BAKE-03',
    name_en: 'Fresh Pastéis de Nata (Box of 4)',
    name_pt: 'Caixa de Pastéis de Nata Artesanais (4 un)',
    description_en: 'Freshly baked custard tarts with flaky crisp puff pastry and cinnamon topping.',
    description_pt: 'Pastéis de nata acabados de sair do forno com massa folhada estaladiça e canela.',
    price: 5.20,
    stock: 25,
    unit: 'box',
    isFeatured: true,
    categoryId: 'cat-food-grocery',
    images: [
      {
        id: 'img-nata-1',
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Fresh Portuguese custard tarts',
        alt_pt: 'Pastéis de nata acabados de cozer',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-artisan-sourdough',
    sku: 'MC-BAKE-04',
    name_en: 'Artisan Crusty Wheat Bread (400g)',
    name_pt: 'Pão de Trigo Rústico Artesanal (400g)',
    description_en: 'Slow-fermented traditional Portuguese wheat loaf with deep caramelized crust.',
    description_pt: 'Pão rústico alentejano de fermentação lenta com côdea estaladiça.',
    price: 1.85,
    stock: 30,
    unit: 'loaf',
    isFeatured: false,
    categoryId: 'cat-food-grocery',
    images: [
      {
        id: 'img-bread-1',
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Rustic crusty bread',
        alt_pt: 'Pão rústico de trigo',
        isPrimary: true
      }
    ]
  },

  // Drinks
  {
    id: 'prod-vinho-verde-reserve',
    sku: 'MC-WINE-01',
    name_en: 'Quinta do Ameal Vinho Verde (750ml)',
    name_pt: 'Vinho Verde Quinta do Ameal (750ml)',
    description_en: 'Crisp, aromatic white wine with refreshing minerality and vibrant citrus notes from Minho region.',
    description_pt: 'Vinho branco leve e fresco com aromas florais, acidez crocante e toque mineral da região do Minho.',
    price: 8.50,
    stock: 35,
    unit: 'bottle',
    isFeatured: true,
    categoryId: 'cat-drinks',
    images: [
      {
        id: 'img-wine-1',
        url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Chilled white wine bottle',
        alt_pt: 'Garrafa de vinho branco',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-douro-red-reserve',
    sku: 'MC-WINE-02',
    name_en: 'Douro DOC Red Wine Reserva (750ml)',
    name_pt: 'Vinho Tinto Douro DOC Reserva (750ml)',
    description_en: 'Full-bodied Douro red wine with rich dark berries, oak nuances, and elegant structure.',
    description_pt: 'Vinho tinto encorpado do Douro com notas de frutos silvestres e final aveludado.',
    price: 11.20,
    stock: 28,
    unit: 'bottle',
    isFeatured: true,
    categoryId: 'cat-drinks',
    images: [
      {
        id: 'img-redwine-1',
        url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Bottle of Douro red wine',
        alt_pt: 'Garrafa de vinho tinto do Douro',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-craft-beer-ipa',
    sku: 'MC-BEER-03',
    name_en: 'Musa Born in the IPA Craft Beer (330ml)',
    name_pt: 'Cerveja Artesanal Musa IPA (330ml)',
    description_en: 'Lisbon local craft beer brewed in Marvila, bursting with tropical citrus hops.',
    description_pt: 'Cerveja artesanal produzida em Lisboa com aromas cítricos tropicais e amargor equilibrado.',
    price: 3.10,
    stock: 60,
    unit: 'bottle',
    isFeatured: false,
    categoryId: 'cat-drinks',
    images: [
      {
        id: 'img-beer-1',
        url: 'https://images.unsplash.com/photo-1608270199042-30ff4fc8ebf0?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Craft beer bottle',
        alt_pt: 'Garrafa de cerveja artesanal',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-sparkling-water-pedras',
    sku: 'MC-WATER-04',
    name_en: 'Água das Pedras Natural Sparkling Water (4x250ml)',
    name_pt: 'Água das Pedras Salgadas Gás Natural (4x250ml)',
    description_en: 'Naturally sparkling thermal mineral water from northern Portugal.',
    description_pt: 'Água mineral natural gasocarbónica portuguesa, perfeita para refrescar.',
    price: 3.80,
    stock: 50,
    unit: 'pack',
    isFeatured: false,
    categoryId: 'cat-drinks',
    images: [
      {
        id: 'img-water-1',
        url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Sparkling mineral water',
        alt_pt: 'Água com gás refrescante',
        isPrimary: true
      }
    ]
  },

  // Dairy
  {
    id: 'prod-queijo-serra',
    sku: 'MC-CHEESE-01',
    name_en: 'Azeitão DOP Creamy Artisan Cheese (250g)',
    name_pt: 'Queijo de Azeitão DOP Amanteigado (250g)',
    description_en: 'Creamy raw sheep milk cheese made with thistle flower, velvety and intense.',
    description_pt: 'Queijo de ovelha de pasta amanteigada feito com flor de cardo, sabor característico e aveludado.',
    price: 7.80,
    stock: 20,
    unit: 'unit',
    isFeatured: true,
    categoryId: 'cat-dairy',
    images: [
      {
        id: 'img-cheese-1',
        url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Artisan soft cheese wheel',
        alt_pt: 'Queijo artesanal amanteigado',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-azores-butter-sea-salt',
    sku: 'MC-BUTTER-02',
    name_en: 'Terra Nostra Azores Sea Salt Butter (250g)',
    name_pt: 'Manteiga dos Açores com Flor de Sal Terra Nostra (250g)',
    description_en: 'Rich golden butter produced from grass-fed cows on the green pastures of Azores.',
    description_pt: 'Manteiga dourada cremosa com flor de sal das pastagens verdes dos Açores.',
    price: 2.90,
    stock: 40,
    unit: 'pack',
    isFeatured: false,
    categoryId: 'cat-dairy',
    images: [
      {
        id: 'img-butter-1',
        url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Fresh natural butter slab',
        alt_pt: 'Manteiga fresca pura',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-organic-fresh-milk',
    sku: 'MC-MILK-03',
    name_en: 'Whole Fresh Pasture Milk (1L)',
    name_pt: 'Leite Fresco Gordo do Campo (1L)',
    description_en: 'Wholesome fresh milk rich in cream and vitamins, pasteurized daily.',
    description_pt: 'Leite gordo pasteurizado de pastagem natural, sabor rico e autêntico.',
    price: 1.45,
    stock: 35,
    unit: 'bottle',
    isFeatured: false,
    categoryId: 'cat-dairy',
    images: [
      {
        id: 'img-milk-1',
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Bottle of fresh dairy milk',
        alt_pt: 'Garrafa de leite fresco',
        isPrimary: true
      }
    ]
  },

  // Kitchen & Household
  {
    id: 'prod-coffee-filter-ground',
    sku: 'MC-KITCHEN-01',
    name_en: 'Delta Lote Chávena Ground Coffee (250g)',
    name_pt: 'Café Moído Delta Lote Chávena (250g)',
    description_en: 'Iconic Portuguese medium-dark roast coffee, intense aroma with velvety crema.',
    description_pt: 'O clássico café português de torra média-escura com aroma envolvente e creme denso.',
    price: 3.85,
    stock: 45,
    unit: 'pack',
    isFeatured: false,
    categoryId: 'cat-kitchen-household',
    images: [
      {
        id: 'img-coffee-1',
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Portuguese roast coffee pack',
        alt_pt: 'Embalagem de café moído',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-travel-plug-adapter',
    sku: 'MC-ELEC-02',
    name_en: 'Universal Travel EU Power Adapter',
    name_pt: 'Adaptador de Tomada Universal de Viagem UE',
    description_en: 'Compact surge-protected travel adapter fitting US/UK plugs to standard European Europlug sockets.',
    description_pt: 'Adaptador compacto para tomadas europeias com proteção contra picos de tensão.',
    price: 8.90,
    stock: 25,
    unit: 'unit',
    isFeatured: true,
    categoryId: 'cat-kitchen-household',
    images: [
      {
        id: 'img-adapter-1',
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Travel electrical adapter',
        alt_pt: 'Adaptador de viagem elétrico',
        isPrimary: true
      }
    ]
  },

  // Personal Care
  {
    id: 'prod-portuguese-sunscreen-50',
    sku: 'MC-CARE-01',
    name_en: 'Mineral Sunscreen SPF 50+ (100ml)',
    name_pt: 'Protetor Solar Mineral FPS 50+ (100ml)',
    description_en: 'Broad-spectrum UVA/UVB high protection, water-resistant formula ideal for sunny Lisbon strolls.',
    description_pt: 'Proteção solar muito elevada UVA/UVB, resistente à água e ideal para passeios ao sol.',
    price: 9.75,
    stock: 30,
    unit: 'tube',
    isFeatured: true,
    categoryId: 'cat-personal-care',
    images: [
      {
        id: 'img-sun-1',
        url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Sunscreen lotion tube',
        alt_pt: 'Tubo de protetor solar',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-natural-soap-castelbel',
    sku: 'MC-CARE-02',
    name_en: 'Castelbel Porto Luxury Aromatic Soap (150g)',
    name_pt: 'Sabonete Aromático de Luxo Castelbel Porto (150g)',
    description_en: 'Triple-milled vegetable soap with olive and lavender essential oils, handcrafted in Portugal.',
    description_pt: 'Sabonete vegetal com azeite e alfazema, fabricado artesanalmente no norte de Portugal.',
    price: 4.90,
    stock: 55,
    unit: 'bar',
    isFeatured: false,
    categoryId: 'cat-personal-care',
    images: [
      {
        id: 'img-soap-1',
        url: 'https://images.unsplash.com/photo-1607006314644-88f583e722a4?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Artisan aromatic bath soap',
        alt_pt: 'Sabonete artesanal perfumado',
        isPrimary: true
      }
    ]
  },

  // Cleaning Products
  {
    id: 'prod-eco-multisurface-spray',
    sku: 'MC-CLEAN-01',
    name_en: 'Eco Citrus Multi-Surface Cleaner (750ml)',
    name_pt: 'Limpa-Superfícies Ecológico Cítrico (750ml)',
    description_en: 'Plant-based cleaning spray leaving zero residue and a natural Mediterranean lemon scent.',
    description_pt: 'Detergente multi-usos biodegradável com aroma fresco a limão e ingredientes de origem vegetal.',
    price: 3.25,
    stock: 32,
    unit: 'bottle',
    isFeatured: false,
    categoryId: 'cat-cleaning-products',
    images: [
      {
        id: 'img-spray-1',
        url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Multi-surface cleaner spray bottle',
        alt_pt: 'Frasco de spray de limpeza multiusos',
        isPrimary: true
      }
    ]
  },
  {
    id: 'prod-natural-dish-soap',
    sku: 'MC-CLEAN-02',
    name_en: 'Gentle Aloe Vera Dishwashing Liquid (500ml)',
    name_pt: 'Detergente da Loiça Suave com Aloé Vera (500ml)',
    description_en: 'Degreasing concentrated formula that is soft on hands and safe for glassware.',
    description_pt: 'Fórmula desengordurante concentrada, suave para a pele e eficaz na remoção de gordura.',
    price: 2.15,
    stock: 40,
    unit: 'bottle',
    isFeatured: false,
    categoryId: 'cat-cleaning-products',
    images: [
      {
        id: 'img-dish-1',
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        alt_en: 'Dish soap bottle',
        alt_pt: 'Embalagem de detergente da loiça',
        isPrimary: true
      }
    ]
  }
];

export const mockBookings: LuggageBookingDTO[] = [];

export const mockOrders: OrderDTO[] = [];
