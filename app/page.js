
import Link from 'next/link';
import { getAllProducts, getAllCategories, getAllBrands } from '@/lib/sheets';

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
            <h1>Знайди деталь для своєї <em>машинки, фену чи фрезера</em></h1>
            <p>Wahl, Moser, BaByliss PRO, Oster — ножі, насадки, акумулятори, двигуни. Підбір за фото. Відправка Новою Поштою.</p>
            <div className="hero-badges">
              <span className="hero-badge">✅ Гарантія 365 днів</span>
              <span className="hero-badge">📦 Нова Пошта по Україні</span>
              <span className="hero-badge">🚀 Відправка в день замовлення</span>
              <span className="hero-badge">⭐ 1000+ замовлень</span>
            </div>
            <Link href="/catalog" className="btn-primary">Відкрити каталог →</Link>
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
          <section style={{ marginBottom: '48px' }}>
            <h2 className="section-title">Бренди</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/brand/${b.slug}`}
                  style={{
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '20px',
                    padding: '8px 20px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#1a1a1a',
                    transition: 'border-color 0.2s',
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
        <section style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            { icon: '📷', title: 'Підбір за фото', desc: 'Надішліть фото — підберемо потрібну запчастину' },
            { icon: '🚀', title: 'Відправка в день замовлення', desc: 'За наявності — відправляємо того ж дня' },
            { icon: '✅', title: 'Гарантія 365 днів', desc: 'На всі товари та комплектуючі' },
            { icon: '💬', title: 'Консультація', desc: 'Підкажемо що саме треба міняти' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>{item.title}</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>{item.desc}</div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
                    
