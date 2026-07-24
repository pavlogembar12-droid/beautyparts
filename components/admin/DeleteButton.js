'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, name }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Видалити товар "${name}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('failed');
      router.refresh();
    } catch {
      alert('Не вдалося видалити товар.');
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
