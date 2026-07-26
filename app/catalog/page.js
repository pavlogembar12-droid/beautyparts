import Link from 'next/link';
import {
  searchProducts,
  getCategoryTree,
  getAllBrands,
  getAllModels,
} from '@/lib/sheets';

export const metadata = {
  title: 'Каталог товарів — Beauty Parts',
  description: 'Повний каталог запчастин для машинок для стрижки з фільтрами за категорією, брендом і моделлю.',
};

export default async function CatalogPage({ searchParams }) {
  // ── Парсимо бренди — може бути рядок або масив ──
  const rawBrand = searchParams.brand;
  const selectedBrands = Array.isArray(rawBrand)
    ? rawBrand
    : rawBrand ? [rawBrand] : [];

  const filters = {
    q:        searchParams.q        || '',
    category: searchParams.category || '',
    brand:    '',   // беремо всі, фільтруємо нижче
    model:    searchParams.model    || '',
  };

  const [products, categoryTree, brands, models] = await Promise.all([
    searchProducts(filters),
    getCategoryTree(),
    getAllBrands(),
    getAllModels(),
  ]);

  // ── Фільтрація по декількох брендах ──
  const displayProducts = selectedBrands.length > 0
    ? products.filter((p) => {
        const pBrandSlug = (p.brandSlug || p.brand || '').toLowerCase().trim();
        const pBrandName = (p.brand     || '').toLowerCase().trim();
        return selectedBrands.some(
          (b) => b === pBrandSlug || b === pBrandName || pBrandSlug.startsWith(b) || pBrandName.startsWith(b)
        );
      })
    : products;

  return (
    <div className="page-wrapper">
      {/* Автосабміт форми при зміні чекбоксу */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', function() {
          document.querySelectorAll('.brand-chip-input').forEach(function(cb) {
            cb.addEventListener('change', function() { cb.closest('form').submit(); });
          });
        });
      `}} />

      <nav className="breadcrumb">
        <Link href="/">Головна</Link>
        <span>/</span>
        <span>Каталог</span>
      </nav>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px' }}>Каталог товарів</h1>

      <form method="get" action="/catalog">
        {/* ── Пошук + категорія + модель ── */}
        <div className="catalog-filters" style={{ marginBottom: '12px' }}>
          <input
            type="text"
            name="q"
            placeholder="🔍 Пошук товару..."
            defaultValue={filters.q}
          />
          <select name="category" defaultValue={filters.category}>
            <option value="">Усі категорії</option>
            {categoryTree.map((c) => (
              <optgroup key={c.slug} label={`${c.icon ? c.icon + ' ' : ''}${c.name}`}>
                <option value={c.slug}>Усі в «{c.name}»</option>
                {c.children.map((child) => (
                  <option key={child.slug} value={child.slug}>
                    {'— ' + child.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <select name="model" defaultValue={filters.model}>
            <option value="">Усі моделі</option>
            {models.map((m) => (
              <option key={m.slug} value={m.slug}>{m.name}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Знайти</button>
        </div>

        {/* ── Бренди — горизонтальна карусель з мультивибором ── */}
        {brands.length > 0 && (
          <div style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Бренд {selectedBrands.length > 0 && <span style={{ color: '#a8893e' }}>· вибрано {selectedBrands.length}</span>}
            </div>

            {/* Карусель — горизонтальний скрол */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE */
            }}>

              {/* Чіп "Всі" */}
              <a
                href={`/catalog?q=${filters.q}&category=${filters.category}&model=${filters.model}`}
                style={{
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '7px 16px',
                  borderRadius: '100px',
                  border: selectedBrands.length === 0 ? '2px solid #1a1a1a' : '1.5px solid #e0e0e0',
                  background: selectedBrands.length === 0 ? '#1a1a1a' : '#fff',
                  color: selectedBrands.length === 0 ? '#fff' : '#666',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Всі
              </a>

              {/* Чіп для кожного бренду */}
              {brands.map((b) => {
                const isChecked = selectedBrands.includes(b.slug);
                return (
                  <label
                    key={b.slug}
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 16px',
                      borderRadius: '100px',
                      border: isChecked ? '2px solid #c8a96e' : '1.5px solid #e0e0e0',
                      background: isChecked ? 'rgba(200,169,110,0.15)' : '#fff',
                      color: isChecked ? '#a8893e' : '#1a1a1a',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <input
                      className="brand-chip-input"
                      type="checkbox"
                      name="brand"
                      value={b.slug}
                      defaultChecked={isChecked}
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                    />
                    {isChecked && <span>✓ </span>}{b.name}
                  </label>
                );
              })}
            </div>

            {/* Підказка */}
            <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '8px' }}>
              👆 Можна вибрати кілька брендів одночасно
            </div>
          </div>
        )}
      </form>

      {/* ── Активні фільтри (бейджі) ── */}
      {(filters.q || filters.category || filters.model || selectedBrands.length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#666' }}>Активні фільтри:</span>
          {filters.q && (
            <span style={chipStyle}>🔍 {filters.q}</span>
          )}
          {selectedBrands.map((b) => {
            const brand = brands.find((br) => br.slug === b);
            return (
              <span key={b} style={{ ...chipStyle, background: 'rgba(200,169,110,0.13)', borderColor: '#c8a96e', color: '#a8893e' }}>
                🔹 {brand?.name || b}
              </span>
            );
          })}
          {filters.model && (
            <span style={chipStyle}>📋 {models.find((m) => m.slug === filters.model)?.name || filters.model}</span>
          )}
          <Link
            href="/catalog"
            style={{ fontSize: '0.82rem', color: '#c0392b', fontWeight: 600, marginLeft: '4px' }}
          >
            Очистити все
          </Link>
        </div>
      )}

      <p className="catalog-count">
        Знайдено товарів: <strong>{displayProducts.length}</strong>
        {products.length !== displayProducts.length && (
          <span style={{ color: '#666', fontWeight: 400 }}> (з {products.length})</span>
        )}
      </p>

      {displayProducts.length === 0 ? (
        <div className="empty-state">
          <h2>Нічого не знайдено</h2>
          <p>Спробуйте змінити фільтри або <Link href="/catalog" style={{ color: 'var(--accent-dark)' }}>очистити пошук</Link></p>
        </div>
      ) : (
        <div className="product-grid">
          {displayProducts.map((p) => (
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
      )}
    </div>
  );
}

// ── Стиль для бейджів активних фільтрів ──
const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '100px',
  border: '1px solid #e0e0e0',
  background: '#f5f5f5',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#444',
};
          
