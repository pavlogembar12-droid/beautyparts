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
  // ── Парсимо поточні фільтри ──────────────────────────
  const q        = searchParams.q        || '';
  const category = searchParams.category || '';
  const model    = searchParams.model    || '';

  // Бренди — може бути рядок або масив
  const rawBrand     = searchParams.brand;
  const selectedBrands = Array.isArray(rawBrand)
    ? rawBrand
    : rawBrand ? [rawBrand] : [];

  // ── Дані з Google Sheets ─────────────────────────────
  const [products, categoryTree, brands, models] = await Promise.all([
    searchProducts({ q, category, brand: '', model }), // беремо все, фільтруємо нижче
    getCategoryTree(),
    getAllBrands(),
    getAllModels(),
  ]);

  // ── Фільтр по брендах на сервері ────────────────────
  const displayProducts = selectedBrands.length > 0
    ? products.filter((p) => {
        const pSlug = (p.brandSlug || p.brand || '').toLowerCase().trim();
        const pName = (p.brand     || '').toLowerCase().trim();
        return selectedBrands.some(
          (b) => pSlug === b || pName === b || pSlug.startsWith(b)
        );
      })
    : products;

  // ── Хелпер: будуємо URL для кожного бренд-чіпа ─────
  // Клік по вибраному бренду — прибирає його
  // Клік по невибраному — додає
  function buildBrandUrl(brandSlug) {
    const isActive = selectedBrands.includes(brandSlug);
    const newBrands = isActive
      ? selectedBrands.filter((b) => b !== brandSlug)
      : [...selectedBrands, brandSlug];

    const params = new URLSearchParams();
    if (q)        params.set('q',        q);
    if (category) params.set('category', category);
    if (model)    params.set('model',    model);
    newBrands.forEach((b) => params.append('brand', b));

    const qs = params.toString();
    return `/catalog${qs ? '?' + qs : ''}`;
  }

  // URL для кнопки "Всі" — прибирає всі бренди
  function clearBrandsUrl() {
    const params = new URLSearchParams();
    if (q)        params.set('q',        q);
    if (category) params.set('category', category);
    if (model)    params.set('model',    model);
    const qs = params.toString();
    return `/catalog${qs ? '?' + qs : ''}`;
  }

  // Стилі для чіпів
  const chipBase = {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 16px',
    borderRadius: '100px',
    fontSize: '0.88rem',
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  };
  const chipActive = {
    ...chipBase,
    border: '2px solid #c8a96e',
    background: 'rgba(200,169,110,0.15)',
    color: '#a8893e',
  };
  const chipInactive = {
    ...chipBase,
    border: '1.5px solid #e0e0e0',
    background: '#fff',
    color: '#1a1a1a',
  };

  return (
    <div className="page-wrapper">
      <nav className="breadcrumb">
        <Link href="/">Головна</Link>
        <span>/</span>
        <span>Каталог</span>
      </nav>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px' }}>Каталог товарів</h1>

      {/* ── Пошук + категорія + модель (форма) ── */}
      {/* Приховані інпути зберігають вибрані бренди при пошуку */}
      <form method="get" action="/catalog" className="catalog-filters" style={{ marginBottom: '12px' }}>
        <input
          type="text"
          name="q"
          placeholder="🔍 Пошук товару..."
          defaultValue={q}
        />
        <select name="category" defaultValue={category}>
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
        <select name="model" defaultValue={model}>
          <option value="">Усі моделі</option>
          {models.map((m) => (
            <option key={m.slug} value={m.slug}>{m.name}</option>
          ))}
        </select>

        {/* Зберігаємо поточні бренди при сабміті форми */}
        {selectedBrands.map((b) => (
          <input key={b} type="hidden" name="brand" value={b} />
        ))}

        <button type="submit" className="btn-primary">Знайти</button>
      </form>

      {/* ── Бренди — горизонтальна карусель (ТІЛЬКИ ПОСИЛАННЯ, без форми) ── */}
      {brands.length > 0 && (
        <div style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Бренд{selectedBrands.length > 0 && (
              <span style={{ color: '#a8893e', marginLeft: '6px' }}>
                · вибрано {selectedBrands.length}
              </span>
            )}
          </div>

          {/* Карусель */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}>
            {/* Чіп "Всі" */}
            <a
              href={clearBrandsUrl()}
              style={
                selectedBrands.length === 0
                  ? { ...chipBase, border: '2px solid #1a1a1a', background: '#1a1a1a', color: '#fff' }
                  : { ...chipInactive, color: '#666' }
              }
            >
              Всі
            </a>

            {/* Чіп для кожного бренду */}
            {brands.map((b) => {
              const isActive = selectedBrands.includes(b.slug);
              return (
                <a
                  key={b.slug}
                  href={buildBrandUrl(b.slug)}
                  style={isActive ? chipActive : chipInactive}
                >
                  {isActive && '✓ '}{b.name}
                </a>
              );
            })}
          </div>

          <div style={{ fontSize: '0.72rem', color: '#bbb', marginTop: '8px' }}>
            Можна вибрати кілька брендів — листайте вправо
          </div>
        </div>
      )}

      {/* ── Активні фільтри ── */}
      {(q || category || model || selectedBrands.length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#999' }}>Фільтри:</span>
          {q && <span style={tagStyle}>🔍 {q}</span>}
          {selectedBrands.map((b) => {
            const brand = brands.find((br) => br.slug === b);
            return <span key={b} style={{ ...tagStyle, background: 'rgba(200,169,110,0.12)', color: '#a8893e', border: '1px solid #c8a96e' }}>🔹 {brand?.name || b}</span>;
          })}
          {model && <span style={tagStyle}>📋 {models.find((m) => m.slug === model)?.name || model}</span>}
          <Link href="/catalog" style={{ fontSize: '0.8rem', color: '#c0392b', fontWeight: 600 }}>
            Очистити все
          </Link>
        </div>
      )}

      {/* ── Кількість товарів ── */}
      <p className="catalog-count">
        Знайдено: <strong>{displayProducts.length}</strong>
        {selectedBrands.length > 0 && products.length !== displayProducts.length && (
          <span style={{ color: '#999', fontWeight: 400 }}> з {products.length}</span>
        )}
      </p>

      {/* ── Товари ── */}
      {displayProducts.length === 0 ? (
        <div className="empty-state">
          <h2>Нічого не знайдено</h2>
          <p>Спробуйте змінити фільтри або <Link href="/catalog">очистити пошук</Link></p>
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

// Стиль тегів активних фільтрів
const tagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '100px',
  border: '1px solid #e0e0e0',
  background: '#f5f5f5',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#555',
};
                
