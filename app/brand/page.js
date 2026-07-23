import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllBrands, getProductsByBrand } from '@/lib/sheets';

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.slug === params.slug);
  if (!brand) return {};

  return {
    title: `${brand.name} — запчастини та ножові блоки | Beauty Parts`,
    description: `Усі товари бренду ${brand.name}: ножові блоки, запчастини для машинок для стрижки. Купити з доставкою по Україні.`,
  };
}

export default async function BrandPage({ params }) {
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.slug === params.slug);
  if (!brand) notFound();

  const products = await getProductsByBrand(params.slug);

  return (
    <main>
      <nav><a href="/">Головна</a> / {brand.name}</nav>
      <h1>{brand.name}</h1>

      <ul>
        {products.map((p) => (
          <li key={p.id || p.slug}>
            <Link href={`/product/${p.slug}`}>{p.name}</Link> — {p.price} грн
          </li>
        ))}
      </ul>

      {products.length === 0 && <p>У цього бренду поки немає товарів.</p>}
    </main>
  );
}
