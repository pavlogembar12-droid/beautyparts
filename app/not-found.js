// app/not-found.js
// Проста статична 404 сторінка — НЕ викликає Google Sheets

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 20px',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✂️</div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: '#1a1a1a' }}>
        Сторінку не знайдено
      </h1>
      <p style={{ color: '#666', marginBottom: '28px', lineHeight: 1.6 }}>
        Схоже, ця сторінка не існує або була видалена.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          background: '#c8a96e',
          color: '#000',
          fontWeight: 700,
          padding: '12px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
      >
        ← На головну
      </Link>
    </div>
  );
}
