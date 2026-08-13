import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug, getAllModels, generateSeo, SITE_URL } from '@/lib/sheets';
import AddToCartButton from '@/components/AddToCartButton';
import ProductTabs from '@/components/ProductTabs';

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
  const [product, allModels] = await Promise.all([
    getProductBySlug(params.slug),
    getAllModels(),
  ]);
  if (!product) notFound();
  const seo = generateSeo(product);

  // Знаходимо всі моделі до яких підходить товар
  // product.modelId — рядок типу "m20,m24" або одне значення
  const modelIds = product.modelId
    ? String(product.modelId).split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const matchedModels = allModels.filter(m => modelIds.includes(m.id));

  // "Ширина ножа: 40 мм" → [{ label, value }, ...]
  const specs = (product.features || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':');
      return idx === -1
        ? { label: line, value: '' }
        : { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    });

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
            {/* Сумісність з моделями */}
            {matchedModels.length > 0 && (
              <div className="product-meta-row" style={{ alignItems: 'flex-start' }}>
                <span className="product-meta-label">Сумісність:</span>
                <span className="product-meta-value" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {matchedModels.map(m => (
                    <a
                      key={m.id}
                      href={`/model/${m.slug}`}
                      style={{
                        display: 'inline-block',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '0.82rem',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.brand} {m.name}
                    </a>
                  ))}
                </span>
              </div>
            )}
            {specs.map((s) => (
              <div className="product-meta-row" key={s.label}>
                <span className="product-meta-label">{s.label}:</span>
                <span className="product-meta-value">{s.value}</span>
              </div>
            ))}
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

          <div style={{ marginTop: '16px', padding: '14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            📦 Доставка Новою Поштою по всій Україні<br />
            🚀 Відправка в день замовлення (до 14:00)<br />
            ✅ Гарантія 365 днів
          </div>
        </div>

        {/* ОПИС / ДОСТАВКА / ГАРАНТІЯ (вкладки) */}
        <ProductTabs description={product.description} />
      </div>
    </div>
  );
}
