import path from 'node:path';
import { NextResponse } from 'next/server';
import { getDB } from '@/lib/orama';
import { search } from '@orama/orama';
import { loadMdxFiles } from '@/lib/content';

export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  const data = await loadMdxFiles(path.resolve(`content`, type), type);

  const db = await getDB(data);

  const results = await search(db, {
    term: q,
    properties: ['title', 'content'],
    limit: 10,
  });

  return NextResponse.json(results.hits);
}
