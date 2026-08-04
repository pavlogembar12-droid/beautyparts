import Link from 'next/link';
import { getAllCategories } from '@/lib/sheets';
import CategoryForm from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function NewCategoryPage() {
  const categories = await getAllCategories();

  return (
    <main>
      <nav>
        <Link href="/admin">Адмінка</Link> / <Link href="/admin/categories">Категорії</Link> / Нова категорія
      </nav>
      <h1>Додати нову категорію</h1>
      <CategoryForm initialCategory={null} categories={categories} />
    </main>
  );
}
