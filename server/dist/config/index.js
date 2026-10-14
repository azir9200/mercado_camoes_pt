"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mercado_camoes?schema=public',
    store: {
        name: process.env.STORE_NAME || 'Mercado Camões',
        address: process.env.STORE_ADDRESS || 'Praça Luís de Camões 22, 1200-243 Lisboa, Portugal',
        phone: process.env.STORE_PHONE || '+351 21 345 6789',
        whatsapp: process.env.WHATSAPP_PHONE || '+351912345678',
        email: process.env.STORE_EMAIL || 'info@mercadocamoes.pt',
        openingHours: {
            en: 'Monday - Sunday: 08:00 - 23:00 (Open 7 days a week)',
            pt: 'Segunda - Domingo: 08:00 - 23:00 (Aberto todos os dias)'
        },
        geo: {
            lat: 38.7107,
            lng: -9.1436,
            googleMapsUrl: 'https://maps.google.com/?q=Praça+Luís+de+Camões+Lisboa'
        },
        luggageRates: {
            oneHour: 2.50,
            threeHours: 5.00,
            oneDay: 8.00,
            extraHour: 1.50
        }
    }
};
