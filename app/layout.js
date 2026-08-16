import { CartProvider } from '@/context/CartContext';
import SiteHeader from '@/components/SiteHeader';
import { getAllCategories, getAllBrands, getAllModels } from '@/lib/sheets';
import './globals.css';

export const metadata = {
  title: 'Beauty Parts — Запчастини для машинок для стрижки Wahl, Moser',
  description:
    'Оригінальні запчастини для машинок для стрижки Wahl, Moser, BaByliss PRO, Oster. Ножові блоки, акумулятори, насадки, двигуни. Підбір за фото. Доставка Новою Поштою по всій Україні.',
  keywords: [
    'запчастини для машинок для стрижки',
    'ножові блоки Wahl',
    'запчастини Moser',
    'BaByliss PRO запчастини',
    'акумулятор для машинки',
    'насадки для стрижки',
    'Beauty Parts',
    'купити запчастини машинка стрижки Україна',
  ],
  metadataBase: new URL('https://www.beautyparts.com.ua'),
  alternates: {
    canonical: 'https://www.beautyparts.com.ua/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Beauty Parts — Запчастини для машинок для стрижки',
    description:
      'Оригінальні запчастини Wahl, Moser, BaByliss PRO, Oster. Підбір за фото. Доставка по Україні.',
    url: 'https://www.beautyparts.com.ua/',
    siteName: 'Beauty Parts',
    locale: 'uk_UA',
    type: 'website',
  },
};

export default async function RootLayout({ children }) {
  const [categories, brands, models] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
    getAllModels(),
  ]);

  return (
    <html lang="uk">
      <body>
        <CartProvider>
          <SiteHeader categories={categories} brands={brands} models={models} />
          {children}
          <footer className="site-footer">
            <p>© 2026 Beauty Parts — запчастини для техніки краси. Доставка по Україні.</p>
            <p style={{ marginTop: '6px' }}>
              <a href="tel:+380965407076">+380 (96) 540-70-76</a>
              {' · '}
              <a href="tel:+380931022046">+380 (93) 102-20-46</a>
              {' · '}
              <a href="https://t.me/liga_krasotu">Telegram</a>
            </p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
