import Link from 'next/link';
import {
  searchProducts,
  getAllCategories,
  getAllBrands,
  getAllModels,
} from '@/lib/sheets';

export const metadata = {
  title: 'Каталог товарів — Beauty Parts',
  description: 'Повний каталог запчастин для машинок для стрижки з фільтрами за категорією, брендом і моделлю.',
};

// searchParams тут — це ?category=...&brand=...&model=...&q=...
// Next.js передає їх серверному компоненту автоматично.
export default async function CatalogPage({ searchParams }) {
  const filters = {
    q: searchParams.q || '',
    category: searchParams.category || '',
    brand: searchParams.brand || '',
    model: searchParams.model || '',
  };

  const [products, categories, brands, models] = await Promise.all([
    searchProducts(filters),
    getAllCategories(),
    getAllBrands(),
    getAllModels(),
  ]);

  return (
    <main>
      <nav><Link href="/">Головна</Link> / Каталог</nav>
      <h1>Каталог товарів</h1>

      {/*
        Звичайна HTML-форма з method="get" — це принципово важливо:
        вона працює навіть якщо JavaScript вимкнений (чи не встиг
        завантажитись), бо браузер сам формує URL типу
        /catalog?category=nozhi&brand=wahl
      */}
      <form method="get" action="/catalog">
        <input
          type="text"
          name="q"
          placeholder="Пошук товару..."
          defaultValue={filters.q}
        />

        <select name="category" defaultValue={filters.category}>
          <option value="">Усі категорії</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select name="brand" defaultValue={filters.brand}>
          <option value="">Усі бренди</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </select>

        <select name="model" defaultValue={filters.model}>
          <option value="">Усі моделі</option>
          {models.map((m) => (
            <option key={m.slug} value={m.slug}>{m.name}</option>
          ))}
        </select>

        <button type="submit">Знайти</button>
      </form>

      <p>Знайдено товарів: {products.length}</p>

      <ul>
        {products.map((p) => (
          <li key={p.id || p.slug}>
            <Link href={`/product/${p.slug}`}>{p.name}</Link> — {p.price} грн
          </li>
        ))}
      </ul>

      {products.length === 0 && <p>Нічого не знайдено. Спробуйте змінити фільтри.</p>}
    </main>
  );
}
