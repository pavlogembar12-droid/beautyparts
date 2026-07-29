'use client';

import { useState } from 'react';

const TABS = [
  { id: 'desc', label: 'Опис' },
  { id: 'delivery', label: 'Доставка' },
  { id: 'warranty', label: 'Гарантія' },
];

const WARRANTY_TEXT = `Гарантія поширюється на заводські дефекти. Природний знос, затуплення ріжучих елементів, механічні пошкодження та несправності, що виникли внаслідок неправильного використання, гарантійними випадками не є.`;

const DELIVERY_TEXT = `Нова Пошта — відділення, поштомат або кур'єр (адресна доставка у великих містах).\n\nЗамовлення до 14:00 — відправляємо того ж дня. Субота до 12:00 — також відправляємо. Неділя — відправок немає.\n\nБезкоштовна доставка по Україні від 3000 грн.`;

// Розбиває текст по \n і відображає кожен рядок як окремий абзац
function TextWithParagraphs({ text, empty = 'Інформація поки не додана.' }) {
  if (!text) return <p style={{ color: '#999' }}>{empty}</p>;

  const paragraphs = text
    .split('\n')
    .map(line => line.trim());

  return (
    <div>
      {paragraphs.map((line, i) => {
        if (!line) return <div key={i} style={{ height: '0.6em' }} />;

        // Маркований список — рядки що починаються з - або •
        if (line.startsWith('-') || line.startsWith('•')) {
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <span style={{ color: '#FF7A1A', flexShrink: 0, marginTop: 1 }}>▸</span>
              <span style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.6 }}>
                {line.replace(/^[-•]\s*/, '')}
              </span>
            </div>
          );
        }

        // Заголовок — рядок що закінчується на : і коротший за 60 символів
        if (line.endsWith(':') && line.length < 60) {
          return (
            <p key={i} style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, marginTop: i > 0 ? 12 : 0 }}>
              {line}
            </p>
          );
        }

        // Звичайний абзац
        return (
          <p key={i} style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.7, marginBottom: 6 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

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
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 0 12px', fontSize: '0.95rem', fontWeight: 700,
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
        <TextWithParagraphs
          text={description}
          empty="Опис для цього товару поки не додано."
        />
      )}
      {active === 'delivery' && <TextWithParagraphs text={DELIVERY_TEXT} />}
      {active === 'warranty' && <TextWithParagraphs text={WARRANTY_TEXT} />}
    </div>
  );
                  }
