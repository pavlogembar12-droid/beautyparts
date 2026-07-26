import { CartProvider } from '@/context/CartContext';
import SiteHeader from '@/components/SiteHeader';
import SiteSidebar from '@/components/SiteSidebar';
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

          {/* site-layout: sidebar + main. На адмін-сторінках sidebar ховається через .admin-page */}
          <div className="site-layout">
            <SiteSidebar />
            <div className="site-main">
              {children}
            </div>
          </div>

          <footer className="site-footer">
            <p>© 2026 Beauty Parts — запчастини для техніки краси. Доставка по Україні.</p>
            <p style={{ marginTop: '6px' }}>
              <a href="tel:+380965407076">+380 (96) 540-70-76</a>
              {' · '}
              <a href="https://t.me/liga_krasotu">Telegram</a>
              {' · '}
              <a href="viber://chat?number=%2B380965407076">Viber</a>
            </p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
