import { n as __name } from "./chunk-Y2CYZVJY.js";
import { m as log } from "./src.js";
import { u as handleUndefinedAttr } from "./chunk-75Z2AOVW.js";
import { o as shapes } from "./chunk-4HAMMTFA.js";

//#region ../../node_modules/.pnpm/mermaid@11.17.2/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GVQU2GXP.mjs
var getSubGraphTitleMargins = /* @__PURE__ */ __name(({ flowchart }) => {
	const subGraphTitleTopMargin = flowchart?.subGraphTitleMargin?.top ?? 0;
	const subGraphTitleBottomMargin = flowchart?.subGraphTitleMargin?.bottom ?? 0;
	return {
		subGraphTitleTopMargin,
		subGraphTitleBottomMargin,
		subGraphTitleTotalMargin: subGraphTitleTopMargin + subGraphTitleBottomMargin
	};
}, "getSubGraphTitleMargins");
var nodeElems = /* @__PURE__ */ new Map();
async function insertNode(elem, node, renderOptions) {
	let newEl;
	let el;
	if (node.shape === "rect") if (node.rx && node.ry) node.shape = "roundedRect";
	else node.shape = "squareRect";
	const shapeHandler = node.shape ? shapes[node.shape] : void 0;
	if (!shapeHandler) throw new Error(`No such shape: ${node.shape}. Please check your syntax.`);
	if (node.link) {
		let target;
		if (renderOptions.config.securityLevel === "sandbox") target = "_top";
		else if (node.linkTarget) target = node.linkTarget || "_blank";
		newEl = elem.insert("svg:a").attr("xlink:href", node.link).attr("target", target ?? null);
		el = await shapeHandler(newEl, node, renderOptions);
	} else {
		el = await shapeHandler(elem, node, renderOptions);
		newEl = el;
	}
	newEl.attr("data-look", handleUndefinedAttr(node.look));
	if (node.tooltip) el.attr("title", node.tooltip);
	nodeElems.set(node.id, newEl);
	if (node.haveCallback) newEl.attr("class", newEl.attr("class") + " clickable");
	return newEl;
}
__name(insertNode, "insertNode");
var setNodeElem = /* @__PURE__ */ __name((elem, node) => {
	nodeElems.set(node.id, elem);
}, "setNodeElem");
var clear = /* @__PURE__ */ __name(() => {
	nodeElems.clear();
}, "clear");
var positionNode = /* @__PURE__ */ __name((node) => {
	const el = nodeElems.get(node.id);
	log.trace("Transforming node", node.diff, node, "translate(" + (node.x - node.width / 2 - 5) + ", " + node.width / 2 + ")");
	const padding = 8;
	const diff = node.diff || 0;
	if (node.clusterNode) el.attr("transform", "translate(" + (node.x + diff - node.width / 2) + ", " + (node.y - node.height / 2 - padding) + ")");
	else el.attr("transform", "translate(" + node.x + ", " + node.y + ")");
	return diff;
}, "positionNode");

//#endregion
export { setNodeElem as a, positionNode as i, getSubGraphTitleMargins as n, insertNode as r, clear as t };