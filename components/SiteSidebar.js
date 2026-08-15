import Link from 'next/link';
import { getAllCategories, getAllBrands } from '@/lib/sheets';

// Таймаут щоб не зависати при генерації сторінок
function withTimeout(promise, ms = 4000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('fetch timeout')), ms)
    ),
  ]);
}

export default async function SiteSidebar() {
  let categories = [];
  let brands = [];

  try {
    [categories, brands] = await Promise.all([
      withTimeout(getAllCategories(), 4000),
      withTimeout(getAllBrands(), 4000),
    ]);
  } catch (e) {
    // Якщо Sheets не відповідає — сайдбар рендериться без динамічних даних
    console.error('[SiteSidebar] fetch failed:', e.message);
  }

  return (
    <aside className="site-sidebar">

      {/* ── Головна навігація ── */}
      <div className="sidebar-section">
        <Link href="/" className="sidebar-nav-link">🏠 Головна</Link>
        <Link href="/catalog" className="sidebar-nav-link">📦 Весь каталог</Link>
        <Link href="/catalog?brand=moser" className="sidebar-nav-link sidebar-nav-indent">
          По моделях Moser
        </Link>
      </div>

      {/* ── Категорії ── */}
      {categories.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-heading">Категорії</div>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="sidebar-nav-link">
              {c.icon || '📦'} {c.name}
            </Link>
          ))}
        </div>
      )}

      {/* ── Бренди ── */}
      {brands.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-heading">Бренди</div>
          {brands.map((b) => (
            <Link key={b.slug} href={`/brand/${b.slug}`} className="sidebar-nav-link">
              🔹 {b.name}
            </Link>
          ))}
        </div>
      )}

      {/* ── Інформація ── */}
      <div className="sidebar-section">
        <div className="sidebar-heading">Інформація</div>
        <Link href="/delivery" className="sidebar-nav-link">🚚 Доставка та оплата</Link>
        <Link href="/returns"  className="sidebar-nav-link">ℹ️ Про нас</Link>
        <Link href="/contacts" className="sidebar-nav-link">📞 Контакти</Link>
      </div>

    </aside>
  );
}
