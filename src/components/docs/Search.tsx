import { useState } from 'react';
import Link from 'next/link';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search docs..."
          className="border p-2 w-full rounded"
        />
      </form>

      {loading && <p className="mt-2 text-sm text-gray-500">Searching...</p>}

      <ul className="mt-4 space-y-3">
        {results.map(r => (
          <li key={r.id} className="border p-2 rounded">
            <Link href={`/docs/${r.document.slug}`}>
              <strong>{r.document.title}</strong>
            </Link>
            <p className="text-sm text-gray-600 line-clamp-2">
              {r.document.content.slice(0, 120)}...
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
