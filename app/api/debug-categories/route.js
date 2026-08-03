import { getAllCategories } from '@/lib/sheets';

export async function GET() {
  const categories = await getAllCategories();
  return Response.json({ categories, count: categories.length });
}
