//#region src/lib/search.ts
/**
* Restricts records to the active scope. Records without a scope id (from
* single-scope indexes or older caches) always pass.
*/
function filterRecordsByScope(records, context) {
	if (!context?.scopeId) return records;
	return records.filter((record) => !record.scopeId || record.scopeId === context.scopeId);
}
const SNIPPET_RADIUS = 60;
function makeSnippet(text, index, length) {
	const start = Math.max(0, index - SNIPPET_RADIUS);
	const end = Math.min(text.length, index + length + SNIPPET_RADIUS);
	return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}
function searchIndex(records, query, limit = 10) {
	const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
	if (!terms.length) return [];
	const results = [];
	for (const record of records) {
		const page = record.page.toLowerCase();
		const heading = (record.heading || "").toLowerCase();
		const text = record.text.toLowerCase();
		let score = 0;
		let snippetAt = -1;
		let snippetLength = 0;
		let matched = true;
		for (const term of terms) if (page.includes(term)) score += page === term ? 40 : 20;
		else if (heading.includes(term)) score += heading === term ? 30 : 15;
		else {
			const index = text.indexOf(term);
			if (index === -1) {
				matched = false;
				break;
			}
			score += 5;
			if (snippetAt === -1) {
				snippetAt = index;
				snippetLength = term.length;
			}
		}
		if (!matched || !score) continue;
		results.push({
			url: record.id ? `${record.url}#${record.id}` : record.url,
			page: record.page,
			heading: record.heading,
			snippet: snippetAt >= 0 ? makeSnippet(record.text, snippetAt, snippetLength) : void 0,
			score
		});
	}
	return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

//#endregion
//#region src/lib/search/providers/local.ts
/** Built-in provider backed by the section index generated during the build. */
function createLocalSearchProvider(_options = {}) {
	let records = null;
	return { async search(query, limit, context) {
		records ||= import("@/lib/search-index.generated").then((module) => module.SEARCH_INDEX);
		return searchIndex(filterRecordsByScope(await records, context), query, limit);
	} };
}

//#endregion
export { createLocalSearchProvider };