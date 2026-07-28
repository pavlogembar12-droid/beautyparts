'use client';

import { useState, useEffect } from 'react';

export default function SidebarShell({ children }) {
  const [open, setOpen] = useState(false);

  // Закриваємо панель при переході на іншу сторінку (клік по посиланню всередині)
  useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (e.target.closest('a')) setOpen(false);
    }
    const panel = document.getElementById('site-sidebar-panel');
    panel?.addEventListener('click', onClick);
    return () => panel?.removeEventListener('click', onClick);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
        aria-expanded={open}
      >
        ⋮
      </button>

      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside id="site-sidebar-panel" className={`site-sidebar ${open ? 'open' : ''}`}>
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={() => setOpen(false)}
          aria-label="Закрити меню"
        >
          ← Назад
        </button>
        {children}
      </aside>
    </>
  );
}
