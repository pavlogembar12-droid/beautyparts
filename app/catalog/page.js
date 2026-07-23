import Link from 'next/link';
import {
  searchProducts,
  getAllCategories,
  getAllBrands,
  getAllModels,
} from '@/lib/sheets';

export const metadata = {
  title: 'Каталог товарів — Beauty Parts',
  description: 'Повний каталог запчастин для машинок для стрижки з фільтрами за категорією, брендом і моделлю.',
};

export default async function CatalogPage({ searchParams }) {
  const filters = {
    q: searchParams.q || '',
    category: searchParams.category || '',
    brand: searchParams.brand || '',
    model: searchParams.model || '',
  };

  const [products, categories, brands, models] = await Promise.all([
    searchProducts(filters),
    getAllCategories(),
    getAllBrands(),
    getAllModels(),
  ]);

  return (
    <div className="page-wrapper">
      <nav className="breadcrumb">
        <Link href="/">Головна</Link>
        <span>/</span>
        <span>Каталог</span>
      </nav>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px' }}>Каталог товарів</h1>

      <form method="get" action="/catalog" className="catalog-filters">
        <input
          type="text"
          name="q"
          placeholder="🔍 Пошук товару..."
          defaultValue={filters.q}
        />
        <select name="category" defaultValue={filters.category}>
          <option value="">Усі категорії</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select name="brand" defaultValue={filters.brand}>
          <option value="">Усі бренди</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </select>
        <select name="model" defaultValue={filters.model}>
          <option value="">Усі моделі</option>
          {models.map((m) => (
            <option key={m.slug} value={m.slug}>{m.name}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Знайти</button>
      </form>

      <p className="catalog-count">Знайдено товарів: <strong>{products.length}</strong></p>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>Нічого не знайдено</h2>
          <p>Спробуйте змінити фільтри або очистити пошук</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
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
      )}
    </div>
  );
        }

