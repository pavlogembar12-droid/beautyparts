import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { saveCategory, deleteCategory, slugify } from '@/lib/sheets';

export async function POST(request) {
  const body = await request.json();

  try {
    if (body.action === 'delete') {
      await deleteCategory(body.id);
      // Без цього getAllCategories() продовжує повертати закешовану
      // (revalidate: 300s) відповідь ще до 5 хвилин після видалення —
      // router.refresh() на клієнті перезапускає рендер сторінки, але
      // не примушує Next.js ігнорувати кеш самого fetch до Google Sheets.
      revalidatePath('/admin/categories');
      revalidatePath('/');
      return NextResponse.json({ ok: true });
    }

    const category = body.category || {};

    if (!category.id) {
      category.id = slugify(category.label || category.name || '');
    }

    const result = await saveCategory(category);
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error('Помилка збереження категорії:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
