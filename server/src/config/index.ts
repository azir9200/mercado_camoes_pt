import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mercado_camoes?schema=public',
  store: {
    name: process.env.STORE_NAME || 'Mercado Camões',
    address: process.env.STORE_ADDRESS || 'Rua Camões 242, 4000-140 Porto, Portugal',
    phone: process.env.STORE_PHONE || '+351 920 319 177',
    whatsapp: process.env.WHATSAPP_PHONE || '+351920319177',
    email: process.env.STORE_EMAIL || 'info@mercadocamoes.pt',
    openingHours: {
      en: 'Monday - Sunday: 08:00 - 23:00 (Open 7 days a week)',
      pt: 'Segunda - Domingo: 08:00 - 23:00 (Aberto todos os dias)'
    },
    geo: {
      lat: 41.1557,
      lng: -8.6074,
      googleMapsUrl: 'https://maps.google.com/?q=Rua+Cam%C3%B5es+242,+Porto'
    },
    luggageRates: {
      oneHour: 2.50,
      threeHours: 5.00,
      oneDay: 8.00,
      extraHour: 1.50
    }
  }
};
