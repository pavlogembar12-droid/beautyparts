'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

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

  // Групуємо моделі по бренду
  const modelsByBrand = {};
  models.forEach(m => {
    const brand = m.brand || 'Інші';
    if (!modelsByBrand[brand]) modelsByBrand[brand] = [];
    modelsByBrand[brand].push(m);
  });

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Бургер кнопка */}
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
            <Link href="/" className="header-logo">✂ Beauty Parts</Link>
          </div>

          <nav className="header-nav">
            <Link href="/">Головна</Link>
            <Link href="/catalog" style={{
              color: '#FF7A1A',
              border: '1.5px solid rgba(255,122,26,0.5)',
              borderRadius: '6px',
              padding: '4px 10px',
            }}>Каталог</Link>
            <a
              href="https://t.me/liga_krasotu"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#FF7A1A',
                border: '1.5px solid rgba(255,122,26,0.3)',
                borderRadius: '6px',
                padding: '4px 10px',
                background: 'rgba(255,122,26,0.08)',
                textDecoration: 'none',
              }}
            >📷 Підбір за фото</a>
            <Link href="/delivery">Доставка</Link>
            <Link href="/returns">Гарантія</Link>
          </nav>

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
          <span style={{ color: '#c8a96e', fontWeight: 800, fontSize: '1.1rem' }}>✂ Beauty Parts</span>
          <button
            onClick={closeSidebar}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
              fontSize: '22px', cursor: 'pointer', lineHeight: 1, padding: 4,
            }}
          >✕</button>
        </div>

        {/* Навігація */}
        <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { href: '/', label: '🏠 Головна', external: false },
            { href: '/catalog', label: '📦 Весь каталог', external: false },
            { href: 'https://t.me/liga_krasotu', label: '📷 Підбір за фото', external: true },
            { href: '/delivery', label: '🚚 Доставка та оплата', external: false },
            { href: '/returns', label: '✅ Гарантія', external: false },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              style={{
                display: 'block', padding: '11px 20px',
                color: item.external ? '#FF7A1A' : 'rgba(255,255,255,0.85)',
                fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                transition: 'background 0.15s',
                background: item.external ? 'rgba(255,122,26,0.06)' : 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = item.external ? 'rgba(255,122,26,0.06)' : ''}
            >
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
            }}>
              Категорії
            </div>
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={closeSidebar}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 20px', color: 'rgba(255,255,255,0.8)',
                  fontSize: '13px', textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
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
            }}>
              Бренди
            </div>
            {brands.map(brand => {
              const brandModels = modelsByBrand[brand.name] || [];
              const isOpen = openSections[`brand-${brand.slug}`];
              return (
                <div key={brand.slug}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <Link
                      href={`/brand/${brand.slug}`}
                      onClick={closeSidebar}
                      style={{
                        flex: 1, padding: '10px 20px',
                        color: 'rgba(255,255,255,0.8)', fontSize: '13px',
                        fontWeight: 600, textDecoration: 'none',
                      }}
                    >
                      {brand.name}
                    </Link>
                    {brandModels.length > 0 && (
                      <button
                        onClick={() => toggleSection(`brand-${brand.slug}`)}
                        style={{
                          background: 'none', border: 'none',
                          color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                          padding: '10px 16px', fontSize: '12px',
                          transition: 'transform 0.2s',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        }}
                      >▾</button>
                    )}
                  </div>
                  {isOpen && brandModels.length > 0 && (
                    <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                      {brandModels.map(m => (
                        <Link
                          key={m.slug}
                          href={`/model/${m.slug}`}
                          onClick={closeSidebar}
                          style={{
                            display: 'block', padding: '8px 20px 8px 44px',
                            color: 'rgba(255,255,255,0.6)', fontSize: '12px',
                            textDecoration: 'none',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#c8a96e'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                        >
                          {m.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Контакти внизу */}
        <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
          <a href="tel:+380965407076" style={{
            display: 'block', color: '#c8a96e', fontSize: '13px',
            fontWeight: 600, textDecoration: 'none', marginBottom: 8,
          }}>
            📞 +380 (96) 540-70-76
          </a>
          <a href="https://t.me/liga_krasotu" target="_blank" rel="noopener noreferrer" style={{
            display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px',
            textDecoration: 'none',
          }}>
            💬 Telegram @liga_krasotu
          </a>
        </div>
      </div>
    </>
  );
                  }
