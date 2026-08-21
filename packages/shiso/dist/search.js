//#region src/lib/search/provider.ts
const factories = /* @__PURE__ */ new Map();
const BUILTIN_PROVIDERS = /* @__PURE__ */ new Set(["local", "pagefind"]);
function normalizeProviderId(id) {
	return id.trim().toLowerCase();
}
/**
* Registers a runtime search provider. Call this before rendering the app.
* The returned cleanup function only removes this exact registration.
*/
function registerSearchProvider(id, factory) {
	const providerId = normalizeProviderId(id);
	if (!providerId || BUILTIN_PROVIDERS.has(providerId)) throw new Error("Search provider ids must be non-empty and cannot replace the built-in providers (\"local\", \"pagefind\").");
	factories.set(providerId, factory);
	return () => {
		if (factories.get(providerId) === factory) factories.delete(providerId);
	};
}
async function createLocalProvider(options) {
	const { createLocalSearchProvider } = await import("./chunks/local.js");
	return createLocalSearchProvider(options);
}
/** Resolves a configured provider, falling back to local for unknown ids. */
async function resolveSearchProvider(id, options = {}) {
	const requestedId = normalizeProviderId(id) || "local";
	if (requestedId === "local") return {
		provider: await createLocalProvider(options),
		providerId: "local",
		fellBack: false
	};
	if (requestedId === "pagefind") {
		const { createPagefindSearchProvider } = await import("./chunks/pagefind.js");
		return {
			provider: createPagefindSearchProvider(options),
			providerId: "pagefind",
			fellBack: false
		};
	}
	const factory = factories.get(requestedId);
	if (factory) return {
		provider: await factory(options),
		providerId: requestedId,
		fellBack: false
	};
	return {
		provider: await createLocalProvider({}),
		providerId: "local",
		fellBack: true
	};
}

//#endregion
export { registerSearchProvider, resolveSearchProvider };