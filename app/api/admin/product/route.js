import { NextResponse } from 'next/server';
import { saveProduct, deleteProduct, slugify } from '@/lib/sheets';

export async function POST(request) {
  const body = await request.json();

  try {
    if (body.action === 'delete') {
      await deleteProduct(body.id);
      return NextResponse.json({ ok: true });
    }

    const product = body.product || {};

    // Якщо адміністратор не вписав slug вручну — генеруємо з бренду й артикула
    if (!product.slug) {
      product.slug = slugify(`${product.brand || ''}-${product.sku || product.name || ''}`);
    }

    const result = await saveProduct(product);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error('Помилка збереження товару:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
