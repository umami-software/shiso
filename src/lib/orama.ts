import { create, insert } from '@orama/orama';
import { Content } from '@/lib/types';

let db: any | null = null;

export async function getDB(data: Content[]) {
  //if (db) return db;

  db = create({
    schema: {
      id: 'string',
      title: 'string',
      content: 'string',
      slug: 'string',
    },
  });

  for (const row of data) {
    const { meta = {}, content, slug } = row;

    const { title } = meta;

    insert(db, {
      id: slug,
      title,
      content,
      slug,
    });
  }

  return db;
}
