import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllCategories, getAllModels } from '@/lib/sheets';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }) {
  const [product, categories, models] = await Promise.all([
    getProductBySlug(params.slug),
    getAllCategories(),
    getAllModels(),
  ]);
  if (!product) notFound();

  return (
    <main>
      <nav><Link href="/admin">Адмінка</Link> / <Link href="/admin/products">Товари</Link> / {product.name}</nav>
      <h1>Редагувати: {product.name}</h1>
      <ProductForm initialProduct={product} categories={categories} models={models} />
    </main>
  );
}
