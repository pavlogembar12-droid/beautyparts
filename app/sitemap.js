import { getAllProducts, getAllCategories, getAllBrands, getAllModels, SITE_URL } from '@/lib/sheets';

// Next.js автоматично віддає це на адресу /sitemap.xml
export default async function sitemap() {
  const [products, categories, brands, models] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
    getAllModels(),
  ]);

  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/catalog`, changeFrequency: 'daily', priority: 0.9 },
  ];

  const modelPages = models.map((m) => ({
    url: `${SITE_URL}/model/${m.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const productPages = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const brandPages = brands.map((b) => ({
    url: `${SITE_URL}/brand/${b.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...brandPages, ...modelPages];
}
