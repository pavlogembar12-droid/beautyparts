'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import NovaPoshtaSelect from '@/components/NovaPoshtaSelect';

const MONO_CARD = '4149 6090 7054 3105';
const PRIVAT_CARD = '4441 1111 5512 2884';
const NBU_QR_LINK =
  'https://bank.gov.ua/qr/QkNECjAwMgoxClVDVAoK0JPRgNC40YnQtdC90LrQviDQktGW0LrRgtC-0YDRltGPINCu0YDRltGX0LLQvdCwClVBMTkzMjIwMDEwMDAwMDI2MjA1MzQwNTMyMTM1CgozMzk4MDEyNjYzCgoK0J_QvtC_0L7QstC90LXQvdC90Y8g0YDQsNGF0YPQvdC60YMKCg==';
const NBU_QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(
  NBU_QR_LINK
)}`;

const COLORS = {
  dark: '#1a1a1a',
  gold: '#D4820A',
  cream: '#FFF3DC',
  border: '#E5E2DC',
  gray: '#6B6968',
};

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Якщо буфер обміну недоступний (старий браузер) — просто ігноруємо,
      // людина зможе виділити номер картки вручну.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        background: copied ? COLORS.gold : '#fff',
        color: copied ? '#fff' : COLORS.dark,
        border: `1.5px solid ${copied ? COLORS.gold : COLORS.border}`,
        borderRadius: '6px',
        padding: '8px 14px',
        fontWeight: 600,
        fontSize: '13px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all .15s',
      }}
    >
      {copied ? '✓ Скопійовано' : 'Скопіювати'}
    </button>
  );
}

function CardRow({ label, number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: '#fff',
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: '10px',
        padding: '14px 16px',
      }}
    >
      <div>
        <div style={{ fontSize: '12px', color: COLORS.gray, marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '0.5px', fontFamily: 'monospace' }}>
          {number}
        </div>
      </div>
      <CopyButton value={number} />
    </div>
  );
}

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
      <main className="page-wrapper" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Оформлення замовлення</h1>
        <p style={{ color: COLORS.gray, marginBottom: '24px' }}>Кошик порожній.</p>
        <Link href="/catalog" className="btn-primary">
          Перейти до каталогу
        </Link>
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

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${COLORS.border}`,
    fontSize: '15px',
    marginTop: '6px',
    boxSizing: 'border-box',
  };

  const labelStyle = { display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '4px' };

  return (
    <div className="page-wrapper" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <h1 style={{ marginBottom: '28px' }}>Оформлення замовлення</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '28px',
        }}
      >
        {/* ── Підсумок замовлення ── */}
        <section
          style={{
            background: '#fff',
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: '12px',
            padding: '22px 24px',
          }}
        >
          <h2 style={{ fontSize: '17px', marginTop: 0, marginBottom: '14px' }}>Ваше замовлення</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {items.map((i) => (
              <li
                key={i.slug}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.border}`,
                  fontSize: '14px',
                }}
              >
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{i.price * i.quantity} грн</span>
              </li>
            ))}
          </ul>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '14px',
              paddingTop: '14px',
              borderTop: `2px solid ${COLORS.dark}`,
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            <span>Разом</span>
            <span>{totalPrice} грн</span>
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          {/* ── Контактні дані ── */}
          <section
            style={{
              background: '#fff',
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: '12px',
              padding: '22px 24px',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ fontSize: '17px', marginTop: 0, marginBottom: '16px' }}>Контактні дані</h2>

            <label style={{ ...labelStyle, marginBottom: '14px' }}>
              Ім'я та прізвище
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </label>

            <label style={{ ...labelStyle, marginBottom: '4px' }}>
              Телефон
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380..."
                required
                style={inputStyle}
              />
            </label>
          </section>

          {/* ── Доставка ── */}
          <section
            style={{
              background: '#fff',
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: '12px',
              padding: '22px 24px',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ fontSize: '17px', marginTop: 0, marginBottom: '16px' }}>Доставка · Нова Пошта</h2>
            <NovaPoshtaSelect onChange={setDelivery} />
          </section>

          {/* ── Оплата ── */}
          <section
            style={{
              background: '#fff',
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: '12px',
              padding: '22px 24px',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ fontSize: '17px', marginTop: 0, marginBottom: '16px' }}>Спосіб оплати</h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  border: `1.5px solid ${paymentMethod === 'card' ? COLORS.dark : COLORS.border}`,
                  background: paymentMethod === 'card' ? COLORS.dark : '#fff',
                  color: paymentMethod === 'card' ? '#fff' : COLORS.dark,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                💳 Переказ на картку
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  border: `1.5px solid ${paymentMethod === 'qr' ? COLORS.dark : COLORS.border}`,
                  background: paymentMethod === 'qr' ? COLORS.dark : '#fff',
                  color: paymentMethod === 'qr' ? '#fff' : COLORS.dark,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                📱 QR-код (НБУ)
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <CardRow label="Monobank" number={MONO_CARD} />
                <CardRow label="ПриватБанк" number={PRIVAT_CARD} />
                <p style={{ fontSize: '13px', color: COLORS.gray, margin: '4px 0 0' }}>
                  Перекажіть суму {totalPrice} грн на будь-яку з карток вище й натисніть "Підтвердити
                  замовлення" — ми зв'яжемось для підтвердження оплати.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  background: COLORS.cream,
                  border: `1.5px solid rgba(212,130,10,.22)`,
                  borderRadius: '10px',
                  padding: '18px',
                }}
              >
                <img
                  src={NBU_QR_IMAGE}
                  alt="QR-код для оплати НБУ"
                  width={140}
                  height={140}
                  style={{ borderRadius: '8px', background: '#fff', padding: '6px' }}
                />
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <p style={{ fontWeight: 700, margin: '0 0 6px' }}>Оплата за QR-кодом (НБУ)</p>
                  <p style={{ fontSize: '13px', color: COLORS.gray, margin: '0 0 10px' }}>
                    Відскануйте код камерою банківського застосунку й перекажіть суму {totalPrice} грн.
                  </p>
                  <a
                    href={NBU_QR_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '13px', color: COLORS.gold, fontWeight: 600 }}
                  >
                    Або відкрити посилання на оплату →
                  </a>
                </div>
              </div>
            )}
          </section>

          {/* ── Коментар ── */}
          <section
            style={{
              background: '#fff',
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: '12px',
              padding: '22px 24px',
              marginBottom: '20px',
            }}
          >
            <label style={labelStyle}>
              Коментар до замовлення (необов'язково)
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </label>
          </section>

          {error && (
            <p
              style={{
                color: '#B3261E',
                background: '#FDECEA',
                border: '1.5px solid #F5C2C0',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '14px',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              width: '100%',
              border: 'none',
              fontSize: '16px',
              padding: '16px',
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Надсилаємо...' : `Підтвердити замовлення · ${totalPrice} грн`}
          </button>
        </form>
      </div>
    </div>
  );
          }
  
