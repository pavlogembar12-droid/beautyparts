import Link from 'next/link';
import { getAllProducts } from '@/lib/sheets';

// Список в адмінці завжди має бути свіжим — не кешуємо
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <main>
      <nav><Link href="/admin">Адмінка</Link> / Товари</nav>
      <h1>Товари ({products.length})</h1>

      <p><Link href="/admin/products/new">+ Додати новий товар</Link></p>

      <table>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Бренд</th>
            <th>Категорія</th>
            <th>Ціна</th>
            <th>Наявність</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id || p.slug}>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>{p.price} грн</td>
              <td>{p.inStock ? 'В наявності' : 'Немає'}</td>
              <td>
                <Link href={`/admin/products/${p.slug}`}>Редагувати</Link>
                {' · '}
                <Link href={`/product/${p.slug}`} target="_blank">Переглянути на сайті</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
