'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header>
      <Link href="/">Beauty Parts</Link>
      {' | '}
      <Link href="/catalog">Каталог</Link>
      {' | '}
      <Link href="/cart">Кошик ({totalItems})</Link>
    </header>
  );
}
