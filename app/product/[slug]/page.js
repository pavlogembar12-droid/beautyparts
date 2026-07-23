  import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug, generateSeo, SITE_URL } from '@/lib/sheets';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const seo = generateSeo(product);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${SITE_URL}/product/${product.slug}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const seo = generateSeo(product);

  return (
    <div className="page-wrapper">
      <nav className="breadcrumb">
        <a href="/">Головна</a>
        <span>/</span>
        <a href="/catalog">Каталог</a>
        <span>/</span>
        {product.category && (
          <>
            <a href={`/category/${product.categorySlug}`}>{product.category}</a>
            <span>/</span>
          </>
        )}
        <span>{product.name}</span>
      </nav>

      <div className="product-page">
        {/* ФОТО */}
        <div className="product-img-wrap">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div style={{ fontSize: '5rem', textAlign: 'center', padding: '40px' }}>
              {product.emoji || '📦'}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="product-info">
          {product.model && (
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>
              Підходить до моделі:{' '}
              <a href={`/model/${product.modelSlug}`}>{product.model}</a>
            </p>
          )}

          <h1>{seo.h1}</h1>

          <div className="product-price-block">
            <span className="product-price">{product.price} грн</span>
            {product.oldPrice > 0 && (
              <span className="product-price-old">{product.oldPrice} грн</span>
            )}
          </div>

          <span className={`product-stock ${product.inStock ? 'in' : 'out'}`}>
            {product.inStock ? '✓ В наявності' : '✗ Немає в наявності'}
          </span>

          <div className="product-meta">
            {product.brand && (
              <div className="product-meta-row">
                <span className="product-meta-label">Бренд:</span>
                <a href={`/brand/${product.brandSlug}`} className="product-meta-value">{product.brand}</a>
              </div>
            )}
            {product.sku && (
              <div className="product-meta-row">
                <span className="product-meta-label">Артикул:</span>
                <span className="product-meta-value">{product.sku}</span>
              </div>
            )}
            {product.category && (
              <div className="product-meta-row">
                <span className="product-meta-label">Категорія:</span>
                <a href={`/category/${product.categorySlug}`} className="product-meta-value">{product.category}</a>
              </div>
            )}
          </div>

          {product.inStock && (
            <AddToCartButton
              product={{
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image || '',
              }}
            />
          )}

          <div style={{ marginTop: '16px', padding: '14px', background: '#f9f6f0', borderRadius: '8px', fontSize: '0.85rem', color: '#666' }}>
            📦 Доставка Новою Поштою по всій Україні<br />
            🚀 Відправка в день замовлення (до 14:00)<br />
            ✅ Гарантія 365 днів
          </div>
        </div>

        {/* ОПИС */}
        {product.description && (
          <div className="product-desc">
            <h2>Опис</h2>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

