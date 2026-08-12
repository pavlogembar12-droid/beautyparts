'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const emptyProduct = {
  id: '', name: '', sku: '', brand: '',
  categorySlug: '', modelIds: [], price: '', oldPrice: '',
  image: '', description: '', inStock: true, top: false,
  features: '', slug: '', seoTitle: '', seoDescription: '', h1: '',
  features: '', createdAt: '',
};

const s = {
  page: { maxWidth: 640, margin: '0 auto', padding: '20px 16px 80px', color: '#1a1a1a' },
  card: { background: '#fff', border: '1px solid #e0ddd8', borderRadius: 12, padding: '20px 16px', marginBottom: 16, color: '#1a1a1a' },
  cardTitle: { fontSize: '12px', fontWeight: 700, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0ede8' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: 6, marginTop: 14 },
  input: { display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fafaf8', outline: 'none', color: '#1a1a1a' },
  textarea: { display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fafaf8', resize: 'vertical', lineHeight: 1.6, outline: 'none', color: '#1a1a1a' },
  select: { display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fafaf8', color: '#1a1a1a' },
  hint: { fontSize: '11.5px', color: '#777', marginTop: 5, lineHeight: 1.4 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  btnSave: { display: 'block', width: '100%', padding: '15px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  btnDelete: { display: 'block', width: '100%', padding: '13px', background: '#fff', color: '#c00', border: '1.5px solid #fcc', borderRadius: 10, fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  error: { background: '#fff0f0', border: '1px solid #fcc', borderRadius: 8, padding: '12px 14px', color: '#c00', fontSize: '14px', marginBottom: 12 },
  modelItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f5f3f0' },
  imagePreview: { width: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', background: '#fafaf8', padding: 8, marginTop: 10 },
};

export default function ProductForm({ initialProduct, categories, models }) {
  // Парсимо modelIds — може бути рядком через кому або масивом
  function parseModelIds(product) {
    if (!product) return [];
    const raw = product.modelIds || product.modelId || product.model || '';
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  }

  const [product, setProduct] = useState({
    ...emptyProduct,
    ...initialProduct,
    modelIds: parseModelIds(initialProduct),
    // Якщо categorySlug не встановлено але є cat — використовуємо cat
    categorySlug: initialProduct?.categorySlug || initialProduct?.cat || '',
    image: initialProduct?.image || initialProduct?.img || '',
    description: initialProduct?.description || initialProduct?.desc || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const router = useRouter();
  const isEditing = Boolean(initialProduct?.id);

  function set(field, value) {
    setProduct(prev => ({ ...prev, [field]: value }));
  }

  function toggleModel(modelId) {
    setProduct(prev => {
      const ids = prev.modelIds || [];
      return {
        ...prev,
        modelIds: ids.includes(modelId)
          ? ids.filter(id => id !== modelId)
          : [...ids, modelId],
      };
    });
  }

  // Групуємо моделі по бренду для зручності
  const modelsByBrand = {};
  models.forEach(m => {
    const b = m.brand || 'Інші';
    if (!modelsByBrand[b]) modelsByBrand[b] = [];
    modelsByBrand[b].push(m);
  });

  // Фільтруємо по пошуку
  const filteredModels = modelSearch
    ? models.filter(m => `${m.brand} ${m.name}`.toLowerCase().includes(modelSearch.toLowerCase()))
    : null;

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
      // Зберігаємо modelIds як рядок через кому (для сумісності з Google Sheets)
      const modelIdsString = (product.modelIds || []).join(',');

      const res = await fetch('/api/admin/product', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            ...product,
            price: parseFloat(product.price) || 0,
            oldPrice: parseFloat(product.oldPrice) || 0,
            cat: product.categorySlug,
            model: modelIdsString,
            img: product.image,
            desc: product.description,
          },
        }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error || 'Помилка збереження'); setSubmitting(false); return; }
      router.push('/admin/products'); router.refresh();
    } catch (err) {
      console.error(err);
      setError('Помилка з\'єднання. Спробуйте ще раз.');
      setSubmitting(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '11px', color: '#999', marginBottom: 6 }}>
          {isEditing ? '✏️ Редагування товару' : '➕ Новий товар'}
        </div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.3, color: '#1a1a1a' }}>
          {product.name || 'Без назви'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ОСНОВНА ІНФОРМАЦІЯ */}
        <div style={s.card}>
          <div style={s.cardTitle}>📦 Основна інформація</div>

          <label style={{ ...s.label, marginTop: 0 }}>Назва товару *</label>
          <input style={s.input} type="text" value={product.name}
            onChange={e => set('name', e.target.value)} required
            placeholder="напр. Ножовий блок Wahl T-Blade 1584-7222" />

          <div style={s.row2}>
            <div>
              <label style={{ ...s.label, marginTop: 12 }}>Артикул (SKU)</label>
              <input style={s.input} type="text" value={product.sku}
                onChange={e => set('sku', e.target.value)} placeholder="1584-7222" />
            </div>
            <div>
              <label style={{ ...s.label, marginTop: 12 }}>Бренд *</label>
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
          {!product.categorySlug && (
            <div style={{ ...s.hint, color: '#e07000' }}>⚠️ Оберіть категорію</div>
          )}
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
              <label style={{ ...s.label, marginTop: 0 }}>Стара ціна</label>
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
            onChange={e => set('image', e.target.value)} placeholder="https://..." />
          {product.image && (
            <img src={product.image} alt="preview" style={s.imagePreview}
              onError={e => e.target.style.display = 'none'} />
          )}
        </div>

        {/* ОПИС */}
        <div style={s.card}>
          <div style={s.cardTitle}>📝 Опис товару</div>
          <div style={{ ...s.hint, marginBottom: 10, fontSize: '12.5px', color: '#666' }}>
            💡 Кожен абзац з нового рядка. Рядки з "-" стають списком. Рядок що закінчується ":" стає заголовком.
          </div>
          <textarea style={{ ...s.textarea, minHeight: 180 }}
            value={product.description}
            onChange={e => set('description', e.target.value)}
            placeholder={'Оригінальний ножовий блок Wahl T-Blade 1584-7222.\n\nПереваги:\n- Оригінальна запчастина\n- T-подібне лезо\n- Висота зрізу — 0,3 мм'}
          />
        </div>

        {/* ХАРАКТЕРИСТИКИ */}
        <div style={s.card}>
          <div style={s.cardTitle}>📋 Характеристики</div>
          <div style={{ ...s.hint, marginBottom: 10, fontSize: '12.5px', color: '#666' }}>
            💡 Формат: "Назва: значення" — кожна з нового рядка
          </div>
          <textarea style={{ ...s.textarea, minHeight: 120 }}
            value={product.features}
            onChange={e => set('features', e.target.value)}
            placeholder={'Ширина ножа: 40 мм\nВисота зрізу: 0,3 мм\nМатеріал: нержавіюча сталь'}
          />
        </div>

        {/* МОДЕЛІ — МУЛЬТИВИБІР */}
        <div style={s.card}>
          <div style={s.cardTitle}>🔧 Підходить до моделей</div>
          <div style={{ ...s.hint, marginBottom: 10, fontSize: '12.5px', color: '#666' }}>
            💡 Можна обрати кілька моделей — товар буде відображатись в кожній
          </div>

          {/* Обрані моделі */}
          {product.modelIds.length > 0 && (
            <div style={{ background: '#f0f8f0', border: '1px solid #a5d6a7', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#2a6b45', marginBottom: 6 }}>
                ✓ Обрано: {product.modelIds.length}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.modelIds.map(id => {
                  const m = models.find(m => m.id === id);
                  return m ? (
                    <span key={id} style={{
                      background: '#fff', border: '1px solid #a5d6a7',
                      borderRadius: 14, padding: '3px 10px',
                      fontSize: '12px', display: 'flex', alignItems: 'center', gap: 5,
                      color: '#1a1a1a',
                    }}>
                      {m.brand} {m.name}
                      <button type="button" onClick={() => toggleModel(id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '14px', padding: 0, lineHeight: 1 }}>
                        ✕
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Пошук */}
          <input
            type="text"
            placeholder="🔍 Пошук моделі..."
            value={modelSearch}
            onChange={e => setModelSearch(e.target.value)}
            style={{ ...s.input, marginBottom: 10 }}
          />

          {/* Список моделей */}
          <div style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8 }}>
            {(filteredModels
              ? [{ brand: 'Результати пошуку', items: filteredModels }]
              : Object.entries(modelsByBrand).map(([brand, items]) => ({ brand, items }))
            ).map(({ brand, items }) => (
              <div key={brand}>
                <div style={{ padding: '8px 12px 4px', fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', background: '#f9f9f7', borderBottom: '1px solid #f0ede8' }}>
                  {brand}
                </div>
                {items.map(m => {
                  const checked = product.modelIds.includes(m.id);
                  return (
                    <label key={m.id} style={{ ...s.modelItem, padding: '10px 12px', cursor: 'pointer', background: checked ? '#f0f8f0' : 'transparent', color: '#1a1a1a' }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleModel(m.id)}
                        style={{ width: 18, height: 18, cursor: 'pointer', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: checked ? 600 : 400, color: '#1a1a1a' }}>
                        {m.brand} {m.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* СТАТУС */}
        <div style={s.card}>
          <div style={s.cardTitle}>⚙️ Статус</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f5f3f0', cursor: 'pointer' }}>
            <input type="checkbox" checked={product.inStock}
              onChange={e => set('inStock', e.target.checked)}
              style={{ width: 22, height: 22, cursor: 'pointer' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>В наявності</div>
              <div style={{ fontSize: '11.5px', color: '#777' }}>Товар доступний для замовлення</div>
            </div>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={product.top}
              onChange={e => set('top', e.target.checked)}
              style={{ width: 22, height: 22, cursor: 'pointer' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Топ товар</div>
              <div style={{ fontSize: '11.5px', color: '#777' }}>Показувати в "Популярні товари" на головній</div>
            </div>
          </label>
        </div>

        {/* SEO */}
        <div style={s.card}>
          <div style={s.cardTitle}>🔍 URL та SEO</div>
          <label style={{ ...s.label, marginTop: 0 }}>Slug (адреса)</label>
          <input style={s.input} type="text" value={product.slug}
            onChange={e => set('slug', e.target.value)}
            placeholder="wahl-1584-7222 (порожньо = автогенерація)" />
          <label style={s.label}>Title для Google</label>
          <input style={s.input} type="text" value={product.seoTitle}
            onChange={e => set('seoTitle', e.target.value)}
            placeholder="Порожньо = автогенерація" />
          <label style={s.label}>Description для Google</label>
          <textarea style={{ ...s.textarea, minHeight: 60 }}
            value={product.seoDescription}
            onChange={e => set('seoDescription', e.target.value)}
            placeholder="Порожньо = автогенерація" />
          <label style={s.label}>H1 заголовок</label>
          <input style={s.input} type="text" value={product.h1}
            onChange={e => set('h1', e.target.value)}
            placeholder="Порожньо = назва товару" />
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <button type="submit" disabled={submitting}
          style={{ ...s.btnSave, opacity: submitting ? 0.7 : 1 }}>
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
