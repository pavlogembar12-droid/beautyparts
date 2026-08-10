import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo');
    const model = formData.get('model') || '';
    const contact = formData.get('contact') || '';

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({ ok: false, error: 'Telegram не налаштований' }, { status: 500 });
    }

    const caption = [
      '📷 *Новий запит на підбір за фото*',
      '',
      model ? `🔧 Модель машинки: ${model}` : '',
      contact ? `👤 Контакт: ${contact}` : '',
      '',
      '_Запит з сайту beautyparts.com.ua_',
    ].filter(Boolean).join('\n');

    if (photo && photo.size > 0) {
      const tgFormData = new FormData();
      tgFormData.append('chat_id', TELEGRAM_CHAT_ID);
      tgFormData.append('photo', photo, photo.name || 'photo.jpg');
      tgFormData.append('caption', caption);
      tgFormData.append('parse_mode', 'Markdown');

      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        { method: 'POST', body: tgFormData }
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.description || 'Помилка Telegram sendPhoto');
    } else {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: caption,
            parse_mode: 'Markdown',
          }),
        }
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.description || 'Помилка Telegram sendMessage');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Помилка photo-select:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
