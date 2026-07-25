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

  const products = await getProductsByCategory(params.slug);

  return (
    <main>
      <nav><a href="/">Головна</a> / {category.name}</nav>
      <h1>{category.name}</h1>

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
