import { g as BrowserRouter, m as BASE_URL, t as App } from "./chunks/App.js";
import { jsx } from "react/jsx-runtime";

//#region src/entry-client.tsx
function ShisoApp() {
	return /* @__PURE__ */ jsx(BrowserRouter, {
		basename: BASE_URL || void 0,
		children: /* @__PURE__ */ jsx(App, {})
	});
}

//#endregion
export { ShisoApp };