import { MetadataRoute } from 'next';
import { initialProducts } from '../lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mercadocamoes.pt';
  const locales = ['pt', 'en'];

  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((lang) => {
    // Core pages
    routes.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    });
    routes.push({
      url: `${baseUrl}/${lang}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    });
    routes.push({
      url: `${baseUrl}/${lang}/luggage-storage`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    });
    routes.push({
      url: `${baseUrl}/${lang}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    });

    // Product pages
    initialProducts.forEach((prod) => {
      routes.push({
        url: `${baseUrl}/${lang}/products/${prod.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
      });
    });
  });

  return routes;
}
