'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, loaded } = useCart();

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 12 }}>Кошик порожній</h1>
        <p style={{ color: '#888', marginBottom: 24 }}>Додайте товари з каталогу</p>
        <Link href="/catalog" style={{
          display: 'inline-block', background: '#1a1a1a', color: '#fff',
          padding: '14px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none'
        }}>
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 80px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 24 }}>Кошик</h1>

      <div style={{ marginBottom: 24 }}>
        {items.map((item) => (
          <div key={item.slug} style={{
            display: 'flex', gap: 14, alignItems: 'center',
            background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10,
            padding: '14px 16px', marginBottom: 10
          }}>
            {/* Фото */}
            {item.image ? (
              <img src={item.image} alt={item.name} width={64} height={64} style={{
                objectFit: 'contain', borderRadius: 6, border: '1px solid #eee',
                background: '#fafafa', padding: 4, flexShrink: 0
              }} />
            ) : (
              <div style={{
                width: 64, height: 64, background: '#f0f0f0', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', flexShrink: 0
              }}>📦</div>
            )}

            {/* Назва */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link href={`/product/${item.slug}`} style={{
                fontSize: '14px', fontWeight: 600, color: '#1a1a1a',
                textDecoration: 'none', lineHeight: 1.3,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {item.name}
              </Link>
              <div style={{ fontSize: '13px', color: '#888', marginTop: 4 }}>
                {item.price} грн / шт
              </div>
            </div>

            {/* Кількість */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                style={{
                  width: 30, height: 30, borderRadius: 6, border: '1px solid #ddd',
                  background: '#fff', fontSize: '16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: '#1a1a1a'
                }}
              >−</button>
              <span style={{ fontSize: '15px', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                style={{
                  width: 30, height: 30, borderRadius: 6, border: '1px solid #ddd',
                  background: '#fff', fontSize: '16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: '#1a1a1a'
                }}
              >+</button>
            </div>

            {/* Сума */}
            <div style={{ fontWeight: 800, fontSize: '15px', minWidth: 70, textAlign: 'right', flexShrink: 0 }}>
              {item.price * item.quantity} грн
            </div>

            {/* Видалити */}
            <button
              onClick={() => removeItem(item.slug)}
              title="Видалити"
              style={{
                background: 'none', border: 'none', color: '#bbb',
                fontSize: '18px', cursor: 'pointer', padding: '4px',
                lineHeight: 1, flexShrink: 0, transition: 'color 0.15s'
              }}
              onMouseEnter={e => e.target.style.color = '#c00'}
              onMouseLeave={e => e.target.style.color = '#bbb'}
            >✕</button>
          </div>
        ))}
      </div>

      {/* Безкоштовна доставка */}
      {totalPrice < 3000 && (
        <div style={{
          background: '#f9f6f0', border: '1px solid #e8dcc8', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20, fontSize: '13px', color: '#7a6040'
        }}>
          🚚 До безкоштовної доставки залишилось{' '}
          <strong>{3000 - totalPrice} грн</strong>
        </div>
      )}
      {totalPrice >= 3000 && (
        <div style={{
          background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20, fontSize: '13px', color: '#2d7a4f', fontWeight: 600
        }}>
          🎉 Безкоштовна доставка по Україні!
        </div>
      )}

      {/* Підсумок */}
      <div style={{
        background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10,
        padding: '20px 20px', marginBottom: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '14px', color: '#888' }}>До сплати</span>
          <span style={{ fontSize: '28px', fontWeight: 800 }}>{totalPrice} грн</span>
        </div>
      </div>

      <Link href="/checkout" style={{
        display: 'block', width: '100%', background: '#1a1a1a', color: '#fff',
        padding: '16px', borderRadius: 8, fontWeight: 800, fontSize: '16px',
        textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box'
      }}>
        Оформити замовлення →
      </Link>

      <Link href="/catalog" style={{
        display: 'block', textAlign: 'center', marginTop: 14,
        color: '#888', fontSize: '14px', textDecoration: 'none'
      }}>
        ← Продовжити покупки
      </Link>
    </div>
  );
                  }
