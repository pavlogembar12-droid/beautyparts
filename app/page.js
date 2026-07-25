import Link from 'next/link';
import { getAllProducts, getAllCategories, getAllBrands, getAllModels } from '@/lib/sheets';

// ─── Відгуки (статичні) ─────────────────────────────────
const REVIEWS = [
  {
    initials: 'АМ',
    name: 'Антон М.',
    role: 'Барбер · Київ',
    text: 'Замовляв ножовий блок Wahl T-Blade. Прийшов оригінал, упакований дбайливо. Відправили справді в той самий день!',
  },
  {
    initials: 'ОВ',
    name: 'Олена В.',
    role: 'Майстер · Харків',
    text: 'Надіслала фото зламаної деталі — хлопці одразу ідентифікували і запропонували аналог. Деталь підійшла ідеально.',
  },
  {
    initials: 'ДК',
    name: 'Дмитро К.',
    role: 'Стиліст · Львів',
    text: 'Акумулятор для Moser Li+Pro Mini — дійшов за 2 дні, тримає заряд як новий. Вже четверте замовлення — жодного разу не підвели.',
  },
];

// ─── FAQ (статичні) ─────────────────────────────────────
const FAQS = [
  {
    q: 'Чи всі запчастини оригінальні?',
    a: 'Так, продаємо виключно оригінальні запчастини від Wahl, Moser, BaByliss PRO та Immortal. Ніяких аналогів чи підробок.',
  },
  {
    q: 'Як дізнатися, яка деталь мені підходить?',
    a: 'Надішліть фото зламаної деталі або машинки в Telegram — @liga_krasotu. Підберемо потрібну запчастину за кілька хвилин.',
  },
  {
    q: 'Яка умова повернення?',
    a: 'Якщо деталь не підійшла або несправна — повернемо гроші або замінимо протягом 365 днів.',
  },
  {
    q: 'Як швидко прийде замовлення?',
    a: 'Нова Пошта. Замовлення до 14:00 — відправка в той самий день. Зазвичай 1–2 дні по Україні.',
  },
  {
    q: 'Чи можна оплатити при отриманні?',
    a: 'Так, накладений платіж на Новій Пошті або оплата на карту онлайн.',
  },
];

// ─── Переваги ───────────────────────────────────────────
const WHY = [
  { icon: '📷', title: 'Підбір за фото',       desc: 'Надішліть фото зламаної деталі або машинки — підберемо потрібну запчастину за кілька хвилин.' },
  { icon: '🚀', title: 'Відправка того ж дня', desc: 'Замовлення до 14:00 — відправляємо в день оформлення. Трекінг-номер отримаєте одразу.' },
  { icon: '✅', title: 'Гарантія 365 днів',    desc: 'Якщо деталь несправна — замінимо або повернемо гроші протягом року.' },
  { icon: '🎯', title: 'Тільки оригінал',      desc: 'Продаємо виключно оригінальні запчастини Wahl, Moser та BaByliss PRO. Жодних підробок.' },
];

