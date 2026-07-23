import { NextResponse } from 'next/server';
import { saveOrder } from '@/lib/sheets';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

function formatOrderMessage(order) {
  const itemsList = order.items
    .map((i) => `— ${i.name} × ${i.quantity} = ${i.price * i.quantity} грн`)
    .join('\n');

  return (
    `🛒 Нове замовлення з сайту\n\n` +
    `Ім'я: ${order.name}\n` +
    `Телефон: ${order.phone}\n` +
    `Місто: ${order.city}\n` +
    `Відділення: ${order.warehouse}\n` +
    `Оплата: ${order.paymentMethod}\n` +
    (order.comment ? `Коментар: ${order.comment}\n` : '') +
    `\nТовари:\n${itemsList}\n\n` +
    `Разом: ${order.totalPrice} грн`
  );
}

async function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не задано — сповіщення не надіслано.');
    return false;
  }
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  });
  return res.ok;
}

// Запис у Google Таблицю (аркуш Orders) через lib/sheets.js — той самий
// SHEET_API_URL, що й товари, окремий скрипт клієнтці не потрібен.
async function saveOrderToSheet(order) {
  try {
    await saveOrder(order);
    return true;
  } catch (err) {
    console.error('Помилка запису замовлення в Google Таблицю:', err);
    return false;
  }
}

export async function POST(request) {
  const order = await request.json();

  // Мінімальна валідація на сервері (не покладаємось лише на required у формі)
  if (!order?.name || !order?.phone || !order?.items?.length) {
    return NextResponse.json({ ok: false, error: 'Не вистачає обов’язкових полів' }, { status: 400 });
  }

  const message = formatOrderMessage(order);

  const [telegramOk, sheetOk] = await Promise.all([
    sendTelegramMessage(message),
    saveOrderToSheet(order),
  ]);

  return NextResponse.json({ ok: telegramOk || sheetOk, telegramOk, sheetOk });
}
