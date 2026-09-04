//#region ../../node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/array.js
var slice = Array.prototype.slice;
function array_default(x) {
	return typeof x === "object" && "length" in x ? x : Array.from(x);
}

//#endregion
export { array_default as t };