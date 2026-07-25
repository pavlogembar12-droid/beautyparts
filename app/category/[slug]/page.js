import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCategories, getProductsByCategory } from '@/lib/sheets';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return {};

  return {
    title: `${category.name} — купити в Beauty Parts`,
    description: `Каталог: ${category.name}. Оригінальні запчастини для машинок для стрижки з доставкою по Україні.`,
  };
}

export default async function CategoryPage({ params }) {
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  // Підкатегорії цієї категорії (якщо вона верхнього рівня)
  const children = categories.filter((c) => c.parent === category.slug);
  // Якщо ми самі є підкатегорією — знайдемо "батька" для хлібних крихт
  const parent = category.parent ? categories.find((c) => c.slug === category.parent) : null;

  const products = await getProductsByCategory(params.slug);

  return (
    <main>
      <nav>
        <a href="/">Головна</a>
        {parent && (
          <>
            {' / '}
            <a href={`/category/${parent.slug}`}>{parent.name}</a>
          </>
        )}
        {' / '}
        {category.name}
      </nav>
      <h1>{category.name}</h1>

      {children.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '16px 0 24px' }}>
          {children.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              style={{ background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: '20px', padding: '8px 20px', fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a', textDecoration: 'none' }}
            >
              {c.icon ? `${c.icon} ` : ''}{c.name}
            </Link>
          ))}
        </div>
      )}

      <ul>
        {products.map((p) => (
          <li key={p.id || p.slug}>
            <Link href={`/product/${p.slug}`}>{p.name}</Link> — {p.price} грн
          </li>
        ))}
      </ul>

      {products.length === 0 && <p>У цій категорії поки немає товарів.</p>}
    </main>
  );
      }
