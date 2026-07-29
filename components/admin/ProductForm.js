'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const emptyProduct = {
  id: '', name: '', sku: '', brand: '',
  categorySlug: '', modelId: '', price: '', oldPrice: '',
  image: '', description: '', inStock: true, top: false,
  features: '', slug: '', seoTitle: '', seoDescription: '', h1: '',
};

const s = {
  page: { maxWidth: 640, margin: '0 auto', padding: '20px 16px 80px' },
  card: { background: '#fff', border: '1px solid #e0ddd8', borderRadius: 12, padding: '20px 16px', marginBottom: 16 },
  cardTitle: { fontSize: '13px', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0ede8' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: 6, marginTop: 14 },
  input: { display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fafaf8', transition: 'border-color 0.15s', outline: 'none' },
  textarea: { display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fafaf8', resize: 'vertical', lineHeight: 1.6, outline: 'none' },
  select: { display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fafaf8', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%23666\' d=\'M6 8L0 0h12z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' },
  hint: { fontSize: '11.5px', color: '#999', marginTop: 5, lineHeight: 1.4 },
  checkRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid #f5f3f0', cursor: 'pointer' },
  checkLabel: { fontSize: '14px', fontWeight: 600, color: '#333', flex: 1 },
  checkDesc: { fontSize: '12px', color: '#999', marginTop: 2 },
  imagePreview: { width: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', background: '#fafaf8', padding: 8, marginTop: 10 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  btnSave: { display: 'block', width: '100%', padding: '15px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: 10, transition: 'opacity 0.15s' },
  btnDelete: { display: 'block', width: '100%', padding: '13px', background: '#fff', color: '#c00', border: '1.5px solid #fcc', borderRadius: 10, fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  error: { background: '#fff0f0', border: '1px solid #fcc', borderRadius: 8, padding: '12px 14px', color: '#c00', fontSize: '14px', marginBottom: 12 },
  badge: { display: 'inline-block', background: '#e8f5e9', color: '#2a6b45', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginLeft: 8 },
};

export default function ProductForm({ initialProduct, categories, models }) {
  const [product, setProduct] = useState({ ...emptyProduct, ...initialProduct });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const isEditing = Boolean(initialProduct?.id);

  function set(field, value) {
    setProduct(prev => ({ ...prev, [field]: value }));
  }

  async function handleDelete() {
    if (!window.confirm(`Видалити "${product.name}"? Це незворотньо.`)) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/product', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: product.id }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error || 'Помилка видалення'); setSubmitting(false); return; }
      router.push('/admin/products'); router.refresh();
    } catch { setError('Помилка з\'єднання'); setSubmitting(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/admin/product', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            ...product,
            price: parseFloat(product.price) || 0,
            oldPrice: parseFloat(product.oldPrice) || 0,
            cat: product.categorySlug,
            model: product.modelId,
          },
        }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error || 'Помилка збереження'); setSubmitting(false); return; }
      router.push('/admin/products'); router.refresh();
    } catch { setError('Помилка з\'єднання'); setSubmitting(false); }
  }

  return (
    <div style={s.page}>
      {/* Заголовок */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '11px', color: '#999', marginBottom: 6 }}>
          {isEditing ? '✏️ Редагування товару' : '➕ Новий товар'}
        </div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.3, color: '#1a1a1a' }}>
          {product.name || 'Без назви'}
          {product.inStock && <span style={s.badge}>В наявності</span>}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ОСНОВНА ІНФОРМАЦІЯ */}
        <div style={s.card}>
          <div style={s.cardTitle}>📦 Основна інформація</div>

          <label style={s.label}>Назва товару *</label>
          <input style={s.input} type="text" value={product.name}
            onChange={e => set('name', e.target.value)} required
            placeholder="напр. Ножовий блок Wahl T-Blade 1584-7222" />

          <div style={s.row2}>
            <div>
              <label style={{ ...s.label, marginTop: 0 }}>Артикул (SKU)</label>
              <input style={s.input} type="text" value={product.sku}
                onChange={e => set('sku', e.target.value)} placeholder="1584-7222" />
            </div>
            <div>
              <label style={{ ...s.label, marginTop: 0 }}>Бренд *</label>
              <input style={s.input} type="text" value={product.brand}
                onChange={e => set('brand', e.target.value)} required placeholder="Wahl" />
            </div>
          </div>

          <label style={s.label}>Категорія *</label>
          <select style={s.select} value={product.categorySlug}
            onChange={e => set('categorySlug', e.target.value)} required>
            <option value="">Оберіть категорію</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>

          <label style={s.label}>Модель машинки</label>
          <select style={s.select} value={product.modelId}
            onChange={e => set('modelId', e.target.value)}>
            <option value="">— Не прив'язано до моделі —</option>
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.brand} {m.name}</option>
            ))}
          </select>
        </div>

        {/* ЦІНА */}
        <div style={s.card}>
          <div style={s.cardTitle}>💰 Ціна</div>
          <div style={s.row2}>
            <div>
              <label style={{ ...s.label, marginTop: 0 }}>Ціна (грн) *</label>
              <input style={s.input} type="number" step="0.01" value={product.price}
                onChange={e => set('price', e.target.value)} required placeholder="0" />
            </div>
            <div>
              <label style={{ ...s.label, marginTop: 0 }}>Стара ціна (грн)</label>
              <input style={s.input} type="number" step="0.01" value={product.oldPrice}
                onChange={e => set('oldPrice', e.target.value)} placeholder="0" />
              <div style={s.hint}>Якщо є знижка</div>
            </div>
          </div>
        </div>

        {/* ФОТО */}
        <div style={s.card}>
          <div style={s.cardTitle}>🖼 Фото</div>
          <label style={{ ...s.label, marginTop: 0 }}>Посилання на фото (URL)</label>
          <input style={s.input} type="text" value={product.image}
            onChange={e => set('image', e.target.value)}
            placeholder="https://..." />
          <div style={s.hint}>Вставте пряме посилання на зображення</div>
          {product.image && (
            <img src={product.image} alt="preview" style={s.imagePreview}
              onError={e => e.target.style.display = 'none'} />
          )}
        </div>

        {/* ОПИС */}
        <div style={s.card}>
          <div style={s.cardTitle}>📝 Опис товару</div>
          <div style={s.hint} style={{ ...s.hint, marginBottom: 8, fontSize: '12.5px', color: '#666' }}>
            💡 Пишіть кожен абзац з нового рядка — вони відображатимуться окремо на сторінці товару.
          </div>
          <textarea style={{ ...s.textarea, minHeight: 160 }}
            value={product.description}
            onChange={e => set('description', e.target.value)}
            placeholder={`Оригінальний ножовий блок Wahl T-Blade 1584-7222 призначений для тримерів серії ChroMini та T-Cut.\n\nT-подібне лезо забезпечує точне окантування, оформлення контурів і зріз довжиною 0,3 мм.\n\nПереваги:\n- Оригінальна запчастина Wahl\n- T-подібне лезо для точного окантування\n- Висота зрізу — 0,3 мм`}
          />
        </div>

        {/* ХАРАКТЕРИСТИКИ */}
        <div style={s.card}>
          <div style={s.cardTitle}>📋 Характеристики</div>
          <div style={{ ...s.hint, marginBottom: 8, fontSize: '12.5px', color: '#666' }}>
            💡 Формат: "Назва: значення" — кожна характеристика з нового рядка
          </div>
          <textarea style={{ ...s.textarea, minHeight: 120 }}
            value={product.features}
            onChange={e => set('features', e.target.value)}
            placeholder={'Ширина ножа: 40 мм\nВисота зрізу: 0,3 мм\nМатеріал: нержавіюча сталь\nСумісний з: Wahl ChroMini, T-Cut'}
          />
        </div>

        {/* СТАТУС */}
        <div style={s.card}>
          <div style={s.cardTitle}>⚙️ Статус</div>

          <label style={s.checkRow}>
            <input type="checkbox" checked={product.inStock}
              onChange={e => set('inStock', e.target.checked)}
              style={{ width: 20, height: 20, cursor: 'pointer', flexShrink: 0 }} />
            <div>
              <div style={s.checkLabel}>В наявності</div>
              <div style={s.checkDesc}>Товар відображається як доступний для замовлення</div>
            </div>
          </label>

          <label style={{ ...s.checkRow, borderBottom: 'none', paddingBottom: 0 }}>
            <input type="checkbox" checked={product.top}
              onChange={e => set('top', e.target.checked)}
              style={{ width: 20, height: 20, cursor: 'pointer', flexShrink: 0 }} />
            <div>
              <div style={s.checkLabel}>Топ товар</div>
              <div style={s.checkDesc}>Показувати в "Популярні товари" на головній сторінці</div>
            </div>
          </label>
        </div>

        {/* SEO */}
        <div style={s.card}>
          <div style={s.cardTitle}>🔍 URL та SEO</div>

          <label style={{ ...s.label, marginTop: 0 }}>Slug (адреса сторінки)</label>
          <input style={s.input} type="text" value={product.slug}
            onChange={e => set('slug', e.target.value)}
            placeholder="wahl-1584-7222 (залиште порожнім — згенерується автоматично)" />
          <div style={s.hint}>Адреса: /product/wahl-1584-7222</div>

          <label style={s.label}>Title для Google</label>
          <input style={s.input} type="text" value={product.seoTitle}
            onChange={e => set('seoTitle', e.target.value)}
            placeholder="Залиште порожнім — згенерується автоматично" />

          <label style={s.label}>Description для Google</label>
          <textarea style={{ ...s.textarea, minHeight: 70 }}
            value={product.seoDescription}
            onChange={e => set('seoDescription', e.target.value)}
            placeholder="Залиште порожнім — згенерується автоматично" />

          <label style={s.label}>H1 заголовок на сторінці</label>
          <input style={s.input} type="text" value={product.h1}
            onChange={e => set('h1', e.target.value)}
            placeholder="Залиште порожнім — буде = назва товару" />
        </div>

        {/* ПОМИЛКА */}
        {error && <div style={s.error}>⚠️ {error}</div>}

        {/* КНОПКИ */}
        <button type="submit" disabled={submitting} style={{ ...s.btnSave, opacity: submitting ? 0.7 : 1 }}>
          {submitting ? '⏳ Зберігаємо...' : isEditing ? '✅ Зберегти зміни' : '➕ Додати товар'}
        </button>

        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={submitting} style={s.btnDelete}>
            🗑 Видалити товар
          </button>
        )}
      </form>
    </div>
  );
                  }
          
