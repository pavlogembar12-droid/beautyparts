import Link from 'next/link';
import { getAllCategories, getAllBrands } from '@/lib/sheets';
import SidebarShell from './SidebarShell';

export default async function SiteSidebar() {
  const [categories, brands] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
  ]);

  return (
    <SidebarShell>

      {/* ── Головна навігація ── */}
      <div className="sidebar-section">
        <Link href="/" className="sidebar-nav-link">🏠 Головна</Link>
        <Link href="/catalog" className="sidebar-nav-link">📦 Весь каталог</Link>
        <Link href="/catalog?brand=moser" className="sidebar-nav-link sidebar-nav-indent">
          По моделях Moser
        </Link>
      </div>

      {/* ── Категорії (з Sheets) ── */}
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

      {/* ── Бренди (з Sheets) ── */}
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

    </SidebarShell>
  );
}
