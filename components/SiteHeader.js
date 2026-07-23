'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo">✂ Beauty Parts</Link>
        <nav className="header-nav">
          <Link href="/">Головна</Link>
          <Link href="/catalog">Каталог</Link>
        </nav>
        <Link href="/cart" className="header-cart">
          🛒 Кошик {totalItems > 0 ? `(${totalItems})` : ''}
        </Link>
      </div>
    </header>
  );
}
