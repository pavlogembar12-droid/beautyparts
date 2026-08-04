import { NextResponse } from 'next/server';
import { saveCategory, deleteCategory, slugify } from '@/lib/sheets';

export async function POST(request) {
  const body = await request.json();

  try {
    if (body.action === 'delete') {
      await deleteCategory(body.id);
      return NextResponse.json({ ok: true });
    }

    const category = body.category || {};

    // Якщо адміністратор не вписав id (slug) вручну — генеруємо з назви
    if (!category.id) {
      category.id = slugify(category.label || category.name || '');
    }

    const result = await saveCategory(category);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error('Помилка збереження категорії:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
