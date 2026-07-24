'use client';

import { useState, useEffect, useRef } from 'react';

const DELIVERY_TYPES = [
  { id: 'warehouse', label: '📦 Відділення НП' },
  { id: 'parcel', label: '🏧 Поштомат НП' },
  { id: 'courier', label: '🚗 Адресна доставка (кур\'єр)' },
];

const s = {
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: 6 },
  input: {
    display: 'block', width: '100%', padding: '13px 14px',
    border: '1px solid #ddd', borderRadius: 8, fontSize: '15px',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    marginBottom: 10,
  },
  inputFocus: { border: '1.5px solid #1a1a1a' },
  dropdown: {
    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
    background: '#fff', border: '1px solid #ddd', borderRadius: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', maxHeight: 220, overflowY: 'auto',
  },
  dropdownItem: {
    padding: '11px 14px', fontSize: '14px', cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
  },
  radioRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', border: '1px solid #ddd', borderRadius: 8,
    marginBottom: 8, cursor: 'pointer', fontSize: '14px',
  },
  radioRowActive: { border: '1.5px solid #1a1a1a', background: '#fafafa' },
  hint: { fontSize: '12px', color: '#888', marginTop: 2, lineHeight: 1.5 },
  info: {
    background: '#f9f6f0', border: '1px solid #e8dcc8', borderRadius: 8,
    padding: '12px 14px', fontSize: '13px', color: '#7a6040', marginBottom: 10,
  },
};

export default function NovaPoshtaSelect({ onChange }) {
  const [deliveryType, setDeliveryType] = useState('warehouse');
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [address, setAddress] = useState('');
  const [cityFocused, setCityFocused] = useState(false);
  const cityRef = useRef(null);

  // Пошук міст
  useEffect(() => {
    if (cityQuery.length < 2) { setCities([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/novaposhta/cities?q=${encodeURIComponent(cityQuery)}`);
        const data = await res.json();
        setCities(data.cities || []);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [cityQuery]);

  function selectCity(city) {
    setSelectedCity(city);
    setCityQuery(city.Present || city.MainDescription);
    setCities([]);
    setSelectedWarehouse('');
    setWarehouses([]);
    if (deliveryType !== 'courier') loadWarehouses(city.DeliveryCity || city.Ref, deliveryType);
    notifyParent(city, '', address, deliveryType);
  }

  async function loadWarehouses(ref, type) {
    try {
      const categoryOfWarehouse = type === 'parcel' ? 'Postomat' : '';
      const url = `/api/novaposhta/warehouses?cityRef=${encodeURIComponent(ref)}${categoryOfWarehouse ? `&type=${categoryOfWarehouse}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setWarehouses(data.warehouses || []);
    } catch {}
  }

  function selectWarehouse(e) {
    setSelectedWarehouse(e.target.value);
    notifyParent(selectedCity, e.target.value, address, deliveryType);
  }

  function notifyParent(city, warehouse, addr, type) {
    const cityName = city?.Present || city?.MainDescription || cityQuery;
    let warehouseStr = warehouse;
    if (type === 'courier') warehouseStr = addr;
    onChange?.({ city: cityName, warehouse: warehouseStr, deliveryType: type });
  }

  function changeDeliveryType(type) {
    setDeliveryType(type);
    setSelectedWarehouse('');
    setWarehouses([]);
    if (selectedCity && type !== 'courier') {
      loadWarehouses(selectedCity.DeliveryCity || selectedCity.Ref, type);
    }
    notifyParent(selectedCity, '', address, type);
  }

  const noApiKey = cities.length === 0 && cityQuery.length >= 2 && !selectedCity;

  return (
    <div>
      {/* Тип доставки */}
      <div style={{ marginBottom: 14 }}>
        {DELIVERY_TYPES.map(opt => (
          <div
            key={opt.id}
            onClick={() => changeDeliveryType(opt.id)}
            style={{ ...s.radioRow, ...(deliveryType === opt.id ? s.radioRowActive : {}) }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `2px solid ${deliveryType === opt.id ? '#1a1a1a' : '#ccc'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {deliveryType === opt.id && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a1a1a' }} />
              )}
            </div>
            <span style={{ fontWeight: deliveryType === opt.id ? 700 : 400 }}>{opt.label}</span>
          </div>
        ))}
      </div>

      {/* Терміни */}
      <div style={s.info}>
        🕐 До 14:00 — відправка того ж дня · Після 14:00 — наступного робочого дня<br />
        Сб до 12:00 — відправка в суботу · Нд — відправок немає
      </div>

      {/* Місто */}
      <div style={{ position: 'relative' }}>
        <label style={s.label}>Місто</label>
        <input
          ref={cityRef}
          type="text"
          value={cityQuery}
          onChange={e => { setCityQuery(e.target.value); setSelectedCity(null); }}
          onFocus={() => setCityFocused(true)}
          onBlur={() => setTimeout(() => setCityFocused(false), 150)}
          placeholder="Почніть вводити назву міста..."
          autoComplete="off"
          style={{ ...s.input, ...(cityFocused ? s.inputFocus : {}) }}
        />
        {cities.length > 0 && cityFocused && (
          <div style={s.dropdown}>
            {cities.map((city, i) => (
              <div
                key={city.Ref || i}
                style={s.dropdownItem}
                onMouseDown={() => selectCity(city)}
                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                {city.Present || city.MainDescription}
              </div>
            ))}
          </div>
        )}
        {noApiKey && (
          <p style={s.hint}>
            Автопідказка недоступна — введіть місто і відділення вручну в полі "Коментар" нижче.
          </p>
        )}
      </div>

      {/* Відділення / поштомат */}
      {deliveryType !== 'courier' && (
        <div>
          <label style={s.label}>
            {deliveryType === 'parcel' ? 'Поштомат' : 'Відділення / поштомат'}
          </label>
          {warehouses.length > 0 ? (
            <select
              value={selectedWarehouse}
              onChange={selectWarehouse}
              style={{ ...s.input, marginBottom: 0 }}
            >
              <option value="">Оберіть відділення</option>
              {warehouses.map(w => (
                <option key={w.Ref} value={w.Description}>{w.Description}</option>
              ))}
            </select>
          ) : selectedCity ? (
            <input
              type="text"
              placeholder="Номер відділення або поштомату"
              value={selectedWarehouse}
              onChange={e => {
                setSelectedWarehouse(e.target.value);
                notifyParent(selectedCity, e.target.value, address, deliveryType);
              }}
              style={{ ...s.input, marginBottom: 0 }}
            />
          ) : (
            <input
              type="text"
              placeholder="Спочатку оберіть місто"
              disabled
              style={{ ...s.input, marginBottom: 0, background: '#f5f5f5', color: '#aaa' }}
            />
          )}
        </div>
      )}

      {/* Адреса для кур'єра */}
      {deliveryType === 'courier' && (
        <div>
          <label style={s.label}>Адреса доставки</label>
          <input
            type="text"
            placeholder="Вулиця, будинок, квартира"
            value={address}
            onChange={e => {
              setAddress(e.target.value);
              notifyParent(selectedCity, '', e.target.value, deliveryType);
            }}
            style={{ ...s.input, marginBottom: 0 }}
          />
        </div>
      )}
    </div>
  );
}
