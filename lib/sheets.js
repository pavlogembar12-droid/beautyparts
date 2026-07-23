/**
 * =====================================================================
 * ЦЕНТРАЛЬНИЙ ФАЙЛ ДАНИХ
 * =====================================================================
 * Підлаштовано під РЕАЛЬНУ структуру таблиці "Liga kra..." (4 вкладки):
 *
 *   Products   — id, name, sku, brand, price, cat, model, inStock,
 *                emoji, img, desc, oldPrice, features, top, createdAt
 *   Categories — id, label, icon      (напр. id="blades", label="ножі та ножові блоки")
 *   Models     — id, name, brand, emoji, img  (напр. id="m17", name="T-Cut")
 *   Orders     — замовлення (не використовується цим файлом, див. app/api/order)
 *
 * Тобто "cat" у товарі — це КОД категорії (напр. "blades"), а не текст.
 * Людський текст лежить у вкладці Categories. Так само "model" у товарі —
 * це КОД моделі (напр. "m17"), а людська назва — у вкладці Models.
 * Цей файл сам об'єднує ці 3 таблиці докупи.
 *
 * ПІДТВЕРДЖЕНО 22.07 реальним кодом Apps Script: один SHEET_API_URL
 * (doGet) повертає JSON { products: [...], models: [...],
 * categories: [...], orders: [...] } — саме це й читає fetchAllSheets()
 * нижче.
 * =====================================================================
 */

const SHEET_API_URL = process.env.SHEET_API_URL || 'https://script.google.com/macros/s/ВАШ_ID/exec';
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

// Google Sheets віддає inStock/top як текст "TRUE"/"FALSE" або як boolean
// залежно від того, як Apps Script це серіалізує — обробляємо обидва варіанти.
function toBool(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toUpperCase() === 'TRUE';
  return Boolean(value);
}

/**
 * Один похід у Google Sheets за всіма трьома довідниками одразу.
 * Next.js кешує цей fetch на REVALIDATE_SECONDS.
 */
async function fetchAllSheets() {
  try {
    const res = await fetch(SHEET_API_URL, { next: { revalidate: REVALIDATE_SECONDS }, redirect: 'follow' });
    if (!res.ok) throw new Error(`Sheet API відповів ${res.status}`);
    const data = await res.json();

    // Гнучко приймаємо кілька можливих форм відповіді:
    const products = data.products || data.Products || (Array.isArray(data) ? data : []) || [];
    const categories = data.categories || data.Categories || [];
    const models = data.models || data.Models || [];

    return { products, categories, models };
  } catch (err) {
    console.error('Помилка завантаження даних із Google Sheets:', err);
    return { products: [], categories: [], models: [] };
  }
}

