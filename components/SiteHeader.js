'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const TICKER_TEXT = 'Оригінальні запчастини Wahl • Moser • BaByliss PRO • Oster • Відправка в день замовлення • Гарантія 365 днів • Підбір за фото • Доставка Новою Поштою по Україні';

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <>
      {/* БІГУЧИЙ РЯДОК */}
      <div style={{
        background: '#FF7A1A',
        color: '#000',
        fontSize: '12px',
        fontWeight: 600,
        padding: '6px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        zIndex: 101,
      }}>
        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-inner {
            display: inline-block;
            animation: ticker 28s linear infinite;
          }
          .ticker-inner:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="ticker-inner">
          {/* Текст повторюємо двічі для безшовного циклу */}
          <span style={{ padding: '0 40px' }}>{TICKER_TEXT}</span>
          <span style={{ padding: '0 40px' }}>{TICKER_TEXT}</span>
          <span style={{ padding: '0 40px' }}>{TICKER_TEXT}</span>
          <span style={{ padding: '0 40px' }}>{TICKER_TEXT}</span>
        </div>
      </div>

      {/* ОСНОВНИЙ ХЕДЕР */}
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="header-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/logo-header.png   
             width={220}
              height={148}
              style={{ height: 108, width: 'auto' }}
              priority
            />
          </Link>
          <nav className="header-nav">
            <Link href="/">Головна</Link>
            <Link href="/catalog" style={{
              color: '#FF7A1A',
              border: '1.5px solid rgba(255,122,26,0.5)',
              borderRadius: '6px',
              padding: '4px 10px',
            }}>Каталог</Link>
            <Link href="/photo-select" style={{
              color: '#FF7A1A',
              border: '1.5px solid rgba(255,122,26,0.3)',
              borderRadius: '6px',
              padding: '4px 10px',
              background: 'rgba(255,122,26,0.08)',
            }}>📷 Підбір за фото</Link>
            <Link href="/delivery">Доставка</Link>
            <Link href="/returns">Гарантія</Link>
          </nav>
          <Link href="/cart" className="header-cart">
            🛒 Кошик {totalItems > 0 ? `(${totalItems})` : ''}
          </Link>
        </div>
      </header>
    </>
  );
                }
