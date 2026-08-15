import Link from 'next/link';
import { getAllProducts, getCategoryTree, getAllBrands, getAllModels, slugify } from '@/lib/sheets';

// Сторінка кешується Next.js статично при білді — без цього revalidate
// зміни в Google Таблиці (нові категорії, товари) ніколи б не з'явились
// на головній сторінці без повторного деплою. 300с узгоджено з
// REVALIDATE_SECONDS у lib/sheets.js.
export const revalidate = 300;

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

// ─── Анімована збірка машинки для стрижки (SVG) ──────────
function ClipperAssembly({ style }) {
  return (
    <svg
      viewBox="0 0 320 380"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#CC5500" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="bladeGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFB273" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="attachGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.15" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <style>{`
          @keyframes slideInBody {
            0%   { transform: translateX(120px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInBlade {
            0%   { transform: translateY(-80px); opacity: 0; }
            60%  { transform: translateY(-80px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideInAttach {
            0%   { transform: translateY(80px); opacity: 0; }
            60%  { transform: translateY(80px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideInScrew1 {
            0%   { transform: translateX(60px); opacity: 0; }
            70%  { transform: translateX(60px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInScrew2 {
            0%   { transform: translateX(-60px); opacity: 0; }
            70%  { transform: translateX(-60px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1; }
          }
          .anim-body   { animation: slideInBody   1.2s cubic-bezier(.22,1,.36,1) 0.2s both; }
          .anim-blade  { animation: slideInBlade  1.4s cubic-bezier(.22,1,.36,1) 0.2s both; }
          .anim-attach { animation: slideInAttach 1.4s cubic-bezier(.22,1,.36,1) 0.2s both; }
          .anim-screw1 { animation: slideInScrew1 1.2s cubic-bezier(.22,1,.36,1) 0.4s both; }
          .anim-screw2 { animation: slideInScrew2 1.2s cubic-bezier(.22,1,.36,1) 0.4s both; }
          .anim-pulse  { animation: pulse 3s ease-in-out 2s infinite; }
        `}</style>
      </defs>

      {/* НАСАДКА-ГРЕБІНЬ (зверху) */}
      <g className="anim-blade" filter="url(#glow)">
        {/* Гребінь — зубці */}
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
          <rect
            key={i}
            x={74 + i * 15}
            y={28}
            width={8}
            height={28}
            rx={2}
            fill="url(#bladeGrad2)"
            opacity={0.85}
          />
        ))}
        {/* Основа гребеня */}
        <rect x={70} y={52} width={188} height={18} rx={4} fill="url(#bladeGrad2)" opacity={0.9}/>
        {/* Підпис */}
        <text x={160} y={44} textAnchor="middle" fontSize="9" fill="#FFB273" opacity={0.7} fontFamily="system-ui">насадка</text>
      </g>

      {/* НОЖОВИЙ БЛОК (приєднується до корпусу зверху) */}
      <g className="anim-blade">
        {/* Леза — зубці ножового блоку */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => (
          <rect
            key={i}
            x={68 + i * 11.5}
            y={84}
            width={7}
            height={20}
            rx={1.5}
            fill="#FF7A1A"
            opacity={0.7 + (i % 2) * 0.15}
          />
        ))}
        {/* Корпус ножового блоку */}
        <rect x={64} y={100} width={200} height={24} rx={5} fill="url(#bladeGrad2)" opacity={0.95}/>
        <text x={160} y={96} textAnchor="middle" fontSize="9" fill="#FFB273" opacity={0.7} fontFamily="system-ui">ножовий блок</text>
      </g>

      {/* КОРПУС МАШИНКИ */}
      <g className="anim-body">
        {/* Основний корпус */}
        <rect x={80} y={120} width={168} height={190} rx={28} fill="url(#bodyGrad)" opacity={0.22}/>
        <rect x={82} y={122} width={164} height={188} rx={26} fill="none" stroke="url(#bodyGrad)" strokeWidth={2}/>

        {/* Кнопка увімкнення */}
        <rect x={136} y={155} width={56} height={22} rx={11} fill="#FF7A1A" opacity={0.35}/>
        <rect x={138} y={157} width={52} height={18} rx={9} fill="none" stroke="#FF7A1A" strokeWidth={1.5} opacity={0.6}/>
        <circle cx={155} cy={166} r={6} fill="#FF7A1A" opacity={0.7}/>
        <circle cx={173} cy={166} r={6} fill="#FF7A1A" opacity={0.25}/>
        <text x={164} y={192} textAnchor="middle" fontSize="9" fill="#FFB273" opacity={0.5} fontFamily="system-ui">ON / OFF</text>

        {/* Регулятор довжини зрізу */}
        <rect x={112} y={205} width={104} height={10} rx={5} fill="#FF7A1A" opacity={0.15}/>
        <rect x={112} y={205} width={104} height={10} rx={5} fill="none" stroke="#FF7A1A" strokeWidth={1} opacity={0.4}/>
        <rect x={148} y={202} width={32} height={16} rx={4} fill="#FF7A1A" opacity={0.45}/>

        {/* Вентиляційні отвори */}
        {[0,1,2].map(i => (
          <rect key={i} x={130} y={232 + i * 14} width={68} height={6} rx={3} fill="#FF7A1A" opacity={0.12}/>
        ))}

        {/* Логотип — стилізоване лезо */}
        <path d="M148 282 L160 268 L172 282" fill="none" stroke="#FF7A1A" strokeWidth={1.5} opacity={0.4}/>
        <line x1={160} y1={268} x2={160} y2={292} stroke="#FF7A1A" strokeWidth={1.5} opacity={0.4}/>
      </g>

      {/* ГВИНТИ (кріплення ножового блоку) */}
      <g className="anim-screw1" filter="url(#glow)">
        <circle cx={96} cy={112} r={7} fill="#FF7A1A" opacity={0.5}/>
        <circle cx={96} cy={112} r={4} fill="none" stroke="#FFB273" strokeWidth={1.5} opacity={0.8}/>
        <line x1={93} y1={112} x2={99} y2={112} stroke="#FFB273" strokeWidth={1} opacity={0.8}/>
        <line x1={96} y1={109} x2={96} y2={115} stroke="#FFB273" strokeWidth={1} opacity={0.8}/>
      </g>
      <g className="anim-screw2" filter="url(#glow)">
        <circle cx={232} cy={112} r={7} fill="#FF7A1A" opacity={0.5}/>
        <circle cx={232} cy={112} r={4} fill="none" stroke="#FFB273" strokeWidth={1.5} opacity={0.8}/>
        <line x1={229} y1={112} x2={235} y2={112} stroke="#FFB273" strokeWidth={1} opacity={0.8}/>
        <line x1={232} y1={109} x2={232} y2={115} stroke="#FFB273" strokeWidth={1} opacity={0.8}/>
      </g>

      {/* АКУМУЛЯТОР / НИЖНЯ ЧАСТИНА */}
      <g className="anim-attach">
        <rect x={100} y={312} width={128} height={36} rx={10} fill="url(#attachGrad)" stroke="#FF7A1A" strokeWidth={1.5} opacity={0.7}/>
        {/* Індикатор заряду */}
        {[0,1,2,3].map(i => (
          <rect key={i} x={115 + i * 26} y={322} width={16} height={10} rx={2}
            fill="#FF7A1A" opacity={i < 3 ? 0.6 : 0.15} className="anim-pulse"/>
        ))}
        <text x={164} y={360} textAnchor="middle" fontSize="9" fill="#FFB273" opacity={0.6} fontFamily="system-ui">акумулятор</text>
      </g>

      {/* З'ЄДНУВАЛЬНІ ЛІНІЇ (пунктир) */}
      <g opacity={0.25} className="anim-body">
        <line x1={88} y1={70} x2={88} y2={120} stroke="#FF7A1A" strokeWidth={1} strokeDasharray="3,3"/>
        <line x1={240} y1={70} x2={240} y2={120} stroke="#FF7A1A" strokeWidth={1} strokeDasharray="3,3"/>
        <line x1={124} y1={308} x2={124} y2={312} stroke="#FF7A1A" strokeWidth={1} strokeDasharray="3,3"/>
        <line x1={204} y1={308} x2={204} y2={312} stroke="#FF7A1A" strokeWidth={1} strokeDasharray="3,3"/>
      </g>
    </svg>
  );
}

// ─── Головна сторінка ────────────────────────────────────
export default async function HomePage() {
  // Послідовно, не Promise.all — кожен виклик всередині сам робить
  // кілька HTTP-запитів до Google Sheets (fetchAllSheets), і паралельний
  // запуск кількох таких наборів одночасно провокував Google/Next.js
  // повертати однакову (помилкову) відповідь на різні запити.
  const products = await getAllProducts();
  const categoryTree = await getCategoryTree();
  const brands = await getAllBrands();
  const models = await getAllModels();

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
          <ClipperAssembly style={{ top: '-10px', right: '-20px', width: '280px', height: '380px', opacity: 0.9 }} />
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
