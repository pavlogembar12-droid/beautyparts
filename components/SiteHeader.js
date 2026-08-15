'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Перемикає сайдбар — додає/знімає клас на <html>
function toggleSidebar() {
  const html = document.documentElement;
  const isOpen = !html.classList.contains('sidebar-closed');
  html.classList.toggle('sidebar-closed');
  try {
    localStorage.setItem('bp-sidebar', isOpen ? 'closed' : 'open');
  } catch (e) {}
}

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* ☰ Кнопка відкрити/закрити сайдбар */}
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
          title="Відкрити / закрити меню"
          aria-label="Меню"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Лого */}
        <Link href="/" className="header-logo">
          <img
            src="/logo.png"
            alt="Beauty Parts"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="header-logo-text">✂ Beauty<span style={{ color: 'var(--accent)' }}>Parts</span></span>
        </Link>

        <nav className="header-nav">
          <Link href="/">Головна</Link>
          <Link href="/catalog">Каталог</Link>
          <Link href="/delivery">Доставка</Link>
          <Link href="/returns">Гарантія</Link>
        </nav>

        <Link href="/cart" className="header-cart">
          🛒 Кошик {totalItems > 0 ? `(${totalItems})` : ''}
        </Link>

      </div>
    </header>
  );
}
