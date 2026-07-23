/**
 * =====================================================================
 * НОВА ПОШТА — робота з офіційним API
 * =====================================================================
 * Документація: https://developers.novaposhta.ua/
 * Ключ API (NOVA_POSHTA_API_KEY) МАЄ зберігатися лише в .env.local і
 * НІКОЛИ не потрапляти в код, що виконується в браузері. Саме тому ці
 * функції викликаються тільки з app/api/novaposhta/*/route.js
 * (серверні роути), а клієнтський компонент звертається до /api/..., а
 * не напряму до api.novaposhta.com.
 * =====================================================================
 */

const NP_API_URL = 'https://api.novaposhta.ua/v2.0/json/';
const API_KEY = process.env.NOVA_POSHTA_API_KEY || '';

async function callNovaPoshta(modelName, calledMethod, methodProperties) {
  if (!API_KEY) {
    // Немає ключа — не ламаємо сайт, просто повертаємо порожній список.
    // Клієнт зможе ввести місто/відділення вручну текстом (fallback нижче).
    console.warn('NOVA_POSHTA_API_KEY не задано в .env.local — автопідказки вимкнено.');
    return [];
  }

  const res = await fetch(NP_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: API_KEY,
      modelName,
      calledMethod,
      methodProperties,
    }),
    cache: 'no-store',
  });

  const data = await res.json();
  return data.data || [];
}

/**
 * Пошук міста за назвою (для автопідказки при введенні).
 */
export async function searchCities(query) {
  if (!query || query.length < 2) return [];
  const results = await callNovaPoshta('Address', 'searchSettlements', {
    CityName: query,
    Limit: 10,
  });
  // Структура відповіді Нової Пошти для цього методу — масив з одним
  // об'єктом { Addresses: [...] }
  return results[0]?.Addresses || [];
}

/**
 * Список відділень/поштоматів у конкретному місті (за Ref міста).
 */
export async function getWarehouses(cityRef) {
  if (!cityRef) return [];
  return callNovaPoshta('AddressGeneral', 'getWarehouses', {
    CityRef: cityRef,
    Limit: 200,
  });
}
