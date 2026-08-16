'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

function toggleSidebar() {
  const html = document.documentElement;
  const isOpen = !html.classList.contains('sidebar-closed');
  html.classList.toggle('sidebar-closed');
  try { localStorage.setItem('bp-sidebar', isOpen ? 'closed' : 'open'); } catch (e) {}
}

// Бігучий рядок
const TICKER = [
  'Оригінальні запчастини Wahl',
  'Moser',
  'BaByliss PRO',
  'Oster',
  'Відправка в день замовлення',
  'Гарантія 365 днів',
  'Підбір за фото',
  'Доставка Новою Поштою по Україні',
];

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <>
      {/* ── Бігучий рядок ── */}
      <div className="header-ticker">
        <div className="header-ticker-track">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="header-ticker-item">
              ✂ {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Основний хедер ── */}
      <header className="site-header">
        <div className="header-inner">

          {/* ☰ Сайдбар toggle */}
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn"
            title="Відкрити / закрити меню"
            aria-label="Меню"
          >
            <span /><span /><span />
          </button>

          {/* Лого */}
          <Link href="/" className="header-logo">
            <img
              src="/logo-header.png"
              alt="Beauty Parts"
              style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          
          </Link>

          {/* Навігація */}
          <nav className="header-nav">
            <Link href="/" className="header-nav-link">Головна</Link>

            {/* Каталог — в рамці */}
            <Link href="/catalog" className="header-nav-link header-nav-box">
              Каталог
            </Link>

            {/* Підбір за фото — виділена кнопка */}
            <Link href="/photo-select" className="header-nav-link header-nav-photo">
              📷 Підбір за фото
            </Link>

            <Link href="/delivery" className="header-nav-link">Доставка</Link>
            <Link href="/returns"  className="header-nav-link">Гарантія</Link>
          </nav>

          {/* Кошик */}
          <Link href="/cart" className="header-cart">
            🛒 Кошик{totalItems > 0 ? ` (${totalItems})` : ''}
          </Link>

        </div>
      </header>
    </>
  );
}
