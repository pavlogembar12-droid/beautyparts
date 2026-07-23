import { CartProvider } from '@/context/CartContext';
import SiteHeader from '@/components/SiteHeader';

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
        </CartProvider>
      </body>
    </html>
  );
}
