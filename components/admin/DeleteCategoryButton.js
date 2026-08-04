'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteCategoryButton({ id, name }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Видалити категорію "${name}"? Товари з цією категорією не видаляться, але залишаться без категорії.`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error('failed');
      router.refresh();
    } catch {
      alert('Не вдалося видалити категорію.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: 'none',
        border: '1px solid #c0392b',
        color: '#c0392b',
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {loading ? '...' : 'Видалити'}
    </button>
  );
}
