/**
 * =====================================================================
 * ЦЕНТРАЛЬНИЙ ФАЙЛ ДАНИХ
 * =====================================================================
 * ЧИТАННЯ (products/categories/models): напряму з Google Таблиці через
 * публічний CSV-експорт (gviz/tq). Це в обхід Apps Script doGet, який
 * зі стабільно невідомої причини повертав порожній масив categories,
 * попри те що дані в таблиці коректні. CSV-читання не залежить від
 * стану/деплою Apps Script і працює доти, доки таблиця відкрита для
 * перегляду за посиланням ("Усі, хто має посилання" → Читач).
 *
 * ЗАПИС (адмінка: збереження/видалення товару, збереження замовлення):
 * як і раніше йде через SHEET_API_URL (Apps Script doPost) — це не
 * змінилось.
 *
 * Структура таблиці (4 вкладки):
 *   Products   — id, name, sku, brand, price, cat, model, inStock,
 *                emoji, img, desc, oldPrice, features, top, createdAt
 *   Categories — id, label, icon, parent
 *   Models     — id, name, brand, emoji, img
 *   Orders     — замовлення (пишеться окремо через saveOrder)
 * =====================================================================
 */

const SHEET_API_URL = process.env.SHEET_API_URL || 'https://script.google.com/macros/s/ВАШ_ID/exec';
const SHEET_ID = process.env.SHEET_ID || '1AbKN0l43knJmUH_0jBvmKz1P1-HUwjz5JDyZ-_IsKOQ';
const REVALIDATE_SECONDS = 300; // 5 хвилин

export function slugify(text) {
  if (!text) return '';
  const map = {
    а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ie',ж:'zh',з:'z',и:'y',
    і:'i',ї:'i',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',
    т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ь:'',ю:'iu',я:'ia'
  };
  return String(text)
    .toLowerCase()
    .split('')
    .map((ch) => map[ch] !== undefined ? map[ch] : ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Google Sheets віддає inStock/top як текст "TRUE"/"FALSE" або як boolean.
function toBool(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toUpperCase() === 'TRUE';
  return Boolean(value);
}

/**
 * Мінімальний, але коректний CSV-парсер: підтримує коми всередині
 * лапок, екрановані подвійні лапки ("") та переноси рядків усередині
 * поля — усе це реально трапляється в описах товарів.
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\r') { /* ignore, \n handles the break */ }
      else if (ch === '\n') { row.push(field); field = ''; rows.push(row); row = []; }
      else { field += ch; }
    }
  }
  // останнє поле/рядок, якщо файл не закінчується переносом рядка
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }

  return rows.filter((r) => r.length > 0 && !(r.length === 1 && r[0] === ''));
}

function rowsToObjects(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue; // порожній id — пропускаємо рядок
    const obj = {};
    for (let j = 0; j < headers.length; j++) obj[headers[j]] = r[j] !== undefined ? r[j] : '';
    out.push(obj);
  }
  return out;
}

/**
 * Завантажує один аркуш таблиці як масив об'єктів через публічний
 * gviz CSV-експорт. Next.js кешує цей fetch на REVALIDATE_SECONDS.
 */
async function fetchSheetTab(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let res;
    try {
      res = await fetch(url, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!res.ok) throw new Error(`Не вдалося завантажити аркуш "${sheetName}" (${res.status})`);
    const text = await res.text();
    return rowsToObjects(parseCsv(text));
  } catch (err) {
    console.error(`Помилка завантаження аркуша "${sheetName}" із Google Sheets:`, err);
    return [];
  }
}

async function fetchAllSheets() {
  const [products, categories, models] = await Promise.all([
    fetchSheetTab('Products'),
    fetchSheetTab('Categories'),
    fetchSheetTab('Models'),
  ]);
  return { products, categories, models };
}

function buildCategoryMap(categories) {
  const map = new Map();
  for (const c of categories) {
    const id = c.id || c.Id || c.ID;
    if (!id) continue;
    map.set(id, {
      id,
      label: c.label || c.Label || id,
      icon: c.icon || c.Icon || '',
      parent: c.parent || c.Parent || '',
    });
  }
  return map;
}

