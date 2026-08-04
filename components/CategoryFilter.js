'use client';

import { useState, useRef, useEffect } from 'react';

export default function CategoryFilter({ categoryTree, initialValue }) {
  const initialSlugs = (initialValue || '').split(',').map((s) => s.trim()).filter(Boolean);
  const [selected, setSelected] = useState(new Set(initialSlugs));
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const hiddenRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  function toggle(slug) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }

  function clearAll() {
    setSelected(new Set());
  }

  function apply() {
    setOpen(false);
    const form = hiddenRef.current?.closest('form');
    if (form) form.requestSubmit();
  }

  const label = selected.size ? `Обрано: ${selected.size}` : 'Усі категорії';

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 1, minWidth: 160 }}>
      <input ref={hiddenRef} type="hidden" name="category" value={Array.from(selected).join(',')} readOnly />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          background: 'var(--surface-2)',
          border: `1px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
          color: 'var(--text)',
          borderRadius: 6,
          padding: '9px 12px',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {label}
          {selected.size > 0 && (
            <span style={{ background: 'var(--accent)', color: 'var(--black)', fontWeight: 700, fontSize: 11, borderRadius: 20, padding: '1px 7px' }}>
              {selected.size}
            </span>
          )}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'var(--text-dim)', flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
          boxShadow: '0 12px 32px rgba(0,0,0,.5)', maxHeight: 360, overflowY: 'auto', zIndex: 30,
        }}>
          {categoryTree.map((cat) => (
            <div key={cat.slug}>
              <Row
                icon={cat.icon}
                name={cat.name}
                checked={selected.has(cat.slug)}
                onClick={() => toggle(cat.slug)}
                bold
              />
              {cat.children.map((child) => (
                <Row
                  key={child.slug}
                  icon={child.icon}
                  name={child.name}
                  checked={selected.has(child.slug)}
                  onClick={() => toggle(child.slug)}
                  indent
                />
              ))}
            </div>
          ))}

          <div style={{
            position: 'sticky', bottom: 0, background: 'var(--surface)', borderTop: '1px solid var(--border)',
            padding: 12, display: 'flex', gap: 10,
          }}>
            <button
              type="button"
              onClick={clearAll}
              style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-dim)', borderRadius: 8, padding: '9px 14px', fontSize: 13, cursor: 'pointer' }}
            >
              Скинути
            </button>
            <button
              type="button"
              onClick={apply}
              style={{ flex: 1, background: 'var(--accent)', border: 'none', color: 'var(--black)', fontWeight: 800, borderRadius: 8, padding: '9px 14px', fontSize: 14, cursor: 'pointer' }}
            >
              Показати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ icon, name, checked, onClick, bold, indent }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: indent ? '10px 14px 10px 40px' : '11px 14px',
        cursor: 'pointer', borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
        background: checked ? 'var(--accent)' : 'var(--surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--black)', fontSize: 12, fontWeight: 800,
      }}>
        {checked ? '✓' : ''}
      </span>
      <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 700 : 400, color: 'var(--text)' }}>{name}</span>
    </div>
  );
    }
