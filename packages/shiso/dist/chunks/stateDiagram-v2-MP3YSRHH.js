import { n as __name } from "./chunk-Y2CYZVJY.js";
import "./src.js";
import "./chunk-DU6HZSFF.js";
import "./chunk-75Z2AOVW.js";
import "./chunk-PWAF6VOD.js";
import "./chunk-GMAD6QVW.js";
import "./chunk-P2QGCYS3.js";
import "./chunk-4HAMMTFA.js";
import "./chunk-GVQU2GXP.js";
import "./chunk-OSK3NFVY.js";
import "./chunk-F27PBJKO.js";
import "./chunk-XXDRQBXY.js";
import "./chunk-POPQ4Y6H.js";
import "./chunk-L3NEJ4N5.js";
import { i as styles_default, n as stateDiagram_default, r as stateRenderer_v3_unified_default, t as StateDB } from "./chunk-IMKFNOWR.js";
import "./mermaid.core.js";

//#region ../../node_modules/.pnpm/mermaid@11.17.2/node_modules/mermaid/dist/chunks/mermaid.core/stateDiagram-v2-MP3YSRHH.mjs
var diagram = {
	parser: stateDiagram_default,
	get db() {
		return new StateDB(2);
	},
	renderer: stateRenderer_v3_unified_default,
	styles: styles_default,
	init: /* @__PURE__ */ __name((cnf) => {
		if (!cnf.state) cnf.state = {};
		cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
	}, "init")
};

//#endregion
export { diagram };