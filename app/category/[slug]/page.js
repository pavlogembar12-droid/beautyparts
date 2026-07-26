import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCategories, getProductsByCategory } from '@/lib/sheets';

export async function generateMetadata({ params }) {
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return {};

  return {
    title: `${category.name} — купити в Beauty Parts`,
    description: `Каталог: ${category.name}. Оригінальні запчастини для машинок для стрижки з доставкою по Україні.`,
  };
}

export default async function CategoryPage({ params }) {
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const children = categories.filter((c) => c.parent === category.slug);
  const parent = category.parent ? categories.find((c) => c.slug === category.parent) : null;

  const products = await getProductsByCategory(params.slug);

  return (
    <div className="page-wrapper">
      <div className="breadcrumb">
        <a href="/">Головна</a>
        {parent && (
          <>
            <span>/</span>
            <a href={`/category/${parent.slug}`}>{parent.name}</a>
          </>
        )}
        <span>/</span>
        <span>{category.name}</span>
      </div>

      <div className="entity-hero">
        <div className="entity-mark">{category.icon || '📦'}</div>
        <div>
          <h1>{category.name}</h1>
          <p>{products.length} {products.length === 1 ? 'товар' : 'товарів'} у цій категорії</p>
        </div>
      </div>

      {children.length > 0 && (
        <div className="entity-subcats">
          {children.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="entity-subcat-pill">
              {c.icon ? `${c.icon} ` : ''}{c.name}
            </Link>
          ))}
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
          <h2>У цій категорії поки немає товарів</h2>
        </div>
      )}
    </div>
  );
                        }
