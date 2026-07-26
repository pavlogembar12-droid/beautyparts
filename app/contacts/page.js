import Link from 'next/link';

export const metadata = {
  title: "Контакти — Beauty Parts",
  description:
    "Зв'яжіться з Beauty Parts: телефон, Telegram, Viber. Підбір запчастин для машинок для стрижки Wahl, Moser, BaByliss PRO.",
};

const card = {
  background: 'var(--surface)',
  border: '1.5px solid var(--border)',
  borderRadius: 10,
  padding: 24,
  marginBottom: 16,
};

const h2 = { fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#FF7A1A' };
const p = { fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.75, margin: '0 0 10px' };

const linkRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--text)',
  padding: '12px 0',
  borderBottom: '1px solid var(--border)',
};

export default function ContactsPage() {
  return (
    <div className="page-wrapper" style={{ maxWidth: 760 }}>
      <nav className="breadcrumb">
        <Link href="/">Головна</Link>
        <span>/</span>
        <span>Контакти</span>
      </nav>

      <h1 className="section-title">Контакти</h1>

      <section style={card}>
        <h2 style={h2}>Як з нами зв'язатись</h2>
        <p style={p}>
          Надішліть фото зламаної деталі або машинки — підберемо потрібну запчастину за кілька
          хвилин.
        </p>

        <a href="tel:+380965407076" style={linkRow}>📞 +380 (96) 540-70-76</a>
        <a href="https://t.me/liga_krasotu" target="_blank" rel="noopener noreferrer" style={linkRow}>
          ✈ Telegram — @liga_krasotu
        </a>
        <a href="viber://chat?number=%2B380965407076" style={{ ...linkRow, borderBottom: 'none' }}>
          💬 Viber
        </a>
      </section>

      <section style={card}>
        <h2 style={h2}>Доставка</h2>
        <p style={{ ...p, marginBottom: 0 }}>
          Відправляємо Новою Поштою по всій Україні. Детальніше — на сторінці{' '}
          <Link href="/delivery" style={{ color: 'var(--accent)' }}>доставки та оплати</Link>.
        </p>
      </section>
    </div>
  );
}
