'use client';

import { useState, useEffect } from 'react';

export default function NovaPoshtaSelect({ onChange }) {
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  // Пошук міст під час введення (з невеликою затримкою, щоб не бомбити API)
  useEffect(() => {
    if (cityQuery.length < 2) {
      setCities([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/novaposhta/cities?q=${encodeURIComponent(cityQuery)}`);
        const data = await res.json();
        setCities(data.cities || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [cityQuery]);

  function handleSelectCity(city) {
    setSelectedCity(city);
    setCityQuery(city.Present || city.MainDescription);
    setCities([]);
    setWarehouses([]);
    setSelectedWarehouse('');
    loadWarehouses(city.DeliveryCity || city.Ref);
  }

  async function loadWarehouses(cityRef) {
    try {
      const res = await fetch(`/api/novaposhta/warehouses?cityRef=${encodeURIComponent(cityRef)}`);
      const data = await res.json();
      setWarehouses(data.warehouses || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSelectWarehouse(e) {
    const value = e.target.value;
    setSelectedWarehouse(value);
    onChange?.({
      city: selectedCity?.Present || cityQuery,
      warehouse: value,
    });
  }

  return (
    <div>
      <label>
        Місто
        <input
          type="text"
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value);
            setSelectedCity(null);
          }}
          placeholder="Почніть вводити назву міста..."
          autoComplete="off"
          required
        />
      </label>

      {cities.length > 0 && (
        <ul>
          {cities.map((city) => (
            <li key={city.Ref || city.DeliveryCity}>
              <button type="button" onClick={() => handleSelectCity(city)}>
                {city.Present || city.MainDescription}
              </button>
            </li>
          ))}
        </ul>
      )}

      {warehouses.length > 0 && (
        <label>
          Відділення / поштомат
          <select value={selectedWarehouse} onChange={handleSelectWarehouse} required>
            <option value="">Оберіть відділення</option>
            {warehouses.map((w) => (
              <option key={w.Ref} value={w.Description}>
                {w.Description}
              </option>
            ))}
          </select>
        </label>
      )}

      {/*
        Якщо NOVA_POSHTA_API_KEY не задано на сервері — списки будуть
        порожні. Даємо клієнту можливість ввести адресу вручну текстом,
        щоб форма не була заблокована повністю.
      */}
      {selectedCity === null && cities.length === 0 && (
        <p style={{ fontSize: '0.85em', color: '#666' }}>
          Якщо автопідказка не з'являється — впишіть місто і номер відділення
          вручну в полі "Коментар до замовлення" нижче.
        </p>
      )}
    </div>
  );
}
