import Link from 'next/link';
import { getAllCategories, getAllModels } from '@/lib/sheets';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const [categories, models] = await Promise.all([getAllCategories(), getAllModels()]);

  return (
    <main>
      <nav><Link href="/admin">Адмінка</Link> / <Link href="/admin/products">Товари</Link> / Новий товар</nav>
      <h1>Додати новий товар</h1>
      <ProductForm initialProduct={null} categories={categories} models={models} />
    </main>
  );
}
