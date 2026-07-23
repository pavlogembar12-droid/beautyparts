import { NextResponse } from 'next/server';
import { searchCities } from '@/lib/novaposhta';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  try {
    const cities = await searchCities(q);
    return NextResponse.json({ cities });
  } catch (err) {
    console.error('Помилка пошуку міст Нової Пошти:', err);
    return NextResponse.json({ cities: [], error: true });
  }
}
