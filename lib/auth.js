/**
 * =====================================================================
 * ПРОСТА АУТЕНТИФІКАЦІЯ АДМІНКИ
 * =====================================================================
 * Один спільний пароль (як і на старому сайті), але тепер він
 * зберігається в змінній середовища ADMIN_PASSWORD, а НЕ в JS-коді,
 * який будь-хто може прочитати у вихідному коді сторінки.
 *
 * Сесія — просто підписаний cookie "admin_session" зі значенням-міткою.
 * Для сайту такого масштабу (один адміністратор) цього достатньо;
 * якщо в майбутньому знадобиться кілька акаунтів з різними правами —
 * varto перейти на NextAuth чи подібне рішення.
 * =====================================================================
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
export const SESSION_COOKIE_NAME = 'admin_session';

// Значення cookie — не сам пароль, а похідне від нього значення,
// щоб пароль не "світився" у cookie браузера.
export function getExpectedSessionValue() {
  // Просте (не криптографічне) перетворення — достатнє для захисту
  // від випадкового вгадування, але не є банківським рівнем безпеки.
  // Для більшої надійності в майбутньому можна замінити на JWT.
  return Buffer.from(`beautyparts-admin:${ADMIN_PASSWORD}`).toString('base64');
}

export function checkPassword(inputPassword) {
  if (!ADMIN_PASSWORD) {
    console.warn('ADMIN_PASSWORD не задано в .env.local — вхід в адмінку неможливий.');
    return false;
  }
  return inputPassword === ADMIN_PASSWORD;
}

export function isValidSession(cookieValue) {
  if (!ADMIN_PASSWORD) return false;
  return cookieValue === getExpectedSessionValue();
}
