# Full-Stack Architectural Blueprint & Antigravity Prompt

This document provides a production-ready blueprint, enterprise-grade folder structure, database seeding guidelines, and a master prompt tailored for Antigravity to build your bilingual (EN/PT) e-commerce & luggage storage web application.

## 1. System Architecture & Tech Stack

* **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React (Icons), Context API / Zustand for State Management (Cart & Language Toggle).

* **Backend:** Node.js, Express.js, TypeScript, Prisma ORM or TypeORM.

* **Database:** PostgreSQL (supporting multi-language fields like `name_en`, `name_pt`, relations for categories, products, images, and admin users).

* **Integrations:** WhatsApp Order API redirection, Geolocation/Contact mapping, Luggage Storage booking calculator.

* **Design System:** Professional minimal color palette (Tailwind `slate`, `emerald` for primary accents, and crisp `white`/`zinc` backgrounds).

## 2. Enterprise Industrial Folder Structure

### Frontend (`/client` - Next.js App Router)

```
client/
├── src/
│   ├── app/
│   │   ├── [lang]/                  # Dynamic locale routing (en/pt)
│   │   │   ├── layout.tsx           # Root layout with providers & language context
│   │   │   ├── page.tsx             # Homepage (About shop, hero, WhatsApp order CTA)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx         # Category list & All products view
│   │   │   │   └── [id]/
│   │   │   │       page.tsx         # Product detail view with gallery & cart action
│   │   │   ├── luggage-storage/
│   │   │   │   └── page.tsx         # Luggage storage booking page (1h, 3h, 1 day, other)
│   │   │   └── contact/
│   │   │       └── page.tsx         # Contact, address, phone & interactive direction map
│   │   ├── sitemap.ts               # Dynamic SEO sitemap generation
│   │   └── robots.ts                # Robots configuration for crawlers
│   ├── components/
│   │   ├── common/                  # Reusable atomic elements (Button, Input, Modal, Badge)
│   │   ├── layout/                  # Header, Footer, Navbar, LanguageSwitcher
│   │   ├── products/                # ProductCard, ProductGrid, CategoryFilter
│   │   └── cart/                    # CartDrawer, CartItem
│   ├── context/                     # LanguageContext, CartContext
│   ├── hooks/                       # Custom hooks (useCart, useDebounce, useLocalStorage)
│   ├── lib/                         # API client fetchers (axios/fetch wrappers), utils
│   └── types/                       # Shared TypeScript interfaces & types
├── public/                          # Static assets & icons
├── tailwind.config.ts               # Minimal design tokens & theme extension
└── tsconfig.json

```

### Backend (`/server` - Node.js & Express)

```
server/
├── src/
│   ├── config/                      # Database connection, environment config
│   ├── controllers/                 # Route logic (productController, categoryController, bookingController)
│   ├── middleware/                  # Error handling, request validation (Joi/Zod), auth middleware
│   ├── models/                      # Prisma schema or ORM models matching your ER diagram
│   ├── routes/                      # API endpoint definitions (/api/v1/products, /api/v1/storage)
│   ├── services/                    # Business logic layer
│   ├── utils/                       # Logger, response formatters, helpers
│   ├── server.ts                    # Application entry point
│   └── app.ts                       # Express middleware setup
├── prisma/
│   └── schema.prisma                # Database schema (AdminUsers, Categories, Products, ProductImages)
├── .env.example
├── package.json
└── tsconfig.json

```

## 3. Master Antigravity Prompt

Copy and paste the prompt below directly into Antigravity to generate the codebase:

```
Act as a Principal Full-Stack Software Architect and UI/UX Expert. Build a production-ready, highly scalable, and SEO-optimized web application based on the user's architectural blueprints (an e-commerce convenience store with a option to have luggage storage booking).

### Tech Stack Specifications:
- Frontend: Next.js (App Router, TypeScript, Tailwind CSS, Lucide Icons).
- Backend: Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL schema.
- Languages: Multi-language support (English / Portuguese) built into the schema and UI state.

### UI/UX & Design Guidelines:
- Clean, minimal, professional aesthetic using a Tailwind color palette of Slate (neutrals), Emerald (trust/success accents), and Zinc.
- Fully responsive across mobile, tablet, and desktop with fluid layouts and accessible touch targets.
- Reusable component architecture with strict separation of concerns (atomic components in /components/common, feature blocks in /components/products).

### Core Features to Implement:
1. Homepage: Includes an "About Shop" section, featured products, WhatsApp direct order button, and quick navigation links.
2. Product Catalog: Category grid (Food & Grocery, Drinks, Dairy, Kitchen & Household, Personal Care, Cleaning Products) with multi-language name/description rendering (name_en/name_pt).
3. Luggage Storage Page: Interactive booking calculator allowing users to select storage duration (1 hour, 3 hours, 1 day, or custom) with transparent pricing calculations.
4. Contact & Location Page: Address, phone number, direction guidelines, and store details.
5. Cart & Checkout: Lightweight state management for shopping cart items with a seamless checkout trigger forwarding orders to WhatsApp or backend API.

### Technical Requirements:
- Write modular, clean, and thoroughly commented code with error handling.
- Ensure strict TypeScript typing across all frontend components and backend models mirroring the database tables (AdminUsers, Categories, Products, ProductImages).
- Implement Next.js App Router metadata generation for SEO optimization (OpenGraph tags, meta titles/descriptions, and sitemap).
- Implement robust backend controllers, validation middleware, and clean RESTful API routing.

```