'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const emptyCategory = {
  id: '', name: '', icon: '', parent: '',
};

const s = {
  page: { maxWidth: 640, margin: '0 auto', padding: '20px 16px 80px' },
  card: { background: '#fff', border: '1px solid #e0ddd8', borderRadius: 12, padding: '20px 16px', marginBottom: 16 },
  cardTitle: { fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f0ede8' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: 6, marginTop: 14 },
  input: { display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fafaf8', outline: 'none' },
  select: { display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fafaf8' },
  hint: { fontSize: '11.5px', color: '#999', marginTop: 5, lineHeight: 1.4 },
  btnSave: { display: 'block', width: '100%', padding: '15px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  btnDelete: { display: 'block', width: '100%', padding: '13px', background: '#fff', color: '#c00', border: '1.5px solid #fcc', borderRadius: 10, fontSize: '14px', fontWeight: 700, cursor: 'pointer' },
  error: { background: '#fff0f0', border: '1px solid #fcc', borderRadius: 8, padding: '12px 14px', color: '#c00', fontSize: '14px', marginBottom: 12 },
};

export default function CategoryForm({ initialCategory, categories }) {
  const [category, setCategory] = useState({
    ...emptyCategory,
    // getAllCategories() віддає { name, slug, icon, parent } — мапимо
    // на внутрішню форму { id, name, icon, parent }, де id = slug.
    id: initialCategory?.slug || '',
    name: initialCategory?.name || '',
    icon: initialCategory?.icon || '',
    parent: initialCategory?.parent || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const isEditing = Boolean(initialCategory?.slug);

  function set(field, value) {
    setCategory((prev) => ({ ...prev, [field]: value }));
  }

  // Категорія не може бути власним батьком, і для списку "Батьківська"
  // не показуємо саму себе (актуально при редагуванні).
  const parentOptions = categories.filter((c) => c.slug !== category.id);

  async function handleDelete() {
    if (!window.confirm(`Видалити категорію "${category.name}"? Товари з цією категорією не видаляться, але залишаться без категорії.`)) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: category.id }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error || 'Помилка видалення'); setSubmitting(false); return; }
      router.push('/admin/categories');
      router.refresh();
    } catch {
      setError('Помилка з\'єднання');
      setSubmitting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: {
            id: category.id,
            label: category.name,
            icon: category.icon,
            parent: category.parent,
          },
        }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error || 'Помилка збереження'); setSubmitting(false); return; }
      router.push('/admin/categories');
      router.refresh();
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
          {isEditing ? '✏️ Редагування категорії' : '➕ Нова категорія'}
        </div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.3 }}>
          {category.icon ? `${category.icon} ` : ''}{category.name || 'Без назви'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={s.card}>
          <div style={s.cardTitle}>📦 Основна інформація</div>

          <label style={{ ...s.label, marginTop: 0 }}>Назва категорії *</label>
          <input
            style={s.input}
            type="text"
            value={category.name}
            onChange={(e) => set('name', e.target.value)}
            required
            placeholder="напр. Ножі та ножові блоки"
          />

          <label style={s.label}>Іконка (емодзі)</label>
          <input
            style={s.input}
            type="text"
            value={category.icon}
            onChange={(e) => set('icon', e.target.value)}
            placeholder="🔪"
          />

          <label style={s.label}>Батьківська категорія</label>
          <select
            style={s.select}
            value={category.parent}
            onChange={(e) => set('parent', e.target.value)}
          >
            <option value="">— Немає (категорія верхнього рівня) —</option>
            {parentOptions.map((c) => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
          <div style={s.hint}>Якщо обрати — ця категорія стане підкатегорією обраної.</div>

          <label style={s.label}>Slug (id) {isEditing && '— не можна змінити'}</label>
          <input
            style={{ ...s.input, background: isEditing ? '#f0ede8' : s.input.background, color: isEditing ? '#999' : undefined }}
            type="text"
            value={category.id}
            onChange={(e) => set('id', e.target.value)}
            disabled={isEditing}
            placeholder="blades (порожньо = автогенерація з назви)"
          />
          <div style={s.hint}>
            {isEditing
              ? 'Slug — це первинний ключ рядка в таблиці, тому зміна slug при редагуванні створила б нову категорію замість оновлення цієї.'
              : 'Використовується в адресі сторінки категорії та як код у товарах. Порожньо — згенерується з назви.'}
          </div>
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <button type="submit" disabled={submitting} style={{ ...s.btnSave, opacity: submitting ? 0.7 : 1 }}>
          {submitting ? '⏳ Зберігаємо...' : isEditing ? '✅ Зберегти зміни' : '➕ Додати категорію'}
        </button>

        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={submitting} style={s.btnDelete}>
            🗑 Видалити категорію
          </button>
        )}
      </form>
    </div>
  );
}
