'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const TICKER_TEXT = 'Оригінальні запчастини Wahl • Moser • BaByliss PRO • Oster • Відправка в день замовлення • Гарантія 365 днів • Підбір за фото • Доставка Новою Поштою по Україні';

export default function SiteHeader({ categories = [], brands = [], models = [] }) {
  const { totalItems } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  function toggleSection(key) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  const modelsByBrand = {};
  models.forEach(m => {
    const brand = m.brand || 'Інші';
    if (!modelsByBrand[brand]) modelsByBrand[brand] = [];
    modelsByBrand[brand].push(m);
  });

  return (
    <>
      {/* БІГУЧИЙ РЯДОК */}
      <div style={{
        background: '#FF7A1A', color: '#000', fontSize: '12px',
        fontWeight: 600, padding: '6px 0', overflow: 'hidden',
        whiteSpace: 'nowrap', position: 'relative', zIndex: 101,
      }}>
        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-inner { display: inline-block; animation: ticker 28s linear infinite; }
          .ticker-inner:hover { animation-play-state: paused; }
        `}</style>
        <div className="ticker-inner">
          <span style={{ padding: '0 40px' }}>{TICKER_TEXT}</span>
          <span style={{ padding: '0 40px' }}>{TICKER_TEXT}</span>
          <span style={{ padding: '0 40px' }}>{TICKER_TEXT}</span>
          <span style={{ padding: '0 40px' }}>{TICKER_TEXT}</span>
        </div>
      </div>

      {/* ОСНОВНИЙ ХЕДЕР */}
      <header className="site-header">
        <div className="header-inner">

          {/* ЛІВА ЧАСТИНА: бургер + лого + пошук */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>

            {/* Бургер */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Відкрити меню"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px', color: '#fff', display: 'flex',
                flexDirection: 'column', gap: '5px', flexShrink: 0,
              }}
            >
              <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
            </button>

            {/* Лого */}
            <Link href="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: '175px', height: '50px', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Image
                  src="/logo.png"
                  alt="Beauty Parts"
                  width={220}
                  height={148}
                  style={{ height: '95px', width: 'auto', flexShrink: 0 }}
                  priority
                />
              </div>
            </Link>

            {/* Пошук */}
            <form method="get" action="/catalog"
              style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: '280px' }}
            >
              <input
                type="text"
                name="q"
                placeholder="🔍 Пошук запчастин..."
                style={{
                  width: '100%', padding: '8px 14px', borderRadius: '8px',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '13px', outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </form>

          </div>

          {/* НАВІГАЦІЯ (тільки десктоп) */}
          <nav className="header-nav">
            <Link href="/">Головна</Link>
            <Link href="/catalog" style={{
              color: '#FF7A1A', border: '1.5px solid rgba(255,122,26,0.5)',
              borderRadius: '6px', padding: '4px 10px',
            }}>Каталог</Link>
            <Link href="/photo-select" style={{
              color: '#FF7A1A', border: '1.5px solid rgba(255,122,26,0.3)',
              borderRadius: '6px', padding: '4px 10px',
              background: 'rgba(255,122,26,0.08)',
            }}>📷 Підбір за фото</Link>
            <Link href="/delivery">Доставка</Link>
            <Link href="/returns">Гарантія</Link>
          </nav>

          {/* КОШИК */}
          <Link href="/cart" className="header-cart">
            🛒 Кошик {totalItems > 0 ? `(${totalItems})` : ''}
          </Link>

        </div>
      </header>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 200, transition: 'opacity 0.2s',
          }}
        />
      )}

      {/* SIDEBAR */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100%',
        width: 280, background: '#1a1a1a', zIndex: 300,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>

        {/* Шапка сайдбара */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
        }}>
          <Link href="/" onClick={closeSidebar} style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo.png" alt="Beauty Parts" width={180} height={120}
              style={{ height: 90, width: 'auto' }} />
          </Link>
          <button onClick={closeSidebar} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
            fontSize: '22px', cursor: 'pointer', lineHeight: 1, padding: 4,
          }}>✕</button>
        </div>

        {/* Навігація в сайдбарі */}
        <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { href: '/',             label: '🏠 Головна',           highlight: false },
            { href: '/catalog',      label: '📦 Весь каталог',       highlight: false },
            { href: '/photo-select', label: '📷 Підбір за фото',     highlight: true  },
            { href: '/delivery',     label: '🚚 Доставка та оплата', highlight: false },
            { href: '/returns',      label: '✅ Гарантія',           highlight: false },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={closeSidebar} style={{
              display: 'block', padding: '11px 20px',
              color: item.highlight ? '#FF7A1A' : 'rgba(255,255,255,0.85)',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              background: item.highlight ? 'rgba(255,122,26,0.06)' : 'transparent',
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* КАТЕГОРІЇ */}
        {categories.length > 0 && (
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{
              padding: '12px 20px 8px', fontSize: '11px', fontWeight: 700,
              letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}>Категорії</div>
            {categories.map(cat => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={closeSidebar} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px', color: 'rgba(255,255,255,0.8)',
                fontSize: '13px', textDecoration: 'none',
              }}>
                <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center' }}>
                  {cat.icon || '📦'}
                </span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* БРЕНДИ з моделями */}
        {brands.length > 0 && (
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{
              padding: '12px 20px 8px', fontSize: '11px', fontWeight: 700,
              letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
            }}>Бренди</div>
            {brands.map(brand => {
              const brandModels = modelsByBrand[brand.name] || [];
              const isOpen = openSections[`brand-${brand.slug}`];
              return (
                <div key={brand.slug}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href={`/brand/${brand.slug}`} onClick={closeSidebar} style={{
                      flex: 1, padding: '10px 20px',
                      color: 'rgba(255,255,255,0.8)', fontSize: '13px',
                      fontWeight: 600, textDecoration: 'none',
                    }}>{brand.name}</Link>
                    {brandModels.length > 0 && (
                      <button onClick={() => toggleSection(`brand-${brand.slug}`)} style={{
                        background: 'none', border: 'none',
                        color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                        padding: '10px 16px', fontSize: '12px',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                      }}>▾</button>
                    )}
                  </div>
                  {isOpen && brandModels.length > 0 && (
                    <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                      {brandModels.map(m => (
                        <Link key={m.slug} href={`/model/${m.slug}`} onClick={closeSidebar} style={{
                          display: 'block', padding: '8px 20px 8px 44px',
                          color: 'rgba(255,255,255,0.6)', fontSize: '12px',
                          textDecoration: 'none',
                        }}>{m.name}</Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Контакти */}
        <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
          <a href="tel:+380965407076" style={{
            display: 'block', color: '#c8a96e', fontSize: '13px',
            fontWeight: 600, textDecoration: 'none', marginBottom: 8,
          }}>📞 +380 (96) 540-70-76</a>
          <a href="https://t.me/liga_krasotu" target="_blank" rel="noopener noreferrer" style={{
            display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px',
            textDecoration: 'none',
          }}>💬 Telegram @liga_krasotu</a>
        </div>

      </div>
    </>
  );
}
