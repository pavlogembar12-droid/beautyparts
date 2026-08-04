import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCategories } from '@/lib/sheets';
import CategoryForm from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  return (
    <main>
      <nav>
        <Link href="/admin">Адмінка</Link> / <Link href="/admin/categories">Категорії</Link> / {category.name}
      </nav>
      <h1>Редагувати категорію</h1>
      <CategoryForm initialCategory={category} categories={categories} />
    </main>
  );
}
