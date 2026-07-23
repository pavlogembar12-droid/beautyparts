'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import NovaPoshtaSelect from '@/components/NovaPoshtaSelect';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, loaded } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [delivery, setDelivery] = useState({ city: '', warehouse: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loaded && items.length === 0) {
    return (
      <main>
        <h1>Оформлення замовлення</h1>
        <p>Кошик порожній.</p>
        <Link href="/catalog">Перейти до каталогу</Link>
      </main>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const order = {
      name,
      phone,
      city: delivery.city,
      warehouse: delivery.warehouse,
      paymentMethod: paymentMethod === 'card' ? 'Переказ на картку' : 'QR-код НБУ',
      comment,
      items,
      totalPrice,
    };

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      const data = await res.json();

      if (!data.ok) {
        setError('Не вдалося оформити замовлення. Спробуйте ще раз або напишіть нам напряму.');
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push('/order-success');
    } catch (err) {
      console.error(err);
      setError('Сталася помилка з\'єднання. Перевірте інтернет і спробуйте ще раз.');
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Оформлення замовлення</h1>

      <section>
        <h2>Ваше замовлення</h2>
        <ul>
          {items.map((i) => (
            <li key={i.slug}>{i.name} × {i.quantity} = {i.price * i.quantity} грн</li>
          ))}
        </ul>
        <p><strong>Разом: {totalPrice} грн</strong></p>
      </section>

      <form onSubmit={handleSubmit}>
        <label>
          Ім'я та прізвище
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Телефон
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+380..."
            required
          />
        </label>

        <NovaPoshtaSelect onChange={setDelivery} />

        <fieldset>
          <legend>Спосіб оплати</legend>
          <label>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
            />
            Переказ на картку
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="qr"
              checked={paymentMethod === 'qr'}
              onChange={() => setPaymentMethod('qr')}
            />
            Оплата за QR-кодом (НБУ)
          </label>
        </fieldset>

        {/*
          TODO для наступного етапу налаштування: якщо оплата "card" —
          показати тут реальний номер картки; якщо "qr" — показати
          зображення QR-коду. Ці дані потрібно взяти зі старого сайту
          (у поточному index.html вони вже є в HTML чекауту) і вставити
          сюди один раз під час підключення реальних даних.
        */}

        <label>
          Коментар до замовлення (необов'язково)
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Надсилаємо...' : 'Підтвердити замовлення'}
        </button>
      </form>
    </main>
  );
}
