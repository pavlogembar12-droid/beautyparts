import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, isValidSession } from '@/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Сторінку логіну і сам API логіну не захищаємо — інакше буде замкнене коло
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!isValidSession(cookie)) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ ok: false, error: 'Не авторизовано' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