// ─── Головна сторінка ───────────────────────────────────
export default async function HomePage() {
  const [products, categories, brands, models] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
    getAllModels(),
  ]);

  const topProducts = products.filter((p) => p.top).slice(0, 8);
  const showProducts = topProducts.length > 0 ? topProducts : products.slice(0, 8);
  const showModels = models.slice(0, 8);

  return (
    <>
      <style>{`
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        details > summary::marker { display: none; }
      `}</style>

      {/* ── HERO ── */}
      <div className="hero">
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '14px' }}>
          ✦ Запчастини для техніки краси
        </div>
        <h1>Знайди деталь для своєї <em>машинки, фену чи фрезера</em></h1>
        <p>Wahl, Moser, BaByliss PRO, Oster — ножі, насадки, акумулятори, двигуни. Підбір за фото. Відправка Новою Поштою.</p>
        <div className="hero-badges" style={{ marginBottom: '28px' }}>
          <span className="hero-badge">✅ Гарантія 365 днів</span>
          <span className="hero-badge">📦 Нова Пошта по Україні</span>
          <span className="hero-badge">🚀 Відправка в день замовлення</span>
          <span className="hero-badge">📷 Підбір за фото</span>
          <span className="hero-badge">💬 Viber / Telegram</span>
          <span className="hero-badge">⭐ 1000+ замовлень</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/catalog" className="btn-primary">Відкрити каталог →</Link>
          <a
            href="https://t.me/liga_krasotu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)', fontWeight: 600, fontSize: '15px', padding: '13px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            📷 Підбір за фото
          </a>
          <a
            href="viber://chat?number=%2B380965407076"
            style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)', fontWeight: 600, fontSize: '15px', padding: '13px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            💬 Viber
          </a>
        </div>
      </div>

      {/* ── ПО МОДЕЛЯХ (новий блок) ── */}
      {showModels.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <div className="section-header">
            <h2 className="section-title">По моделях Запчастини Moser — оберіть вашу модель</h2>
            <Link href="/catalog?brand=moser" className="see-all-link">Дивитись всі →</Link>
          </div>
          <div className="model-grid">
            {showModels.map((m) => (
              <Link
                key={m.slug || m.name}
                href={`/catalog?model=${encodeURIComponent(m.slug || m.name)}`}
                className="model-card"
              >
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    style={{ width: '52px', height: '52px', objectFit: 'contain', margin: '0 auto 8px' }}
                  />
                ) : (
                  <div className="model-card-icon">{m.emoji || '✂️'}</div>
                )}
                <div className="model-card-name">{m.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── КАТЕГОРІЇ (з Sheets) ── */}
      {categories.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <h2 className="section-title">Категорії</h2>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="cat-card">
                <div className="cat-card-icon">{c.icon || '📦'}</div>
                <div className="cat-card-name">{c.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── БРЕНДИ (з Sheets) ── */}
      {brands.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <h2 className="section-title">Бренди</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/brand/${b.slug}`}
                style={{ background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: '20px', padding: '8px 20px', fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a', textDecoration: 'none', transition: 'border-color .2s' }}
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── ТОП ПРОДАЖІВ (з Sheets) ── */}
      <section style={{ marginBottom: '48px' }}>
        <div className="section-header">
          <h2 className="section-title">Топ продажів Популярні запчастини</h2>
          <Link href="/catalog" className="see-all-link">Дивитись всі →</Link>
        </div>
        <div className="product-grid">
          {showProducts.map((p) => (
            <Link key={p.id || p.slug} href={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div className="product-card">
                {p.image ? (
                  <img className="product-card-img" src={p.image} alt={p.name} />
                ) : (
                  <div className="product-card-img-placeholder">{p.emoji || '📦'}</div>
                )}
                <div className="product-card-body">
                  <span className={`product-card-badge ${p.inStock ? '' : 'out'}`}>
                    {p.inStock ? 'В наявності' : 'Немає в наявності'}
                  </span>
                  <div className="product-card-name">{p.name}</div>
                  <div className="product-card-price">{p.price} грн</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── СЕРВІС / ПІДБІР ЗА ФОТО ── */}
      <section style={{ marginBottom: '48px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📷</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Сервіс — Не знаєте що саме?</h2>
        <p style={{ color: '#666', marginBottom: '20px', maxWidth: '480px', margin: '0 auto 20px' }}>
          Надішліть фото — підберемо потрібну запчастину за фотографією пристрою або старої деталі
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="viber://chat?number=%2B380965407076"
            style={{ background: '#7360f2', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            💬 Viber
          </a>
          <a
            href="https://t.me/liga_krasotu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#229ED9', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            ✈️ Telegram
          </a>
        </div>
      </section>

      {/* ── ПЕРЕВАГИ ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title">Чому обирають нас</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {WHY.map((item) => (
            <div key={item.title} style={{ background: '#fff', borderRadius: '10px', padding: '24px', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{item.title}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ВІДГУКИ ── */}
      <section style={{ marginBottom: '48px', background: '#1a1a1a', borderRadius: '12px', padding: '40px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Відгуки клієнтів</h2>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '13px' }}>1 000+ задоволених клієнтів</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {REVIEWS.map((r) => (
            <div key={r.name} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.09)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ color: 'var(--accent)', fontSize: '14px', letterSpacing: '2px', marginBottom: '10px' }}>★★★★★</div>
              <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '14px', lineHeight: 1.7, marginBottom: '14px' }}>{r.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(200,169,110,.25)', color: 'var(--accent)', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{r.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.38)' }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ justifyContent: 'center' }}>Часті запитання</h2>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAQS.map((f) => (
            <details key={f.q} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
              <summary style={{ padding: '16px 18px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
                {f.q}
                <span style={{ fontSize: '11px', color: '#666', flexShrink: 0 }}>▼</span>
              </summary>
              <div style={{ padding: '0 18px 16px', fontSize: '14px', color: '#666', lineHeight: 1.75, borderTop: '1px solid #e0e0e0' }}>
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ marginBottom: '20px', background: '#fdf6ec', border: '1.5px solid rgba(200,169,110,.3)', borderRadius: '12px', padding: '40px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Не знайшли потрібну деталь?</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Надішліть фото — підберемо і знайдемо для вас за короткий час</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://t.me/liga_krasotu" target="_blank" rel="noopener noreferrer"
            style={{ background: '#229ED9', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            ✈ Telegram
          </a>
          <a href="viber://chat?number=%2B380965407076"
            style={{ background: '#7360f2', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            💬 Viber
          </a>
          <a href="tel:+380965407076"
            style={{ background: '#fff', color: '#1a1a1a', fontWeight: 700, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', border: '1.5px solid #e0e0e0', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            📞 Зателефонувати
          </a>
        </div>
      </section>
    </>
  );
              }
