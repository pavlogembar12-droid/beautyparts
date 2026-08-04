import Link from 'next/link';
import { getAllCategories } from '@/lib/sheets';
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton';

export const dynamic = 'force-dynamic';

export default async function CategoriesListPage() {
  const categories = await getAllCategories();

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
      <nav style={{ marginBottom: 16, fontSize: 14 }}>
        <Link href="/admin">Адмінка</Link> / Категорії
      </nav>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22 }}>Категорії ({categories.length})</h1>
        <Link
          href="/admin/categories/new"
          style={{ background: '#1a1a1a', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}
        >
          + Додати категорію
        </Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #1a1a1a' }}>
              <th style={{ padding: '10px 8px' }}>Іконка</th>
              <th style={{ padding: '10px 8px' }}>Назва</th>
              <th style={{ padding: '10px 8px' }}>Slug (id)</th>
              <th style={{ padding: '10px 8px' }}>Батьківська</th>
              <th style={{ padding: '10px 8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.slug} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 8px', fontSize: 20 }}>{c.icon || '📦'}</td>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '10px 8px', color: '#888', fontFamily: 'monospace' }}>{c.slug}</td>
                <td style={{ padding: '10px 8px', color: '#888' }}>{c.parent || '—'}</td>
                <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/categories/${c.slug}`} style={{ marginRight: 14, fontWeight: 600 }}>
                    Редагувати
                  </Link>
                  <DeleteCategoryButton id={c.slug} name={c.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && (
        <p style={{ marginTop: 24, color: '#888' }}>Категорій поки немає.</p>
      )}
    </main>
  );
            }
