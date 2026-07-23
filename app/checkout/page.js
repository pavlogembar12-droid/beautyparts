'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import NovaPoshtaSelect from '@/components/NovaPoshtaSelect';

const MONO_CARD = '4149 6090 7054 3105';
const PRIVAT_CARD = '4441 1111 5512 2884';
const NBU_QR_LINK =
  'https://bank.gov.ua/qr/QkNECjAwMgoxClVDVAoK0JPRgNC40YnQtdC90LrQviDQktGW0LrRgtC-0YDRltGX0LLQvdCwClVBMTkzMjIwMDEwMDAwMDI2MjA1MzQwNTMyMTM1CgozMzk4MDEyNjYzCgoK0J_QvtC_0L7QstC90LXQvdC90Y8g0YDQsNGF0YPQvdC60YMKCg==';
const NBU_QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(NBU_QR_LINK)}`;

function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(value.replace(/\s/g, '')); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button type="button" onClick={copy} style={{
      background: 'none', border: 'none', color: copied ? '#2d7a4f' : '#888',
      fontSize: '13px', cursor: 'pointer', padding: '0', fontWeight: 600,
    }}>
      {copied ? '✓ Скопійовано' : 'Скопіювати'}
    </button>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, loaded } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [delivery, setDelivery] = useState({ city: '', warehouse: '' });
  const [payMethod, setPayMethod] = useState('card');
  const [cardChoice, setCardChoice] = useState('mono');
  const [comment, setComment] = useState('');
  const [noCall, setNoCall] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loaded && items.length === 0) {
    return (
      <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 16 }}>Кошик порожній</h2>
        <a href="/catalog" style={{ display: 'inline-block', background: '#1a1a1a', color: '#fff', padding: '14px 28px', borderRadius: 8, fontWeight: 700 }}>Перейти до каталогу</a>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payLabel =
      payMethod === 'cash' ? 'Накладений платіж' :
      payMethod === 'qr' ? 'QR-код НБУ' :
      cardChoice === 'mono' ? 'Переказ на Monobank' : 'Переказ на ПриватБанк';

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, city: delivery.city, warehouse: delivery.warehouse, paymentMethod: payLabel, comment, noCall, items, totalPrice }),
      });
      const data = await res.json();
      if (!data.ok) { setError('Не вдалося оформити замовлення.'); setSubmitting(false); return; }
      clearCart();
      router.push('/order-success');
    } catch {
      setError('Помилка з\'єднання. Спробуйте ще раз.');
      setSubmitting(false);
    }
  }

  const s = {
    wrap: { maxWidth: 560, margin: '0 auto', padding: '32px 20px 80px' },
    title: { fontSize: '22px', fontWeight: 800, marginBottom: 24 },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: '16px', fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #e8e8e8' },
    input: { display: 'block', width: '100%', padding: '14px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: '15px', marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' },
    radio: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #ddd', borderRadius: 8, marginBottom: 8, cursor: 'pointer', fontSize: '14px' },
    radioActive: { border: '1.5px solid #1a1a1a', background: '#fafafa' },
    cardBox: { background: '#f8f8f8', borderRadius: 10, padding: '16px', marginTop: 12 },
    cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '12px 16px', marginBottom: 8 },
    cardNum: { fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, letterSpacing: '1px' },
    cardLabel: { fontSize: '12px', color: '#888', marginBottom: 4 },
    submitBtn: { display: 'block', width: '100%', background: '#1a1a1a', color: '#fff', padding: '16px', borderRadius: 8, fontWeight: 800, fontSize: '16px', border: 'none', cursor: 'pointer', marginTop: 24 },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 },
    totalLabel: { fontSize: '14px', color: '#888' },
    totalPrice: { fontSize: '28px', fontWeight: 800 },
  };

  return (
    <div style={s.wrap}>
      <h1 style={s.title}>Оформлення замовлення</h1>

      {/* ТОВАРИ */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Ваше замовлення</div>
        {items.map((i) => (
          <div key={i.slug} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            {i.image && <img src={i.image} alt={i.name} width={56} height={56} style={{ objectFit: 'contain', borderRadius: 6, border: '1px solid #eee', background: '#fafafa', padding: 4 }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.3 }}>{i.name}</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: 2 }}>× {i.quantity}</div>
            </div>
            <div style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{i.price * i.quantity} грн</div>
          </div>
        ))}
        <div style={{ ...s.totalRow, borderTop: '2px solid #1a1a1a', paddingTop: 14, marginTop: 8 }}>
          <span style={s.totalLabel}>До сплати</span>
          <span style={s.totalPrice}>{totalPrice} грн</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* КОНТАКТИ */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Контактні дані</div>
          <input style={s.input} type="text" placeholder="Ім'я та прізвище" value={name} onChange={e => setName(e.target.value)} required />
          <input style={s.input} type="tel" placeholder="+380 __ ___ __ __" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>

        {/* ДОСТАВКА */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Доставка · Нова Пошта</div>
          <NovaPoshtaSelect onChange={setDelivery} />
        </div>

        {/* ОПЛАТА */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Спосіб оплати</div>

          {[
            { id: 'card', label: '💳 Переказ на картку', desc: 'Monobank або ПриватБанк' },
            { id: 'cash', label: '💵 Накладений платіж', desc: '+2% та 20 грн комісії НП' },
            { id: 'qr', label: '📱 QR-код (НБУ)', desc: 'Будь-який банк через Pay' },
          ].map(opt => (
            <div key={opt.id} onClick={() => setPayMethod(opt.id)} style={{ ...s.radio, ...(payMethod === opt.id ? s.radioActive : {}) }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payMethod === opt.id ? '#1a1a1a' : '#ccc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {payMethod === opt.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a' }} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{opt.label}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: 2 }}>{opt.desc}</div>
              </div>
            </div>
          ))}

          {/* КАРТКИ */}
          {payMethod === 'card' && (
            <div style={s.cardBox}>
              {[
                { id: 'mono', label: 'Monobank', num: MONO_CARD },
                { id: 'privat', label: 'ПриватБанк', num: PRIVAT_CARD },
              ].map(c => (
                <div key={c.id} onClick={() => setCardChoice(c.id)} style={{ ...s.cardRow, border: cardChoice === c.id ? '1.5px solid #1a1a1a' : '1px solid #eee', cursor: 'pointer', marginBottom: c.id === 'mono' ? 8 : 0 }}>
                  <div>
                    <div style={s.cardLabel}>{c.label}</div>
                    <div style={s.cardNum}>{c.num}</div>
                  </div>
                  <CopyBtn value={c.num} />
                </div>
              ))}
              <p style={{ fontSize: '12px', color: '#888', margin: '10px 0 0' }}>
                Перекажіть <strong>{totalPrice} грн</strong> на обрану картку. Після оплати ми зв'яжемось для підтвердження.
              </p>
            </div>
          )}

          {/* QR */}
          {payMethod === 'qr' && (
            <div style={{ ...s.cardBox, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <img src={NBU_QR_IMAGE} alt="QR оплата" width={120} height={120} style={{ borderRadius: 8, border: '1px solid #eee' }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Оплата за QR-кодом</div>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: 8 }}>Відскануйте камерою або відкрийте посилання у банківському застосунку</div>
                <a href={NBU_QR_LINK} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 700, textDecoration: 'underline' }}>Відкрити посилання →</a>
              </div>
            </div>
          )}
        </div>

        {/* КОМЕНТАР */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Коментар до замовлення</div>
          <textarea style={{ ...s.input, resize: 'vertical', minHeight: 80, marginBottom: 0 }} placeholder="Необов'язково..." value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        {/* НЕ ПЕРЕДЗВОНЮВАТИ */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, cursor: 'pointer', fontSize: '14px' }}>
          <input type="checkbox" checked={noCall} onChange={e => setNoCall(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
          Не передзвонюйте мені — все підтверджено
        </label>

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #fcc', borderRadius: 8, padding: '12px 14px', marginBottom: 16, fontSize: '14px', color: '#c00' }}>{error}</div>
        )}

        <button type="submit" disabled={submitting} style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }}>
          {submitting ? 'Надсилаємо...' : `Замовити · ${totalPrice} грн →`}
        </button>
      </form>
    </div>
  );
                }
                  
