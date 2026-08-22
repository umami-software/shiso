import { r as searchIndex, t as filterRecordsByScope } from "./search.js";

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