import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllModels, getProductsByModel } from '@/lib/sheets';

export async function generateStaticParams() {
  const models = await getAllModels();
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }) {
  const models = await getAllModels();
  const model = models.find((m) => m.slug === params.slug);
  if (!model) return {};

  return {
    title: `Запчастини для ${model.name} — Beauty Parts`,
    description: `Усі сумісні запчастини та ножові блоки для машинки ${model.name}. Доставка по Україні.`,
  };
}

export default async function ModelPage({ params }) {
  const models = await getAllModels();
  const model = models.find((m) => m.slug === params.slug);
  if (!model) notFound();

  const products = await getProductsByModel(params.slug);

  return (
    <main>
      <nav><Link href="/">Головна</Link> / {model.name}</nav>
      <h1>Запчастини для {model.name}</h1>

      <ul>
        {products.map((p) => (
          <li key={p.id || p.slug}>
            <Link href={`/product/${p.slug}`}>{p.name}</Link> — {p.price} грн
          </li>
        ))}
      </ul>

      {products.length === 0 && <p>Для цієї моделі поки немає товарів у каталозі.</p>}
    </main>
  );
}
