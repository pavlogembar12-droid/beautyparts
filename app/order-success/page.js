import Link from 'next/link';

export const metadata = {
  title: 'Замовлення оформлено — Beauty Parts',
};

export default function OrderSuccessPage() {
  return (
    <main>
      <h1>Дякуємо! Ваше замовлення оформлено ✓</h1>
      <p>Ми зв'яжемось з вами найближчим часом для підтвердження.</p>
      <Link href="/catalog">Повернутись до каталогу</Link>
    </main>
  );
}
