import { Cr as Router, Dr as createPath, Or as parsePath, kr as ABSOLUTE_URL_REGEX } from "./chunks/docs.js";
import { a as docsSite, c as getSeo, d as standalonePages, f as getDocModule, g as toAbsoluteUrl, h as BASE_URL, i as docsHomeUrl, l as siteConfig, m as getScopeForPage, n as buildHead, o as getLocaleByPathname, p as getLastModified, r as renderHeadToString, s as getRedirects, t as App, u as siteName } from "./chunks/App.js";
import * as React$1 from "react";
import { jsx } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";

//#region ../../node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/server.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
/**
* A {@link Router | `<Router>`} that may not navigate to any other {@link Location}.
* This is useful on the server where there is no stateful UI.
*
* @public
* @category Declarative Routers
* @mode declarative
* @param props Props
* @param {StaticRouterProps.basename} props.basename n/a
* @param {StaticRouterProps.children} props.children n/a
* @param {StaticRouterProps.location} props.location n/a
* @returns A React element that renders the static {@link Router | `<Router>`}
*/
function StaticRouter({ basename, children, location: locationProp = "/" }) {
	if (typeof locationProp === "string") locationProp = parsePath(locationProp);
	let action = "POP";
	let location = {
		pathname: locationProp.pathname || "/",
		search: locationProp.search || "",
		hash: locationProp.hash || "",
		state: locationProp.state != null ? locationProp.state : null,
		key: locationProp.key || "default",
		mask: void 0
	};
	let staticNavigator = getStatelessNavigator();
	return /* @__PURE__ */ React$1.createElement(Router, {
		basename,
		children,
		location,
		navigationType: action,
		navigator: staticNavigator,
		static: true,
		useTransitions: false
	});
}
function getStatelessNavigator() {
	return {
		createHref,
		encodeLocation,
		push(to) {
			throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
		},
		replace(to) {
			throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
		},
		go(delta) {
			throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
		},
		back() {
			throw new Error("You cannot use navigator.back() on the server because it is a stateless environment.");
		},
		forward() {
			throw new Error("You cannot use navigator.forward() on the server because it is a stateless environment.");
		}
	};
}
function createHref(to) {
	return typeof to === "string" ? to : createPath(to);
}
function encodeLocation(to) {
	let href = typeof to === "string" ? to : createPath(to);
	href = href.replace(/ $/, "%20");
	let encoded = ABSOLUTE_URL_REGEX.test(href) ? new URL(href) : new URL(href, "http://localhost");
	return {
		pathname: encoded.pathname,
		search: encoded.search,
		hash: encoded.hash
	};
}

//#endregion
//#region src/entry-server.tsx
/** Base-relative routes for every scope. The prerenderer prepends the deploy base itself. */
function getRoutes() {
	return [...docsSite.pages.map((page) => page.url), ...standalonePages.map((page) => page.path)];
}
/**
* Source file for every Markdown/MDX page, so the prerenderer can publish raw
* markdown next to each HTML page (used by the contextual menu's copy/view
* options and by AI tools). TSX standalone pages have no raw Markdown copy.
* `filePath` is a module key like "/content/docs/index.mdx", resolved against
* the project root.
*/
function getMarkdownPages() {
	return [...docsSite.pages.map((page) => ({
		route: page.url,
		filePath: page.filePath
	})), ...standalonePages.filter((page) => !page.filePath.endsWith(".tsx")).map((page) => ({
		route: page.path,
		filePath: page.filePath
	}))];
}
/** Navigable Markdown pages used to generate llms.txt and llms-full.txt. */
function getLlmsPages() {
	const { indexing } = getSeo();
	const pages = [];
	for (const page of docsSite.pages) {
		const doc = getDocModule(page.filePath);
		if (doc?.frontmatter?.noindex === true || (page.hidden || getScopeForPage(docsSite, page).hidden) && indexing !== "all") continue;
		pages.push({
			route: page.url,
			filePath: page.filePath,
			title: doc?.frontmatter?.title || page.label,
			description: doc?.frontmatter?.description
		});
	}
	for (const page of standalonePages) {
		if (page.filePath.endsWith(".tsx")) continue;
		const doc = getDocModule(page.filePath);
		if (doc?.frontmatter?.noindex === true) continue;
		pages.push({
			route: page.path,
			filePath: page.filePath,
			title: doc?.frontmatter?.title || page.title || page.path,
			description: doc?.frontmatter?.description
		});
	}
	return pages;
}
/**
* Absolute URLs for the sitemap, honoring `seo.indexing` and per-page
* noindex. Empty when the shiso.config `siteUrl` is not configured, since a sitemap
* of relative URLs is invalid.
*/
function getSitemapEntries() {
	const { indexing } = getSeo();
	const entries = [];
	for (const page of docsSite.pages) {
		if ((page.hidden || getScopeForPage(docsSite, page).hidden) && indexing !== "all") continue;
		if (getDocModule(page.filePath)?.frontmatter?.noindex === true) continue;
		const url = toAbsoluteUrl(page.url);
		if (url) entries.push({
			url,
			lastmod: getLastModified(page.filePath)
		});
	}
	for (const page of standalonePages) {
		if (getDocModule(page.filePath)?.frontmatter?.noindex === true) continue;
		const url = toAbsoluteUrl(page.path);
		if (url) entries.push({
			url,
			lastmod: getLastModified(page.filePath)
		});
	}
	return entries;
}
function render(url) {
	return {
		html: renderToString(/* @__PURE__ */ jsx(StaticRouter, {
			basename: BASE_URL || void 0,
			location: `${BASE_URL}${url}`,
			children: /* @__PURE__ */ jsx(App, {})
		})),
		head: renderHeadToString(buildHead(url)),
		htmlAttrs: getLocaleByPathname(url)
	};
}
const siteDescription = siteConfig.description;

//#endregion
export { docsHomeUrl, getLlmsPages, getMarkdownPages, getRedirects, getRoutes, getSitemapEntries, render, siteDescription, siteName };