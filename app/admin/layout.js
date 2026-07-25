// app/admin/layout.js
// Цей файл прибирає бокову панель на всіх адмін-сторінках
export default function AdminLayout({ children }) {
  return <div className="admin-page">{children}</div>;
}
