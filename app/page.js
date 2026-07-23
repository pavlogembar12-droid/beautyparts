import Link from 'next/link';
import { getAllProducts, getAllCategories, getAllBrands } from '@/lib/sheets';

export default async function HomePage() {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
  ]);

  return (
    <main>
      <h1>Beauty Parts — запчастини для машинок для стрижки</h1>

      <p><Link href="/catalog">Перейти до повного каталогу з фільтрами →</Link></p>

      <section>
        <h2>Категорії</h2>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Бренди</h2>
        <ul>
          {brands.map((b) => (
            <li key={b.slug}>
              <Link href={`/brand/${b.slug}`}>{b.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Усі товари</h2>
        <ul>
          {products.map((p) => (
            <li key={p.id || p.slug}>
              <Link href={`/product/${p.slug}`}>{p.name}</Link> — {p.price} грн
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
