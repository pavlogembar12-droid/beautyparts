'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const emptyProduct = {
  id: '',
  name: '',
  sku: '',
  brand: '',
  categorySlug: '', // код категорії, напр. "blades" — див. lib/sheets.js
  modelId: '',       // код моделі, напр. "m17"
  price: '',
  oldPrice: '',
  image: '',
  description: '',
  inStock: true,
  top: false,
  slug: '',
  seoTitle: '',
  seoDescription: '',
  h1: '',
};

export default function ProductForm({ initialProduct, categories, models }) {
  const [product, setProduct] = useState({ ...emptyProduct, ...initialProduct });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const isEditing = Boolean(initialProduct?.id);

  function handleChange(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }));
  }

  async function handleDelete() {
    if (!window.confirm(`Видалити товар "${product.name}"? Це незворотньо.`)) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: product.id }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || 'Не вдалося видалити товар.');
        setSubmitting(false);
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Помилка з\'єднання. Спробуйте ще раз.');
      setSubmitting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            ...product,
            price: parseFloat(product.price) || 0,
            oldPrice: parseFloat(product.oldPrice) || 0,
            // На запис у таблицю йдуть КОДИ категорії/моделі (cat, model),
            // а не людський текст — саме так, як зберігається в Products.
            cat: product.categorySlug,
            model: product.modelId,
          },
        }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || 'Не вдалося зберегти товар.');
        setSubmitting(false);
        return;
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Помилка з\'єднання. Спробуйте ще раз.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Основна інформація</legend>

        <label>
          Назва товару
          <input
            type="text"
            value={product.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </label>

        <label>
          Артикул (SKU)
          <input
            type="text"
            value={product.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="напр. 1584-7222"
          />
        </label>

        <label>
          Бренд
          <input
            type="text"
            value={product.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            required
          />
        </label>

        <label>
          Категорія
          <select
            value={product.categorySlug}
            onChange={(e) => handleChange('categorySlug', e.target.value)}
            required
          >
            <option value="">Оберіть категорію</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </label>

        <label>
          Модель машинки (до якої підходить)
          <select
            value={product.modelId}
            onChange={(e) => handleChange('modelId', e.target.value)}
          >
            <option value="">— Не прив'язано до моделі —</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.brand} {m.name}</option>
            ))}
          </select>
        </label>

        <label>
          Ціна (грн)
          <input
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
          />
        </label>

        <label>
          Стара ціна (грн, якщо є знижка — необов'язково)
          <input
            type="number"
            step="0.01"
            value={product.oldPrice}
            onChange={(e) => handleChange('oldPrice', e.target.value)}
          />
        </label>

        <label>
          Посилання на фото
          <input
            type="text"
            value={product.image}
            onChange={(e) => handleChange('image', e.target.value)}
          />
        </label>

        <label>
          Опис
          <textarea
            value={product.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={product.inStock}
            onChange={(e) => handleChange('inStock', e.target.checked)}
          />
          В наявності
        </label>

        <label>
          <input
            type="checkbox"
            checked={product.top}
            onChange={(e) => handleChange('top', e.target.checked)}
          />
          Показувати в "топ товарах" на головній
        </label>
      </fieldset>

      <fieldset>
        <legend>URL та SEO</legend>

        <label>
          Slug (адреса сторінки — залиште порожнім для автогенерації з бренду й артикула)
          <input
            type="text"
            value={product.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="напр. wahl/1584-7222"
          />
        </label>

        <label>
          Title (заголовок для Google — залиште порожнім для автогенерації)
          <input
            type="text"
            value={product.seoTitle}
            onChange={(e) => handleChange('seoTitle', e.target.value)}
          />
        </label>

        <label>
          Description (опис для Google — залиште порожнім для автогенерації)
          <textarea
            value={product.seoDescription}
            onChange={(e) => handleChange('seoDescription', e.target.value)}
            rows={2}
          />
        </label>

        <label>
          H1 (заголовок на сторінці — залиште порожнім, буде = назва товару)
          <input
            type="text"
            value={product.h1}
            onChange={(e) => handleChange('h1', e.target.value)}
          />
        </label>
      </fieldset>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Зберігаємо...' : isEditing ? 'Зберегти зміни' : 'Додати товар'}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={submitting}
          style={{ marginLeft: '1em', color: 'red' }}
        >
          Видалити товар
        </button>
      )}
    </form>
  );
}
