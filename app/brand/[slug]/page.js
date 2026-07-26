import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllBrands, getProductsByBrand } from '@/lib/sheets';

export async function generateMetadata({ params }) {
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.slug === params.slug);
  if (!brand) return {};

  return {
    title: `${brand.name} — запчастини та ножові блоки | Beauty Parts`,
    description: `Усі товари бренду ${brand.name}: ножові блоки, запчастини для машинок для стрижки. Купити з доставкою по Україні.`,
  };
}

export default async function BrandPage({ params }) {
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.slug === params.slug);
  if (!brand) notFound();

  const products = await getProductsByBrand(params.slug);

  return (
    <div className="page-wrapper">
      <div className="breadcrumb">
        <a href="/">Головна</a>
        <span>/</span>
        <span>{brand.name}</span>
      </div>

      <div className="entity-hero">
        <div className="entity-mark">✂️</div>
        <div>
          <h1>{brand.name}</h1>
          <p>Оригінальні запчастини для машинок для стрижки {brand.name} — {products.length} {products.length === 1 ? 'товар' : 'товарів'}</p>
        </div>
      </div>

      {products.length > 0 && (
        <div className="entity-toolbar">
          <span className="entity-count">Показано {products.length} {products.length === 1 ? 'товар' : 'товарів'}</span>
        </div>
      )}

      {products.length > 0 ? (
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
      ) : (
        <div className="empty-state">
          <h2>У цього бренду поки немає товарів</h2>
        </div>
      )}
    </div>
  );
}
