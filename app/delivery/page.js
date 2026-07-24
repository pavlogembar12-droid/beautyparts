// app/delivery/page.js
export const metadata = {
  title: "Доставка та оплата — BeautyParts",
  description:
    "Умови доставки Новою Поштою (відділення, поштомат, кур'єр) та способи оплати в інтернет-магазині BeautyParts.",
};

const wrap = {
  maxWidth: 860,
  margin: "0 auto",
  padding: "40px 20px",
  color: "#e6e6e6",
};

const card = {
  background: "#151a23",
  border: "1px solid #2a2f3a",
  borderRadius: 14,
  padding: "20px 22px",
  marginBottom: 16,
};

const h1 = { fontSize: 28, fontWeight: 700, marginBottom: 24, color: "#fff" };
const h2 = { fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#f2a900" };
const p = { fontSize: 15, lineHeight: 1.6, color: "#c7ccd6", margin: 0 };
const ul = { margin: "8px 0 0", paddingLeft: 18, color: "#c7ccd6", fontSize: 15, lineHeight: 1.7 };

export default function DeliveryPage() {
  return (
    <main style={wrap}>
      <h1 style={h1}>Доставка та оплата</h1>

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
        <p style={p}>
          Вартість доставки оплачується отримувачем за тарифами Нової Пошти.
        </p>
        <p style={{ ...p, marginTop: 10, color: "#f2a900", fontWeight: 600 }}>
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
    </main>
  );
            }
