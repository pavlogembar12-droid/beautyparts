import Link from 'next/link';

export const metadata = {
  title: "Доставка та оплата — Beauty Parts",
  description:
    "Умови доставки Новою Поштою (відділення, поштомат, кур'єр) та способи оплати в інтернет-магазині Beauty Parts.",
};

const card = {
  background: 'var(--surface)',
  border: '1.5px solid var(--border)',
  borderRadius: 10,
  padding: 24,
  marginBottom: 16,
};

const h2 = { fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#FF7A1A' };
const ul = { margin: '8px 0 0', paddingLeft: 18, color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.75 };
const p = { fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.75, margin: 0 };

export default function DeliveryPage() {
  return (
    <div className="page-wrapper" style={{ maxWidth: 760 }}>
      <nav className="breadcrumb">
        <Link href="/">Головна</Link>
        <span>/</span>
        <span>Доставка та оплата</span>
      </nav>

      <h1 className="section-title">Доставка та оплата</h1>

      <section style={card}>
        <h2 style={h2}>Способи доставки</h2>
        <ul style={ul}>
          <li>Нова Пошта — відділення (по всій Україні)</li>
          <li>Нова Пошта — поштомат</li>
          <li>Нова Пошта — адресна доставка (кур'єр до дверей у великих містах)</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>Терміни відправки</h2>
        <ul style={ul}>
          <li>Замовлення до 14:00 (Пн–Пт) — відправляємо того ж дня за наявності</li>
          <li>Після 14:00 — відправка наступного робочого дня</li>
          <li>Субота — відправка до 12:00</li>
          <li>Неділя — відправок немає</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>Вартість доставки</h2>
        <p style={p}>Вартість доставки оплачується отримувачем за тарифами Нової Пошти.</p>
        <p style={{ ...p, marginTop: 10, color: '#FF7A1A', fontWeight: 600 }}>
          Безкоштовна доставка по Україні при замовленні від 3000 грн.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Способи оплати</h2>
        <ul style={ul}>
          <li>Оплата карткою онлайн — Monobank або ПриватБанк</li>
          <li>Накладений платіж — оплата при отриманні у відділенні Нової Пошти</li>
          <li>Безготівковий розрахунок — оплата на рахунок ФОП</li>
        </ul>
      </section>
    </div>
  );
}
