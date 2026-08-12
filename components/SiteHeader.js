'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/logo.png" alt="Beauty Parts" width={220} height={148} style={{ height: 52, width: 'auto' }} priority />
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
