'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminHomePage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <main>
      <h1>Адмінка Beauty Parts</h1>

      <nav>
        <ul>
          <li><Link href="/admin/products">Товари</Link></li>
          <li><Link href="/admin/products/new">Додати новий товар</Link></li>
        </ul>
      </nav>

      <button onClick={handleLogout}>Вийти</button>
    </main>
  );
}
