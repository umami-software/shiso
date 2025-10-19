import path from 'path';
import { NextResponse } from 'next/server';
import { getDB } from '@/lib/orama';
import { search } from '@orama/orama';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const db = await getDB(`src/content`);

  const results = await search(db, {
    term: q,
    properties: ['title', 'content'],
    limit: 10,
  });

  return NextResponse.json(results.hits);
}
