'use client';

import { useState, useRef } from 'react';

export default function PhotoSelectPage() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [model, setModel] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef();

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const fd = new FormData();
      if (photo) fd.append('photo', photo);
      fd.append('model', model);
      fd.append('contact', contact);
      const res = await fetch('/api/photo-select', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Помилка відправки');
      setStatus('sent');
      setTimeout(() => { window.open('https://t.me/liga_krasotu', '_blank'); }, 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  if (status === 'sent') {
    return (
      <div className="page-wrapper">
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--white)', marginBottom: 12 }}>
            Запит надіслано!
          </h1>
          <p style={{ color: 'var(--text-dim)', marginBottom: 28, lineHeight: 1.6 }}>
            Ми отримали ваше фото і зв'яжемося з вами найближчим часом.<br />
            Зараз відкриємо Telegram для швидкого зв'язку...
          </p>
          <a href="https://t.me/liga_krasotu" target="_blank" rel="noopener noreferrer" className="btn-primary">
            ✈ Написати в Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{ maxWidth: 560, margin: '0 auto', paddingBottom: 60 }}>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--white)', marginBottom: 8 }}>
          📷 Підбір за фото
        </h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: 28, lineHeight: 1.6 }}>
          Не знаєте назву деталі? Надішліть фото — визначимо потрібну запчастину за кілька хвилин.
        </p>

        <form onSubmit={handleSubmit}>

          {/* ФОТО */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Фото деталі або машинки
            </div>

            {photoPreview ? (
              <div style={{ position: 'relative' }}>
                <img src={photoPreview} alt="preview" style={{ width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 8, background: 'var(--surface-2)' }} />
                <button type="button" onClick={removePhoto} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--surface-2)' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📸</div>
                <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>Натисніть щоб додати фото</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>JPG, PNG до 10 МБ</div>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} style={{ display: 'none' }} />

            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.5 }}>
              Можна надіслати фото: самої деталі · машинки/тримера · шильдика з моделлю · упаковки або старої запчастини
            </div>
          </div>

          {/* МОДЕЛЬ */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Модель машинки (якщо знаєте)
            </label>
            <input
              style={{ display: 'block', width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--surface-2)', color: 'var(--text)', outline: 'none' }}
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="напр. Wahl Magic Clip, Moser Class 45..."
            />
          </div>

          {/* КОНТАКТ */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Ваше ім'я / телефон або Telegram *
            </label>
            <input
              style={{ display: 'block', width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--surface-2)', color: 'var(--text)', outline: 'none' }}
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              required
              placeholder="напр. Олена, +38099..., або @username"
            />
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: 6 }}>
              Як з вами зв'язатись після підбору
            </div>
          </div>

          {status === 'error' && (
            <div style={{ background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, padding: '12px 16px', color: '#FF6B6B', fontSize: '14px', marginBottom: 16 }}>
              ⚠️ {errorMsg || 'Помилка відправки. Спробуйте ще раз.'}
            </div>
          )}

          <button type="submit" disabled={status === 'sending'} className="btn-primary" style={{ display: 'block', width: '100%', padding: '15px', fontSize: '16px', marginBottom: 12, opacity: status === 'sending' ? 0.7 : 1 }}>
            {status === 'sending' ? '⏳ Надсилаємо...' : '📤 Надіслати на підбір'}
          </button>

          <a href="https://t.me/liga_krasotu" target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', padding: '13px', background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 10, fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box' }}>
            ✈ Або написати напряму в Telegram
          </a>

        </form>
      </div>
    </div>
  );
}
