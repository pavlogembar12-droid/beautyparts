import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug, generateSeo, SITE_URL } from '@/lib/sheets';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  const seo = generateSeo(product);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/product/${product.slug}`,
    },
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
    <main>
      <nav>
        <a href="/">Головна</a> {' '}
        <a href="/catalog">Каталог</a> {' '}
        <a href={`/category/${product.categorySlug}`}>{product.category}</a> {' '}
        <a href={`/brand/${product.brandSlug}`}>{product.brand}</a>
      </nav>

      {product.model && (
        <p>
          Підходить до моделі:{' '}
          <a href={`/model/${product.modelSlug}`}>{product.model}</a>
        </p>
      )}

      <h1>{seo.h1}</h1>

      {product.image && <img src={product.image} alt={product.name} width={400} />}

      <p><strong>Ціна:</strong> {product.price} грн</p>
      <p><strong>Бренд:</strong> {product.brand}</p>
      <p><strong>Наявність:</strong> {product.inStock ? 'В наявності' : 'Немає в наявності'}</p>

      {product.inStock && (
        <AddToCartButton
          product={{
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
          }}
        />
      )}

      <section>
        <h2>Опис</h2>
        <p>{product.description}</p>
      </section>
    </main>
  );
}

