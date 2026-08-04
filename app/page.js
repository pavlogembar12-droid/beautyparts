import Link from 'next/link';
import { getAllProducts, getCategoryTree, getAllBrands, getAllModels, slugify } from '@/lib/sheets';

// Бренди, які показуємо додатково, навіть якщо в них ще немає товарів
const EXTRA_BRANDS = [];
// Бренди, які НЕ показуємо в блоці "Бренди" на головній
const HIDDEN_BRAND_SLUGS = [slugify('Універсальний')];

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

// ─── Фірмова ілюстрація леза (SVG, без зовнішніх файлів) ──
function BladeMark({ style }) {
  return (
    <svg
      viewBox="0 0 400 260"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#bladeGrad)" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="40" y="30" width="320" height="140" rx="14" />
        <circle cx="120" cy="100" r="16" />
        <circle cx="280" cy="100" r="16" />
        <path d="M40 170 L60 220 L80 170 L100 220 L120 170 L140 220 L160 170 L180 220 L200 170 L220 220 L240 170 L260 220 L280 170 L300 220 L320 170 L340 220 L360 170" />
      </g>
    </svg>
  );
}

// ─── Головна сторінка ────────────────────────────────────
export default async function HomePage() {
  const [products, categoryTree, brands, models] = await Promise.all([
    getAllProducts(),
    getCategoryTree(),
    getAllBrands(),
    getAllModels(),
  ]);

  const knownSlugs = new Set(brands.map((b) => b.slug));
  const displayBrands = [
    ...brands.filter((b) => !HIDDEN_BRAND_SLUGS.includes(b.slug)),
    ...EXTRA_BRANDS
      .filter((name) => !knownSlugs.has(slugify(name)))
      .map((name) => ({ name, slug: slugify(name) })),
  ];

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
      <div className="page-wrapper" style={{ paddingBottom: 0 }}>
        <div className="hero" style={{ position: 'relative' }}>
          <BladeMark style={{ top: '-20px', right: '-30px', width: '360px', opacity: 0.5 }} />
          <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#FF7A1A', marginBottom: '14px' }}>
              ✂ Оригінальні запчастини Wahl · Moser · BaByliss PRO · Oster
            </div>
            <h1>Знайди деталь для своєї <em>машинки, фену чи фрезера</em></h1>
            <p style={{ margin: '16px 0 0' }}>Wahl, Moser, BaByliss PRO, Oster — ножі, насадки, акумулятори, двигуни.</p>
            <p style={{ marginBottom: '28px' }}>Підбір за фото. Відправка Новою Поштою в день замовлення.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link href="/catalog" className="btn-primary">Відкрити каталог →</Link>
              <a
                href="https://t.me/liga_krasotu"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'transparent', color: 'rgba(245,239,230,.85)', fontWeight: 600, fontSize: '15px', padding: '12px 24px', borderRadius: '6px', border: '1.5px solid rgba(255,122,26,.35)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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

        {/* ── КАТЕГОРІЇ (з Sheets, тільки верхній рівень) ── */}
        {categoryTree.length > 0 && (
          <section>
            <h2 className="section-title">Категорії</h2>
            <div className="cat-grid">
              {categoryTree.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="cat-card">
                  <div className="cat-card-icon">{c.icon || '📦'}</div>
                  <div className="cat-card-name">{c.name}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── МОДЕЛІ (з Sheets, кілька + "Дивитись усі") ── */}
        {models.length > 0 && (
          <section style={{ marginTop: '8px', marginBottom: '48px' }}>
            <h2 className="section-title">Оберіть свою модель</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
              {models.slice(0, 8).map((m) => (
                <Link
                  key={m.slug}
                  href={`/model/${m.slug}`}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 12px', textAlign: 'center', textDecoration: 'none', color: 'var(--text)', transition: 'border-color .2s' }}
                >
                  {m.image ? (
                    <img src={m.image} alt={m.name} style={{ width: '100%', height: 64, objectFit: 'contain', marginBottom: 8, background: '#FAF7F2', borderRadius: 6 }} />
                  ) : (
                    <div style={{ fontSize: '28px', marginBottom: 8 }}>✂</div>
                  )}
                  <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>{m.brand ? `${m.brand} ` : ''}{m.name}</div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link href="/catalog" className="btn-primary">Дивитись усі моделі →</Link>
            </div>
          </section>
        )}

        {/* ── БРЕНДИ (з Sheets) ── */}
        {displayBrands.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 className="section-title">Бренди</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {displayBrands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/brand/${b.slug}`}
                  style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '8px 20px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', textDecoration: 'none' }}
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
              <div key={item.title} style={{ background: 'var(--surface)', borderRadius: '10px', padding: '24px', border: '1.5px solid var(--border)' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px', color: 'var(--white)' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ВІДГУКИ ── */}
        <section style={{ marginTop: '60px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '48px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ color: 'var(--white)', fontSize: '22px', fontWeight: 800, margin: 0 }}>Відгуки клієнтів</h2>
            <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>1 000+ задоволених клієнтів</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {REVIEWS.map((r) => (
              <div key={r.name} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '22px' }}>
                <div style={{ color: '#FF7A1A', fontSize: '14px', letterSpacing: '2px', marginBottom: '12px' }}>★★★★★</div>
                <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{r.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,122,26,.16)', color: '#FF7A1A', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {r.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--white)' }}>{r.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ marginTop: '60px' }}>
          <h2 className="section-title" style={{ justifyContent: 'center' }}>Часті запитання</h2>
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map((f) => (
              <details key={f.q} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                <summary style={{ padding: '18px 20px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', userSelect: 'none', color: 'var(--white)' }}>
                  {f.q}
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', flexShrink: 0 }}>▼</span>
                </summary>
                <div style={{ padding: '0 20px 18px', fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.75, borderTop: '1px solid var(--border)' }}>
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ marginTop: '48px', marginBottom: '56px', background: 'linear-gradient(135deg, rgba(255,122,26,.14), rgba(255,122,26,.04))', border: '1.5px solid rgba(255,122,26,.28)', borderRadius: '16px', padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', marginBottom: '10px', color: 'var(--white)' }}>Не знайшли потрібну деталь?</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: '28px' }}>Надішліть фото — підберемо і знайдемо для вас за короткий час</p>
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
              style={{ background: 'var(--surface)', color: 'var(--white)', fontWeight: 700, fontSize: '15px', padding: '12px 26px', borderRadius: '6px', border: '1.5px solid var(--border)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              📞 Зателефонувати
            </a>
          </div>
        </section>

      </div>
    </>
  );
    }
          
