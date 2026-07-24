import Link from 'next/link';
import { getAllProducts } from '@/lib/sheets';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function ProductsListPage() {
  const products = await getAllProducts();

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
      <nav style={{ marginBottom: 16, fontSize: 14 }}>
        <Link href="/admin">Адмінка</Link> / Товари
      </nav>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22 }}>Товари ({products.length})</h1>
        <Link
          href="/admin/products/new"
          style={{ background: '#1a1a1a', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}
        >
          + Додати товар
        </Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #1a1a1a' }}>
              <th style={{ padding: '10px 8px' }}>Назва</th>
              <th style={{ padding: '10px 8px' }}>Бренд</th>
              <th style={{ padding: '10px 8px' }}>Ціна</th>
              <th style={{ padding: '10px 8px' }}>Наявність</th>
              <th style={{ padding: '10px 8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id || p.slug} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '10px 8px' }}>{p.brand}</td>
                <td style={{ padding: '10px 8px' }}>{p.price} грн</td>
                <td style={{ padding: '10px 8px' }}>{p.inStock ? '✓' : '✗'}</td>
                <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/products/${p.slug}`} style={{ marginRight: 14, fontWeight: 600 }}>
                    Редагувати
                  </Link>
                  <DeleteButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <p style={{ marginTop: 24, color: '#888' }}>Товарів поки немає.</p>
      )}
    </main>
  );
}
