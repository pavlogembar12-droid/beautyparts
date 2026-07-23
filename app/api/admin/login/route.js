import { NextResponse } from 'next/server';
import { checkPassword, getExpectedSessionValue, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  const { password } = await request.json();

  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false, error: 'Невірний пароль' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, getExpectedSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 днів
    path: '/',
  });
  return response;
}
