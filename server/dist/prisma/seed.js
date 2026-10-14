"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const mockDatabase_js_1 = require("../data/mockDatabase.js");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting Mercado Camões Database Seeding...');
    // 1. Seed Categories
    for (const cat of mockDatabase_js_1.mockCategories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
                name_en: cat.name_en,
                name_pt: cat.name_pt,
                description_en: cat.description_en,
                description_pt: cat.description_pt,
                icon: cat.icon,
                displayOrder: cat.displayOrder
            },
            create: {
                id: cat.id,
                slug: cat.slug,
                name_en: cat.name_en,
                name_pt: cat.name_pt,
                description_en: cat.description_en,
                description_pt: cat.description_pt,
                icon: cat.icon,
                displayOrder: cat.displayOrder
            }
        });
    }
    console.log(`✅ Seeded ${mockDatabase_js_1.mockCategories.length} categories.`);
    // 2. Seed Products and Images
    for (const prod of mockDatabase_js_1.mockProducts) {
        const existing = await prisma.product.findUnique({
            where: { id: prod.id }
        });
        if (!existing) {
            await prisma.product.create({
                data: {
                    id: prod.id,
                    sku: prod.sku,
                    name_en: prod.name_en,
                    name_pt: prod.name_pt,
                    description_en: prod.description_en,
                    description_pt: prod.description_pt,
                    price: prod.price,
                    stock: prod.stock,
                    unit: prod.unit,
                    isFeatured: prod.isFeatured,
                    categoryId: prod.categoryId,
                    images: {
                        create: prod.images.map(img => ({
                            id: img.id,
                            url: img.url,
                            alt_en: img.alt_en,
                            alt_pt: img.alt_pt,
                            isPrimary: img.isPrimary
                        }))
                    }
                }
            });
        }
    }
    console.log(`✅ Seeded ${mockDatabase_js_1.mockProducts.length} products.`);
    // 3. Seed Store Settings
    const existingSettings = await prisma.storeSettings.findFirst();
    if (!existingSettings) {
        await prisma.storeSettings.create({
            data: {
                name: 'Mercado Camões',
                address: 'Praça Luís de Camões 22, 1200-243 Lisboa, Portugal',
                phone: '+351 21 345 6789',
                whatsapp: '+351 91 234 5678',
                email: 'info@mercadocamoes.pt',
                openingHours_en: 'Mon - Sun: 08:00 - 23:00',
                openingHours_pt: 'Seg - Dom: 08:00 - 23:00',
                rate_1h_per_bag: 2.50,
                rate_3h_per_bag: 5.00,
                rate_day_per_bag: 8.00,
                rate_extra_h_per_bag: 1.50
            }
        });
        console.log('✅ Seeded store settings.');
    }
    console.log('🎉 Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
