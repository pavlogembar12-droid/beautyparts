
import { CartProvider } from '@/context/CartContext';
import SiteHeader from '@/components/SiteHeader';
import './globals.css';

export const metadata = {
  title: 'Beauty Parts — Запчастини для машинок для стрижки Wahl, Moser',
  description:
    'Запчастини та ножові блоки для машинок для стрижки Wahl, Moser, Andis. Доставка по Україні.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <footer className="site-footer">
            <p>© 2026 Beauty Parts — запчастини для техніки краси. Доставка по Україні.</p>
            <p style={{ marginTop: '6px' }}>
              <a href="tel:+380965407076">+380 (96) 540-70-76</a>
              {' · '}
              <a href="https://t.me/liga_krasotu">Telegram</a>
            </p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
