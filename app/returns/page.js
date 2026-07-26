import Link from 'next/link';

export const metadata = {
  title: "Обмін, повернення та гарантія — Beauty Parts",
  description:
    "Умови обміну, повернення та гарантії на товари інтернет-магазину Beauty Parts відповідно до законодавства України.",
};

const card = {
  background: 'var(--surface)',
  border: '1.5px solid var(--border)',
  borderRadius: 10,
  padding: 24,
  marginBottom: 16,
};

const note = {
  ...card,
  background: 'linear-gradient(135deg, rgba(255,122,26,.14), rgba(255,122,26,.04))',
  border: '1.5px solid rgba(255,122,26,.28)',
};

const h2 = { fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#FF7A1A' };
const ul = { margin: '8px 0 0', paddingLeft: 18, color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.75 };
const p = { fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.75, margin: '0 0 10px' };

export default function ReturnsPage() {
  return (
    <div className="page-wrapper" style={{ maxWidth: 760 }}>
      <nav className="breadcrumb">
        <Link href="/">Головна</Link>
        <span>/</span>
        <span>Обмін, повернення та гарантія</span>
      </nav>

      <h1 className="section-title">Обмін, повернення та гарантія</h1>

      <section style={card}>
        <h2 style={h2}>Обмін та повернення</h2>
        <p style={p}>
          Обмін і повернення товару здійснюються відповідно до Закону України «Про захист прав
          споживачів». Ви можете повернути або обміняти товар протягом 14 днів з моменту
          отримання за умови збереження його товарного вигляду, комплектації та відсутності
          слідів використання.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Гарантія</h2>
        <p style={p}>
          На всі товари Beauty Parts поширюється гарантія відповідно до вимог чинного
          законодавства України та умов виробника.
        </p>
        <p style={p}>
          Гарантія покриває заводські дефекти матеріалів або виробництва, виявлені під час
          експлуатації товару за умови дотримання правил використання.
        </p>

        <p style={{ ...p, fontWeight: 600, color: 'var(--white)' }}>Гарантія НЕ поширюється на:</p>
        <ul style={ul}>
          <li>природний знос деталей і витратних матеріалів</li>
          <li>затуплення ножових блоків і ріжучих елементів у процесі експлуатації</li>
          <li>механічні пошкодження (удари, падіння, тріщини, відколи тощо)</li>
          <li>пошкодження, спричинені неправильним встановленням, використанням або обслуговуванням</li>
          <li>корозію та інші пошкодження, що виникли через недотримання умов експлуатації</li>
        </ul>

        <p style={{ ...p, marginTop: 12 }}>
          У разі виявлення несправності товар проходить перевірку спеціалістами сервісного
          центру. Якщо підтверджується заводський дефект — гарантійне обслуговування, ремонт,
          обмін або повернення коштів.
        </p>
      </section>

      <section style={note}>
        <h2 style={h2}>Важливо!</h2>
        <p style={{ ...p, marginBottom: 0 }}>
          Для оформлення обміну, повернення або гарантійного звернення зв'яжіться з менеджером
          за контактним номером на сайті.
        </p>
      </section>
    </div>
  );
}
