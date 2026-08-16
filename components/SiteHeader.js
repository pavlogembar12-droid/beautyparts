'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

function toggleSidebar() {
  const html = document.documentElement;
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // На мобільному — відкриваємо як overlay
    html.classList.toggle('sidebar-mobile-open');
  } else {
    // На десктопі — ховаємо/показуємо в сітці
    const isOpen = !html.classList.contains('sidebar-closed');
    html.classList.toggle('sidebar-closed');
    try { localStorage.setItem('bp-sidebar', isOpen ? 'closed' : 'open'); } catch (e) {}
  }
}

// Закрити мобільний сайдбар при кліку на backdrop
function handleBackdropClick(e) {
  if (e.target.classList.contains('sidebar-backdrop')) {
    document.documentElement.classList.remove('sidebar-mobile-open');
  }
}

const TICKER = [
  'Оригінальні запчастини Wahl', 'Moser', 'BaByliss PRO', 'Oster',
  'Відправка в день замовлення', 'Гарантія 365 днів',
  'Підбір за фото', 'Доставка Новою Поштою по Україні',
];

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <>
      {/* ── Backdrop для мобільного сайдбару ── */}
      <div
        className="sidebar-backdrop"
        onClick={handleBackdropClick}
      />

      {/* ── Бігучий рядок ── */}
      <div className="header-ticker">
        <div className="header-ticker-track">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="header-ticker-item">✂ {item}</span>
          ))}
        </div>
      </div>

      {/* ── Хедер ── */}
      <header className="site-header">
        <div className="header-inner">

          {/* ☰ Сайдбар toggle */}
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn"
            title="Меню"
            aria-label="Меню"
          >
            <span /><span /><span />
          </button>

          {/* Лого */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '8px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              height: '44px',
            }}>
              <img
                src="/logo-header.png"
                alt="Beauty Parts"
                style={{ height: '36px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </Link>

          {/* Навігація (тільки десктоп) */}
          <nav className="header-nav">
            <Link href="/"             className="header-nav-link">Головна</Link>
            <Link href="/catalog"      className="header-nav-link header-nav-box">Каталог</Link>
            <Link href="/photo-select" className="header-nav-link header-nav-photo">📷 Підбір за фото</Link>
            <Link href="/delivery"     className="header-nav-link">Доставка</Link>
            <Link href="/returns"      className="header-nav-link">Гарантія</Link>
          </nav>

          {/* Кошик */}
          <Link href="/cart" className="header-cart">
            🛒{totalItems > 0 ? ` (${totalItems})` : ' Кошик'}
          </Link>

        </div>
      </header>
    </>
  );
            }