function buildCategoryMap(categories) {
  const map = new Map();
  for (const c of categories) {
    const id = c.id || c.Id || c.ID;
    if (!id) continue;
    map.set(id, { id, label: c.label || c.Label || id, icon: c.icon || c.Icon || '' });
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
      // "Людський" slug для URL моделі — з бренду й назви, а не з коду "m17"
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

  // Slug сторінки товару: бренд + артикул (sku) — стабільний і унікальний,
  // на відміну від назви, яка може повторюватись у різних товарів.
  const slug = row.slug || slugify(`${brand}-${sku || name}`);

  return {
    id: row.id,
    sku,
    name,
    brand,
    brandSlug: slugify(brand),
    category: categoryInfo?.label || catId,
    categorySlug: catId, // коди категорій (blades, housing...) вже url-безпечні
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
    // SEO-поля — якщо колонок seoTitle/seoDescription/h1 ще немає в таблиці,
    // тут просто буде порожньо, і спрацює автогенерація (generateSeo нижче)
    seoTitle: row.seoTitle || '',
    seoDescription: row.seoDescription || '',
    h1: row.h1 || '',
    // "Прозорі" поля — форма адмінки їх не показує й не редагує, але
    // ПОВИННА повернути назад при збереженні: upsertRow() в Apps
    // Script перезаписує весь рядок цілком, тож без цього passthrough
    // редагування товару стирало б features/createdAt на порожньо.
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

export async function getProductBySlug(slug) {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductsByCategory(categorySlug) {
  const products = await getAllProducts();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getProductsByBrand(brandSlug) {
  const products = await getAllProducts();
  return products.filter((p) => p.brandSlug === brandSlug);
}

export async function getProductsByModel(modelSlug) {
  const products = await getAllProducts();
  return products.filter((p) => p.modelSlug === modelSlug);
}

/**
 * Категорії беремо напряму з вкладки Categories (а не "вгадуємо" з товарів) —
 * так у каталозі показуються навіть категорії, у яких зараз 0 товарів,
 * і з правильною людською назвою + іконкою.
 */
export async function getAllCategories() {
  const { categories } = await fetchAllSheets();
  const map = buildCategoryMap(categories);
  return Array.from(map.values()).map((c) => ({ name: c.label, slug: c.id, icon: c.icon }));
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
    if (p.brand && !map.has(p.brandSlug)) {
      map.set(p.brandSlug, { name: p.brand, slug: p.brandSlug });
    }
  }
  return Array.from(map.values());
}

/**
 * Універсальний пошук/фільтр для сторінки каталогу.
 * filters = { q, category, brand, model } — усі поля необов'язкові.
 */
export async function searchProducts(filters = {}) {
  const { q, category, brand, model } = filters;
  const products = await getAllProducts();

  return products.filter((p) => {
    if (category && p.categorySlug !== category) return false;
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
 * ЗАПИС ДАНИХ (адмінка, Етап 4)
 * =====================================================================
 * ПІДТВЕРДЖЕНО 22.07 з реальним кодом Apps Script (Code.gs, скріншот
 * від користувача). Реальний контракт:
 *
 *   POST { sheet: 'Products', action: 'save', row: { id, name, sku,
 *          brand, cat, model, price, oldPrice, img, desc, inStock,
 *          emoji, top, ... } }
 *   POST { sheet: 'Products', action: 'delete', row: { id: '...' } }
 *
 * (дія 'save' може бути будь-яким рядком, окрім 'delete' — скрипт
 * перевіряє лише `body.action === 'delete'`, інакше робить upsertRow)
 *
 * Пише в те саме SHEET_API_URL, що й читає (doGet і doPost в одному
 * скрипті) — окремого write-URL не існує.
 *
 * ProductForm.js віддає поля у "зручному" вигляді (categorySlug,
 * modelId, image, description) — toProductRow() нижче перекладає їх
 * у реальні назви колонок таблиці (cat, model, img, desc) перед
 * відправкою.
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
    // upsertRow() в Apps Script переписує ВЕСЬ рядок — обов'язково
    // передати ці поля назад, інакше вони обнуляться при редагуванні.
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
 * ЗАПИС ЗАМОВЛЕНЬ (Етап 3, доопрацьовано 22.07)
 * =====================================================================
 * Раніше планувалось, що для збереження замовлень клієнтці потрібен
 * ОКРЕМИЙ Apps Script (ORDERS_API_URL). Тепер, коли реальний Code.gs
 * підтверджено — це зайве: той самий SHEET_API_URL уже вміє писати в
 * БУДЬ-ЯКИЙ аркуш через { sheet, action, row }, включно з Orders.
 * Колонки Orders (підтверджено з createSheet у Code.gs): id, num, date,
 * name, phone, email, np, delivery, payment, items, total, status,
 * comment.
 *
 * ПРИПУЩЕННЯ (не підтверджено): як саме "np" і "delivery" мають бути
 * заповнені — тут "np" = місто+відділення Нової Пошти одним рядком,
 * "delivery" = фіксовано "Нова Пошта". Якщо клієнтка очікує щось інше
 * в цих двох колонках — підправте лише orderToRow() нижче.
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
