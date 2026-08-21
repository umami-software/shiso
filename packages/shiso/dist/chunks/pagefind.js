//#region src/lib/search/providers/pagefind.ts
const DEFAULT_LIMIT = 10;
/**
* Sanitizes a Pagefind excerpt: keeps the `<mark>` highlight tags (rendered
* as highlights by the search dialog, never as raw HTML), strips every other
* tag, and decodes basic HTML entities.
*/
function sanitizePagefindExcerpt(excerpt) {
	return excerpt.replace(/<(?!\/?mark>)[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&").trim();
}
/** Converts a Pagefind result URL into a router-relative path: strips a
* trailing `/index.html` and trailing slash while preserving `#anchor`. */
function normalizePagefindUrl(url) {
	const hashIndex = url.indexOf("#");
	const hash = hashIndex === -1 ? "" : url.slice(hashIndex);
	let pathname = hashIndex === -1 ? url : url.slice(0, hashIndex);
	pathname = pathname.replace(/\/index\.html$/, "/");
	if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "") || "/";
	return `${pathname}${hash}`;
}
/** Maps loaded Pagefind fragments to `SearchResult`s. Each sub-result (a
* heading-bounded section) becomes its own result; duplicate URLs are
* dropped because the search dialog keys items by URL. */
function mapPagefindResults(fragments, limit) {
	const results = [];
	const seen = /* @__PURE__ */ new Set();
	for (const { fragment, score } of fragments) {
		const page = fragment.meta?.title || fragment.url;
		const subResults = fragment.sub_results?.length ? fragment.sub_results : [{
			url: fragment.url,
			excerpt: fragment.excerpt
		}];
		for (const subResult of subResults) {
			const url = normalizePagefindUrl(subResult.url);
			if (seen.has(url)) continue;
			seen.add(url);
			const heading = url.includes("#") && subResult.title && subResult.title !== page ? subResult.title : void 0;
			const excerpt = subResult.excerpt || fragment.excerpt;
			results.push({
				url,
				page,
				heading,
				snippet: excerpt ? sanitizePagefindExcerpt(excerpt) : void 0,
				score: score ?? 0
			});
			if (results.length >= limit) return results;
		}
	}
	return results;
}
/**
* Built-in provider backed by a Pagefind index generated during `shiso build`.
* When the Pagefind bundle is unavailable (for example in dev, where no
* prerendered HTML exists), it falls back to the local provider.
*/
function createPagefindSearchProvider(options = {}) {
	let backend = null;
	async function loadBackend() {
		const base = (import.meta.env?.BASE_URL || "/").trim().replace(/\/+$/, "");
		try {
			const api = await import(
				/* @vite-ignore */
				`${base}/pagefind/pagefind.js`
);
			const ranking = options.ranking;
			await api.options({
				baseUrl: "/",
				...ranking && typeof ranking === "object" ? { ranking } : {}
			});
			await api.init();
			return {
				kind: "pagefind",
				api
			};
		} catch (error) {
			console.warn("[shiso] Pagefind bundle not found — falling back to local search. This is expected in dev; run \"shiso build\" to generate the Pagefind index.", error);
			const { createLocalSearchProvider } = await import("./local.js");
			return {
				kind: "local",
				provider: createLocalSearchProvider({})
			};
		}
	}
	return { async search(query, limit = DEFAULT_LIMIT, context) {
		backend ||= loadBackend();
		const resolved = await backend;
		if (resolved.kind === "local") return resolved.provider.search(query, limit, context);
		const filters = context?.scopeId && context.scopeId !== "default" ? { filters: { scope: context.scopeId } } : void 0;
		const response = await resolved.api.search(query, filters);
		const fragments = [];
		for (const result of response.results.slice(0, limit)) fragments.push({
			fragment: await result.data(),
			score: result.score
		});
		return mapPagefindResults(fragments, limit);
	} };
}

//#endregion
export { createPagefindSearchProvider };