function buildModelMap(models) {
  const map = new Map();
  for (const m of models) {
    const id = m.id || m.Id || m.ID;
    if (!id) continue;
    const name = m.name || m.Name || id;
    const brand = m.brand || m.Brand || '';
    map.set(id, {
      id,
      name,
      brand,
      emoji: m.emoji || '',
      image: m.img || m.image || '',
      slug: slugify(`${brand}-${name}`) || id,
    });
  }
  return map;
}

function normalizeProduct(row, categoryMap, modelMap) {
  const name = row.name || '';
  const sku = row.sku || '';
  const brand = row.brand || '';
  const catId = row.cat || '';
  const modelId = row.model || '';

  const categoryInfo = categoryMap.get(catId);
  const modelInfo = modelMap.get(modelId);

  const slug = row.slug || slugify(`${brand}-${sku || name}`);

  return {
    id: row.id,
    sku,
    name,
    brand,
    brandSlug: slugify(brand),
    category: categoryInfo?.label || catId,
    categorySlug: catId,
    categoryIcon: categoryInfo?.icon || '',
    model: modelInfo?.name || '',
    modelSlug: modelInfo?.slug || (modelId ? slugify(modelId) : ''),
    modelId,
    price: Number(row.price) || 0,
    oldPrice: Number(row.oldPrice) || 0,
    image: row.img || '',
    description: row.desc || '',
    inStock: toBool(row.inStock),
    top: toBool(row.top),
    emoji: row.emoji || '',
    slug,
    seoTitle: row.seoTitle || '',
    seoDescription: row.seoDescription || '',
    h1: row.h1 || '',
    features: row.features ?? '',
    createdAt: row.createdAt ?? '',
  };
}

export function generateSeo(product) {
  const title = product.seoTitle || `${product.name} — купити в Beauty Parts`;
  const description =
    product.seoDescription ||
    product.description?.slice(0, 155) ||
    `${product.name} для машинок для стрижки ${product.brand}. Купити з доставкою по Україні.`;
  const h1 = product.h1 || product.name;
  return { title, description, h1 };
}

export async function getAllProducts() {
  const { products, categories, models } = await fetchAllSheets();
  const categoryMap = buildCategoryMap(categories);
  const modelMap = buildModelMap(models);
  return products.map((row) => normalizeProduct(row, categoryMap, modelMap));
}

export async function getAllCategories() {
  const { categories, products } = await fetchAllSheets();

  if (categories && categories.length > 0) {
    const map = buildCategoryMap(categories);
    return Array.from(map.values()).map((c) => ({
      name: c.label, slug: c.id, icon: c.icon, parent: c.parent,
    }));
  }

  const CATEGORY_MAP = {
    'blades': { name: 'Ножі та ножові блоки', icon: '🔪' },
    'attachments': { name: 'Насадки та гребені', icon: '📎' },
    'motors': { name: 'Двигуни та плати', icon: '⚙️' },
    'batteries': { name: 'Акумулятори', icon: '⚡' },
    'dryer': { name: 'Фени', icon: '💨' },
    'manicure': { name: 'Манікюр', icon: '💅' },
    'grooming': { name: 'Грумінг', icon: '🐾' },
    'care': { name: 'Масла та спреї', icon: '💧' },
    'housing': { name: 'Корпуси та деталі', icon: '🏠' },
    'sprays': { name: 'Спреї', icon: '🧴' },
    'oils': { name: 'Масла', icon: '🫙' },
  };

  const seen = new Set();
  const result = [];
  for (const p of products) {
    const catId = p.cat || '';
    if (!catId || seen.has(catId)) continue;
    seen.add(catId);
    const known = CATEGORY_MAP[catId];
    result.push({ name: known?.name || catId, slug: catId, icon: known?.icon || '📦', parent: '' });
  }
  for (const [slug, info] of Object.entries(CATEGORY_MAP)) {
    if (!seen.has(slug)) result.push({ name: info.name, slug, icon: info.icon, parent: '' });
  }
  return result;
}

