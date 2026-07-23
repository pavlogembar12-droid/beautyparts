'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError('Невірний пароль.');
        setSubmitting(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Помилка з\'єднання. Спробуйте ще раз.');
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Вхід в адмінку</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Перевірка...' : 'Увійти'}
        </button>
      </form>
    </main>
  );
}
