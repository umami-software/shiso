import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { create, insert } from '@orama/orama';
import recursive from 'recursive-readdir';

let db: any | null = null;

export async function getDB(dir: string) {
  if (db) return db;

  db = create({
    schema: {
      id: 'string',
      title: 'string',
      content: 'string',
      slug: 'string',
    },
  });

  console.log({ dir });

  const files = await recursive(dir);

  console.log({ files });

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);

    const title = data.title || file.replace(/\.mdx?$/, '').replace(/-/g, ' ');
    const slug = file.replace(/\.mdx?$/, '');

    insert(db, {
      id: slug,
      title,
      content,
      slug,
    });
  }

  console.log({ files, db });

  return db;
}
