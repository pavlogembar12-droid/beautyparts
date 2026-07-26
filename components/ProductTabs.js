'use client';

import { useState } from 'react';

const TABS = [
  { id: 'desc', label: 'Опис' },
  { id: 'delivery', label: 'Доставка' },
  { id: 'warranty', label: 'Гарантія' },
];

const WARRANTY_TEXT =
  'Гарантія поширюється на заводські дефекти. Природний знос, затуплення ріжучих елементів, ' +
  'механічні пошкодження та несправності, що виникли внаслідок неправильного використання, ' +
  'гарантійними випадками не є.';

const DELIVERY_TEXT =
  'Нова Пошта — відділення, поштомат або кур\'єр (адресна доставка у великих містах). ' +
  'Замовлення до 14:00 — відправляємо того ж дня. Безкоштовна доставка по Україні від 3000 грн.';

export default function ProductTabs({ description }) {
  const [active, setActive] = useState('desc');

  return (
    <div className="product-desc">
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 0 12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              color: active === t.id ? '#FF7A1A' : 'var(--text-dim)',
              borderBottom: active === t.id ? '2px solid #FF7A1A' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === 'desc' && (
        <p>{description || 'Опис для цього товару поки не додано.'}</p>
      )}
      {active === 'delivery' && <p>{DELIVERY_TEXT}</p>}
      {active === 'warranty' && <p>{WARRANTY_TEXT}</p>}
    </div>
  );
      }

