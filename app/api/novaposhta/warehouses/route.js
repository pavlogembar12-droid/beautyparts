import { NextResponse } from 'next/server';
import { getWarehouses } from '@/lib/novaposhta';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cityRef = searchParams.get('cityRef') || '';

  try {
    const warehouses = await getWarehouses(cityRef);
    return NextResponse.json({ warehouses });
  } catch (err) {
    console.error('Помилка завантаження відділень Нової Пошти:', err);
    return NextResponse.json({ warehouses: [], error: true });
  }
}
