import Link from 'next/link';
import { getAllProducts, getAllCategories, getAllBrands } from '@/lib/sheets';

// ─── Відгуки (статичні) ──────────────────────────────────
const REVIEWS = [
  {
    initials: 'АМ',
    name: 'Антон М.',
    role: 'Барбер · Київ',
    text: 'Замовляв ножовий блок Wahl T-Blade. Прийшов оригінал, упакований дбайливо. Відправили справді в той самий день — приємно здивований!',
  },
  {
    initials: 'ОВ',
    name: 'Олена В.',
    role: 'Майстер · Харків',
    text: 'Надіслала фото зламаної деталі — хлопці одразу ідентифікували і запропонували аналог. Деталь підійшла ідеально, машинка як нова.',
  },
  {
    initials: 'ДК',
    name: 'Дмитро К.',
    role: 'Стиліст · Львів',
    text: 'Акумулятор для Moser Li+Pro Mini — дійшов за 2 дні, тримає заряд як новий. Ціна нижча ніж в офіційних магазинах. Вже четверте замовлення.',
  },
];

// ─── FAQ (статичні) ──────────────────────────────────────
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
    a: 'Так, накладений платіж на Новій Пошті. Також доступна оплата на карту онлайн.',
  },
];

// ─── Переваги ────────────────────────────────────────────
const WHY = [
  { icon: '📷', title: 'Підбір за фото',       desc: 'Надішліть фото зламаної деталі або машинки — підберемо потрібну запчастину за кілька хвилин.' },
  { icon: '🚀', title: 'Відправка того ж дня', desc: 'Замовлення до 14:00 — відправляємо в день оформлення. Трекінг-номер отримаєте одразу.' },
  { icon: '✅', title: 'Гарантія 365 днів',    desc: 'На всі товари надаємо гарантію рік. Якщо деталь несправна — замінимо або повернемо гроші.' },
  { icon: '🎯', title: 'Тільки оригінал',      desc: 'Продаємо виключно оригінальні запчастини Wahl, Moser та BaByliss PRO. Жодних підробок.' },
];

// ─── Головна сторінка ────────────────────────────────────
export default async function HomePage() {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
  ]);

  const topProducts = products.filter((p) => p.top).slice(0, 8);
  const showProducts = topProducts.length > 0 ? topProducts : products.slice(0, 8);

  return (
    <>
      {/* стиль для FAQ акордеону */}
      <style>{`
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        details > summary::marker { display: none; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: '#1a1a1a' }}>
        <div className="page-wrapper" style={{ paddingBottom: 0 }}>
          <div className="hero">
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#D4820A', marginBottom: '14px' }}>
              ✂ Офіційні запчастини Wahl · Moser · BaByliss PRO · Oster
            </div>
            <h1>Знайди деталь для своєї <em>машинки, фену чи фрезера</em></h1>
            <p>Wahl, Moser, BaByliss PRO, Oster — ножі, насадки, акумулятори, двигуни. Підбір за фото. Відправка Новою Поштою в день замовлення.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link href="/catalog" className="btn-primary">Відкрити каталог →</Link>
              <a
                href="https://t.me/liga_krasotu"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'transparent', color: 'rgba(255,255,255,.75)', fontWeight: 600, fontSize: '15px', padding: '12px 24px', borderRadius: '6px', border: '1.5px solid rgba(255,255,255,.22)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                📷 Підбір за фото
              </a>
            </div>
            <div className="hero-badges">
              <span className="hero-badge">✅ Гарантія 365 днів</span>
              <span className="hero-badge">📦 Нова Пошта по Україні</span>
              <span className="hero-badge">🚀 Відправка в день замовлення</span>
              <span className="hero-badge">⭐ 1000+ замовлень</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrapper">

        {/* ── КАТЕГОРІЇ (з Sheets) ── */}
        {categories.length > 0 && (
          <section>
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
                  style={{ background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: '20px', padding: '8px 20px', fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a', textDecoration: 'none' }}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── ПОПУЛЯРНІ ТОВАРИ (з Sheets) ── */}
        <section>
          <h2 className="section-title">Популярні товари</h2>
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
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/catalog" className="btn-primary">Весь каталог →</Link>
          </div>
        </section>

        {/* ── ЧОМУ ОБИРАЮТЬ НАС ── */}
        <section style={{ marginTop: '60px' }}>
          <h2 className="section-title">Чому обирають нас</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {WHY.map((item) => (
              <div key={item.title} style={{ background: '#fff', borderRadius: '10px', padding: '24px', border: '1.5px solid #E5E2DC' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#6B6968', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ВІДГУКИ (новий блок) ── */}
        <section style={{ marginTop: '60px', background: '#1a1a1a', borderRadius: '16px', padding: '48px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Відгуки клієнтів</h2>
            <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '13px' }}>1 000+ задоволених клієнтів</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {REVIEWS.map((r) => (
              <div key={r.name} style={{ background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.09)', borderRadius: '10px', padding: '22px' }}>
                <div style={{ color: '#D4820A', fontSize: '14px', letterSpacing: '2px', marginBottom: '12px' }}>★★★★★</div>
                <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{r.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(212,130,10,.25)', color: '#D4820A', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {r.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{r.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.38)' }}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ (новий блок, нативний акордеон) ── */}
        <section style={{ marginTop: '60px' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Часті запитання</h2>
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map((f) => (
              <details key={f.q} style={{ background: '#fff', border: '1.5px solid #E5E2DC', borderRadius: '10px', overflow: 'hidden' }}>
                <summary style={{ padding: '18px 20px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
                  {f.q}
                  <span style={{ fontSize: '11px', color: '#6B6968', flexShrink: 0 }}>▼</span>
                </summary>
                <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#6B6968', lineHeight: 1.75, borderTop: '1px solid #E5E2DC' }}>
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA (новий блок) ── */}
        <section style={{ marginTop: '48px', marginBottom: '56px', background: '#FFF3DC', border: '1.5px solid rgba(212,130,10,.22)', borderRadius: '16px', padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', marginBottom: '10px' }}>Не знайшли потрібну деталь?</h2>
          <p style={{ color: '#6B6968', marginBottom: '28px' }}>Надішліть фото — підберемо і знайдемо для вас за короткий час</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://t.me/liga_krasotu"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: '#229ED9', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '12px 26px', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              ✈ Написати в Telegram
            </a>
            <a
              href="tel:+380965407076"
              style={{ background: '#fff', color: '#1C1C1C', fontWeight: 700, fontSize: '15px', padding: '12px 26px', borderRadius: '6px', border: '1.5px solid #E5E2DC', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              📞 Зателефонувати
            </a>
          </div>
        </section>

      </div>
    </>
  );
          }
          
