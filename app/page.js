import Link from 'next/link';
import { getAllProducts, getAllCategories, getAllBrands } from '@/lib/sheets';

export const metadata = {
  title: 'Beauty Parts — Оригінальні запчастини для машинок Wahl, Moser, BaByliss',
  description: 'Інтернет-магазин оригінальних запчастин для машинок, фенів, фрезерів. Wahl, Moser, BaByliss PRO, Oster. Доставка Новою Поштою по всій Україні.',
};

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
      {/* HERO */}
      <div style={{ background: '#1a1a1a' }}>
        <div className="page-wrapper" style={{ paddingBottom: 0 }}>
          <div className="hero">
            {/* Суббренд лайн */}
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
              color: 'rgba(200,169,110,0.7)', textTransform: 'uppercase',
              marginBottom: 16
            }}>
              ✂ Оригінальні запчастини · Wahl · Moser · BaByliss PRO · Oster
            </p>

            <h1>
              Знайди деталь для своєї{' '}
              <em>машинки, фену чи фрезера</em>
            </h1>

            {/* Опис по реченню в рядок */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', marginBottom: 6 }}>
                Ножі, насадки, акумулятори, двигуни — все для Wahl, Moser, BaByliss PRO, Oster.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', marginBottom: 6 }}>
                Підбір за фото. Відправка Новою Поштою в день замовлення.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>
                Безкоштовна доставка від 3000 грн.
              </p>
            </div>

            {/* Кнопки */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <Link href="/catalog" className="btn-primary">
                Відкрити каталог →
              </Link>
              <a
                href="https://t.me/liga_krasotu"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', padding: '13px 20px', borderRadius: 8,
                  fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                }}
              >
                📷 Підбір за фото
              </a>
            </div>

            {/* Бейджі */}
            <div className="hero-badges">
              <span className="hero-badge">✅ Гарантія 365 днів</span>
              <span className="hero-badge">📦 Нова Пошта по Україні</span>
              <span className="hero-badge">🚀 Відправка в день замовлення</span>
              <span className="hero-badge">📷 Підбір за фото</span>
              <span className="hero-badge">💬 Viber / Telegram</span>
              <span className="hero-badge">⭐ 1000+ замовлень</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrapper">

        {/* КАТЕГОРІЇ */}
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

        {/* БРЕНДИ */}
        {brands.length > 0 && (
          <section style={{ marginBottom: '44px' }}>
            <h2 className="section-title">Бренди</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/brand/${b.slug}`}
                  style={{
                    background: '#fff', border: '1px solid #e0e0e0',
                    borderRadius: '20px', padding: '8px 20px',
                    fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a',
                    textDecoration: 'none', transition: 'border-color 0.2s',
                  }}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ПОПУЛЯРНІ ТОВАРИ */}
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
                    <div className="product-card-name">{p.name}</div>
                    <span className={`product-card-badge ${p.inStock ? '' : 'out'}`}>
                      {p.inStock ? 'В наявності' : 'Немає'}
                    </span>
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

        {/* ПЕРЕВАГИ */}
        <section style={{ marginTop: '60px' }}>
          <h2 className="section-title">Чому обирають нас</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: '✅', title: 'Виключно оригінальні запчастини', desc: 'Оригінальні деталі від перевірених виробників без підробок' },
              { icon: '🚀', title: 'Відправка в день замовлення', desc: 'За наявності відправляємо того ж дня до 14:00' },
              { icon: '📷', title: 'Допоможемо з підбором та сумісністю', desc: 'Надішліть фото — підберемо потрібну деталь' },
              { icon: '✅', title: 'Гарантія 365 днів', desc: 'На всі товари та комплектуючі' },
            ].map((item) => (
              <div key={item.title} style={{
                background: '#fff', borderRadius: '8px',
                padding: '22px', border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.95rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ПІДБІР ЗА ФОТО */}
        <section style={{
          marginTop: '48px',
          background: '#1a1a1a',
          borderRadius: '16px',
          padding: '36px 32px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📷</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>
            Не знаєте артикул?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontSize: '0.95rem' }}>
            Надішліть фото деталі або машинки — підберемо потрібну запчастину та перевіримо сумісність.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://t.me/liga_krasotu"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              💬 Написати в Telegram
            </a>
            <a
              href="viber://chat?number=380965407076"
              className="btn-primary"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
            >
              📱 Написати у Viber
            </a>
          </div>
        </section>

      </div>
    </>
  );
                  }
                  