export async function getProductBySlug(slug) {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductsByCategory(categorySlug) {
  const { categories } = await fetchAllSheets();
  const categoryMap = buildCategoryMap(categories);
  const matchSlugs = new Set([categorySlug]);
  for (const c of categoryMap.values()) {
    if (c.parent === categorySlug) matchSlugs.add(c.id);
  }
  const products = await getAllProducts();
  return products.filter((p) => matchSlugs.has(p.categorySlug));
}

export async function getProductsByBrand(brandSlug) {
  const products = await getAllProducts();
  return products.filter((p) => p.brandSlug === brandSlug);
}

export async function getProductsByModel(modelSlug) {
  const products = await getAllProducts();
  return products.filter((p) => p.modelSlug === modelSlug);
}

export async function getCategoryTree() {
  const flat = await getAllCategories();
  const topLevel = flat.filter((c) => !c.parent);
  return topLevel.map((c) => ({
    ...c,
    children: flat.filter((child) => child.parent === c.slug),
  }));
}

export async function getAllModels() {
  const { models } = await fetchAllSheets();
  const map = buildModelMap(models);
  return Array.from(map.values()).map((m) => ({ id: m.id, name: m.name, slug: m.slug, brand: m.brand, image: m.image }));
}

export async function getAllBrands() {
  const products = await getAllProducts();
  const map = new Map();
  for (const p of products) {
    if (p.brand && p.brand.trim().toLowerCase() === 'універсальний') continue;
    if (p.brand && !map.has(p.brandSlug)) {
      map.set(p.brandSlug, { name: p.brand, slug: p.brandSlug });
    }
  }
  return Array.from(map.values());
}

export async function searchProducts(filters = {}) {
  const { q, category, brand, model } = filters;
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  let categorySlugs = null;
  if (category) {
    categorySlugs = new Set([category]);
    for (const c of categories) {
      if (c.parent === category) categorySlugs.add(c.slug);
    }
  }

  return products.filter((p) => {
    if (categorySlugs && !categorySlugs.has(p.categorySlug)) return false;
    if (brand && p.brandSlug !== brand) return false;
    if (model && p.modelSlug !== model) return false;
    if (q) {
      const needle = q.toLowerCase();
      const haystack = `${p.name} ${p.brand} ${p.sku} ${p.model} ${p.category}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export const SITE_URL = process.env.SITE_URL || 'https://beautyparts.com.ua';

/**
 * =====================================================================
 * ЗАПИС ДАНИХ (адмінка) — без змін, як і раніше через Apps Script.
 * =====================================================================
 */
function generateProductId() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function toProductRow(product) {
  return {
    id: product.id || generateProductId(),
    name: product.name || '',
    sku: product.sku || '',
    brand: product.brand || '',
    price: Number(product.price) || 0,
    oldPrice: Number(product.oldPrice) || 0,
    cat: product.cat || product.categorySlug || '',
    model: product.model || product.modelId || '',
    inStock: Boolean(product.inStock),
    top: Boolean(product.top),
    emoji: product.emoji || '',
    img: product.img || product.image || '',
    desc: product.desc || product.description || '',
    slug: product.slug || '',
    seoTitle: product.seoTitle || '',
    seoDescription: product.seoDescription || '',
    h1: product.h1 || '',
    features: product.features || '',
    createdAt: product.createdAt || new Date().toISOString(),
  };
}

export async function saveProduct(product) {
  const row = toProductRow(product);
  const res = await fetch(SHEET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Products', action: 'save', row }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Не вдалося зберегти товар (${res.status})`);
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(SHEET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Products', action: 'delete', row: { id } }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Не вдалося видалити товар (${res.status})`);
  return res.json();
}

/**
 * =====================================================================
 * ЗАПИС ЗАМОВЛЕНЬ — без змін.
 * =====================================================================
 */
function orderToRow(order) {
  return {
    id: generateProductId(),
    num: Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    name: order.name || '',
    phone: order.phone || '',
    email: order.email || '',
    np: `${order.city || ''}, ${order.warehouse || ''}`,
    delivery: 'Нова Пошта',
    payment: order.paymentMethod || '',
    items: JSON.stringify(order.items || []),
    total: order.totalPrice || 0,
    status: 'нове',
    comment: order.comment || '',
  };
}

export async function saveOrder(order) {
  const row = orderToRow(order);
  const res = await fetch(SHEET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Orders', action: 'save', row }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Не вдалося зберегти замовлення (${res.status})`);
  return res.json();
    }
