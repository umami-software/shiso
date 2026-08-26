import { $ as POPUP_COLLISION_AVOIDANCE, $n as isHTMLElement, $t as itemPress, A as popupStoreSelectors, An as ARROW_UP, B as useSyncedFloatingRootContext, Bn as EMPTY_ARRAY, C as pressableTriggerOpenStateMapping, Cn as isTypeableCombobox, Ct as COMPOSITE_KEYS, D as useFocus, Dn as ARROW_DOWN, E as useHoverFloatingInteraction, En as getTarget, F as setPopupOpenState, Fn as useId$1, G as FloatingNode, Gn as ownerDocument, Gt as useValueAsRef, H as useDismiss, Hn as useMergedRefs, Ht as getIcon, I as useImplicitActiveTrigger, In as useTimeout, J as useFloatingParentNodeId, Jn as useIsoLayoutEffect, Jt as createChangeEventDetails, K as FloatingTree, Kn as useCompositeRootContext, Kt as useCompositeListItem, L as useOpenStateTransitions, Ln as Button, M as FOCUSABLE_POPUP_PROPS, Mn as webkit, N as PopupHandleAttachment, Nn as mac, O as usePopupHandleStore, On as ARROW_LEFT, P as attachPreventUnmountOnClose, Pn as useBaseUiId, Q as DROPDOWN_COLLISION_AVOIDANCE, Qn as getWindow, Qt as imperativeAction, R as usePopupInteractionProps, Rn as cn, Rt as Badge, S as popupTransitionStateMapping, Sn as getFloatingFocusElement, T as useHoverReferenceInteraction, Tn as contains, Tt as useCompositeItem, U as useClick, Un as useButton, Ut as useOpenChangeComplete, V as ReactStore, Vn as EMPTY_OBJECT, Vt as resolveIcon, W as FloatingFocusManager, Wn as dispatchClickWithModifiers, Wt as useAnimationsFinished, X as FloatingTreeStore, Xn as useRefWithInit, Xt as escapeKey, Y as useFloatingTree, Yn as useStableCallback, Yt as cancelOpen, Z as FloatingPortal, Zn as getParentNode, Zt as focusOut, _n as isIndexOutOfListBounds, _t as Collapsible, a as DialogTitle, an as triggerPress, b as getDisabledMountTransitionStyles, bn as isVirtualPointerEvent, c as useOpenInteractionType, cn as useDirection, cr as Route, d as useScrollLock, dn as getTabbableBeforeElement, dr as useLocation, en as listNavigation, er as isLastTraversableNode, et as enqueueFocus, f as DialogPortal$1, fn as isOutsideEvent, fr as useNavigate, g as DialogBackdrop, gn as isElementVisible, h as DialogClose, hn as getMinListIndex, ht as renderInlineMarkdown, i as DialogContent$1, in as triggerHover, ir as createLucideIcon, j as PopupTriggerMap, jn as jsdom, k as createInitialPopupStoreState, kn as ARROW_RIGHT, l as DialogTitle$1, ln as getNextTabbable, m as DialogPopup, mn as getMaxListIndex, n as ZoomableImage, nn as siblingOpen, nr as ChevronRight, nt as fastComponent, o as DialogTrigger, on as CompositeList, or as Link, p as InternalBackdrop, pn as findNonDisabledListIndex, q as useFloatingNodeId, qn as mergeProps$1, qt as useAnimationFrame, r as Dialog$1, rn as triggerFocus, rr as Check, rt as fastComponentRef, s as DialogTrigger$1, sn as addEventListener, sr as Navigate, t as docs_exports, tn as outsidePress, tr as X$1, tt as FocusGuard, u as DialogRoot, un as getTabbableAfterElement, ur as Routes, v as TooltipProvider, vn as isListIndexDisabled, vt as CollapsibleContent, w as safePolygon, wn as activeElement, wt as inertValue, x as useAnchorPositioning, xn as stopEvent, y as usePositioner, yn as isVirtualClick, yt as CollapsibleTrigger, z as useTriggerDataForwarding, zn as useRenderElement } from "./docs.js";
import { n as highlightTerms } from "./search.js";
import { resolveSearchProvider } from "../search.js";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import "@fontsource-variable/inter/index.css";
import "@fontsource/jetbrains-mono/400.css";
import "highlight.js/styles/github.css";
import "@umami/shiso/styles.css";
import { MDXProvider } from "@mdx-js/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as ReactDOM from "react-dom";
import shiso from "virtual:shiso-config";
import rawConfig from "virtual:shiso-docs-config";
import { LAST_MODIFIED } from "@/generated/last-modified";

//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$10 = [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$10);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$9 = [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "m12 5 7 7-7 7",
	key: "xquz4c"
}]];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$9);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/copy.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$8 = [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]];
const Copy = createLucideIcon("copy", __iconNode$8);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/external-link.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$7 = [
	["path", {
		d: "M15 3h6v6",
		key: "1q9fwt"
	}],
	["path", {
		d: "M10 14 21 3",
		key: "gplh6r"
	}],
	["path", {
		d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
		key: "a6xqqp"
	}]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$7);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/file-text.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$6 = [
	["path", {
		d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
		key: "1oefj6"
	}],
	["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}],
	["path", {
		d: "M10 9H8",
		key: "b1mrlr"
	}],
	["path", {
		d: "M16 13H8",
		key: "t4e002"
	}],
	["path", {
		d: "M16 17H8",
		key: "z1uh3a"
	}]
];
const FileText = createLucideIcon("file-text", __iconNode$6);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/globe.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$5 = [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
		key: "13o1zl"
	}],
	["path", {
		d: "M2 12h20",
		key: "9i4pu4"
	}]
];
const Globe = createLucideIcon("globe", __iconNode$5);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/menu.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$4 = [
	["path", {
		d: "M4 5h16",
		key: "1tepv9"
	}],
	["path", {
		d: "M4 12h16",
		key: "1lakjw"
	}],
	["path", {
		d: "M4 19h16",
		key: "1djgab"
	}]
];
const Menu = createLucideIcon("menu", __iconNode$4);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/mic-signal.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$3 = [
	["path", {
		d: "M12 17v4",
		key: "1riwvh"
	}],
	["path", {
		d: "M18 11a6 6 0 00-3-5.197",
		key: "1lvu40"
	}],
	["path", {
		d: "M2 11a10 10 0 015-8.662",
		key: "bida4p"
	}],
	["path", {
		d: "M22 11a10 10 0 00-5-8.662",
		key: "idvinr"
	}],
	["path", {
		d: "M6 11a6 6 0 013-5.197",
		key: "17n2ii"
	}],
	["path", {
		d: "M9 21h6",
		key: "1udhl7"
	}],
	["rect", {
		x: "10",
		y: "9",
		width: "4",
		height: "8",
		rx: "2",
		key: "1l8p2f"
	}]
];
const MicSignal = createLucideIcon("mic-signal", __iconNode$3);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/moon.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$2 = [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]];
const Moon = createLucideIcon("moon", __iconNode$2);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/search.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode$1 = [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]];
const Search$1 = createLucideIcon("search", __iconNode$1);

//#endregion
//#region ../../node_modules/.pnpm/lucide-react@1.28.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/sun.mjs
/**
* @license lucide-react v1.28.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
const __iconNode = [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}],
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M12 20v2",
		key: "1lh1kg"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "m17.66 17.66 1.41 1.41",
		key: "ptbguv"
	}],
	["path", {
		d: "M2 12h2",
		key: "1t8f8n"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m6.34 17.66-1.41 1.41",
		key: "1m8zz5"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}]
];
const Sun = createLucideIcon("sun", __iconNode);

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/root/ScrollAreaRootContext.mjs
const ScrollAreaRootContext = /*#__PURE__*/ React.createContext(void 0);
ScrollAreaRootContext.displayName = "ScrollAreaRootContext";
function useScrollAreaRootContext() {
	const context = React.useContext(ScrollAreaRootContext);
	if (context === void 0) throw new Error("Base UI: ScrollAreaRootContext is missing. ScrollArea parts must be placed within <ScrollArea.Root>.");
	return context;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/utils/getOffset.mjs
function getOffset$1(element, prop, axis) {
	if (!element) return 0;
	const styles = getComputedStyle(element);
	const key = `${prop}${axis === "x" ? "Inline" : "Block"}`;
	const start = parseFloat(styles[`${key}Start`]);
	if (axis === "x" && prop === "margin") return start * 2;
	return start + parseFloat(styles[`${key}End`]);
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/utils/styles.mjs
const DISABLE_SCROLLBAR_CLASS_NAME = "base-ui-disable-scrollbar";
const styleDisableScrollbar = {
	className: DISABLE_SCROLLBAR_CLASS_NAME,
	getElement(nonce) {
		return /*#__PURE__*/ jsx("style", {
			nonce,
			href: DISABLE_SCROLLBAR_CLASS_NAME,
			precedence: "base-ui:low",
			children: `.${DISABLE_SCROLLBAR_CLASS_NAME}{scrollbar-width:none}.${DISABLE_SCROLLBAR_CLASS_NAME}::-webkit-scrollbar{display:none}`
		});
	}
};
styleDisableScrollbar.getElement.displayName = "styleDisableScrollbar.getElement";

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/root/stateAttributes.mjs
const attr = (name) => (value) => value ? { [name]: "" } : null;
const scrollAreaStateAttributesMapping = {
	hasOverflowX: attr("data-has-overflow-x"),
	hasOverflowY: attr("data-has-overflow-y"),
	overflowXStart: attr("data-overflow-x-start"),
	overflowXEnd: attr("data-overflow-x-end"),
	overflowYStart: attr("data-overflow-y-start"),
	overflowYEnd: attr("data-overflow-y-end"),
	cornerHidden: () => null
};

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/internals/csp-context/CSPContext.mjs
const CSPContext = /*#__PURE__*/ React.createContext(void 0);
CSPContext.displayName = "CSPContext";
const DEFAULT_CSP_CONTEXT_VALUE = { disableStyleElements: false };
function useCSPContext() {
	return React.useContext(CSPContext) ?? DEFAULT_CSP_CONTEXT_VALUE;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/root/ScrollAreaRoot.mjs
const DEFAULT_COORDS = {
	x: 0,
	y: 0
};
const DEFAULT_SIZE = {
	width: 0,
	height: 0
};
const DEFAULT_OVERFLOW_EDGES = {
	xStart: false,
	xEnd: false,
	yStart: false,
	yEnd: false
};
const DEFAULT_HIDDEN_STATE = {
	x: true,
	y: true,
	corner: true
};
/**
* Groups all parts of the scroll area.
* Renders a `<div>` element.
*
* Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
*/
const ScrollAreaRoot = /*#__PURE__*/ React.forwardRef(function ScrollAreaRoot(componentProps, forwardedRef) {
	const { render, className, overflowEdgeThreshold: overflowEdgeThresholdProp, style, ...elementProps } = componentProps;
	const { xStart, xEnd, yStart, yEnd } = normalizeOverflowEdgeThreshold(overflowEdgeThresholdProp);
	const rootId = useBaseUiId();
	const scrollYTimeout = useTimeout();
	const scrollXTimeout = useTimeout();
	const { nonce, disableStyleElements } = useCSPContext();
	const [hovering, setHovering] = React.useState(false);
	const [scrollingX, setScrollingX] = React.useState(false);
	const [scrollingY, setScrollingY] = React.useState(false);
	const [touchModality, setTouchModality] = React.useState(false);
	const [hasMeasuredScrollbar, setHasMeasuredScrollbar] = React.useState(false);
	const [cornerSize, setCornerSize] = React.useState(DEFAULT_SIZE);
	const [thumbSize, setThumbSize] = React.useState(DEFAULT_SIZE);
	const [overflowEdges, setOverflowEdges] = React.useState(DEFAULT_OVERFLOW_EDGES);
	const [hiddenState, setHiddenState] = React.useState(DEFAULT_HIDDEN_STATE);
	const rootRef = React.useRef(null);
	const viewportRef = React.useRef(null);
	const scrollbarYRef = React.useRef(null);
	const scrollbarXRef = React.useRef(null);
	const thumbYRef = React.useRef(null);
	const thumbXRef = React.useRef(null);
	const cornerRef = React.useRef(null);
	const activePointerIdRef = React.useRef(null);
	const startYRef = React.useRef(0);
	const startXRef = React.useRef(0);
	const startScrollTopRef = React.useRef(0);
	const startScrollLeftRef = React.useRef(0);
	const currentOrientationRef = React.useRef("vertical");
	const scrollPositionRef = React.useRef(DEFAULT_COORDS);
	const savedSnapTypeRef = React.useRef(null);
	function startScrolling(vertical) {
		const setScrolling = vertical ? setScrollingY : setScrollingX;
		const timeout = vertical ? scrollYTimeout : scrollXTimeout;
		setScrolling(true);
		timeout.start(500, () => {
			setScrolling(false);
		});
	}
	const handleScroll = useStableCallback((scrollPosition) => {
		const offsetX = scrollPosition.x - scrollPositionRef.current.x;
		const offsetY = scrollPosition.y - scrollPositionRef.current.y;
		scrollPositionRef.current = scrollPosition;
		if (offsetY !== 0) startScrolling(true);
		if (offsetX !== 0) startScrolling(false);
	});
	const disableViewportSnap = useStableCallback(() => {
		const viewportEl = viewportRef.current;
		if (viewportEl && savedSnapTypeRef.current === null) {
			savedSnapTypeRef.current = viewportEl.style.scrollSnapType;
			viewportEl.style.scrollSnapType = "none";
		}
	});
	const handlePointerDown = useStableCallback((event) => {
		if (event.button !== 0) return;
		if (activePointerIdRef.current !== null) {
			if ((currentOrientationRef.current === "vertical" ? thumbYRef.current : thumbXRef.current)?.hasPointerCapture(activePointerIdRef.current)) return;
		}
		activePointerIdRef.current = event.pointerId;
		startYRef.current = event.clientY;
		startXRef.current = event.clientX;
		currentOrientationRef.current = event.currentTarget.getAttribute("data-orientation");
		const viewportEl = viewportRef.current;
		if (viewportEl) {
			startScrollTopRef.current = viewportEl.scrollTop;
			startScrollLeftRef.current = viewportEl.scrollLeft;
			disableViewportSnap();
		}
		(currentOrientationRef.current === "vertical" ? thumbYRef.current : thumbXRef.current)?.setPointerCapture(event.pointerId);
	});
	const handlePointerUp = useStableCallback((event) => {
		if (event.pointerId !== activePointerIdRef.current) return;
		activePointerIdRef.current = null;
		(currentOrientationRef.current === "vertical" ? setScrollingY : setScrollingX)(false);
		if (savedSnapTypeRef.current !== null) {
			if (viewportRef.current) viewportRef.current.style.scrollSnapType = savedSnapTypeRef.current;
			savedSnapTypeRef.current = null;
		}
		const thumb = currentOrientationRef.current === "vertical" ? thumbYRef.current : thumbXRef.current;
		if (thumb?.hasPointerCapture(event.pointerId)) thumb.releasePointerCapture(event.pointerId);
	});
	const handlePointerMove = useStableCallback((event) => {
		if (event.pointerId !== activePointerIdRef.current) return;
		if (event.buttons % 2 === 0) {
			handlePointerUp(event);
			return;
		}
		const viewportEl = viewportRef.current;
		if (!viewportEl) return;
		const vertical = currentOrientationRef.current === "vertical";
		const thumbEl = vertical ? thumbYRef.current : thumbXRef.current;
		const scrollbarEl = vertical ? scrollbarYRef.current : scrollbarXRef.current;
		if (!thumbEl || !scrollbarEl) return;
		const axis = vertical ? "y" : "x";
		const scrollbarOffset = getOffset$1(scrollbarEl, "padding", axis);
		const thumbOffset = getOffset$1(thumbEl, "margin", axis);
		const thumbSizePx = vertical ? thumbEl.offsetHeight : thumbEl.offsetWidth;
		const maxThumbOffset = (vertical ? scrollbarEl.offsetHeight : scrollbarEl.offsetWidth) - thumbSizePx - scrollbarOffset - thumbOffset;
		const delta = vertical ? event.clientY - startYRef.current : event.clientX - startXRef.current;
		const scrollRatio = maxThumbOffset <= 0 ? 0 : delta / maxThumbOffset;
		const scrollableSize = vertical ? viewportEl.scrollHeight : viewportEl.scrollWidth;
		const viewportSize = vertical ? viewportEl.clientHeight : viewportEl.clientWidth;
		const nextScroll = (vertical ? startScrollTopRef.current : startScrollLeftRef.current) + scrollRatio * (scrollableSize - viewportSize);
		if (vertical) viewportEl.scrollTop = nextScroll;
		else viewportEl.scrollLeft = nextScroll;
		event.preventDefault();
		startScrolling(vertical);
	});
	function handleTouchModalityChange(event) {
		setTouchModality(event.pointerType === "touch");
	}
	function handlePointerEnterOrMove(event) {
		handleTouchModalityChange(event);
		if (event.pointerType !== "touch") {
			const isTargetRootChild = contains(rootRef.current, event.target);
			setHovering(isTargetRootChild);
		}
	}
	const state = React.useMemo(() => ({
		scrolling: scrollingX || scrollingY,
		hasOverflowX: !hiddenState.x,
		hasOverflowY: !hiddenState.y,
		overflowXStart: overflowEdges.xStart,
		overflowXEnd: overflowEdges.xEnd,
		overflowYStart: overflowEdges.yStart,
		overflowYEnd: overflowEdges.yEnd,
		cornerHidden: hiddenState.corner
	}), [
		scrollingX,
		scrollingY,
		hiddenState.x,
		hiddenState.y,
		hiddenState.corner,
		overflowEdges
	]);
	const props = {
		role: "presentation",
		onPointerEnter: handlePointerEnterOrMove,
		onPointerMove: handlePointerEnterOrMove,
		onPointerDown: handleTouchModalityChange,
		onPointerLeave() {
			setHovering(false);
		},
		style: {
			position: "relative",
			["--scroll-area-corner-height"]: `${cornerSize.height}px`,
			["--scroll-area-corner-width"]: `${cornerSize.width}px`
		}
	};
	const element = useRenderElement("div", componentProps, {
		state,
		ref: [forwardedRef, rootRef],
		props: [props, elementProps],
		stateAttributesMapping: scrollAreaStateAttributesMapping
	});
	const contextValue = React.useMemo(() => ({
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleScroll,
		disableViewportSnap,
		cornerSize,
		setCornerSize,
		thumbSize,
		setThumbSize,
		hasMeasuredScrollbar,
		setHasMeasuredScrollbar,
		touchModality,
		cornerRef,
		scrollingX,
		scrollingY,
		hovering,
		setHovering,
		viewportRef,
		scrollbarYRef,
		scrollbarXRef,
		thumbYRef,
		thumbXRef,
		rootId,
		hiddenState,
		setHiddenState,
		overflowEdges,
		setOverflowEdges,
		viewportState: state,
		overflowEdgeThreshold: {
			xStart,
			xEnd,
			yStart,
			yEnd
		}
	}), [
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleScroll,
		disableViewportSnap,
		cornerSize,
		thumbSize,
		hasMeasuredScrollbar,
		touchModality,
		scrollingX,
		scrollingY,
		hovering,
		rootId,
		hiddenState,
		overflowEdges,
		state,
		xStart,
		xEnd,
		yStart,
		yEnd
	]);
	return /*#__PURE__*/ jsxs(ScrollAreaRootContext.Provider, {
		value: contextValue,
		children: [!disableStyleElements && styleDisableScrollbar.getElement(nonce), element]
	});
});
ScrollAreaRoot.displayName = "ScrollAreaRoot";
function normalizeOverflowEdgeThreshold(threshold) {
	const thresholds = typeof threshold === "number" ? {
		xStart: threshold,
		xEnd: threshold,
		yStart: threshold,
		yEnd: threshold
	} : threshold;
	return {
		xStart: Math.max(0, thresholds?.xStart || 0),
		xEnd: Math.max(0, thresholds?.xEnd || 0),
		yStart: Math.max(0, thresholds?.yStart || 0),
		yEnd: Math.max(0, thresholds?.yEnd || 0)
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/viewport/ScrollAreaViewportContext.mjs
const ScrollAreaViewportContext = /*#__PURE__*/ React.createContext(void 0);
ScrollAreaViewportContext.displayName = "ScrollAreaViewportContext";
function useScrollAreaViewportContext() {
	const context = React.useContext(ScrollAreaViewportContext);
	if (context === void 0) throw new Error("Base UI: ScrollAreaViewportContext missing. ScrollAreaViewport parts must be placed within <ScrollArea.Viewport>.");
	return context;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/internals/clamp.mjs
function clamp(val, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
	return Math.max(min, Math.min(val, max));
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/utils/scrollEdges.mjs
const SCROLL_EDGE_TOLERANCE_PX = 1;
function normalizeScrollOffset(value, max) {
	if (max <= 0) return 0;
	const clamped = clamp(value, 0, max);
	const startDistance = clamped;
	const endDistance = max - clamped;
	const withinStartTolerance = startDistance <= 1;
	const withinEndTolerance = endDistance <= 1;
	if (withinStartTolerance && withinEndTolerance) return startDistance <= endDistance ? 0 : max;
	if (withinStartTolerance) return 0;
	if (withinEndTolerance) return max;
	return clamped;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/viewport/ScrollAreaViewport.mjs
const OVERFLOW_EDGE_VARS = [
	"--scroll-area-overflow-x-start",
	"--scroll-area-overflow-x-end",
	"--scroll-area-overflow-y-start",
	"--scroll-area-overflow-y-end"
];
let scrollAreaOverflowVarsRegistered = false;
/**
* Removes inheritance of the scroll area overflow CSS variables, which
* improves rendering performance in complex scroll areas with deep subtrees.
* Instead, each child must manually opt-in to using these properties by
* specifying `inherit`.
* See https://motion.dev/blog/web-animation-performance-tier-list
* under the "Improving CSS variable performance" section.
*/
function removeCSSVariableInheritance() {
	if (scrollAreaOverflowVarsRegistered || webkit) return;
	if (typeof CSS !== "undefined" && "registerProperty" in CSS) OVERFLOW_EDGE_VARS.forEach((name) => {
		try {
			CSS.registerProperty({
				name,
				syntax: "<length>",
				inherits: false,
				initialValue: "0px"
			});
		} catch {}
	});
	scrollAreaOverflowVarsRegistered = true;
}
/**
* The actual scrollable container of the scroll area.
* Renders a `<div>` element.
*
* Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
*/
const ScrollAreaViewport = /*#__PURE__*/ React.forwardRef(function ScrollAreaViewport(componentProps, forwardedRef) {
	const { render, className, style, ...elementProps } = componentProps;
	const { viewportRef, scrollbarYRef, scrollbarXRef, thumbYRef, thumbXRef, cornerRef, cornerSize, setCornerSize, setThumbSize, rootId, setHiddenState, hiddenState, setHasMeasuredScrollbar, handleScroll, touchModality, setHovering, setOverflowEdges, overflowEdgeThreshold, viewportState } = useScrollAreaRootContext();
	const direction = useDirection();
	const programmaticScrollRef = React.useRef(true);
	const lastMeasuredViewportMetricsRef = React.useRef([
		NaN,
		NaN,
		NaN,
		NaN
	]);
	const scrollEndTimeout = useTimeout();
	const waitForAnimationsTimeout = useTimeout();
	const computeThumbPosition = useStableCallback(() => {
		const viewportEl = viewportRef.current;
		const scrollbarYEl = scrollbarYRef.current;
		const scrollbarXEl = scrollbarXRef.current;
		const thumbYEl = thumbYRef.current;
		const thumbXEl = thumbXRef.current;
		const cornerEl = cornerRef.current;
		if (!viewportEl) return;
		const scrollableContentHeight = viewportEl.scrollHeight;
		const scrollableContentWidth = viewportEl.scrollWidth;
		const viewportHeight = viewportEl.clientHeight;
		const viewportWidth = viewportEl.clientWidth;
		const scrollTop = viewportEl.scrollTop;
		const scrollLeft = viewportEl.scrollLeft;
		const lastMeasuredViewportMetrics = lastMeasuredViewportMetricsRef.current;
		const isFirstMeasurement = Number.isNaN(lastMeasuredViewportMetrics[0]);
		lastMeasuredViewportMetrics[0] = viewportHeight;
		lastMeasuredViewportMetrics[1] = scrollableContentHeight;
		lastMeasuredViewportMetrics[2] = viewportWidth;
		lastMeasuredViewportMetrics[3] = scrollableContentWidth;
		if (isFirstMeasurement) setHasMeasuredScrollbar(true);
		if (scrollableContentHeight === 0 || scrollableContentWidth === 0) return;
		const nextHiddenState = getHiddenState(viewportEl);
		const scrollbarYHidden = nextHiddenState.y;
		const scrollbarXHidden = nextHiddenState.x;
		const ratioX = viewportWidth / scrollableContentWidth;
		const ratioY = viewportHeight / scrollableContentHeight;
		const maxScrollLeft = Math.max(0, scrollableContentWidth - viewportWidth);
		const maxScrollTop = Math.max(0, scrollableContentHeight - viewportHeight);
		let scrollLeftFromStart = 0;
		let scrollLeftFromEnd = 0;
		if (!scrollbarXHidden) {
			scrollLeftFromStart = normalizeScrollOffset(direction === "rtl" ? -scrollLeft : scrollLeft, maxScrollLeft);
			scrollLeftFromEnd = maxScrollLeft - scrollLeftFromStart;
		}
		const scrollTopFromStart = scrollbarYHidden ? 0 : normalizeScrollOffset(scrollTop, maxScrollTop);
		const scrollTopFromEnd = scrollbarYHidden ? 0 : maxScrollTop - scrollTopFromStart;
		const nextWidth = scrollbarXHidden ? 0 : viewportWidth;
		const nextHeight = scrollbarYHidden ? 0 : viewportHeight;
		let nextCornerWidth = 0;
		let nextCornerHeight = 0;
		if (!scrollbarXHidden && !scrollbarYHidden) {
			nextCornerWidth = scrollbarYEl?.offsetWidth || 0;
			nextCornerHeight = scrollbarXEl?.offsetHeight || 0;
		}
		const cornerNotYetSized = cornerSize.width === 0 && cornerSize.height === 0;
		const cornerWidthOffset = cornerNotYetSized ? nextCornerWidth : 0;
		const cornerHeightOffset = cornerNotYetSized ? nextCornerHeight : 0;
		const scrollbarXOffset = getOffset$1(scrollbarXEl, "padding", "x");
		const scrollbarYOffset = getOffset$1(scrollbarYEl, "padding", "y");
		const thumbXOffset = getOffset$1(thumbXEl, "margin", "x");
		const thumbYOffset = getOffset$1(thumbYEl, "margin", "y");
		const idealNextWidth = nextWidth - scrollbarXOffset - thumbXOffset;
		const idealNextHeight = nextHeight - scrollbarYOffset - thumbYOffset;
		const maxNextWidth = scrollbarXEl ? Math.min(scrollbarXEl.offsetWidth - cornerWidthOffset, idealNextWidth) : idealNextWidth;
		const maxNextHeight = scrollbarYEl ? Math.min(scrollbarYEl.offsetHeight - cornerHeightOffset, idealNextHeight) : idealNextHeight;
		const clampedNextWidth = Math.max(16, maxNextWidth * ratioX);
		const clampedNextHeight = Math.max(16, maxNextHeight * ratioY);
		setThumbSize((prevSize) => pickState(prevSize, {
			width: clampedNextWidth,
			height: clampedNextHeight
		}));
		if (scrollbarYEl && thumbYEl) {
			const thumbOffsetY = applyOverscrollThumb(thumbYEl, "--scroll-area-thumb-height", scrollTop, maxScrollTop, scrollableContentHeight, clampedNextHeight, scrollbarYEl.offsetHeight - clampedNextHeight - scrollbarYOffset - thumbYOffset);
			thumbYEl.style.transform = `translate3d(0,${thumbOffsetY}px,0)`;
		}
		if (scrollbarXEl && thumbXEl) {
			const maxThumbOffsetX = scrollbarXEl.offsetWidth - clampedNextWidth - scrollbarXOffset - thumbXOffset;
			const offsetX = applyOverscrollThumb(thumbXEl, "--scroll-area-thumb-width", direction === "rtl" ? -scrollLeft : scrollLeft, maxScrollLeft, scrollableContentWidth, clampedNextWidth, maxThumbOffsetX);
			thumbXEl.style.transform = `translate3d(${direction === "rtl" ? -offsetX : offsetX}px,0,0)`;
		}
		const overflowMetricsPx = [
			scrollLeftFromStart,
			scrollLeftFromEnd,
			scrollTopFromStart,
			scrollTopFromEnd
		];
		OVERFLOW_EDGE_VARS.forEach((cssVar, index) => {
			viewportEl.style.setProperty(cssVar, `${overflowMetricsPx[index]}px`);
		});
		if (cornerEl) setCornerSize((prevSize) => pickState(prevSize, {
			width: nextCornerWidth,
			height: nextCornerHeight
		}));
		setHiddenState((prevState) => pickState(prevState, nextHiddenState));
		const nextOverflowEdges = {
			xStart: !scrollbarXHidden && scrollLeftFromStart > overflowEdgeThreshold.xStart,
			xEnd: !scrollbarXHidden && scrollLeftFromEnd > overflowEdgeThreshold.xEnd,
			yStart: !scrollbarYHidden && scrollTopFromStart > overflowEdgeThreshold.yStart,
			yEnd: !scrollbarYHidden && scrollTopFromEnd > overflowEdgeThreshold.yEnd
		};
		setOverflowEdges((prev) => pickState(prev, nextOverflowEdges));
	});
	useIsoLayoutEffect(() => {
		removeCSSVariableInheritance();
	}, []);
	useIsoLayoutEffect(() => {
		queueMicrotask(computeThumbPosition);
	}, [
		computeThumbPosition,
		hiddenState,
		direction,
		overflowEdgeThreshold.xStart,
		overflowEdgeThreshold.xEnd,
		overflowEdgeThreshold.yStart,
		overflowEdgeThreshold.yEnd
	]);
	useIsoLayoutEffect(() => {
		if (viewportRef.current?.matches(":hover")) setHovering(true);
	}, [viewportRef, setHovering]);
	useIsoLayoutEffect(() => {
		const viewport = viewportRef.current;
		if (typeof ResizeObserver === "undefined" || !viewport) return;
		let hasInitialized = false;
		const resizeObserver = new ResizeObserver(() => {
			if (!hasInitialized) {
				hasInitialized = true;
				const lastMeasuredViewportMetrics = lastMeasuredViewportMetricsRef.current;
				if (lastMeasuredViewportMetrics[0] === viewport.clientHeight && lastMeasuredViewportMetrics[1] === viewport.scrollHeight && lastMeasuredViewportMetrics[2] === viewport.clientWidth && lastMeasuredViewportMetrics[3] === viewport.scrollWidth) return;
			}
			computeThumbPosition();
		});
		resizeObserver.observe(viewport);
		waitForAnimationsTimeout.start(0, () => {
			const animations = viewport.getAnimations({ subtree: true });
			if (animations.length === 0) return;
			Promise.allSettled(animations.map((animation) => animation.finished)).then(computeThumbPosition).catch(() => {});
		});
		return () => {
			resizeObserver.disconnect();
			waitForAnimationsTimeout.clear();
		};
	}, [
		computeThumbPosition,
		viewportRef,
		waitForAnimationsTimeout
	]);
	function handleUserInteraction() {
		programmaticScrollRef.current = false;
	}
	const props = {
		role: "presentation",
		...rootId && { "data-id": `${rootId}-viewport` },
		tabIndex: hiddenState.x && hiddenState.y ? -1 : 0,
		className: styleDisableScrollbar.className,
		style: { overflow: "scroll" },
		onScroll() {
			if (!viewportRef.current) return;
			computeThumbPosition();
			if (touchModality || !programmaticScrollRef.current) handleScroll({
				x: viewportRef.current.scrollLeft,
				y: viewportRef.current.scrollTop
			});
			scrollEndTimeout.start(100, () => {
				programmaticScrollRef.current = true;
			});
		},
		onWheel: handleUserInteraction,
		onPointerMove: handleUserInteraction,
		onPointerEnter: handleUserInteraction,
		onKeyDown: handleUserInteraction
	};
	const element = useRenderElement("div", componentProps, {
		ref: [forwardedRef, viewportRef],
		state: viewportState,
		props: [props, elementProps],
		stateAttributesMapping: scrollAreaStateAttributesMapping
	});
	const contextValue = React.useMemo(() => ({ computeThumbPosition }), [computeThumbPosition]);
	return /*#__PURE__*/ jsx(ScrollAreaViewportContext.Provider, {
		value: contextValue,
		children: element
	});
});
ScrollAreaViewport.displayName = "ScrollAreaViewport";
function getHiddenState(viewport) {
	const y = viewport.clientHeight >= viewport.scrollHeight;
	const x = viewport.clientWidth >= viewport.scrollWidth;
	return {
		y,
		x,
		corner: y || x
	};
}
/**
* Returns `prev` when `next` is shallow-equal to it so setState bails out and
* scroll-frame updates don't rebuild the root context.
*/
function pickState(prev, next) {
	for (const key in next) if (prev[key] !== next[key]) return next;
	return prev;
}
/**
* Sizes the thumb and returns its axis offset. On overscroll (Safari rubber-band only) it shrinks
* against the pinned edge, damped by `content / (content + overscroll)` to match native feedback;
* the size flows through the thumb-size variable so the resting `var(...)` still applies.
*/
function applyOverscrollThumb(thumbEl, sizeVar, scrollFromStart, maxScroll, content, size, maxThumbOffset) {
	const clamped = clamp(scrollFromStart, 0, maxScroll);
	const overscroll = scrollFromStart - clamped;
	const nextSize = Math.max(16, size * content / (content + Math.abs(overscroll)));
	thumbEl.style.setProperty(sizeVar, overscroll ? `${nextSize}px` : "");
	return (maxScroll ? clamped / maxScroll * maxThumbOffset : 0) + (overscroll > 0 ? size - nextSize : 0);
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/scrollbar/ScrollAreaScrollbarContext.mjs
const ScrollAreaScrollbarContext = /*#__PURE__*/ React.createContext(void 0);
ScrollAreaScrollbarContext.displayName = "ScrollAreaScrollbarContext";
function useScrollAreaScrollbarContext() {
	const context = React.useContext(ScrollAreaScrollbarContext);
	if (context === void 0) throw new Error("Base UI: ScrollAreaScrollbarContext is missing. ScrollAreaScrollbar parts must be placed within <ScrollArea.Scrollbar>.");
	return context;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/scrollbar/ScrollAreaScrollbar.mjs
/**
* A vertical or horizontal scrollbar for the scroll area.
* Renders a `<div>` element.
*
* Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
*/
const ScrollAreaScrollbar = /*#__PURE__*/ React.forwardRef(function ScrollAreaScrollbar(componentProps, forwardedRef) {
	const { render, className, orientation = "vertical", keepMounted = false, style, ...elementProps } = componentProps;
	const { hovering, scrollingX, scrollingY, hiddenState, scrollbarYRef, scrollbarXRef, viewportRef, thumbYRef, thumbXRef, handlePointerDown, handlePointerUp, handleScroll, disableViewportSnap, rootId, thumbSize, hasMeasuredScrollbar, viewportState } = useScrollAreaRootContext();
	const vertical = orientation === "vertical";
	const state = {
		...viewportState,
		hovering,
		scrolling: vertical ? scrollingY : scrollingX,
		orientation
	};
	const direction = useDirection();
	const hideTrackUntilMeasured = !hasMeasuredScrollbar && !keepMounted;
	const isHidden = vertical ? hiddenState.y : hiddenState.x;
	const shouldRender = keepMounted || !isHidden;
	React.useEffect(() => {
		if (!shouldRender) return;
		const viewportEl = viewportRef.current;
		const scrollbarEl = vertical ? scrollbarYRef.current : scrollbarXRef.current;
		if (!scrollbarEl) return;
		function handleWheel(event) {
			if (!viewportEl || event.ctrlKey) return;
			const horizontal = !vertical;
			const scrollProperty = horizontal ? "scrollLeft" : "scrollTop";
			const delta = horizontal ? event.deltaX : event.deltaY;
			if (delta === 0) return;
			const maxScroll = horizontal ? viewportEl.scrollWidth - viewportEl.clientWidth : viewportEl.scrollHeight - viewportEl.clientHeight;
			const minScroll = horizontal && direction === "rtl" ? -maxScroll : 0;
			const maxScrollValue = horizontal && direction === "rtl" ? 0 : maxScroll;
			const scrollValue = viewportEl[scrollProperty];
			if (scrollValue <= minScroll && delta < 0 || scrollValue >= maxScrollValue && delta > 0) return;
			event.preventDefault();
			viewportEl[scrollProperty] = Math.min(maxScrollValue, Math.max(minScroll, scrollValue + delta));
			handleScroll({
				x: viewportEl.scrollLeft,
				y: viewportEl.scrollTop
			});
		}
		return addEventListener(scrollbarEl, "wheel", handleWheel, { passive: false });
	}, [
		direction,
		handleScroll,
		vertical,
		scrollbarXRef,
		scrollbarYRef,
		shouldRender,
		viewportRef
	]);
	const props = {
		...rootId && { "data-id": `${rootId}-scrollbar` },
		onPointerDown(event) {
			if (event.button !== 0) return;
			const target = getTarget(event.nativeEvent);
			const thumbEl = vertical ? thumbYRef.current : thumbXRef.current;
			if (thumbEl && contains(thumbEl, target)) return;
			const viewportEl = viewportRef.current;
			if (!viewportEl) return;
			const scrollbarEl = vertical ? scrollbarYRef.current : scrollbarXRef.current;
			if (!thumbEl || !scrollbarEl) return;
			const axis = vertical ? "y" : "x";
			const thumbOffset = getOffset$1(thumbEl, "margin", axis);
			const scrollbarOffset = getOffset$1(scrollbarEl, "padding", axis);
			const thumbSizePx = vertical ? thumbEl.offsetHeight : thumbEl.offsetWidth;
			const trackRect = scrollbarEl.getBoundingClientRect();
			const clickPosition = vertical ? event.clientY - trackRect.top - thumbSizePx / 2 - scrollbarOffset + thumbOffset / 2 : event.clientX - trackRect.left - thumbSizePx / 2 - scrollbarOffset + thumbOffset / 2;
			const scrollableSize = vertical ? viewportEl.scrollHeight : viewportEl.scrollWidth;
			const viewportSize = vertical ? viewportEl.clientHeight : viewportEl.clientWidth;
			const maxThumbOffset = (vertical ? scrollbarEl.offsetHeight : scrollbarEl.offsetWidth) - thumbSizePx - scrollbarOffset - thumbOffset;
			if (maxThumbOffset <= 0) return;
			const scrollRatio = clickPosition / maxThumbOffset;
			const maxScrollDistance = scrollableSize - viewportSize;
			disableViewportSnap();
			if (vertical) viewportEl.scrollTop = scrollRatio * maxScrollDistance;
			else if (direction === "rtl") viewportEl.scrollLeft = -(1 - scrollRatio) * maxScrollDistance;
			else viewportEl.scrollLeft = scrollRatio * maxScrollDistance;
			handleScroll({
				x: viewportEl.scrollLeft,
				y: viewportEl.scrollTop
			});
			handlePointerDown(event);
		},
		onPointerUp: handlePointerUp,
		onPointerCancel: handlePointerUp,
		style: {
			position: "absolute",
			touchAction: "none",
			WebkitUserSelect: "none",
			userSelect: "none",
			visibility: hideTrackUntilMeasured ? "hidden" : void 0,
			...vertical ? {
				top: 0,
				bottom: "var(--scroll-area-corner-height)",
				insetInlineEnd: 0,
				["--scroll-area-thumb-height"]: `${thumbSize.height}px`
			} : {
				insetInlineStart: 0,
				insetInlineEnd: "var(--scroll-area-corner-width)",
				bottom: 0,
				["--scroll-area-thumb-width"]: `${thumbSize.width}px`
			}
		}
	};
	const element = useRenderElement("div", componentProps, {
		ref: [forwardedRef, vertical ? scrollbarYRef : scrollbarXRef],
		state,
		props: [props, elementProps],
		stateAttributesMapping: scrollAreaStateAttributesMapping
	});
	if (!shouldRender) return null;
	return /*#__PURE__*/ jsx(ScrollAreaScrollbarContext.Provider, {
		value: orientation,
		children: element
	});
});
ScrollAreaScrollbar.displayName = "ScrollAreaScrollbar";

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/content/ScrollAreaContent.mjs
/**
* A container for the content of the scroll area.
* Renders a `<div>` element.
*
* Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
*/
const ScrollAreaContent = /*#__PURE__*/ React.forwardRef(function ScrollAreaContent(componentProps, forwardedRef) {
	const { render, className, style, ...elementProps } = componentProps;
	const { computeThumbPosition } = useScrollAreaViewportContext();
	const { hasMeasuredScrollbar, viewportState } = useScrollAreaRootContext();
	const contentWrapperRef = React.useRef(null);
	const computeOnInitialResizeRef = React.useRef(hasMeasuredScrollbar);
	useIsoLayoutEffect(() => {
		if (typeof ResizeObserver === "undefined") return;
		let hasInitialized = false;
		const resizeObserver = new ResizeObserver(() => {
			if (!hasInitialized) {
				hasInitialized = true;
				if (!computeOnInitialResizeRef.current) return;
			}
			computeThumbPosition();
		});
		if (contentWrapperRef.current) resizeObserver.observe(contentWrapperRef.current);
		return () => {
			resizeObserver.disconnect();
		};
	}, [computeThumbPosition]);
	return useRenderElement("div", componentProps, {
		ref: [forwardedRef, contentWrapperRef],
		state: viewportState,
		stateAttributesMapping: scrollAreaStateAttributesMapping,
		props: [{
			role: "presentation",
			style: { minWidth: "fit-content" }
		}, elementProps]
	});
});
ScrollAreaContent.displayName = "ScrollAreaContent";

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/thumb/ScrollAreaThumb.mjs
/**
* The draggable part of the scrollbar that indicates the current scroll position.
* Renders a `<div>` element.
*
* Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
*/
const ScrollAreaThumb = /*#__PURE__*/ React.forwardRef(function ScrollAreaThumb(componentProps, forwardedRef) {
	const { render, className, style, ...elementProps } = componentProps;
	const { thumbYRef, thumbXRef, handlePointerDown, handlePointerMove, handlePointerUp, scrollingX, scrollingY, hasMeasuredScrollbar } = useScrollAreaRootContext();
	const orientation = useScrollAreaScrollbarContext();
	const vertical = orientation === "vertical";
	return useRenderElement("div", componentProps, {
		ref: [forwardedRef, vertical ? thumbYRef : thumbXRef],
		state: {
			scrolling: vertical ? scrollingY : scrollingX,
			orientation
		},
		props: [{
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
			onPointerCancel: handlePointerUp,
			style: {
				visibility: hasMeasuredScrollbar ? void 0 : "hidden",
				...vertical ? { height: "var(--scroll-area-thumb-height)" } : { width: "var(--scroll-area-thumb-width)" }
			}
		}, elementProps]
	});
});
ScrollAreaThumb.displayName = "ScrollAreaThumb";

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/scroll-area/corner/ScrollAreaCorner.mjs
/**
* A small rectangular area that appears at the intersection of horizontal and vertical scrollbars.
* Renders a `<div>` element.
*
* Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
*/
const ScrollAreaCorner = /*#__PURE__*/ React.forwardRef(function ScrollAreaCorner(componentProps, forwardedRef) {
	const { render, className, style, ...elementProps } = componentProps;
	const { cornerRef, cornerSize, hiddenState } = useScrollAreaRootContext();
	const element = useRenderElement("div", componentProps, {
		ref: [forwardedRef, cornerRef],
		props: [{ style: {
			position: "absolute",
			bottom: 0,
			insetInlineEnd: 0,
			width: cornerSize.width,
			height: cornerSize.height
		} }, elementProps]
	});
	if (hiddenState.corner) return null;
	return element;
});
ScrollAreaCorner.displayName = "ScrollAreaCorner";

//#endregion
//#region src/components/ui/scroll-area.tsx
function ScrollArea({ className, children, scrollbars = "vertical", ...props }) {
	const hasHorizontalScrollbar = scrollbars === "horizontal" || scrollbars === "both";
	return /* @__PURE__ */ jsxs(ScrollAreaRoot, {
		"data-slot": "scroll-area",
		className: cn("group/scrollarea relative overflow-hidden [--scroll-area-corner-height:0px] [--scroll-area-corner-width:0px]", className),
		...props,
		children: [
			/* @__PURE__ */ jsx(ScrollAreaViewport, {
				"data-slot": "scroll-area-viewport",
				className: cn("box-border h-full w-full max-w-full rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1", scrollbars === "both" ? "overscroll-contain" : hasHorizontalScrollbar ? "overscroll-x-contain" : "overscroll-y-contain"),
				children: /* @__PURE__ */ jsx(ScrollAreaContent, {
					"data-slot": "scroll-area-content",
					className: cn("box-border min-w-0", hasHorizontalScrollbar ? "w-max min-w-full max-w-none" : "w-full max-w-full"),
					children
				})
			}),
			scrollbars !== "horizontal" && /* @__PURE__ */ jsx(ScrollBar, {}),
			hasHorizontalScrollbar && /* @__PURE__ */ jsx(ScrollBar, { orientation: "horizontal" }),
			/* @__PURE__ */ jsx(ScrollAreaCorner, {})
		]
	});
}
function ScrollBar({ className, orientation = "vertical", ...props }) {
	return /* @__PURE__ */ jsx(ScrollAreaScrollbar, {
		"data-slot": "scroll-area-scrollbar",
		"data-orientation": orientation,
		orientation,
		className: cn("absolute z-[1] flex touch-none rounded-full bg-muted opacity-0 transition-opacity duration-150 select-none group-hover/scrollarea:opacity-100 data-[hovering]:opacity-100 data-[scrolling]:opacity-100", orientation === "vertical" ? "inset-y-0 right-0 w-1.5 flex-col p-px" : "right-0 bottom-0 left-0 h-1.5 flex-row p-px", className),
		...props,
		children: /* @__PURE__ */ jsx(ScrollAreaThumb, {
			"data-slot": "scroll-area-thumb",
			className: "relative shrink-0 rounded-full bg-input transition-colors hover:bg-muted-foreground"
		})
	});
}

//#endregion
//#region src/components/CodeBlock.tsx
function CodeBlock({ children, className }) {
	const textInput = useRef(null);
	const [copied, setCopied] = useState(false);
	const handleCopy = () => {
		setCopied(true);
		navigator?.clipboard?.writeText(textInput.current?.textContent || "");
		setTimeout(() => {
			setCopied(false);
		}, 1e3);
	};
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "code-block",
		className: "relative my-5 overflow-hidden rounded-lg bg-muted/50",
		children: [/* @__PURE__ */ jsx(ScrollArea, {
			scrollbars: "horizontal",
			className: "w-full",
			children: /* @__PURE__ */ jsx("pre", {
				ref: textInput,
				className: `code-block p-3 pr-12 text-sm text-foreground leading-[1.6] font-mono ${className || ""}`,
				children
			})
		}), /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			size: "icon-sm",
			className: "absolute top-2.5 right-3 inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
			onClick: handleCopy,
			"aria-label": "Copy code",
			children: copied ? /* @__PURE__ */ jsx(Check, { className: "size-3.5 text-primary" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3.5" })
		})]
	});
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/floating-ui-react/hooks/useListNavigation.mjs
const ESCAPE = "Escape";
function isStationaryWebKitPointer(event) {
	return webkit && event.movementX === 0 && event.movementY === 0;
}
function doSwitch(orientation, vertical, horizontal) {
	switch (orientation) {
		case "vertical": return vertical;
		case "horizontal": return horizontal;
		default: return vertical || horizontal;
	}
}
function isMainOrientationKey(key, orientation) {
	return doSwitch(orientation, key === "ArrowUp" || key === "ArrowDown", key === "ArrowLeft" || key === "ArrowRight");
}
function isMainOrientationToEndKey(key, orientation, rtl) {
	return doSwitch(orientation, key === "ArrowDown", rtl ? key === "ArrowLeft" : key === "ArrowRight") || key === "Enter" || key === " " || key === "";
}
function isCrossOrientationOpenKey(key, orientation, rtl) {
	return doSwitch(orientation, rtl ? key === ARROW_LEFT : key === ARROW_RIGHT, key === ARROW_DOWN);
}
function isCrossOrientationCloseKey(key, orientation, rtl, grid) {
	const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
	const horizontal = key === ARROW_UP;
	if (orientation === "both" || orientation === "horizontal" && grid) return key === ESCAPE;
	return doSwitch(orientation, vertical, horizontal);
}
/**
* Adds arrow key-based navigation of a list of items, either using real DOM
* focus or virtual focus.
* @see https://floating-ui.com/docs/useListNavigation
*/
function useListNavigation(context, props) {
	const { listRef, activeIndex, onNavigate: onNavigateProp = () => {}, enabled = true, selectedIndex = null, allowEscape = false, loopFocus = false, nested = false, rtl = false, virtual = false, focusItemOnOpen = "auto", focusItemOnHover = true, openOnArrowKeyDown = true, disabledIndices = void 0, orientation = "vertical", parentOrientation, id, resetOnPointerLeave = true, externalTree, grid: navigateGrid } = props;
	const isGrid = navigateGrid != null;
	if (allowEscape) {
		if (!loopFocus) console.warn("`useListNavigation` looping must be enabled to allow escaping.");
		if (!virtual) console.warn("`useListNavigation` must be virtual to allow escaping.");
	}
	if (orientation === "vertical" && isGrid) console.warn("In grid list navigation mode, the `orientation` should", "be either \"horizontal\" or \"both\".");
	const store = "rootStore" in context ? context.rootStore : context;
	const open = store.useState("open");
	const floatingElement = store.useState("floatingElement");
	const domReferenceElement = store.useState("domReferenceElement");
	const dataRef = store.context.dataRef;
	const floatingFocusElement = getFloatingFocusElement(floatingElement);
	const typeableComboboxReference = isTypeableCombobox(domReferenceElement);
	const floatingFocusElementRef = useValueAsRef(floatingFocusElement);
	const parentId = useFloatingParentNodeId();
	const tree = useFloatingTree(externalTree);
	const focusItemOnOpenRef = React.useRef(focusItemOnOpen);
	const indexRef = React.useRef(selectedIndex ?? -1);
	const keyRef = React.useRef(null);
	const isPointerModalityRef = React.useRef(true);
	const onNavigate = useStableCallback((event) => {
		onNavigateProp(indexRef.current === -1 ? null : indexRef.current, event);
	});
	const previousMountedRef = React.useRef(!!floatingElement);
	const previousOpenRef = React.useRef(open);
	const forceSyncFocusRef = React.useRef(false);
	const forceScrollIntoViewRef = React.useRef(false);
	const cancelQueuedFocusRef = React.useRef(null);
	const disabledIndicesRef = useValueAsRef(disabledIndices);
	const latestOpenRef = useValueAsRef(open);
	const selectedIndexRef = useValueAsRef(selectedIndex);
	const resetOnPointerLeaveRef = useValueAsRef(resetOnPointerLeave);
	const focusFrame = useAnimationFrame();
	const waitForListPopulatedFrame = useAnimationFrame();
	const focusItem = useStableCallback(() => {
		function runFocus(item) {
			if (virtual) tree?.events.emit("virtualfocus", item);
			else cancelQueuedFocusRef.current = enqueueFocus(item, {
				sync: forceSyncFocusRef.current,
				preventScroll: true
			});
		}
		const initialItem = listRef.current[indexRef.current];
		const forceScrollIntoView = forceScrollIntoViewRef.current;
		if (initialItem) runFocus(initialItem);
		(forceSyncFocusRef.current ? (callback) => callback() : (callback) => focusFrame.request(callback))(() => {
			const waitedItem = listRef.current[indexRef.current] || initialItem;
			if (!waitedItem) return;
			if (!initialItem) runFocus(waitedItem);
			if (item && (forceScrollIntoView || !isPointerModalityRef.current)) waitedItem.scrollIntoView?.({
				block: "nearest",
				inline: "nearest"
			});
		});
	});
	useIsoLayoutEffect(() => {
		dataRef.current.orientation = orientation;
	}, [dataRef, orientation]);
	useIsoLayoutEffect(() => {
		if (!enabled) return;
		if (open && floatingElement) {
			indexRef.current = selectedIndex ?? -1;
			if (focusItemOnOpenRef.current && selectedIndex != null) {
				forceScrollIntoViewRef.current = true;
				onNavigate();
			}
		} else if (previousMountedRef.current) {
			indexRef.current = -1;
			onNavigate();
		}
	}, [
		enabled,
		open,
		floatingElement,
		selectedIndex,
		onNavigate
	]);
	useIsoLayoutEffect(() => {
		if (!enabled) return;
		if (!open) {
			forceSyncFocusRef.current = false;
			return;
		}
		if (!floatingElement) return;
		if (activeIndex == null) {
			forceSyncFocusRef.current = false;
			if (selectedIndexRef.current != null) return;
			if (previousMountedRef.current) {
				indexRef.current = -1;
				focusItem();
			}
			if ((!previousOpenRef.current || !previousMountedRef.current) && focusItemOnOpenRef.current && (keyRef.current != null || focusItemOnOpenRef.current === true && keyRef.current == null)) {
				let runs = 0;
				const waitForListPopulated = () => {
					if (listRef.current[0] == null) {
						if (runs < 2) (runs ? (callback) => waitForListPopulatedFrame.request(callback) : queueMicrotask)(waitForListPopulated);
						runs += 1;
					} else {
						indexRef.current = keyRef.current == null || isMainOrientationToEndKey(keyRef.current, orientation, rtl) || nested ? getMinListIndex(listRef) : getMaxListIndex(listRef);
						keyRef.current = null;
						onNavigate();
					}
				};
				waitForListPopulated();
			}
		} else if (!isIndexOutOfListBounds(listRef.current, activeIndex)) {
			indexRef.current = activeIndex;
			focusItem();
			forceScrollIntoViewRef.current = false;
		}
	}, [
		enabled,
		open,
		floatingElement,
		activeIndex,
		selectedIndexRef,
		nested,
		listRef,
		orientation,
		rtl,
		onNavigate,
		focusItem,
		waitForListPopulatedFrame
	]);
	useIsoLayoutEffect(() => {
		if (!enabled || floatingElement || !tree || virtual || !previousMountedRef.current) return;
		const nodes = tree.nodesRef.current;
		const parent = nodes.find((node) => node.id === parentId)?.context?.elements.floating;
		const activeEl = activeElement(ownerDocument(domReferenceElement ?? parent ?? null));
		const treeContainsActiveEl = nodes.some((node) => node.context && contains(node.context.elements.floating, activeEl));
		if (parent && !treeContainsActiveEl && isPointerModalityRef.current) parent.focus({ preventScroll: true });
	}, [
		enabled,
		floatingElement,
		domReferenceElement,
		tree,
		parentId,
		virtual
	]);
	useIsoLayoutEffect(() => {
		previousOpenRef.current = open;
		previousMountedRef.current = !!floatingElement;
	});
	useIsoLayoutEffect(() => {
		if (!open) {
			keyRef.current = null;
			focusItemOnOpenRef.current = focusItemOnOpen;
		}
	}, [open, focusItemOnOpen]);
	const hasActiveIndex = activeIndex != null;
	const syncCurrentTarget = useStableCallback((event) => {
		if (!latestOpenRef.current) return;
		const index = listRef.current.indexOf(event.currentTarget);
		if (index !== -1 && (indexRef.current !== index || activeIndex !== index)) {
			indexRef.current = index;
			onNavigate(event);
		}
	});
	const getParentOrientation = useStableCallback(() => {
		return parentOrientation ?? tree?.nodesRef.current.find((node) => node.id === parentId)?.context?.dataRef?.current.orientation;
	});
	const getMinEnabledIndex = useStableCallback(() => {
		return getMinListIndex(listRef, disabledIndicesRef.current);
	});
	const commonOnKeyDown = useStableCallback((event) => {
		isPointerModalityRef.current = false;
		forceSyncFocusRef.current = true;
		if (event.which === 229) return;
		if (!latestOpenRef.current && event.currentTarget === floatingFocusElementRef.current) return;
		if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl, isGrid)) {
			if (!isMainOrientationKey(event.key, getParentOrientation())) stopEvent(event);
			store.setOpen(false, createChangeEventDetails(listNavigation, event.nativeEvent));
			if (isHTMLElement(domReferenceElement)) if (virtual) tree?.events.emit("virtualfocus", domReferenceElement);
			else domReferenceElement.focus();
			return;
		}
		const currentIndex = indexRef.current;
		const minIndex = getMinListIndex(listRef, disabledIndices);
		const maxIndex = getMaxListIndex(listRef, disabledIndices);
		if (!typeableComboboxReference) {
			if (event.key === "Home") {
				stopEvent(event);
				indexRef.current = minIndex;
				onNavigate(event);
			}
			if (event.key === "End") {
				stopEvent(event);
				indexRef.current = maxIndex;
				onNavigate(event);
			}
		}
		if (navigateGrid != null) {
			const index = navigateGrid(event, indexRef.current, listRef, orientation, loopFocus, rtl, disabledIndices, minIndex, maxIndex);
			if (index != null) {
				indexRef.current = index;
				onNavigate(event);
			}
			if (orientation === "both") return;
		}
		if (isMainOrientationKey(event.key, orientation)) {
			stopEvent(event);
			if (open && !virtual && activeElement(event.currentTarget.ownerDocument) === event.currentTarget) {
				indexRef.current = isMainOrientationToEndKey(event.key, orientation, rtl) ? minIndex : maxIndex;
				onNavigate(event);
				return;
			}
			if (isMainOrientationToEndKey(event.key, orientation, rtl)) if (loopFocus) if (currentIndex >= maxIndex) if (allowEscape && currentIndex !== listRef.current.length) indexRef.current = -1;
			else {
				forceSyncFocusRef.current = false;
				indexRef.current = minIndex;
			}
			else indexRef.current = findNonDisabledListIndex(listRef.current, {
				startingIndex: currentIndex,
				disabledIndices
			});
			else indexRef.current = Math.min(maxIndex, findNonDisabledListIndex(listRef.current, {
				startingIndex: currentIndex,
				disabledIndices
			}));
			else if (loopFocus) if (currentIndex <= minIndex) if (allowEscape && currentIndex !== -1) indexRef.current = listRef.current.length;
			else {
				forceSyncFocusRef.current = false;
				indexRef.current = maxIndex;
			}
			else indexRef.current = findNonDisabledListIndex(listRef.current, {
				startingIndex: currentIndex,
				decrement: true,
				disabledIndices
			});
			else indexRef.current = Math.max(minIndex, findNonDisabledListIndex(listRef.current, {
				startingIndex: currentIndex,
				decrement: true,
				disabledIndices
			}));
			if (isIndexOutOfListBounds(listRef.current, indexRef.current)) indexRef.current = -1;
			onNavigate(event);
		}
	});
	const item = React.useMemo(() => {
		return {
			onFocus(event) {
				forceSyncFocusRef.current = true;
				syncCurrentTarget(event);
			},
			onClick: ({ currentTarget }) => currentTarget.focus({ preventScroll: true }),
			onMouseMove(event) {
				if (isStationaryWebKitPointer(event)) return;
				forceSyncFocusRef.current = true;
				forceScrollIntoViewRef.current = false;
				if (focusItemOnHover) syncCurrentTarget(event);
			},
			onPointerLeave(event) {
				if (!latestOpenRef.current || !isPointerModalityRef.current || event.pointerType === "touch") return;
				forceSyncFocusRef.current = true;
				const relatedTarget = event.relatedTarget;
				if (!focusItemOnHover || listRef.current.includes(relatedTarget)) return;
				if (!resetOnPointerLeaveRef.current) return;
				cancelQueuedFocusRef.current?.();
				cancelQueuedFocusRef.current = null;
				indexRef.current = -1;
				onNavigate(event);
				if (!virtual) {
					const floatingFocusEl = floatingFocusElementRef.current;
					const activeEl = activeElement(ownerDocument(floatingFocusEl));
					if (floatingFocusEl && contains(floatingFocusEl, activeEl)) floatingFocusEl.focus({ preventScroll: true });
				}
			}
		};
	}, [
		syncCurrentTarget,
		latestOpenRef,
		floatingFocusElementRef,
		focusItemOnHover,
		listRef,
		onNavigate,
		resetOnPointerLeaveRef,
		virtual
	]);
	const ariaActiveDescendantProp = React.useMemo(() => {
		return virtual && open && hasActiveIndex && { "aria-activedescendant": `${id}-${activeIndex}` };
	}, [
		virtual,
		open,
		hasActiveIndex,
		id,
		activeIndex
	]);
	const floating = React.useMemo(() => {
		return {
			"aria-orientation": orientation === "both" ? void 0 : orientation,
			...!typeableComboboxReference ? ariaActiveDescendantProp : {},
			onKeyDown(event) {
				if (event.key === "Tab" && event.shiftKey && open && !virtual) {
					const target = getTarget(event.nativeEvent);
					if (target && !contains(floatingFocusElementRef.current, target)) return;
					stopEvent(event);
					store.setOpen(false, createChangeEventDetails(focusOut, event.nativeEvent));
					if (isHTMLElement(domReferenceElement)) domReferenceElement.focus();
					return;
				}
				commonOnKeyDown(event);
			},
			onPointerMove(event) {
				if (isStationaryWebKitPointer(event)) return;
				isPointerModalityRef.current = true;
			}
		};
	}, [
		ariaActiveDescendantProp,
		commonOnKeyDown,
		floatingFocusElementRef,
		orientation,
		typeableComboboxReference,
		store,
		open,
		virtual,
		domReferenceElement
	]);
	const trigger = React.useMemo(() => {
		function openOnNavigationKeyDown(event) {
			store.setOpen(true, createChangeEventDetails(listNavigation, event.nativeEvent, event.currentTarget));
		}
		function checkVirtualMouse(event) {
			if (focusItemOnOpen === "auto" && isVirtualClick(event.nativeEvent)) focusItemOnOpenRef.current = !virtual;
		}
		function checkVirtualPointer(event) {
			focusItemOnOpenRef.current = focusItemOnOpen;
			if (focusItemOnOpen === "auto" && isVirtualPointerEvent(event.nativeEvent)) focusItemOnOpenRef.current = true;
		}
		return {
			onKeyDown(event) {
				const currentOpen = store.select("open");
				isPointerModalityRef.current = false;
				const isArrowKey = event.key.startsWith("Arrow");
				const isParentCrossOpenKey = isCrossOrientationOpenKey(event.key, getParentOrientation(), rtl);
				const isMainKey = isMainOrientationKey(event.key, orientation);
				const isNavigationKey = (nested ? isParentCrossOpenKey : isMainKey) || event.key === "Enter" || event.key.trim() === "";
				if (virtual && currentOpen) return commonOnKeyDown(event);
				if (!currentOpen && !openOnArrowKeyDown && isArrowKey) return;
				if (isNavigationKey) {
					const isParentMainKey = isMainOrientationKey(event.key, getParentOrientation());
					keyRef.current = nested && isParentMainKey ? null : event.key;
				}
				if (nested) {
					if (isParentCrossOpenKey) {
						stopEvent(event);
						if (currentOpen) {
							indexRef.current = getMinEnabledIndex();
							onNavigate(event);
						} else openOnNavigationKeyDown(event);
					}
					return;
				}
				if (isMainKey) {
					if (selectedIndexRef.current != null) indexRef.current = selectedIndexRef.current;
					stopEvent(event);
					if (!currentOpen && openOnArrowKeyDown) openOnNavigationKeyDown(event);
					else commonOnKeyDown(event);
					if (currentOpen) onNavigate(event);
				}
			},
			onFocus(event) {
				if (store.select("open") && !virtual) {
					indexRef.current = -1;
					onNavigate(event);
				}
			},
			onPointerDown: checkVirtualPointer,
			onPointerEnter: checkVirtualPointer,
			onMouseDown: checkVirtualMouse,
			onClick: checkVirtualMouse
		};
	}, [
		commonOnKeyDown,
		focusItemOnOpen,
		getMinEnabledIndex,
		nested,
		onNavigate,
		store,
		openOnArrowKeyDown,
		orientation,
		getParentOrientation,
		rtl,
		selectedIndexRef,
		virtual
	]);
	const reference = React.useMemo(() => {
		return {
			...ariaActiveDescendantProp,
			...trigger
		};
	}, [ariaActiveDescendantProp, trigger]);
	return React.useMemo(() => enabled ? {
		reference,
		floating,
		item,
		trigger
	} : {}, [
		enabled,
		reference,
		floating,
		trigger,
		item
	]);
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/floating-ui-react/hooks/useTypeahead.mjs
/**
* Provides a matching callback that can be used to focus an item as the user
* types, often used in tandem with `useListNavigation()`.
* @see https://floating-ui.com/docs/useTypeahead
*/
function useTypeahead(context, props) {
	const { listRef, elementsRef, activeIndex, onMatch: onMatchProp, disabledIndices, onTyping, enabled = true, resetMs = 750, selectedIndex = null } = props;
	const store = "rootStore" in context ? context.rootStore : context;
	const open = store.useState("open");
	const timeout = useTimeout();
	const stringRef = React.useRef("");
	const prevIndexRef = React.useRef(selectedIndex ?? activeIndex ?? -1);
	const matchIndexRef = React.useRef(null);
	const onKeyDown = useStableCallback((event) => {
		function getElement(index) {
			return elementsRef?.current[index];
		}
		function isItemAvailable(index) {
			const element = getElement(index);
			if (element && !isElementVisible(element) || element?.matches(":disabled")) return false;
			return disabledIndices == null || !isListIndexDisabled(EMPTY_ARRAY, index, disabledIndices);
		}
		function getMatchingIndex(list, string, startIndex = 0) {
			if (list.length === 0) return -1;
			const normalizedStartIndex = (startIndex % list.length + list.length) % list.length;
			const lowerString = string.toLowerCase();
			for (let offset = 0; offset < list.length; offset += 1) {
				const index = (normalizedStartIndex + offset) % list.length;
				if (!list[index]?.toLowerCase().startsWith(lowerString) || !isItemAvailable(index)) continue;
				return index;
			}
			return -1;
		}
		const listContent = listRef.current;
		if (stringRef.current.length > 0 && event.key === " ") {
			stopEvent(event);
			onTyping?.(true);
		}
		if (stringRef.current.length > 0 && stringRef.current[0] !== " ") {
			if (getMatchingIndex(listContent, stringRef.current) === -1 && event.key !== " ") onTyping?.(false);
		}
		if (listContent == null || event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
		if (open && event.key !== " ") {
			stopEvent(event);
			onTyping?.(true);
		}
		const isNewSession = stringRef.current === "";
		if (isNewSession) prevIndexRef.current = selectedIndex ?? activeIndex ?? -1;
		if (listContent.every((text, index) => text && isItemAvailable(index) ? text[0]?.toLowerCase() !== text[1]?.toLowerCase() : true) && stringRef.current === event.key) {
			stringRef.current = "";
			prevIndexRef.current = matchIndexRef.current;
		}
		stringRef.current += event.key;
		timeout.start(resetMs, () => {
			stringRef.current = "";
			prevIndexRef.current = matchIndexRef.current;
			onTyping?.(false);
		});
		const startIndex = ((isNewSession ? selectedIndex ?? activeIndex ?? -1 : prevIndexRef.current) ?? 0) + 1;
		const index = getMatchingIndex(listContent, stringRef.current, startIndex);
		if (index !== -1) {
			onMatchProp?.(index);
			matchIndexRef.current = index;
		} else if (event.key !== " ") {
			stringRef.current = "";
			onTyping?.(false);
		}
	});
	const onBlur = useStableCallback((event) => {
		const next = event.relatedTarget;
		const currentDomReferenceElement = store.select("domReferenceElement");
		const currentFloatingElement = store.select("floatingElement");
		if (contains(currentDomReferenceElement, next) || contains(currentFloatingElement, next)) return;
		timeout.clear();
		stringRef.current = "";
		prevIndexRef.current = matchIndexRef.current;
		onTyping?.(false);
	});
	useIsoLayoutEffect(() => {
		if (!open && selectedIndex !== null) return;
		timeout.clear();
		matchIndexRef.current = null;
		if (stringRef.current !== "") stringRef.current = "";
	}, [
		open,
		selectedIndex,
		timeout
	]);
	const sharedProps = React.useMemo(() => ({
		onKeyDown,
		onBlur
	}), [onKeyDown, onBlur]);
	return React.useMemo(() => enabled ? {
		reference: sharedProps,
		floating: sharedProps
	} : {}, [enabled, sharedProps]);
}

//#endregion
//#region src/components/Banner.tsx
const STORAGE_KEY = "shiso-banner-dismissed";
/**
* Site-wide banner from the `banner` config key. Dismissal stores the banner
* content, not just a flag, so publishing a new banner shows it again.
* The banner renders during prerender and hides after hydration when it was
* previously dismissed.
*/
function Banner({ banner, dismissLabel }) {
	const [dismissed, setDismissed] = useState(false);
	useEffect(() => {
		if (!banner?.dismissible) return;
		try {
			setDismissed(localStorage.getItem(STORAGE_KEY) === banner.content);
		} catch {}
	}, [banner?.dismissible, banner?.content]);
	if (!banner || dismissed) return null;
	const handleDismiss = () => {
		setDismissed(true);
		try {
			localStorage.setItem(STORAGE_KEY, banner.content);
		} catch {}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex shrink-0 items-center justify-center gap-2 bg-primary px-10 py-2 text-center text-sm text-primary-foreground",
		children: [/* @__PURE__ */ jsx("div", {
			className: "[&_a:hover]:opacity-[0.85] [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-sm [&_code]:bg-black/20 [&_code]:px-1 [&_code]:py-[0.0625rem] [&_code]:text-[0.8125rem] [&_code]:font-mono",
			children: renderInlineMarkdown(banner.content)
		}), banner.dismissible && /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			size: "icon-xs",
			className: "absolute top-1/2 right-3 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-inherit opacity-80 hover:bg-black/15 hover:opacity-100",
			onClick: handleDismiss,
			"aria-label": dismissLabel,
			children: /* @__PURE__ */ jsx(X$1, { size: 16 })
		})]
	});
}

//#endregion
//#region ../../node_modules/.pnpm/simple-icons@16.28.0/node_modules/simple-icons/index.mjs
const a = "\"/></svg>";
const siBluesky = {
	title: "Bluesky",
	slug: "bluesky",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Bluesky</title><path d=\"" + this.path + a;
	},
	path: "M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026",
	source: "https://bsky.social/about/blog/press-faq",
	hex: "1185FE",
	guidelines: "https://bsky.social/about/blog/press-faq"
};
const siDiscord = {
	title: "Discord",
	slug: "discord",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Discord</title><path d=\"" + this.path + a;
	},
	path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
	source: "https://discord.com/branding",
	hex: "5865F2",
	guidelines: "https://discord.com/branding"
};
const siFacebook = {
	title: "Facebook",
	slug: "facebook",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Facebook</title><path d=\"" + this.path + a;
	},
	path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
	source: "https://about.meta.com/brand/resources/facebook/logo",
	hex: "0866FF",
	guidelines: "https://about.meta.com/brand/resources/facebook/logo"
};
const siGithub = {
	title: "GitHub",
	slug: "github",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>GitHub</title><path d=\"" + this.path + a;
	},
	path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
	source: "https://github.com/logos",
	hex: "181717",
	guidelines: "https://github.com/logos"
};
const siInstagram = {
	title: "Instagram",
	slug: "instagram",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Instagram</title><path d=\"" + this.path + a;
	},
	path: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
	source: "https://about.meta.com/brand/resources/instagram",
	hex: "FF0069",
	guidelines: "https://about.meta.com/brand/resources/instagram"
};
const siMedium = {
	title: "Medium",
	slug: "medium",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Medium</title><path d=\"" + this.path + a;
	},
	path: "M4.21 0A4.201 4.201 0 0 0 0 4.21v15.58A4.201 4.201 0 0 0 4.21 24h15.58A4.201 4.201 0 0 0 24 19.79v-1.093c-.137.013-.278.02-.422.02-2.577 0-4.027-2.146-4.09-4.832a7.592 7.592 0 0 1 .022-.708c.093-1.186.475-2.241 1.105-3.022a3.885 3.885 0 0 1 1.395-1.1c.468-.237 1.127-.367 1.664-.367h.023c.101 0 .202.004.303.01V4.211A4.201 4.201 0 0 0 19.79 0Zm.198 5.583h4.165l3.588 8.435 3.59-8.435h3.864v.146l-.019.004c-.705.16-1.063.397-1.063 1.254h-.003l.003 10.274c.06.676.424.885 1.063 1.03l.02.004v.145h-4.923v-.145l.019-.005c.639-.144.994-.353 1.054-1.03V7.267l-4.745 11.15h-.261L6.15 7.569v9.445c0 .857.358 1.094 1.063 1.253l.02.004v.147H4.405v-.147l.019-.004c.705-.16 1.065-.397 1.065-1.253V6.987c0-.857-.358-1.094-1.064-1.254l-.018-.004zm19.25 3.668c-1.086.023-1.733 1.323-1.813 3.124H24V9.298a1.378 1.378 0 0 0-.342-.047Zm-1.862 3.632c-.1 1.756.86 3.239 2.204 3.634v-3.634z",
	source: "https://medium.design/logos-and-brand-guidelines-f1a01a733592",
	hex: "000000",
	guidelines: "https://medium.design/logos-and-brand-guidelines-f1a01a733592"
};
const siReddit = {
	title: "Reddit",
	slug: "reddit",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Reddit</title><path d=\"" + this.path + a;
	},
	path: "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z",
	source: "https://www.redditinc.com/brand",
	hex: "FF4500",
	guidelines: "https://www.redditinc.com/brand"
};
const siTelegram = {
	title: "Telegram",
	slug: "telegram",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Telegram</title><path d=\"" + this.path + a;
	},
	path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
	source: "https://telegram.org/tour/screenshots",
	hex: "26A5E4"
};
const siThreads = {
	title: "Threads",
	slug: "threads",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Threads</title><path d=\"" + this.path + a;
	},
	path: "M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z",
	source: "https://www.meta.com/brand/resources/instagram/threads",
	hex: "000000",
	guidelines: "https://www.meta.com/brand/resources/instagram/threads"
};
const siX = {
	title: "X",
	slug: "x",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>X</title><path d=\"" + this.path + a;
	},
	path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
	source: "https://x.com",
	hex: "000000",
	guidelines: "https://about.x.com/en/who-we-are/brand-toolkit"
};
const siYcombinator = {
	title: "Y Combinator",
	slug: "ycombinator",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Y Combinator</title><path d=\"" + this.path + a;
	},
	path: "M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z",
	source: "https://www.ycombinator.com/press",
	hex: "F0652F"
};
const siYoutube = {
	title: "YouTube",
	slug: "youtube",
	get svg() {
		return "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>YouTube</title><path d=\"" + this.path + a;
	},
	path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
	source: "https://www.youtube.com/howyoutubeworks/resources/brand-resources/#logos-icons-and-colors",
	hex: "FF0000",
	guidelines: "https://www.youtube.com/howyoutubeworks/resources/brand-resources/#logos-icons-and-colors"
};

//#endregion
//#region src/components/SocialIcon.tsx
/**
* Icons for every platform name the footer `socials` config accepts. Brand
* marks come from simple-icons; generic ones (website, podcast) fall back
* to lucide.
*/
const BRAND_ICONS = {
	x: siX,
	twitter: siX,
	"x-twitter": siX,
	github: siGithub,
	facebook: siFacebook,
	youtube: siYoutube,
	discord: siDiscord,
	instagram: siInstagram,
	"hacker-news": siYcombinator,
	medium: siMedium,
	telegram: siTelegram,
	bluesky: siBluesky,
	threads: siThreads,
	reddit: siReddit,
	slack: { path: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" },
	linkedin: { path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" }
};
const LUCIDE_ICONS = {
	website: Globe,
	"earth-americas": Globe,
	podcast: MicSignal
};
function isKnownPlatform(platform) {
	return platform in BRAND_ICONS || platform in LUCIDE_ICONS;
}
function SocialIcon({ platform, size = 18 }) {
	const brand = BRAND_ICONS[platform];
	if (brand) return /* @__PURE__ */ jsx("svg", {
		role: "img",
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		width: size,
		height: size,
		fill: "currentColor",
		children: /* @__PURE__ */ jsx("path", { d: brand.path })
	});
	const Lucide = LUCIDE_ICONS[platform] || Globe;
	return /* @__PURE__ */ jsx(Lucide, {
		size,
		"aria-hidden": "true"
	});
}

//#endregion
//#region src/components/ConfiguredIcon.tsx
function ConfiguredIcon({ icon, size = 14 }) {
	if (!icon) return null;
	if (isKnownPlatform(icon)) return /* @__PURE__ */ jsx(SocialIcon, {
		platform: icon,
		size
	});
	const Icon = getIcon(icon);
	return Icon ? /* @__PURE__ */ jsx(Icon, {
		size,
		"aria-hidden": "true"
	}) : null;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/positioner/MenuPositionerContext.mjs
const MenuPositionerContext = /*#__PURE__*/ React.createContext(void 0);
MenuPositionerContext.displayName = "MenuPositionerContext";
function useMenuPositionerContext(optional) {
	const context = React.useContext(MenuPositionerContext);
	if (context === void 0 && !optional) throw new Error("Base UI: MenuPositionerContext is missing. MenuPositioner parts must be placed within <Menu.Positioner>.");
	return context;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/root/MenuRootContext.mjs
const MenuRootContext = /*#__PURE__*/ React.createContext(void 0);
MenuRootContext.displayName = "MenuRootContext";
function useMenuRootContext(optional) {
	const context = React.useContext(MenuRootContext);
	if (context === void 0 && !optional) throw new Error("Base UI: MenuRootContext is missing. Menu parts must be placed within <Menu.Root>.");
	return context;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/context-menu/root/ContextMenuRootContext.mjs
const ContextMenuRootContext = /*#__PURE__*/ React.createContext(void 0);
ContextMenuRootContext.displayName = "ContextMenuRootContext";
function useContextMenuRootContext(optional = true) {
	const context = React.useContext(ContextMenuRootContext);
	if (context === void 0 && !optional) throw new Error("Base UI: ContextMenuRootContext is missing. ContextMenu parts must be placed within <ContextMenu.Root>.");
	return context;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/item/useMenuItemCommonProps.mjs
/**
* Returns common props shared by all menu item types.
* This hook extracts the shared logic for id, role, tabIndex, onKeyDown,
* onMouseMove, onClick, and onMouseUp handlers.
*/
function useMenuItemCommonProps(params) {
	const { closeOnClick, highlighted, id, nodeId, store, typingRef, itemRef, itemMetadata } = params;
	const { events: menuEvents } = store.useState("floatingTreeRoot");
	const open = store.useState("open");
	const contextMenuContext = useContextMenuRootContext(true);
	const isContextMenu = contextMenuContext !== void 0;
	return React.useMemo(() => ({
		id,
		role: "menuitem",
		tabIndex: open && highlighted ? 0 : -1,
		onKeyDown(event) {
			if (event.key === " " && typingRef?.current) event.preventDefault();
		},
		onMouseMove(event) {
			if (!nodeId) return;
			menuEvents.emit("itemhover", {
				nodeId,
				target: event.currentTarget
			});
		},
		onClick(event) {
			if (closeOnClick) menuEvents.emit("close", {
				domEvent: event,
				reason: itemPress
			});
		},
		onMouseUp(event) {
			if (contextMenuContext) {
				const initialCursorPoint = contextMenuContext.initialCursorPointRef.current;
				contextMenuContext.initialCursorPointRef.current = null;
				if (isContextMenu && initialCursorPoint && Math.abs(event.clientX - initialCursorPoint.x) <= 1 && Math.abs(event.clientY - initialCursorPoint.y) <= 1) return;
				if (isContextMenu && !mac && event.button === 2) return;
			}
			if (itemRef.current && store.context.allowMouseUpTriggerRef.current && (!isContextMenu || event.button === 2)) {
				if (itemMetadata.type === "regular-item") dispatchClickWithModifiers(itemRef.current, event, { detail: 1 });
			}
		}
	}), [
		closeOnClick,
		highlighted,
		id,
		menuEvents,
		nodeId,
		open,
		store,
		typingRef,
		itemRef,
		contextMenuContext,
		isContextMenu,
		itemMetadata
	]);
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/item/useMenuItem.mjs
const REGULAR_ITEM = { type: "regular-item" };
function useMenuItem(params) {
	const { closeOnClick, disabled, highlighted, id, store, typingRef = store.context.typingRef, nativeButton, itemMetadata, nodeId } = params;
	const itemRef = React.useRef(null);
	const { getButtonProps, buttonRef } = useButton({
		disabled,
		focusableWhenDisabled: true,
		native: nativeButton,
		composite: true
	});
	const commonProps = useMenuItemCommonProps({
		closeOnClick,
		highlighted,
		id,
		nodeId,
		store,
		typingRef,
		itemRef,
		itemMetadata
	});
	const getItemProps = React.useCallback((externalProps) => {
		return mergeProps$1(commonProps, { onMouseEnter() {
			if (itemMetadata.type !== "submenu-trigger") return;
			itemMetadata.setActive();
		} }, externalProps, getButtonProps);
	}, [
		commonProps,
		getButtonProps,
		itemMetadata
	]);
	const mergedRef = useMergedRefs(itemRef, buttonRef);
	return React.useMemo(() => ({
		getItemProps,
		itemRef: mergedRef
	}), [getItemProps, mergedRef]);
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/item/MenuItem.mjs
/**
* An individual interactive item in the menu.
* Renders a `<div>` element.
*
* Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
*/
const MenuItem = /*#__PURE__*/ React.forwardRef(function MenuItem(componentProps, forwardedRef) {
	const { render, className, id: idProp, label, nativeButton = false, disabled: disabledProp = false, closeOnClick = true, style, ...elementProps } = componentProps;
	const listItem = useCompositeListItem({
		guess: true,
		label
	});
	const menuPositionerContext = useMenuPositionerContext(true);
	const id = useBaseUiId(idProp);
	const { store } = useMenuRootContext();
	const rootDisabled = store.useState("disabled");
	const disabled = disabledProp || rootDisabled;
	const highlighted = store.useState("isActive", listItem.index);
	const itemProps = store.useState("itemProps");
	const { getItemProps, itemRef } = useMenuItem({
		closeOnClick,
		disabled,
		highlighted,
		id,
		store,
		nativeButton,
		nodeId: menuPositionerContext?.context.nodeId,
		itemMetadata: REGULAR_ITEM
	});
	return useRenderElement("div", componentProps, {
		state: {
			disabled,
			highlighted
		},
		props: [
			itemProps,
			elementProps,
			getItemProps
		],
		ref: [
			itemRef,
			forwardedRef,
			listItem.ref
		]
	});
});
MenuItem.displayName = "MenuItem";

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/toolbar/root/ToolbarRootContext.mjs
const ToolbarRootContext = /*#__PURE__*/ React.createContext(void 0);
ToolbarRootContext.displayName = "ToolbarRootContext";
function useToolbarRootContext(optional) {
	const context = React.useContext(ToolbarRootContext);
	if (context === void 0 && !optional) throw new Error("Base UI: ToolbarRootContext is missing. Toolbar parts must be placed within <Toolbar.Root>.");
	return context;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/popup/MenuPopup.mjs
/**
* A container for the menu items.
* Renders a `<div>` element.
*
* Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
*/
const MenuPopup = /*#__PURE__*/ React.forwardRef(function MenuPopup(componentProps, forwardedRef) {
	const { render, className, style, finalFocus, ...elementProps } = componentProps;
	const { store } = useMenuRootContext();
	const { side, align } = useMenuPositionerContext();
	const insideToolbar = useToolbarRootContext(true) != null;
	const open = store.useState("open");
	const transitionStatus = store.useState("transitionStatus");
	const popupProps = store.useState("popupProps");
	const mounted = store.useState("mounted");
	const instantType = store.useState("instantType");
	const activeTriggerElement = store.useState("activeTriggerElement");
	const parent = store.useState("parent");
	const lastOpenChangeReason = store.useState("lastOpenChangeReason");
	const rootId = store.useState("rootId");
	const floatingContext = store.useState("floatingRootContext");
	const floatingTreeRoot = store.useState("floatingTreeRoot");
	const closeDelay = store.useState("closeDelay");
	const hoverEnabled = store.useState("hoverEnabled");
	const disabled = store.useState("disabled");
	const openMethod = store.useState("openMethod");
	const isContextMenu = parent.type === "context-menu";
	useOpenChangeComplete({
		open,
		ref: store.context.popupRef,
		onComplete() {
			if (open) store.context.onOpenChangeComplete?.(true);
		}
	});
	React.useEffect(() => {
		function handleClose(event) {
			store.setOpen(false, createChangeEventDetails(event.reason, event.domEvent));
		}
		floatingTreeRoot.events.on("close", handleClose);
		return () => {
			floatingTreeRoot.events.off("close", handleClose);
		};
	}, [floatingTreeRoot.events, store]);
	useHoverFloatingInteraction(floatingContext, {
		enabled: hoverEnabled && !disabled && !isContextMenu && parent.type !== "menubar",
		closeDelay
	});
	const setPopupElement = store.useStateSetter("popupElement");
	const state = {
		transitionStatus,
		side,
		align,
		open,
		nested: parent.type === "menu",
		instant: instantType
	};
	const element = useRenderElement("div", componentProps, {
		state,
		ref: [
			forwardedRef,
			store.context.popupRef,
			setPopupElement
		],
		stateAttributesMapping: popupTransitionStateMapping,
		props: [
			popupProps,
			{ onKeyDown(event) {
				if (insideToolbar && COMPOSITE_KEYS.has(event.key)) event.stopPropagation();
			} },
			getDisabledMountTransitionStyles(transitionStatus),
			elementProps,
			{ "data-rootownerid": rootId }
		]
	});
	let returnFocus = parent.type === void 0 || isContextMenu;
	if (activeTriggerElement || parent.type === "menubar" && lastOpenChangeReason !== "outside-press") returnFocus = true;
	return /*#__PURE__*/ jsx(FloatingFocusManager, {
		context: floatingContext,
		openInteractionType: openMethod,
		modal: isContextMenu,
		disabled: !mounted,
		returnFocus: finalFocus === void 0 ? returnFocus : finalFocus,
		initialFocus: parent.type !== "menu",
		restoreFocus: true,
		externalTree: parent.type !== "menubar" ? floatingTreeRoot : void 0,
		previousFocusableElement: activeTriggerElement,
		nextFocusableElement: parent.type === void 0 ? store.context.triggerFocusTargetRef : void 0,
		beforeContentFocusGuardRef: parent.type === void 0 ? store.context.beforeContentFocusGuardRef : void 0,
		children: element
	});
});
MenuPopup.displayName = "MenuPopup";

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/portal/MenuPortalContext.mjs
const MenuPortalContext = /*#__PURE__*/ React.createContext(void 0);
MenuPortalContext.displayName = "MenuPortalContext";
function useMenuPortalContext() {
	const value = React.useContext(MenuPortalContext);
	if (value === void 0) throw new Error("Base UI: <Menu.Portal> is missing.");
	return value;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/portal/MenuPortal.mjs
/**
* A portal element that moves the popup to a different part of the DOM.
* By default, the portal element is appended to `<body>`.
* Renders a `<div>` element.
*
* Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
*/
const MenuPortal = /*#__PURE__*/ React.forwardRef(function MenuPortal(props, forwardedRef) {
	const { keepMounted = false, ...portalProps } = props;
	const { store } = useMenuRootContext();
	if (!(store.useState("mounted") || keepMounted)) return null;
	return /*#__PURE__*/ jsx(MenuPortalContext.Provider, {
		value: keepMounted,
		children: /*#__PURE__*/ jsx(FloatingPortal, {
			ref: forwardedRef,
			...portalProps
		})
	});
});
MenuPortal.displayName = "MenuPortal";

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/utils/useAnchoredPopupScrollLock.mjs
const VIEWPORT_WIDTH_TOLERANCE_PX = 20;
/**
* Manages scroll lock for anchored popups. For non-touch opens, scroll lock is applied when
* enabled. For touch opens, scroll lock is applied only when the positioner width is effectively
* viewport-sized.
*/
function useAnchoredPopupScrollLock(enabled, touchOpen, positionerElement, referenceElement) {
	const [touchOpenShouldLockScroll, setTouchOpenShouldLockScroll] = React.useState(false);
	useIsoLayoutEffect(() => {
		if (!enabled || !touchOpen || positionerElement == null) {
			setTouchOpenShouldLockScroll(false);
			return;
		}
		const viewportWidth = ownerDocument(positionerElement).documentElement.clientWidth;
		const popupWidth = positionerElement.offsetWidth;
		setTouchOpenShouldLockScroll(viewportWidth > 0 && popupWidth > 0 && popupWidth >= viewportWidth - VIEWPORT_WIDTH_TOLERANCE_PX);
	}, [
		enabled,
		touchOpen,
		positionerElement
	]);
	useScrollLock(enabled && (!touchOpen || touchOpenShouldLockScroll), referenceElement);
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/positioner/MenuPositioner.mjs
/**
* Positions the menu popup against the trigger.
* Renders a `<div>` element.
*
* Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
*/
const MenuPositioner = /*#__PURE__*/ React.forwardRef(function MenuPositioner(componentProps, forwardedRef) {
	const { anchor: anchorProp, positionMethod: positionMethodProp = "absolute", className, render, side, align: alignProp, sideOffset: sideOffsetProp = 0, alignOffset: alignOffsetProp = 0, collisionBoundary = "clipping-ancestors", collisionPadding = 5, arrowPadding = 5, sticky = false, disableAnchorTracking = false, collisionAvoidance: collisionAvoidanceProp = DROPDOWN_COLLISION_AVOIDANCE, style, ...elementProps } = componentProps;
	const { store } = useMenuRootContext();
	const keepMounted = useMenuPortalContext();
	const contextMenuContext = useContextMenuRootContext(true);
	const parent = store.useState("parent");
	const floatingRootContext = store.useState("floatingRootContext");
	const floatingTreeRoot = store.useState("floatingTreeRoot");
	const mounted = store.useState("mounted");
	const open = store.useState("open");
	const modal = store.useState("modal");
	const openMethod = store.useState("openMethod");
	const triggerElement = store.useState("activeTriggerElement");
	const transitionStatus = store.useState("transitionStatus");
	const positionerElement = store.useState("positionerElement");
	const instantType = store.useState("instantType");
	const adaptiveOrigin = store.useState("adaptiveOrigin");
	const lastOpenChangeReason = store.useState("lastOpenChangeReason");
	const floatingNodeId = store.useState("floatingNodeId");
	const floatingParentNodeId = store.useState("floatingParentNodeId");
	const domReference = floatingRootContext.useState("domReferenceElement");
	const previousTriggerRef = React.useRef(null);
	const runOnceAnimationsFinish = useAnimationsFinished(positionerElement);
	let anchor = anchorProp;
	let sideOffset = sideOffsetProp;
	let alignOffset = alignOffsetProp;
	let align = alignProp;
	let collisionAvoidance = collisionAvoidanceProp;
	if (parent.type === "context-menu") {
		anchor = anchorProp ?? parent.context?.anchor;
		align = align ?? "start";
		if (!side && align !== "center") {
			alignOffset = componentProps.alignOffset ?? 2;
			sideOffset = componentProps.sideOffset ?? -5;
		}
	}
	let computedSide = side;
	let computedAlign = align;
	if (parent.type === "menu") {
		computedSide = computedSide ?? "inline-end";
		computedAlign = computedAlign ?? "start";
		collisionAvoidance = componentProps.collisionAvoidance ?? POPUP_COLLISION_AVOIDANCE;
	} else if (parent.type === "menubar") {
		computedSide = computedSide ?? (parent.context.orientation === "vertical" ? "inline-end" : "bottom");
		computedAlign = computedAlign ?? "start";
	}
	const contextMenu = parent.type === "context-menu";
	const positioner = useAnchorPositioning({
		anchor,
		floatingRootContext,
		positionMethod: contextMenuContext ? "fixed" : positionMethodProp,
		mounted,
		side: computedSide,
		sideOffset,
		align: computedAlign,
		alignOffset,
		arrowPadding: contextMenu ? 0 : arrowPadding,
		collisionBoundary,
		collisionPadding,
		sticky,
		nodeId: floatingNodeId,
		keepMounted,
		disableAnchorTracking,
		collisionAvoidance,
		shift: contextMenu ? {
			crossAxis: !("side" in collisionAvoidance && collisionAvoidance.side === "flip"),
			rootBoundary: "layoutViewport"
		} : void 0,
		externalTree: floatingTreeRoot,
		adaptiveOrigin
	});
	React.useEffect(() => {
		function onMenuOpenChange(details) {
			if (details.open) {
				if (details.parentNodeId === floatingNodeId) store.set("hoverEnabled", false);
				if (details.nodeId !== floatingNodeId && details.parentNodeId === store.select("floatingParentNodeId")) store.setOpen(false, createChangeEventDetails(siblingOpen));
			}
		}
		floatingTreeRoot.events.on("menuopenchange", onMenuOpenChange);
		return () => {
			floatingTreeRoot.events.off("menuopenchange", onMenuOpenChange);
		};
	}, [
		store,
		floatingTreeRoot.events,
		floatingNodeId
	]);
	React.useEffect(() => {
		if (store.select("floatingParentNodeId") == null) return;
		function onParentClose(details) {
			if (details.open || details.nodeId !== store.select("floatingParentNodeId")) return;
			const reason = details.reason ?? "sibling-open";
			store.setOpen(false, createChangeEventDetails(reason));
		}
		floatingTreeRoot.events.on("menuopenchange", onParentClose);
		return () => {
			floatingTreeRoot.events.off("menuopenchange", onParentClose);
		};
	}, [floatingTreeRoot.events, store]);
	const closeTimeout = useTimeout();
	React.useEffect(() => {
		if (!open) closeTimeout.clear();
	}, [open, closeTimeout]);
	React.useEffect(() => {
		function onItemHover(event) {
			if (!open || event.nodeId !== store.select("floatingParentNodeId")) return;
			if (event.target && triggerElement && triggerElement !== event.target) {
				const delay = store.select("closeDelay");
				if (delay > 0) {
					if (!closeTimeout.isStarted()) closeTimeout.start(delay, () => {
						store.setOpen(false, createChangeEventDetails(siblingOpen));
					});
				} else store.setOpen(false, createChangeEventDetails(siblingOpen));
			} else closeTimeout.clear();
		}
		floatingTreeRoot.events.on("itemhover", onItemHover);
		return () => {
			floatingTreeRoot.events.off("itemhover", onItemHover);
		};
	}, [
		floatingTreeRoot.events,
		open,
		triggerElement,
		store,
		closeTimeout
	]);
	React.useEffect(() => {
		const eventDetails = {
			open,
			nodeId: floatingNodeId,
			parentNodeId: floatingParentNodeId,
			reason: store.select("lastOpenChangeReason")
		};
		floatingTreeRoot.events.emit("menuopenchange", eventDetails);
	}, [
		floatingTreeRoot.events,
		open,
		store,
		floatingNodeId,
		floatingParentNodeId
	]);
	useIsoLayoutEffect(() => {
		const currentTrigger = domReference;
		const previousTrigger = previousTriggerRef.current;
		if (currentTrigger) previousTriggerRef.current = currentTrigger;
		if (previousTrigger && currentTrigger && currentTrigger !== previousTrigger) {
			store.set("instantType", void 0);
			const abortController = new AbortController();
			runOnceAnimationsFinish(() => {
				store.set("instantType", "trigger-change");
			}, abortController.signal);
			return () => {
				abortController.abort();
			};
		}
	}, [
		domReference,
		runOnceAnimationsFinish,
		store
	]);
	const state = {
		open,
		side: positioner.side,
		align: positioner.align,
		anchorHidden: positioner.anchorHidden,
		nested: parent.type === "menu",
		instant: instantType
	};
	const menubarModal = parent.type === "menubar" && parent.context.modal;
	const popupModal = modal && lastOpenChangeReason !== "trigger-hover";
	useAnchoredPopupScrollLock(open && (menubarModal || popupModal), openMethod === "touch", positionerElement, triggerElement);
	const element = usePositioner(componentProps, state, {
		styles: positioner.positionerStyles,
		transitionStatus,
		props: elementProps,
		refs: [forwardedRef, store.useStateSetter("positionerElement")],
		hidden: !mounted,
		inert: !open
	});
	const shouldRenderBackdrop = mounted && parent.type !== "menu" && (parent.type !== "menubar" && modal && lastOpenChangeReason !== "trigger-hover" || parent.type === "menubar" && parent.context.modal);
	let backdropCutout = null;
	if (parent.type === "menubar") backdropCutout = parent.context.contentElement;
	else if (parent.type === void 0) backdropCutout = triggerElement;
	return /*#__PURE__*/ jsxs(MenuPositionerContext.Provider, {
		value: positioner,
		children: [shouldRenderBackdrop && /*#__PURE__*/ jsx(InternalBackdrop, {
			ref: parent.type === "context-menu" || parent.type === "nested-context-menu" ? parent.context.internalBackdropRef : null,
			inert: inertValue(!open),
			cutout: backdropCutout
		}), /*#__PURE__*/ jsx(FloatingNode, {
			id: floatingNodeId,
			children: /*#__PURE__*/ jsx(CompositeList, {
				elementsRef: store.context.itemDomElements,
				labelsRef: store.context.itemLabels,
				children: element
			})
		})]
	});
});
MenuPositioner.displayName = "MenuPositioner";

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menubar/MenubarContext.mjs
const MenubarContext = /*#__PURE__*/ React.createContext(null);
MenubarContext.displayName = "MenubarContext";
function useMenubarContext(optional) {
	const context = React.useContext(MenubarContext);
	if (context === null && !optional) throw new Error("Base UI: MenubarContext is missing. Menubar parts must be placed within <Menubar>.");
	return context;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/store/MenuStore.mjs
const selectors = {
	...popupStoreSelectors,
	disabled: (state) => state.parent.type === "menubar" ? state.parent.context.disabled || state.disabled : state.disabled,
	modal: (state) => (state.parent.type === void 0 || state.parent.type === "context-menu") && (state.modal ?? true),
	openMethod: (state) => state.openMethod,
	allowMouseEnter: (state) => state.allowMouseEnter,
	highlightItemOnHover: (state) => state.highlightItemOnHover,
	parent: (state) => state.parent,
	rootId: (state) => {
		if (state.parent.type === "menu") return state.parent.store.select("rootId");
		return state.parent.type !== void 0 ? state.parent.context.rootId : state.rootId;
	},
	activeIndex: (state) => state.activeIndex,
	isActive: (state, itemIndex) => state.activeIndex === itemIndex,
	hoverEnabled: (state) => state.hoverEnabled,
	instantType: (state) => state.instantType,
	lastOpenChangeReason: (state) => state.openChangeReason,
	floatingTreeRoot: (state) => {
		if (state.parent.type === "menu") return state.parent.store.select("floatingTreeRoot");
		return state.floatingTreeRoot;
	},
	floatingNodeId: (state) => state.floatingNodeId,
	floatingParentNodeId: (state) => state.floatingParentNodeId,
	itemProps: (state) => state.itemProps,
	closeDelay: (state) => state.closeDelay,
	adaptiveOrigin: (state) => state.adaptiveOrigin,
	keyboardEventRelay: (state) => {
		if (state.keyboardEventRelay) return state.keyboardEventRelay;
		if (state.parent.type === "menu") return state.parent.store.select("keyboardEventRelay");
	}
};
/**
* The store view that detached handle-backed triggers read from. Both the real `MenuStore` and the
* inert fallback store satisfy it, so a trigger can read from whichever store the handle currently
* exposes. Narrowed to the members a trigger actually uses — the trigger-data members plus `setOpen`
* (called by the focus guards) — so the exposed surface can't bypass the open-change pipeline; on
* the detached fallback store every one of these mutations is a no-op.
*/
var MenuStore = class extends ReactStore {
	constructor(initialState) {
		super({
			...createInitialState(),
			...initialState
		}, createInitialContext(), selectors);
		this.unsubscribeParentListener = this.observe("parent", (parent) => {
			this.unsubscribeParentListener?.();
			if (parent.type === "menu") {
				let rootId = parent.store.select("rootId");
				let floatingTreeRoot = parent.store.select("floatingTreeRoot");
				let keyboardEventRelay = parent.store.select("keyboardEventRelay");
				this.unsubscribeParentListener = parent.store.subscribe(() => {
					const nextRootId = parent.store.select("rootId");
					const nextFloatingTreeRoot = parent.store.select("floatingTreeRoot");
					const nextKeyboardEventRelay = parent.store.select("keyboardEventRelay");
					if (rootId === nextRootId && floatingTreeRoot === nextFloatingTreeRoot && keyboardEventRelay === nextKeyboardEventRelay) return;
					rootId = nextRootId;
					floatingTreeRoot = nextFloatingTreeRoot;
					keyboardEventRelay = nextKeyboardEventRelay;
					this.notifyAll();
				});
				this.context.allowMouseUpTriggerRef = parent.store.context.allowMouseUpTriggerRef;
				return;
			}
			if (parent.type !== void 0) this.context.allowMouseUpTriggerRef = parent.context.allowMouseUpTriggerRef;
			this.unsubscribeParentListener = null;
		});
	}
	setOpen(open, eventDetails) {
		this.state.floatingRootContext.context.events.emit("setOpen", {
			open,
			eventDetails
		});
	}
	unsubscribeParentListener = null;
};
function createInitialContext() {
	return {
		positionerRef: /*#__PURE__*/ React.createRef(),
		popupRef: /*#__PURE__*/ React.createRef(),
		typingRef: { current: false },
		itemDomElements: { current: [] },
		itemLabels: { current: [] },
		allowMouseUpTriggerRef: { current: false },
		triggerFocusTargetRef: /*#__PURE__*/ React.createRef(),
		beforeContentFocusGuardRef: /*#__PURE__*/ React.createRef(),
		onOpenChangeComplete: void 0,
		triggerElements: new PopupTriggerMap()
	};
}
function createInitialState() {
	return {
		...createInitialPopupStoreState(),
		disabled: false,
		modal: true,
		openMethod: null,
		allowMouseEnter: false,
		highlightItemOnHover: true,
		parent: { type: void 0 },
		rootId: void 0,
		activeIndex: null,
		hoverEnabled: true,
		instantType: void 0,
		openChangeReason: null,
		floatingTreeRoot: new FloatingTreeStore(),
		floatingNodeId: void 0,
		floatingParentNodeId: null,
		itemProps: EMPTY_OBJECT,
		keyboardEventRelay: void 0,
		closeDelay: 0,
		adaptiveOrigin: void 0
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/submenu-root/MenuSubmenuRootContext.mjs
const MenuSubmenuRootContext = /*#__PURE__*/ React.createContext(void 0);
MenuSubmenuRootContext.displayName = "MenuSubmenuRootContext";
function useMenuSubmenuRootContext() {
	return React.useContext(MenuSubmenuRootContext);
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/root/MenuRoot.mjs
/**
* Groups all parts of the menu.
* Doesn't render its own HTML element.
*
* Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
*/
const MenuRoot = fastComponent(function MenuRoot(props) {
	const { children, open: openProp, onOpenChange, onOpenChangeComplete, defaultOpen = false, disabled: disabledProp = false, modal: modalProp, loopFocus = true, orientation = "vertical", actionsRef, closeParentOnEsc = false, handle, triggerId: triggerIdProp, defaultTriggerId: defaultTriggerIdProp = null, highlightItemOnHover = true } = props;
	const contextMenuContext = useContextMenuRootContext(true);
	const parentMenuRootContext = useMenuRootContext(true);
	const menubarContext = useMenubarContext(true);
	const isSubmenu = useMenuSubmenuRootContext();
	const parentFromContext = React.useMemo(() => {
		if (isSubmenu && parentMenuRootContext) return {
			type: "menu",
			store: parentMenuRootContext.store
		};
		if (menubarContext) return {
			type: "menubar",
			context: menubarContext
		};
		if (contextMenuContext && !parentMenuRootContext) return {
			type: "context-menu",
			context: contextMenuContext
		};
		return { type: void 0 };
	}, [
		contextMenuContext,
		parentMenuRootContext,
		menubarContext,
		isSubmenu
	]);
	const store = useMenuRootStore({
		open: defaultOpen,
		openProp,
		activeTriggerId: defaultTriggerIdProp,
		triggerIdProp,
		parent: parentFromContext
	});
	store.useControlledProp("openProp", openProp);
	store.useControlledProp("triggerIdProp", triggerIdProp);
	store.useContextCallback("onOpenChangeComplete", onOpenChangeComplete);
	const rootId = useId$1();
	const floatingId = useId$1();
	const floatingTreeRoot = store.useState("floatingTreeRoot");
	const floatingNodeIdFromContext = useFloatingNodeId(floatingTreeRoot);
	const floatingParentNodeIdFromContext = useFloatingParentNodeId();
	const open = store.useState("open");
	const activeTriggerElement = store.useState("activeTriggerElement");
	const positionerElement = store.useState("positionerElement");
	const hoverEnabled = store.useState("hoverEnabled");
	const disabled = store.useState("disabled");
	const lastOpenChangeReason = store.useState("lastOpenChangeReason");
	const parent = store.useState("parent");
	const activeIndex = store.useState("activeIndex");
	const payload = store.useState("payload");
	const floatingParentNodeId = store.useState("floatingParentNodeId");
	const openEventRef = React.useRef(null);
	const allowOutsidePressDismissalRef = React.useRef(parent.type !== "context-menu");
	const allowOutsidePressDismissalTimeout = useTimeout();
	const allowTouchToCloseRef = React.useRef(true);
	const allowTouchToCloseTimeout = useTimeout();
	const nested = floatingParentNodeId != null;
	if (parent.type !== void 0 && modalProp !== void 0) console.warn("Base UI: The `modal` prop is not supported on nested menus. It will be ignored.");
	const { openMethod, triggerProps: interactionTypeProps } = useOpenInteractionType(open);
	store.useSyncedValues({
		disabled: disabledProp,
		highlightItemOnHover,
		modal: parent.type === void 0 ? modalProp : void 0,
		openMethod,
		rootId
	});
	useImplicitActiveTrigger(store);
	const { forceUnmount } = useOpenStateTransitions(open, store, () => {
		store.set("allowMouseEnter", false);
	});
	useIsoLayoutEffect(() => {
		if (contextMenuContext && !parentMenuRootContext) store.update({
			parent: {
				type: "context-menu",
				context: contextMenuContext
			},
			floatingNodeId: floatingNodeIdFromContext,
			floatingParentNodeId: floatingParentNodeIdFromContext
		});
		else if (parentMenuRootContext) store.update({
			floatingNodeId: floatingNodeIdFromContext,
			floatingParentNodeId: floatingParentNodeIdFromContext
		});
	}, [
		contextMenuContext,
		parentMenuRootContext,
		floatingNodeIdFromContext,
		floatingParentNodeIdFromContext,
		store
	]);
	React.useEffect(() => {
		if (!open) openEventRef.current = null;
		if (parent.type !== "context-menu") return;
		if (!open) {
			allowOutsidePressDismissalTimeout.clear();
			allowOutsidePressDismissalRef.current = false;
			return;
		}
		allowOutsidePressDismissalTimeout.start(500, () => {
			allowOutsidePressDismissalRef.current = true;
		});
	}, [
		allowOutsidePressDismissalTimeout,
		open,
		parent.type
	]);
	useIsoLayoutEffect(() => {
		if (!open && !hoverEnabled) store.set("hoverEnabled", true);
	}, [
		open,
		hoverEnabled,
		store
	]);
	const setOpen = useStableCallback((nextOpen, eventDetails) => {
		const reason = eventDetails.reason;
		if (!nextOpen && !store.select("open")) return;
		if (open === nextOpen && eventDetails.trigger === activeTriggerElement && lastOpenChangeReason === reason) return;
		const shouldPreventUnmountOnClose = attachPreventUnmountOnClose(eventDetails);
		if (!nextOpen && eventDetails.trigger == null) eventDetails.trigger = activeTriggerElement ?? void 0;
		onOpenChange?.(nextOpen, eventDetails);
		if (eventDetails.isCanceled) return;
		store.state.floatingRootContext.dispatchOpenChange(nextOpen, eventDetails);
		const nativeEvent = eventDetails.event;
		if (nextOpen === false && nativeEvent?.type === "click" && nativeEvent.pointerType === "touch" && !allowTouchToCloseRef.current) return;
		if (nextOpen && reason === "trigger-focus") {
			allowTouchToCloseRef.current = false;
			allowTouchToCloseTimeout.start(300, () => {
				allowTouchToCloseRef.current = true;
			});
		} else {
			allowTouchToCloseRef.current = true;
			allowTouchToCloseTimeout.clear();
		}
		const isKeyboardClick = (reason === "trigger-press" || reason === "item-press") && nativeEvent.detail === 0;
		const isDismissClose = !nextOpen && (reason === "escape-key" || reason == null);
		const updatedState = {
			open: nextOpen,
			openChangeReason: reason
		};
		openEventRef.current = eventDetails.event;
		setPopupOpenState(updatedState, nextOpen, eventDetails.trigger, shouldPreventUnmountOnClose());
		store.update(updatedState);
		if (parent.type === "menubar" && (reason === "trigger-focus" || reason === "focus-out" || reason === "trigger-hover" || reason === "list-navigation" || reason === "sibling-open")) store.set("instantType", "group");
		else if (isKeyboardClick || isDismissClose) store.set("instantType", isKeyboardClick ? "click" : "dismiss");
		else store.set("instantType", void 0);
	});
	const floatingRootContext = useSyncedFloatingRootContext({
		popupStore: store,
		floatingId,
		nested: floatingParentNodeIdFromContext != null,
		onOpenChange: setOpen
	});
	const floatingEvents = floatingRootContext.context.events;
	useIsoLayoutEffect(() => {
		const handleSetOpenEvent = ({ open: nextOpen, eventDetails }) => setOpen(nextOpen, eventDetails);
		floatingEvents.on("setOpen", handleSetOpenEvent);
		return () => {
			floatingEvents?.off("setOpen", handleSetOpenEvent);
		};
	}, [floatingEvents, setOpen]);
	const handleImperativeClose = React.useCallback(() => {
		store.setOpen(false, createChangeEventDetails(imperativeAction));
	}, [store]);
	React.useImperativeHandle(actionsRef, () => ({
		unmount: forceUnmount,
		close: handleImperativeClose
	}), [forceUnmount, handleImperativeClose]);
	let ctx;
	if (parent.type === "context-menu") ctx = parent.context;
	React.useImperativeHandle(ctx?.positionerRef, () => positionerElement, [positionerElement]);
	React.useImperativeHandle(ctx?.actionsRef, () => ({ setOpen }), [setOpen]);
	const dismiss = useDismiss(floatingRootContext, {
		enabled: !disabled,
		bubbles: { escapeKey: closeParentOnEsc && parent.type === "menu" },
		outsidePress() {
			if (parent.type !== "context-menu" || openEventRef.current?.type === "contextmenu") return true;
			return allowOutsidePressDismissalRef.current;
		},
		externalTree: nested ? floatingTreeRoot : void 0
	});
	const direction = useDirection();
	const setActiveIndex = React.useCallback((index) => {
		if (store.select("activeIndex") === index) return;
		store.set("activeIndex", index);
	}, [store]);
	const listNavigation$1 = useListNavigation(floatingRootContext, {
		enabled: !disabled,
		listRef: store.context.itemDomElements,
		activeIndex,
		nested: parent.type !== void 0,
		loopFocus,
		orientation,
		parentOrientation: parent.type === "menubar" ? parent.context.orientation : void 0,
		rtl: direction === "rtl",
		disabledIndices: EMPTY_ARRAY,
		onNavigate: setActiveIndex,
		openOnArrowKeyDown: parent.type !== "context-menu",
		externalTree: nested ? floatingTreeRoot : void 0,
		focusItemOnHover: highlightItemOnHover
	});
	const onTyping = React.useCallback((nextTyping) => {
		store.context.typingRef.current = nextTyping;
	}, [store]);
	const typeahead = useTypeahead(floatingRootContext, {
		enabled: !disabled,
		listRef: store.context.itemLabels,
		elementsRef: store.context.itemDomElements,
		activeIndex,
		resetMs: 500,
		onMatch: (index) => {
			if (open && index !== activeIndex) store.set("activeIndex", index);
		},
		onTyping
	});
	const activeTriggerProps = React.useMemo(() => {
		const mergedProps = mergeProps$1(typeahead.reference, listNavigation$1.reference, dismiss.reference, { onMouseMove() {
			store.set("allowMouseEnter", true);
		} }, interactionTypeProps);
		mergedProps["aria-haspopup"] = "menu";
		mergedProps["aria-expanded"] = open;
		return mergedProps;
	}, [
		store,
		typeahead.reference,
		listNavigation$1.reference,
		dismiss.reference,
		interactionTypeProps,
		open
	]);
	const inactiveTriggerProps = React.useMemo(() => {
		const mergedProps = mergeProps$1(listNavigation$1.trigger, dismiss.trigger, interactionTypeProps);
		mergedProps["aria-haspopup"] = "menu";
		mergedProps["aria-expanded"] = false;
		return mergedProps;
	}, [
		listNavigation$1.trigger,
		dismiss.trigger,
		interactionTypeProps
	]);
	const popupProps = React.useMemo(() => mergeProps$1(FOCUSABLE_POPUP_PROPS, {
		id: floatingId,
		role: "menu",
		"aria-labelledby": activeTriggerElement?.id,
		onMouseMove() {
			store.set("allowMouseEnter", true);
			if (parent.type === "menu") store.set("hoverEnabled", false);
		},
		onClick() {
			if (store.select("hoverEnabled")) store.set("hoverEnabled", false);
		},
		onKeyDown(event) {
			const relay = store.select("keyboardEventRelay");
			if (relay && !event.isPropagationStopped()) relay(event);
		}
	}, typeahead.floating, listNavigation$1.floating, dismiss.floating), [
		activeTriggerElement,
		floatingId,
		parent.type,
		store,
		typeahead.floating,
		listNavigation$1.floating,
		dismiss.floating
	]);
	const itemProps = listNavigation$1.item ?? EMPTY_OBJECT;
	usePopupInteractionProps(store, {
		floatingRootContext,
		activeTriggerProps,
		inactiveTriggerProps,
		popupProps,
		itemProps
	});
	const context = React.useMemo(() => ({
		store,
		parent: parentFromContext
	}), [store, parentFromContext]);
	const content = /*#__PURE__*/ jsxs(MenuRootContext.Provider, {
		value: context,
		children: [handle && /*#__PURE__*/ jsx(PopupHandleAttachment, {
			handle,
			store
		}), typeof children === "function" ? children({ payload }) : children]
	});
	if (parent.type === void 0 || parent.type === "context-menu") return /*#__PURE__*/ jsx(FloatingTree, {
		externalTree: floatingTreeRoot,
		children: content
	});
	return content;
});
MenuRoot.displayName = "MenuRoot";
function useMenuRootStore(initialState) {
	return useRefWithInit(() => new MenuStore(initialState)).current;
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/utils/getPseudoElementBounds.mjs
const BOUNDARY_OFFSET = 5;
/**
* Determines if a mouse event occurred within the bounds of an element
* (including its pseudo-elements), with a small tolerance for pointer drift.
*/
function isMouseWithinBounds(event, element) {
	const bounds = getPseudoElementBounds(element);
	return event.clientX >= bounds.left - BOUNDARY_OFFSET && event.clientX <= bounds.right + BOUNDARY_OFFSET && event.clientY >= bounds.top - BOUNDARY_OFFSET && event.clientY <= bounds.bottom + BOUNDARY_OFFSET;
}
function getPseudoElementBounds(element) {
	const elementRect = element.getBoundingClientRect();
	const win = getWindow(element);
	if (jsdom) return elementRect;
	const beforeStyles = win.getComputedStyle(element, "::before");
	const afterStyles = win.getComputedStyle(element, "::after");
	if (!(beforeStyles.content !== "none" || afterStyles.content !== "none")) return elementRect;
	const beforeWidth = parseFloat(beforeStyles.width) || 0;
	const beforeHeight = parseFloat(beforeStyles.height) || 0;
	const afterWidth = parseFloat(afterStyles.width) || 0;
	const afterHeight = parseFloat(afterStyles.height) || 0;
	const totalWidth = Math.max(elementRect.width, beforeWidth, afterWidth);
	const totalHeight = Math.max(elementRect.height, beforeHeight, afterHeight);
	const widthDiff = totalWidth - elementRect.width;
	const heightDiff = totalHeight - elementRect.height;
	return {
		left: elementRect.left - widthDiff / 2,
		right: elementRect.right + widthDiff / 2,
		top: elementRect.top - heightDiff / 2,
		bottom: elementRect.bottom + heightDiff / 2
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/internals/composite/item/CompositeItem.mjs
function CompositeItem(componentProps) {
	const { render, className, style, state = EMPTY_OBJECT, props = EMPTY_ARRAY, refs = EMPTY_ARRAY, metadata, stateAttributesMapping, tag = "div", ...elementProps } = componentProps;
	const { compositeProps, compositeRef } = useCompositeItem({ metadata });
	return useRenderElement(tag, componentProps, {
		state,
		ref: [compositeRef, ...refs],
		props: [
			compositeProps,
			...props,
			elementProps
		],
		stateAttributesMapping
	});
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/utils/findRootOwnerId.mjs
function findRootOwnerId(node) {
	if (isHTMLElement(node) && node.hasAttribute("data-rootownerid")) return node.getAttribute("data-rootownerid");
	if (isLastTraversableNode(node)) return;
	return findRootOwnerId(getParentNode(node));
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/utils/popups/useTriggerFocusGuards.mjs
/**
* Minimal store interface required by the focus guard hook.
* Both PopoverStore and MenuStore satisfy this interface.
*/
/**
* Provides focus guard handlers for popup triggers (Popover, Menu).
*
* When the popup is open, invisible focus guard elements are placed before and after
* the trigger. These handlers close the popup and move focus to the appropriate
* tabbable element when the guards receive focus (i.e. when the user tabs out).
*/
function useTriggerFocusGuards(store, triggerElementRef) {
	const preFocusGuardRef = React.useRef(null);
	function handlePreFocusGuardFocus(event) {
		ReactDOM.flushSync(() => {
			store.setOpen(false, createChangeEventDetails(focusOut, event.nativeEvent, event.currentTarget));
		});
		getTabbableBeforeElement(preFocusGuardRef.current)?.focus();
	}
	function handleFocusTargetFocus(event) {
		const positionerElement = store.select("positionerElement");
		if (positionerElement && isOutsideEvent(event, positionerElement)) store.context.beforeContentFocusGuardRef.current?.focus();
		else {
			ReactDOM.flushSync(() => {
				store.setOpen(false, createChangeEventDetails(focusOut, event.nativeEvent, event.currentTarget));
			});
			let nextTabbable = getTabbableAfterElement(store.context.triggerFocusTargetRef.current || triggerElementRef.current);
			while (nextTabbable !== null && contains(positionerElement, nextTabbable)) {
				const prevTabbable = nextTabbable;
				nextTabbable = getNextTabbable(nextTabbable);
				if (nextTabbable === prevTabbable) break;
			}
			nextTabbable?.focus();
		}
	}
	return {
		preFocusGuardRef,
		handlePreFocusGuardFocus,
		handleFocusTargetFocus
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/utils/useMixedToggleClickHandler.mjs
/**
* Returns `click` and `mousedown` handlers that fix the behavior of triggers of popups that are toggled by different events.
* For example, a button that opens a popup on mousedown and closes it on click.
* This hook prevents the popup from closing immediately after the mouse button is released.
*/
function useMixedToggleClickHandler(params) {
	const { enabled = true, mouseDownAction, open } = params;
	const ignoreClickRef = React.useRef(false);
	return React.useMemo(() => {
		if (!enabled) return EMPTY_OBJECT;
		return {
			onMouseDown: (event) => {
				if (mouseDownAction === "open" && !open || mouseDownAction === "close" && open) {
					ignoreClickRef.current = true;
					ownerDocument(event.currentTarget).addEventListener("click", () => {
						ignoreClickRef.current = false;
					}, { once: true });
				}
			},
			onClick: (event) => {
				if (ignoreClickRef.current) {
					ignoreClickRef.current = false;
					event.preventBaseUIHandler();
				}
			}
		};
	}, [
		enabled,
		mouseDownAction,
		open
	]);
}

//#endregion
//#region ../../node_modules/.pnpm/@base-ui+react@1.7.0_@types_e9c1e83f6bc6140c3efaf3427f2fbf0a/node_modules/@base-ui/react/menu/trigger/MenuTrigger.mjs
/**
* A button that opens the menu.
* Renders a `<button>` element.
*
* Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
*/
const MenuTrigger = fastComponentRef(function MenuTrigger(componentProps, forwardedRef) {
	const { render, className, style, disabled: disabledProp = false, nativeButton = true, id: idProp, openOnHover: openOnHoverProp, delay = 100, closeDelay = 0, handle, payload, ...elementProps } = componentProps;
	const rootContext = useMenuRootContext(true);
	const store = usePopupHandleStore(handle) ?? rootContext?.store;
	if (!store) throw new Error("Base UI: <Menu.Trigger> must be either used within a <Menu.Root> component or provided with a handle.");
	const thisTriggerId = useBaseUiId(idProp);
	const isTriggerActive = store.useState("isTriggerActive", thisTriggerId);
	const floatingRootContext = store.useState("floatingRootContext");
	const isOpenedByThisTrigger = store.useState("isOpenedByTrigger", thisTriggerId);
	const popupId = store.useState("triggerPopupId", thisTriggerId);
	const triggerElementRef = React.useRef(null);
	const parent = useMenuParent();
	const compositeRootContext = useCompositeRootContext(true);
	const floatingTreeRootFromContext = useFloatingTree();
	const floatingTreeRoot = React.useMemo(() => {
		return floatingTreeRootFromContext ?? new FloatingTreeStore();
	}, [floatingTreeRootFromContext]);
	const floatingNodeId = useFloatingNodeId(floatingTreeRoot);
	const floatingParentNodeId = useFloatingParentNodeId();
	const { registerTrigger, isMountedByThisTrigger } = useTriggerDataForwarding(thisTriggerId, triggerElementRef, store, {
		payload,
		closeDelay,
		parent,
		floatingTreeRoot,
		floatingNodeId,
		floatingParentNodeId,
		keyboardEventRelay: compositeRootContext?.relayKeyboardEvent
	});
	const isInMenubar = parent.type === "menubar";
	const rootDisabled = store.useState("disabled");
	const disabled = disabledProp || rootDisabled || isInMenubar && parent.context.disabled;
	const { getButtonProps, buttonRef } = useButton({
		disabled,
		native: nativeButton
	});
	React.useEffect(() => {
		if (!isOpenedByThisTrigger && parent.type === void 0) store.context.allowMouseUpTriggerRef.current = false;
	}, [
		store,
		isOpenedByThisTrigger,
		parent.type
	]);
	const triggerRef = React.useRef(null);
	const allowMouseUpTriggerTimeout = useTimeout();
	const handleDocumentMouseUp = useStableCallback((mouseEvent) => {
		if (!triggerRef.current) return;
		allowMouseUpTriggerTimeout.clear();
		store.context.allowMouseUpTriggerRef.current = false;
		const mouseUpTarget = mouseEvent.target;
		if (contains(triggerRef.current, mouseUpTarget) || contains(store.select("positionerElement"), mouseUpTarget) || mouseUpTarget === triggerRef.current) return;
		if (mouseUpTarget != null && findRootOwnerId(mouseUpTarget) === store.select("rootId")) return;
		if (isMouseWithinBounds(mouseEvent, triggerRef.current)) return;
		floatingTreeRoot.events.emit("close", {
			domEvent: mouseEvent,
			reason: cancelOpen
		});
	});
	React.useEffect(() => {
		if (isOpenedByThisTrigger && store.select("lastOpenChangeReason") === "trigger-hover") ownerDocument(triggerRef.current).addEventListener("mouseup", handleDocumentMouseUp, { once: true });
	}, [
		isOpenedByThisTrigger,
		handleDocumentMouseUp,
		store
	]);
	const parentMenubarHasSubmenuOpen = isInMenubar && parent.context.hasSubmenuOpen;
	const hoverProps = useHoverReferenceInteraction(floatingRootContext, {
		enabled: (openOnHoverProp ?? parentMenubarHasSubmenuOpen) && !disabled && (!isInMenubar || parentMenubarHasSubmenuOpen && !isMountedByThisTrigger),
		handleClose: safePolygon({ blockPointerEvents: !isInMenubar }),
		mouseOnly: true,
		move: false,
		restMs: parent.type === void 0 ? delay : void 0,
		delay: { close: closeDelay },
		triggerElementRef,
		externalTree: floatingTreeRoot,
		isActiveTrigger: isTriggerActive,
		isClosing: () => store.select("transitionStatus") === "ending"
	});
	const stickIfOpen = useStickIfOpen(isOpenedByThisTrigger, store.select("lastOpenChangeReason"));
	const click = useClick(floatingRootContext, {
		enabled: !disabled,
		event: isOpenedByThisTrigger && isInMenubar ? "click" : "mousedown",
		toggle: true,
		ignoreMouse: false,
		stickIfOpen: parent.type === void 0 ? stickIfOpen : false
	});
	const focus = useFocus(floatingRootContext, { enabled: !disabled && parentMenubarHasSubmenuOpen });
	const mixedToggleHandlers = useMixedToggleClickHandler({
		open: isOpenedByThisTrigger,
		enabled: isInMenubar,
		mouseDownAction: "open"
	});
	const localInteractionProps = React.useMemo(() => mergeProps$1(focus.reference, click.reference), [focus.reference, click.reference]);
	const rootTriggerProps = store.useState("triggerProps", isMountedByThisTrigger);
	const { preFocusGuardRef, handlePreFocusGuardFocus, handleFocusTargetFocus } = useTriggerFocusGuards(store, triggerElementRef);
	const state = {
		disabled,
		open: isOpenedByThisTrigger
	};
	const ref = [
		triggerRef,
		forwardedRef,
		buttonRef,
		registerTrigger,
		triggerElementRef
	];
	const props = [
		localInteractionProps,
		hoverProps ?? EMPTY_OBJECT,
		rootTriggerProps,
		{
			"aria-haspopup": "menu",
			"aria-controls": popupId,
			id: thisTriggerId,
			onMouseDown: (event) => {
				if (store.select("open")) return;
				allowMouseUpTriggerTimeout.start(200, () => {
					store.context.allowMouseUpTriggerRef.current = true;
				});
				ownerDocument(event.currentTarget).addEventListener("mouseup", handleDocumentMouseUp, { once: true });
			}
		},
		isInMenubar ? { role: "menuitem" } : {},
		mixedToggleHandlers,
		elementProps,
		getButtonProps
	];
	const element = useRenderElement("button", componentProps, {
		enabled: !isInMenubar,
		stateAttributesMapping: pressableTriggerOpenStateMapping,
		state,
		ref,
		props
	});
	if (isInMenubar) return /*#__PURE__*/ jsx(CompositeItem, {
		tag: "button",
		render,
		className,
		style,
		state,
		refs: ref,
		props,
		stateAttributesMapping: pressableTriggerOpenStateMapping
	});
	if (isOpenedByThisTrigger) return /*#__PURE__*/ jsxs(React.Fragment, { children: [
		/*#__PURE__*/ jsx(FocusGuard, {
			ref: preFocusGuardRef,
			onFocus: handlePreFocusGuardFocus
		}, `${thisTriggerId}-pre-focus-guard`),
		/*#__PURE__*/ jsx(React.Fragment, { children: element }, thisTriggerId),
		/*#__PURE__*/ jsx(FocusGuard, {
			ref: store.context.triggerFocusTargetRef,
			onFocus: handleFocusTargetFocus
		}, `${thisTriggerId}-post-focus-guard`)
	] });
	return /*#__PURE__*/ jsx(React.Fragment, { children: element }, thisTriggerId);
});
MenuTrigger.displayName = "MenuTrigger";
/**
* Determines whether to ignore clicks after a hover-open.
*/
function useStickIfOpen(open, openReason) {
	const stickIfOpenTimeout = useTimeout();
	const [stickIfOpen, setStickIfOpen] = React.useState(false);
	useIsoLayoutEffect(() => {
		if (open && openReason === "trigger-hover") {
			setStickIfOpen(true);
			stickIfOpenTimeout.start(500, () => {
				setStickIfOpen(false);
			});
		} else if (!open) {
			stickIfOpenTimeout.clear();
			setStickIfOpen(false);
		}
	}, [
		open,
		openReason,
		stickIfOpenTimeout
	]);
	return stickIfOpen;
}
function useMenuParent() {
	const menubarContext = useMenubarContext(true);
	return React.useMemo(() => {
		if (menubarContext) return {
			type: "menubar",
			context: menubarContext
		};
		return { type: void 0 };
	}, [menubarContext]);
}

//#endregion
//#region src/components/ui/dropdown-menu.tsx
function DropdownMenu({ ...props }) {
	return /* @__PURE__ */ jsx(MenuRoot, {
		"data-slot": "dropdown-menu",
		...props
	});
}
function DropdownMenuTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(MenuTrigger, {
		"data-slot": "dropdown-menu-trigger",
		...props
	});
}
function DropdownMenuContent({ align = "start", alignOffset = 0, side = "bottom", sideOffset = 4, className, ...props }) {
	return /* @__PURE__ */ jsx(MenuPortal, { children: /* @__PURE__ */ jsx(MenuPositioner, {
		className: "isolate z-50 outline-none",
		align,
		alignOffset,
		side,
		sideOffset,
		children: /* @__PURE__ */ jsx(MenuPopup, {
			"data-slot": "dropdown-menu-content",
			className: cn("z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95", className),
			...props
		})
	}) });
}
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
	return /* @__PURE__ */ jsx(MenuItem, {
		"data-slot": "dropdown-menu-item",
		"data-inset": inset,
		"data-variant": variant,
		className: cn("group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive", className),
		...props
	});
}

//#endregion
//#region src/lib/paths.ts
/**
* All URL construction goes through this module.
*
* Two separate prefixes are involved and they are easy to confuse:
* - BASE_URL is Vite's `base` — where the whole site is mounted on the host
*   (e.g. "/my-docs" when deployed to a subpath). Baked in at build time.
* - DOCS_PREFIX is where docs pages live *within* the site (default "/docs").
*   Set "" to serve docs at the site root.
*
* Routes stored in the normalized config are base-relative: they include
* DOCS_PREFIX but not BASE_URL. React Router's `basename` adds BASE_URL, so
* only code that bypasses the router (prerender output paths, canonical URLs,
* raw <a href>) needs `toHref`.
*
* Values from `virtual:shiso-config` arrive with defaults applied and already
* normalized by scripts/load-shiso-config.mjs.
*/
/** Strips trailing slashes; "/" and "" both normalize to "". */
function normalizePrefix(value) {
	const trimmed = value.trim().replace(/\/+$/, "");
	if (!trimmed || trimmed === "/") return "";
	return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
const BASE_URL = normalizePrefix(import.meta.env?.BASE_URL || "/");
const DOCS_PREFIX = shiso.docsPrefix;
/** Content directory, relative to the project root, without leading/trailing slashes. */
const CONTENT_DIR = shiso.contentDir;
/** Fixed root for standalone (non-docs) page files. Not configurable, so page
* slugs can never collide with the docs content tree. */
const PAGES_DIR = "content/pages";
/** Absolute origin used for canonical and og:url tags. Undefined when unconfigured. */
const SITE_URL = shiso.siteUrl;
/** Joins path segments with exactly one slash between them. */
function joinPath(...parts) {
	const joined = parts.filter((part) => !!part).join("/").replace(/\/{2,}/g, "/");
	return joined.startsWith("/") ? joined : `/${joined}`;
}
/** Converts a base-relative route to a host-absolute href (prepends BASE_URL). */
function toHref(routePath) {
	if (isExternalHref(routePath)) return routePath;
	return joinPath(BASE_URL, routePath);
}
/** Converts a base-relative route to a fully qualified URL, when SITE_URL is set. */
function toAbsoluteUrl(routePath) {
	return SITE_URL ? `${SITE_URL}${toHref(routePath)}` : void 0;
}
/** Removes BASE_URL from an incoming pathname, yielding a base-relative route. */
function stripBase(pathname) {
	if (BASE_URL && pathname.startsWith(BASE_URL)) return pathname.slice(BASE_URL.length) || "/";
	return pathname;
}
function isExternalHref(href) {
	return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");
}

//#endregion
//#region ../../node_modules/.pnpm/github-slugger@2.0.0/node_modules/github-slugger/regex.js
const regex = /[\0-\x1F!-,\.\/:-@\[-\^`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482\u0530\u0557\u0558\u055A-\u055F\u0589-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EE\u05F3-\u060F\u061B-\u061F\u066A-\u066D\u06D4\u06DD\u06DE\u06E9\u06FD\u06FE\u0700-\u070F\u074B\u074C\u07B2-\u07BF\u07F6-\u07F9\u07FB\u07FC\u07FE\u07FF\u082E-\u083F\u085C-\u085F\u086B-\u089F\u08B5\u08C8-\u08D2\u08E2\u0964\u0965\u0970\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09F2-\u09FB\u09FD\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF0-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B70\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BF0-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C7F\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D4F-\u0D53\u0D58-\u0D5E\u0D64\u0D65\u0D70-\u0D79\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3F\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F17\u0F1A-\u0F1F\u0F2A-\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F98\u0FBD-\u0FC5\u0FC7-\u0FFF\u104A-\u104F\u109E\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u1360-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DB\u17DE\u17DF\u17EA-\u180A\u180E\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DA-\u19FF\u1A1C-\u1A1F\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1AAF\u1AC1-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BF4-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CCF\u1CD3\u1CFB-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u203E\u2041-\u2053\u2055-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u20CF\u20F1-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u215F\u2189-\u24B5\u24EA-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CF4-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u3040\u3097\u3098\u309B\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u319F\u31C0-\u31EF\u3200-\u33FF\u4DC0-\u4DFF\u9FFD-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA673\uA67E\uA6F2-\uA716\uA720\uA721\uA789\uA78A\uA7C0\uA7C1\uA7CB-\uA7F4\uA828-\uA82B\uA82D-\uA83F\uA874-\uA87F\uA8C6-\uA8CF\uA8DA-\uA8DF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA954-\uA95F\uA97D-\uA97F\uA9C1-\uA9CE\uA9DA-\uA9DF\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAAC3-\uAADA\uAADE\uAADF\uAAF0\uAAF1\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABEB\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFDFF\uFE10-\uFE1F\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF3E\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD3F\uDD75-\uDDFC\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEE1-\uDEFF\uDF20-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE40-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE7-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCFF\uDD28-\uDD2F\uDD3A-\uDE7F\uDEAA\uDEAD-\uDEAF\uDEB2-\uDEFF\uDF1D-\uDF26\uDF28-\uDF2F\uDF51-\uDFAF\uDFC5-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC47-\uDC65\uDC70-\uDC7E\uDCBB-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD40-\uDD43\uDD48-\uDD4F\uDD74\uDD75\uDD77-\uDD7F\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDFF\uDE12\uDE38-\uDE3D\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC4B-\uDC4F\uDC5A-\uDC5D\uDC62-\uDC7F\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDC1-\uDDD7\uDDDE-\uDDFF\uDE41-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB9-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF3A-\uDFFF]|\uD806[\uDC3B-\uDC9F\uDCEA-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD44-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE2\uDDE5-\uDDFF\uDE3F-\uDE46\uDE48-\uDE4F\uDE9A-\uDE9C\uDE9E-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC41-\uDC4F\uDC5A-\uDC71\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF7-\uDFAF\uDFB1-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD824-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83D\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDECF\uDEEE\uDEEF\uDEF5-\uDEFF\uDF37-\uDF3F\uDF44-\uDF4F\uDF5A-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE80-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE2\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82C[\uDD1F-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDC9C\uDC9F-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDEBF\uDEFA-\uDFFF]|\uD83A[\uDCC5-\uDCCF\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDD2F\uDD4A-\uDD4F\uDD6A-\uDD6F\uDD8A-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEDE-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]/g;

//#endregion
//#region ../../node_modules/.pnpm/github-slugger@2.0.0/node_modules/github-slugger/index.js
const own = Object.hasOwnProperty;
/**
* Generate a slug.
*
* Does not track previously generated slugs: repeated calls with the same value
* will result in the exact same slug.
* Use the `GithubSlugger` class to get unique slugs.
*
* @param  {string} value
*   String of text to slugify
* @param  {boolean} [maintainCase=false]
*   Keep the current case, otherwise make all lowercase
* @return {string}
*   A unique slug string
*/
function slug(value, maintainCase) {
	if (typeof value !== "string") return "";
	if (!maintainCase) value = value.toLowerCase();
	return value.replace(regex, "").replace(/ /g, "-");
}

//#endregion
//#region src/lib/slug.ts
/**
* Stateless slugify for one-off ids that do not need de-duplication.
*
* github-slugger does not trim, so padded input would otherwise produce leading
* and trailing dashes. Heading text is trimmed upstream by `headingText`; this
* makes the guarantee hold for every other caller too.
*/
function slugify(value) {
	return slug(value.trim());
}
/**
* Slugifies a label into a config-level identifier (tab ids, section ids).
* Falls back when the value contains no slug-able characters.
*/
function slugifyId(value, fallback) {
	return slugify(value) || fallback;
}

//#endregion
//#region src/lib/docs-config.ts
function isRecord(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}
function normalizeLinkTarget(href, target) {
	return target || (/^(?:#|\/|\.\.?\/)/.test(href) ? "_self" : "_blank");
}
function assertDocsConfig(value, sourceName) {
	if (!isRecord(value)) throw new Error(`Invalid docs config in "${sourceName}": expected a JSON object.`);
	if ("anyOf" in value && "definitions" in value && !("navigation" in value)) throw new Error(`Invalid docs config in "${sourceName}": this looks like a JSON schema, not a project config object.`);
	if (!isRecord(value.navigation)) throw new Error(`Invalid docs config in "${sourceName}": missing "navigation" object.`);
}
/** "code-blocks" -> "Code blocks". Sentence case: only the first word is capitalized. */
function toLabel(value) {
	return value.split(/[-_]/g).filter(Boolean).map((word, index) => index === 0 ? word[0]?.toUpperCase() + word.slice(1) : word).join(" ");
}
function normalizePageReference(pageRef) {
	const value = pageRef.trim().replace(/\\/g, "/").replace(/^\/+/, "").replace(/^docs\//, "").replace(/\.mdx?$/, "").replace(/\/+$/, "");
	if (!value) return {
		fileSlug: "index",
		slug: "index"
	};
	return {
		fileSlug: value,
		slug: value === "index" ? "index" : value.replace(/\/index$/, "") || "index"
	};
}
function getDefaultLabel(fileSlug) {
	return toLabel(fileSlug.split("/").filter(Boolean).at(-1) || fileSlug);
}
function pageToUrl(slug, docsPrefix) {
	const base = docsPrefix || "";
	return slug === "index" ? base || "/" : `${base}/${slug}`;
}
function dropdownsToTabs(dropdowns) {
	return dropdowns.map((dropdown, index) => {
		const label = dropdown.dropdown?.trim();
		if (!label) throw new Error(`Invalid docs config: dropdown at index ${index} is missing "dropdown".`);
		return {
			tab: label,
			groups: dropdown.groups || [],
			pages: dropdown.pages || [],
			icon: dropdown.icon,
			hidden: dropdown.hidden,
			presentation: "dropdown"
		};
	});
}
/**
* The mutually exclusive primary navigation modes a container may declare.
* `groups` and `pages` combine into one simple-navigation mode.
*/
function getNavigationModes(container) {
	const modes = [];
	if (container.tabs !== void 0) modes.push("tabs");
	if (container.dropdowns !== void 0) modes.push("dropdowns");
	if (container.versions !== void 0) modes.push("versions");
	if (container.languages !== void 0) modes.push("languages");
	if (container.groups !== void 0 || container.pages !== void 0) modes.push("groups/pages");
	return modes;
}
/** Rejects a container that declares more than one primary navigation mode. */
function assertSingleMode(container, where) {
	const modes = getNavigationModes(container);
	if (modes.length > 1) throw new Error(`Invalid docs config: ${where} must define exactly one of tabs, dropdowns, versions, languages, or groups/pages — found ${modes.join(" and ")}.`);
}
/** Rejects arrays where more than one entry claims to be the default. */
function assertSingleDefault(items, kind, getLabel) {
	const defaults = items.filter((item) => item.default === true);
	if (defaults.length > 1) {
		const labels = defaults.map(getLabel).filter(Boolean);
		throw new Error(`Invalid docs config: multiple ${kind} are marked "default": ${labels.join(", ")}. Only one ${kind.replace(/s$/, "")} may be the default.`);
	}
}
/** Explicit default first, then the first visible entry, then the first entry. */
function pickDefaultEntry(items) {
	return items.find((item) => item.default === true) || items.find((item) => !item.hidden) || items[0];
}
/**
* Resolves a leaf navigation container (one that no longer carries versions or
* languages) down to a flat list of tabs.
*/
function getTabsFromLeafContainer(container, fallbackLabel = "") {
	if (Array.isArray(container.tabs)) {
		if (!container.tabs.length) throw new Error("Invalid docs config: \"tabs\" must contain at least one tab.");
		return container.tabs;
	}
	if (Array.isArray(container.dropdowns)) {
		if (!container.dropdowns.length) throw new Error("Invalid docs config: \"dropdowns\" must contain at least one dropdown.");
		return dropdownsToTabs(container.dropdowns);
	}
	if (Array.isArray(container.groups) || Array.isArray(container.pages)) return [{
		tab: fallbackLabel,
		groups: container.groups || [],
		pages: container.pages || []
	}];
	throw new Error("Invalid docs config: navigation must define tabs, dropdowns, groups, pages, versions, or languages.");
}
function hasExplicitTopNavigation(container) {
	return Array.isArray(container.tabs) && container.tabs.length > 0 || Array.isArray(container.dropdowns) && container.dropdowns.length > 0;
}
function makeVersionScopeSource(version, language, isDefault, isLanguageDefault) {
	const versionLabel = version.version?.trim();
	if (!versionLabel) throw new Error("Invalid docs config: version entry is missing \"version\".");
	assertSingleMode(version, `version "${versionLabel}"`);
	const languageLabel = language?.language?.trim();
	const idBase = [languageLabel, versionLabel].filter(Boolean).join("-");
	return {
		id: slugifyId(idBase, "scope"),
		language: languageLabel || void 0,
		version: versionLabel,
		hidden: version.hidden || language?.hidden || void 0,
		isDefault,
		isLanguageDefault,
		container: version,
		fallbackLabel: versionLabel
	};
}
function collectScopeSources(navigation) {
	assertSingleMode(navigation, "navigation");
	if (navigation.versions !== void 0) {
		const versions = navigation.versions;
		if (!Array.isArray(versions) || !versions.length) throw new Error("Invalid docs config: \"versions\" must contain at least one version.");
		assertSingleDefault(versions, "versions", (item) => item.version);
		const defaultVersion = pickDefaultEntry(versions);
		return versions.map((version) => makeVersionScopeSource(version, void 0, version === defaultVersion, version === defaultVersion));
	}
	if (navigation.languages !== void 0) {
		const languages = navigation.languages;
		if (!Array.isArray(languages) || !languages.length) throw new Error("Invalid docs config: \"languages\" must contain at least one language.");
		assertSingleDefault(languages, "languages", (item) => item.language);
		const defaultLanguage = pickDefaultEntry(languages);
		return languages.flatMap((language) => {
			const languageLabel = language.language?.trim();
			if (!languageLabel) throw new Error("Invalid docs config: language entry is missing \"language\".");
			assertSingleMode(language, `language "${languageLabel}"`);
			if (language.versions !== void 0) {
				const versions = language.versions;
				if (!Array.isArray(versions) || !versions.length) throw new Error(`Invalid docs config: language "${languageLabel}" "versions" must contain at least one version.`);
				assertSingleDefault(versions, `language "${languageLabel}" versions`, (item) => item.version);
				const defaultVersion = pickDefaultEntry(versions);
				return versions.map((version) => makeVersionScopeSource(version, language, language === defaultLanguage && version === defaultVersion, version === defaultVersion));
			}
			return [{
				id: slugifyId(languageLabel, "scope"),
				language: languageLabel,
				hidden: language.hidden || void 0,
				isDefault: language === defaultLanguage,
				isLanguageDefault: true,
				container: language,
				fallbackLabel: languageLabel
			}];
		});
	}
	return [{
		id: "default",
		isDefault: true,
		isLanguageDefault: true,
		container: navigation,
		fallbackLabel: ""
	}];
}
function addPage(pageRef, context, state, extra = {}) {
	const { fileSlug, slug } = normalizePageReference(pageRef);
	const order = state.order.value++;
	state.pages.push({
		fileSlug,
		slug,
		label: extra.label?.trim() || getDefaultLabel(fileSlug),
		section: context.section,
		tabId: context.tabId,
		tabLabel: context.tabLabel,
		order,
		hidden: extra.hidden || context.hidden || void 0,
		icon: extra.icon,
		tag: extra.tag
	});
	return order;
}
function collectPages(items, context, state) {
	const nodes = [];
	items.forEach((item) => {
		if (typeof item === "string") {
			nodes.push({
				kind: "page",
				order: addPage(item, context, state)
			});
			return;
		}
		if (!isRecord(item)) throw new Error("Invalid docs config: page items must be strings, { page }, { href }, or { group, pages } blocks.");
		if (typeof item.href === "string" && item.href) {
			const label = typeof item.label === "string" && item.label.trim() || typeof item.anchor === "string" && item.anchor.trim();
			if (!label) throw new Error(`Invalid docs config: external link "${item.href}" is missing a label.`);
			nodes.push({
				kind: "link",
				label,
				href: item.href,
				icon: typeof item.icon === "string" ? item.icon : void 0,
				hidden: item.hidden === true || context.hidden || void 0,
				target: normalizeLinkTarget(item.href, item.target === "_self" || item.target === "_blank" ? item.target : void 0)
			});
			return;
		}
		if (typeof item.page === "string") {
			const label = typeof item.label === "string" && item.label || typeof item.title === "string" && item.title || void 0;
			nodes.push({
				kind: "page",
				order: addPage(item.page, context, state, {
					label,
					icon: typeof item.icon === "string" ? item.icon : void 0,
					tag: typeof item.tag === "string" ? item.tag : void 0,
					hidden: item.hidden === true
				})
			});
			return;
		}
		if (typeof item.group === "string" && Array.isArray(item.pages)) {
			const label = item.group.trim();
			if (!label) throw new Error("Invalid docs config: navigation group is missing \"group\".");
			const hidden = item.hidden === true || context.hidden || void 0;
			const childContext = {
				...context,
				section: label,
				hidden
			};
			nodes.push({
				kind: "group",
				label,
				rootOrder: typeof item.root === "string" && item.root.trim() ? addPage(item.root, childContext, state) : void 0,
				children: collectPages(item.pages, childContext, state),
				icon: typeof item.icon === "string" ? item.icon : void 0,
				expanded: item.expanded === true || void 0,
				collapsible: item.collapsible === false ? false : void 0,
				hidden
			});
			return;
		}
		throw new Error(`Invalid docs config: unrecognized page item with keys [${Object.keys(item).join(", ")}]. Supported items are strings, { page }, { href }, or { group, pages } blocks.`);
	});
	return nodes;
}
function collectAnchors(anchors) {
	if (!Array.isArray(anchors)) return [];
	return anchors.map((anchor, index) => {
		const label = isRecord(anchor) && typeof anchor.anchor === "string" ? anchor.anchor.trim() : "";
		const href = isRecord(anchor) && typeof anchor.href === "string" ? anchor.href : "";
		if (!label || !href) throw new Error(`Invalid docs config: anchor at index ${index} must define both "anchor" and "href".`);
		return {
			kind: "link",
			label,
			href,
			icon: anchor.icon,
			hidden: anchor.hidden || void 0,
			target: normalizeLinkTarget(href, anchor.target)
		};
	});
}
function normalizeScope(name, source, anchors, resolveDocFile, docsPrefix) {
	const tabs = getTabsFromLeafContainer(source.container, source.fallbackLabel);
	const showTabs = hasExplicitTopNavigation(source.container);
	const state = {
		pages: [],
		order: { value: 0 }
	};
	const treeByTab = /* @__PURE__ */ new Map();
	const seenTabIds = /* @__PURE__ */ new Set();
	const tabIds = [];
	tabs.forEach((tab, index) => {
		const tabLabel = tab.tab?.trim() || "";
		if (!tabLabel && showTabs) throw new Error(`Invalid docs config: tab at index ${index} is missing "tab".`);
		const tabId = slugifyId(tabLabel || "documentation", `tab-${index + 1}`);
		if (seenTabIds.has(tabId)) throw new Error(`Invalid docs config: duplicate tab label "${tabLabel}" resolves to duplicate id "${tabId}".`);
		seenTabIds.add(tabId);
		tabIds.push(tabId);
		const context = {
			tabId,
			tabLabel,
			section: tabLabel,
			hidden: tab.hidden || void 0
		};
		const nodes = [];
		const pagesBefore = state.pages.length;
		if (Array.isArray(tab.groups)) tab.groups.forEach((group) => {
			if (!group?.group || !Array.isArray(group.pages)) throw new Error(`Invalid docs config: tab "${tabLabel}" has an invalid group entry.`);
			nodes.push(...collectPages([group], context, state));
		});
		if (Array.isArray(tab.dropdowns)) tab.dropdowns.forEach((dropdown, dropdownIndex) => {
			const dropdownLabel = dropdown?.dropdown?.trim();
			if (!dropdownLabel) throw new Error(`Invalid docs config: tab "${tabLabel}" dropdown at index ${dropdownIndex} is missing "dropdown".`);
			const children = [];
			const dropdownContext = {
				...context,
				section: dropdownLabel,
				hidden: dropdown.hidden || context.hidden || void 0
			};
			if (Array.isArray(dropdown.groups)) dropdown.groups.forEach((group) => {
				if (!group?.group || !Array.isArray(group.pages)) throw new Error(`Invalid docs config: tab "${tabLabel}" dropdown "${dropdownLabel}" has an invalid group entry.`);
				children.push(...collectPages([group], dropdownContext, state));
			});
			if (Array.isArray(dropdown.pages) && dropdown.pages.length) children.push(...collectPages(dropdown.pages, dropdownContext, state));
			nodes.push({
				kind: "group",
				label: dropdownLabel,
				children,
				icon: dropdown.icon,
				hidden: dropdownContext.hidden
			});
		});
		if (Array.isArray(tab.pages) && tab.pages.length) nodes.push(...collectPages(tab.pages, context, state));
		const isLinkTab = typeof tab.href === "string" && !!tab.href;
		if (isLinkTab && state.pages.length !== pagesBefore) throw new Error(`Invalid docs config: tab "${tabLabel}" cannot define both "href" and page entries.`);
		if (!isLinkTab && state.pages.length === pagesBefore) throw new Error(`Invalid docs config: tab "${tabLabel}" does not contain any supported page entries.`);
		treeByTab.set(tabId, nodes);
	});
	const pending = state.pages;
	if (!pending.length) throw new Error("Invalid docs config: no pages found in navigation.");
	const seenFileSlugs = /* @__PURE__ */ new Set();
	const seenRouteSlugs = /* @__PURE__ */ new Set();
	for (const page of pending) {
		if (seenFileSlugs.has(page.fileSlug)) throw new Error(`Invalid docs config: duplicate page reference "${page.fileSlug}".`);
		if (seenRouteSlugs.has(page.slug)) throw new Error(`Invalid docs config: duplicate route slug "${page.slug}".`);
		seenFileSlugs.add(page.fileSlug);
		seenRouteSlugs.add(page.slug);
	}
	const filePathBySlug = new Map([...seenFileSlugs].map((fileSlug) => {
		const filePath = resolveDocFile(fileSlug);
		if (!filePath) throw new Error(`Missing docs page file for "${fileSlug}": expected "${fileSlug}.mdx" or ".md".`);
		return [fileSlug, filePath];
	}));
	const pageBySlug = {};
	const pageByLookupSlug = {};
	const pageByOrder = /* @__PURE__ */ new Map();
	const pages = [];
	for (const page of pending) {
		const filePath = filePathBySlug.get(page.fileSlug);
		if (!filePath) throw new Error(`Invalid docs config: failed to resolve file for "${page.fileSlug}".`);
		const normalized = {
			...page,
			url: pageToUrl(page.slug, docsPrefix),
			filePath,
			scopeId: source.id,
			language: source.language,
			version: source.version
		};
		pages.push(normalized);
		pageByOrder.set(normalized.order, normalized);
		pageBySlug[normalized.slug] = normalized;
		pageByLookupSlug[normalized.slug] = normalized;
		pageByLookupSlug[normalized.fileSlug] = normalized;
		pageByLookupSlug[normalized.fileSlug.replace(/\/index$/, "") || "index"] = normalized;
	}
	function materialize(node) {
		if (node.kind === "link") return node;
		if (node.kind === "page") {
			const page = pageByOrder.get(node.order);
			return page ? {
				kind: "page",
				page
			} : null;
		}
		const root = node.rootOrder === void 0 ? void 0 : pageByOrder.get(node.rootOrder);
		return {
			kind: "group",
			label: node.label,
			root: root ? {
				kind: "page",
				page: root
			} : void 0,
			children: node.children.map(materialize).filter((child) => !!child),
			icon: node.icon,
			expanded: node.expanded,
			collapsible: node.collapsible,
			hidden: node.hidden
		};
	}
	const navigation = {};
	for (const [tabId, nodes] of treeByTab) navigation[tabId] = nodes.map(materialize).filter((node) => !!node);
	const firstVisiblePageByTab = /* @__PURE__ */ new Map();
	for (const page of pages) if (!page.hidden && !firstVisiblePageByTab.has(page.tabId)) firstVisiblePageByTab.set(page.tabId, page);
	return {
		name,
		tabs: tabs.map((tab, index) => {
			const tabId = tabIds[index];
			const firstPage = firstVisiblePageByTab.get(tabId);
			const href = typeof tab.href === "string" && tab.href ? tab.href : void 0;
			return {
				id: tabId,
				label: tab.tab?.trim() || "",
				url: href || firstPage?.url || pageToUrl("index", docsPrefix),
				icon: tab.icon,
				presentation: tab.presentation || "tab",
				hidden: tab.hidden || void 0,
				link: href ? true : void 0
			};
		}),
		showTabs,
		navigation,
		anchors: collectAnchors(anchors),
		pages,
		pageBySlug,
		pageByLookupSlug
	};
}
/**
* Normalizes the complete docs site: one scope for ordinary navigation, one per
* version, one per language, and one per version nested inside a language.
* Every scope builds, including hidden ones; hidden scopes are only omitted
* from switcher UI. Page references and route URLs are validated globally.
*/
function normalizeDocsSite(docsConfig, resolveDocFile, options = {}) {
	const docsPrefix = options.docsPrefix ?? DOCS_PREFIX;
	const sources = collectScopeSources(docsConfig.navigation);
	const anchors = docsConfig.navigation.anchors;
	const seenScopeIds = /* @__PURE__ */ new Set();
	for (const source of sources) {
		if (seenScopeIds.has(source.id)) throw new Error(`Invalid docs config: duplicate version/language label resolves to duplicate scope id "${source.id}".`);
		seenScopeIds.add(source.id);
	}
	const scopes = sources.map((source) => {
		const docs = normalizeScope(docsConfig.name, source, anchors, resolveDocFile, docsPrefix);
		const firstPage = docs.pages.find((page) => !page.hidden) || docs.pages[0];
		return {
			id: source.id,
			language: source.language,
			version: source.version,
			hidden: source.hidden,
			isDefault: source.isDefault,
			isLanguageDefault: source.isLanguageDefault,
			firstPageUrl: firstPage.url,
			docs
		};
	});
	const pages = [];
	const pageByUrl = {};
	const fileOwners = /* @__PURE__ */ new Map();
	for (const scope of scopes) for (const page of scope.docs.pages) {
		if (fileOwners.get(page.fileSlug) !== void 0) throw new Error(`Invalid docs config: page "${page.fileSlug}" is referenced by multiple navigation scopes. Each version/language must reference its own content files.`);
		fileOwners.set(page.fileSlug, scope.id);
		if (pageByUrl[page.url]) throw new Error(`Invalid docs config: duplicate route URL "${page.url}" across versions/languages.`);
		pageByUrl[page.url] = page;
		pages.push(page);
	}
	return {
		scopes,
		defaultScopeId: (scopes.find((scope) => scope.isDefault) || scopes[0]).id,
		pages,
		pageByUrl
	};
}
function getDefaultScope(site) {
	return site.scopes.find((scope) => scope.id === site.defaultScopeId) || site.scopes[0];
}
function getScopeById(site, scopeId) {
	return site.scopes.find((scope) => scope.id === scopeId) || null;
}
function getScopeForPage(site, page) {
	return getScopeById(site, page.scopeId) || getDefaultScope(site);
}
/**
* One landing scope per language, for language switchers: the language's
* default-version scope, or its first visible scope when the default is
* hidden. Fully hidden languages are omitted.
*/
function getLanguageScopes(site) {
	const byLanguage = /* @__PURE__ */ new Map();
	for (const scope of site.scopes) {
		if (!scope.language) continue;
		const list = byLanguage.get(scope.language) || [];
		list.push(scope);
		byLanguage.set(scope.language, list);
	}
	const landings = [];
	for (const scopes of byLanguage.values()) {
		const visible = scopes.filter((scope) => !scope.hidden);
		if (visible.length) landings.push(visible.find((scope) => scope.isLanguageDefault) || visible[0]);
	}
	return landings;
}
/**
* Exact page lookup by pathname. Tolerates trailing slashes and explicit
* `/index` suffixes; everything else must match a page URL exactly.
*/
function getPageByPathname$1(site, pathname) {
	const trimmed = pathname.replace(/\/+$/, "") || "/";
	const collapsed = trimmed === "/index" ? "/" : trimmed.replace(/\/index$/, "") || "/";
	return site.pageByUrl[trimmed] || site.pageByUrl[collapsed] || null;
}
/** Flattens a navigation tree to the routed pages it contains, in document order. */
function flattenNav(nodes) {
	const pages = [];
	for (const node of nodes) if (node.kind === "page") pages.push(node.page);
	else if (node.kind === "group") {
		if (node.root) pages.push(node.root.page);
		pages.push(...flattenNav(node.children));
	}
	return pages;
}
/** True when a node (or all of its descendants) should be omitted from the sidebar. */
function isNodeHidden(node) {
	if (node.kind === "page") return !!node.page.hidden;
	if (node.kind === "link") return !!node.hidden;
	return !!node.hidden || node.children.every(isNodeHidden);
}

//#endregion
//#region src/lib/content.ts
/**
* Eagerly imports every content file at build time. Markdown/MDX modules
* export a compiled component plus generated frontmatter and TOC values. TSX
* standalone pages export their component and may export frontmatter directly.
*
* Eager loading keeps server prerendering and client hydration in sync
* without Suspense, at the cost of bundling all pages together.
*
* The glob pattern must be a literal for Vite to statically analyze it, so it
* covers all of `content/` and the configured shiso.config `contentDir` is applied at
* lookup time instead. That also lets later versioned/localized content roots
* (`content/v2`, `content/es`) work without touching this glob.
*/
const docModules = import.meta.glob("/content/**/*.{md,mdx,tsx}", { eager: true });
/**
* Resolves a docs.json page reference (e.g. "components/tabs") to a module
* key (e.g. "/content/docs/components/tabs.mdx"). Returns undefined when the
* file does not exist, which makes config normalization fail at startup/build.
*/
function resolveDocFile(fileSlug, contentDir = CONTENT_DIR) {
	return [`/${contentDir}/${fileSlug}.mdx`, `/${contentDir}/${fileSlug}.md`].find((candidate) => candidate in docModules);
}
/**
* Resolves a standalone page slug (docs.json `pages[].page`) to a module key
* under the fixed content/pages root.
*/
function resolvePageFile(fileSlug) {
	return [
		`/${PAGES_DIR}/${fileSlug}.tsx`,
		`/${PAGES_DIR}/${fileSlug}.mdx`,
		`/${PAGES_DIR}/${fileSlug}.md`
	].find((candidate) => candidate in docModules);
}
function getDocModule(filePath) {
	return docModules[filePath];
}
/**
* Last-modified date of a content file, captured from git history at build
* time (see scripts/generate-last-modified.mjs). ISO 8601, or undefined for
* files outside the generated map.
*/
function getLastModified(filePath) {
	return LAST_MODIFIED[filePath];
}

//#endregion
//#region src/lib/locale.ts
/** Primary language subtags written right-to-left. */
const RTL_LANGUAGES = /* @__PURE__ */ new Set([
	"ar",
	"ckb",
	"dv",
	"fa",
	"he",
	"iw",
	"ps",
	"sd",
	"ug",
	"ur",
	"yi"
]);
/** BCP 47-shaped tags with a 2-3 letter primary subtag, e.g. "es" or "pt-BR". */
const LOCALE_PATTERN = /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i;
function isValidLocale(value) {
	if (!value || !LOCALE_PATTERN.test(value)) return false;
	try {
		return Intl.getCanonicalLocales(value).length > 0;
	} catch {
		return false;
	}
}
/**
* Locale for a page: its scope's language code when valid, then the
* site-wide shiso.config `locale`, then en-US.
*/
function resolveLocale(language, fallback) {
	if (isValidLocale(language)) return Intl.getCanonicalLocales(language)[0];
	if (isValidLocale(fallback)) return Intl.getCanonicalLocales(fallback)[0];
	return "en-US";
}
/** Document direction for a locale, e.g. "ar" and "he" read right-to-left. */
function getTextDirection(locale) {
	const primary = locale.split("-")[0]?.toLowerCase() || "";
	return RTL_LANGUAGES.has(primary) ? "rtl" : "ltr";
}

//#endregion
//#region src/lib/search/config.ts
const DEFAULT_SEARCH_PROMPT = "Search...";
const DEFAULT_SEARCH_PROVIDER = "local";
const DEFAULT_SEARCH_SHORTCUT = "k";
const DEFAULT_SEARCH_SHORTCUT_LABEL = "Ctrl K";
const DEFAULT_SEARCH_POSITION = "header";
/** Positions the built-in theme knows how to render. */
const SEARCH_POSITIONS = ["header", "sidebar"];
/**
* Themes must always support "header", so anything unrecognized (or not
* implemented by the active theme) lands there instead of vanishing.
*/
function resolveSearchPosition(position, supported = SEARCH_POSITIONS) {
	if (typeof position === "string" && supported.includes(position)) return position;
	if (position !== void 0 && position !== "header") console.warn(`[shiso] Unsupported search.position "${String(position)}" — using "${DEFAULT_SEARCH_POSITION}".`);
	return DEFAULT_SEARCH_POSITION;
}
/** Normalizes docs.json search settings for both the UI and provider loader. */
function resolveSearchConfig(config) {
	if (config === false) return {
		enabled: false,
		prompt: DEFAULT_SEARCH_PROMPT,
		position: DEFAULT_SEARCH_POSITION,
		provider: DEFAULT_SEARCH_PROVIDER,
		options: {},
		shortcut: false,
		shortcutLabel: DEFAULT_SEARCH_SHORTCUT_LABEL
	};
	return {
		enabled: true,
		prompt: config?.prompt?.trim() || "Search...",
		position: resolveSearchPosition(config?.position),
		provider: config?.provider?.trim().toLowerCase() || "local",
		options: config?.options || {},
		shortcut: config?.shortcut === false ? false : config?.shortcut?.trim().toLowerCase() || "k",
		shortcutLabel: config?.shortcutLabel?.trim() || "Ctrl K"
	};
}

//#endregion
//#region src/lib/site-model.ts
const SHISO_THEME_LABELS = {
	menu: "Menu",
	documentationNavigation: "Documentation navigation",
	sections: "Sections",
	tableOfContents: "On this page",
	tableOfContentsNavigation: "Table of contents",
	searchTitle: "Search",
	searching: "Searching...",
	searchUnavailable: "Search unavailable",
	noResults: "No results",
	lastUpdated: "Last updated on",
	relatedTopics: "Related topics",
	previousPage: "Previous",
	nextPage: "Next",
	notFound: "Page not found",
	dismissBanner: "Dismiss banner",
	toggleTheme: "Toggle theme",
	moreOptions: "More options",
	copied: "Copied",
	expand: "Expand",
	collapse: "Collapse",
	copyPage: "Copy page",
	copyPageDescription: "Copy this page as Markdown",
	viewMarkdown: "View as Markdown",
	viewMarkdownDescription: "Open this page as plain Markdown",
	openInChatGPT: "Open in ChatGPT",
	openInClaude: "Open in Claude",
	openInPerplexity: "Open in Perplexity",
	askQuestionsAboutPage: "Ask questions about this page"
};
function isInternalHref(href) {
	return /^(?:#|\/|\.\.?\/)/.test(href);
}
function resolveLinkTarget(href, target) {
	return target || (isInternalHref(href) ? "_self" : "_blank");
}
function normalizeLink(link) {
	return {
		href: link.href,
		label: link.label?.trim() || void 0,
		ariaLabel: link.ariaLabel?.trim() || void 0,
		icon: link.icon?.trim() || void 0,
		target: resolveLinkTarget(link.href, link.target)
	};
}
function normalizeNavbar(config) {
	if (!config) return null;
	const links = (config.links || []).filter((link) => !!link?.href).map(normalizeLink);
	const primary = config.primary?.href ? normalizeLink(config.primary) : void 0;
	return links.length || primary ? {
		links,
		primary
	} : null;
}
function normalizeFooter(config) {
	const socials = (config?.socials || []).filter((link) => !!link?.href).map(normalizeLink);
	const links = (config?.links || []).filter((column) => column?.items?.length).map((column) => ({
		...column,
		items: column.items.map((item) => ({
			...item,
			target: resolveLinkTarget(item.href, item.target)
		}))
	}));
	const attribution = config?.attribution !== false;
	return socials.length || links.length || attribution ? {
		socials,
		links,
		attribution
	} : null;
}
function resolveSiteModel(config, docs, shiso) {
	const appearance = config.appearance || {};
	const logo = config.logo ? typeof config.logo === "string" ? {
		light: config.logo,
		dark: config.logo
	} : {
		light: config.logo.light || config.logo.dark,
		dark: config.logo.dark || config.logo.light,
		href: config.logo.href,
		target: config.logo.href ? resolveLinkTarget(config.logo.href, config.logo.target) : void 0,
		invert: config.logo.invert === true
	} : null;
	return {
		name: config.name?.trim() || void 0,
		logo,
		navbar: normalizeNavbar(config.navbar),
		footer: normalizeFooter(config.footer),
		banner: config.banner?.content?.trim() ? {
			content: config.banner.content.trim(),
			dismissible: config.banner.dismissible === true
		} : null,
		appearance: {
			default: appearance.default === "light" || appearance.default === "dark" ? appearance.default : "system",
			strict: appearance.strict === true
		},
		styling: { eyebrows: config.styling?.eyebrows === "breadcrumbs" ? "breadcrumbs" : "section" },
		search: resolveSearchConfig(config.search),
		contextualOptions: config.contextual?.options || [],
		error404: {
			...config.errors?.["404"],
			redirect: config.errors?.["404"]?.redirect !== false
		},
		showTimestamp: config.metadata?.timestamp === true,
		drilldown: config.interaction?.drilldown,
		locale: shiso?.locale || "en-US",
		labels: SHISO_THEME_LABELS,
		docs
	};
}
function aiPrompt(mdUrl) {
	return `Read ${mdUrl} so I can ask questions about it.`;
}
function resolveContextualOptions(options, page, labels = SHISO_THEME_LABELS) {
	const mdHref = `${toHref(page.url)}.md`;
	const absolutePageUrl = toAbsoluteUrl(page.url);
	const mdUrl = absolutePageUrl ? `${absolutePageUrl}.md` : void 0;
	const resolved = [];
	for (const option of options) {
		if (typeof option !== "string") {
			const custom = option;
			const href = custom.href.replaceAll("$path", page.url).replaceAll("$page", mdUrl || mdHref);
			resolved.push({
				key: custom.title,
				title: custom.title,
				description: custom.description,
				icon: custom.icon,
				action: "link",
				href,
				target: resolveLinkTarget(href, custom.target)
			});
			continue;
		}
		if (option === "copy") resolved.push({
			key: option,
			title: labels.copyPage,
			description: labels.copyPageDescription,
			icon: "copy",
			action: "copy",
			href: mdHref,
			target: "_self"
		});
		else if (option === "view") resolved.push({
			key: option,
			title: labels.viewMarkdown,
			description: labels.viewMarkdownDescription,
			icon: "external-link",
			action: "link",
			href: mdHref,
			target: "_blank"
		});
		else if (mdUrl && option === "chatgpt") resolved.push({
			key: option,
			title: labels.openInChatGPT,
			description: labels.askQuestionsAboutPage,
			icon: "external-link",
			action: "link",
			href: `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
			target: "_blank"
		});
		else if (mdUrl && option === "claude") resolved.push({
			key: option,
			title: labels.openInClaude,
			description: labels.askQuestionsAboutPage,
			icon: "external-link",
			action: "link",
			href: `https://claude.ai/new?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
			target: "_blank"
		});
		else if (mdUrl && option === "perplexity") resolved.push({
			key: option,
			title: labels.openInPerplexity,
			description: labels.askQuestionsAboutPage,
			icon: "external-link",
			action: "link",
			href: `https://www.perplexity.ai/search?q=${encodeURIComponent(aiPrompt(mdUrl))}`,
			target: "_blank"
		});
	}
	return resolved;
}

//#endregion
//#region src/lib/standalone-pages.ts
function invalid(message) {
	return /* @__PURE__ */ new Error(`Invalid docs config: ${message}`);
}
/** Trims and canonicalizes a standalone route path; throws when malformed. */
function normalizePath(rawPath) {
	const value = typeof rawPath === "string" ? rawPath.trim() : "";
	if (!value.startsWith("/")) throw invalid(`standalone page path "${String(rawPath)}" must start with "/".`);
	if (/[:*]/.test(value)) throw invalid(`standalone page path "${value}" must not use wildcard patterns.`);
	if (/\.(?:mdx?|tsx)$/i.test(value)) throw invalid(`standalone page path "${value}" must be a route, not a file — drop the extension.`);
	return value.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
}
/** Mirrors normalizePageReference in docs-config.ts for the `page` slug. */
function normalizePageSlug(rawSlug) {
	return (typeof rawSlug === "string" ? rawSlug : "").trim().replace(/\\/g, "/").replace(/^\/+/, "").replace(/^pages\//, "").replace(/\.(?:mdx?|tsx)$/, "").replace(/\/+$/, "") || "index";
}
function normalizeStandalonePages(config, resolvePageFile, site, options = {}) {
	const items = config.pages || [];
	if (!items.length) return [];
	const docsPrefix = options.docsPrefix || "";
	const pages = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of items) {
		const path = normalizePath(item?.path);
		if (seen.has(path)) throw invalid(`duplicate standalone page path "${path}".`);
		seen.add(path);
		if (path === "/404") throw invalid("standalone page path \"/404\" is reserved for the error page.");
		const docsPage = site.pageByUrl[path];
		if (docsPage) throw invalid(`standalone page path "${path}" collides with the docs page "${docsPage.fileSlug}". Standalone pages must live outside the docs navigation.`);
		if (docsPrefix && (path === docsPrefix || path.startsWith(`${docsPrefix}/`))) throw invalid(`standalone page path "${path}" is inside the docs prefix "${docsPrefix}". Standalone pages must live outside the docs tree.`);
		const fileSlug = normalizePageSlug(item?.page);
		const filePath = resolvePageFile(fileSlug);
		if (!filePath) throw new Error(`Missing standalone page file for "${fileSlug}": expected "content/pages/${fileSlug}.tsx", ".mdx", or ".md".`);
		pages.push({
			path,
			filePath,
			title: item?.title?.trim() || void 0
		});
	}
	return pages;
}
/**
* Exact standalone page lookup by base-relative pathname. Tolerates trailing
* slashes and an explicit `/index` suffix, like getPageByPathname.
*/
function getStandalonePageByPathname(pages, pathname) {
	const trimmed = pathname.replace(/\/+$/, "") || "/";
	const collapsed = trimmed === "/index" ? "/" : trimmed.replace(/\/index$/, "") || "/";
	return pages.find((page) => page.path === trimmed || page.path === collapsed) || null;
}

//#endregion
//#region src/lib/site-config.ts
assertDocsConfig(rawConfig, "docs.json");
const siteConfig = rawConfig;
/** The complete normalized site: every version/language scope. */
const docsSite = normalizeDocsSite(siteConfig, resolveDocFile);
/** The default scope's navigation, used where a single navigation is expected. */
const docsConfig = getDefaultScope(docsSite).docs;
/** Landing page of the default scope: the site-wide "docs home" URL. */
const docsHomeUrl = getDefaultScope(docsSite).firstPageUrl;
const siteModel = resolveSiteModel(siteConfig, docsConfig, shiso);
/** Standalone pages declared with the top-level `pages` key, e.g. a home page. */
const standalonePages = normalizeStandalonePages(siteConfig, resolvePageFile, docsSite, { docsPrefix: DOCS_PREFIX });
/** True when a standalone page owns "/", replacing the root docs redirect. */
const hasRootStandalonePage = standalonePages.some((page) => page.path === "/");
function getStandalonePage(pathname) {
	return getStandalonePageByPathname(standalonePages, stripBase(pathname));
}
/** Scope that owns the current pathname; the default scope for unknown paths. */
function getScopeByPathname(pathname) {
	const page = getPageByPathname(pathname);
	return page ? getScopeForPage(docsSite, page) : getDefaultScope(docsSite);
}
/** Document language and direction for a pathname, from its scope's language. */
function getLocaleByPathname(pathname) {
	const lang = resolveLocale(getScopeByPathname(pathname).language, siteModel.locale);
	return {
		lang,
		dir: getTextDirection(lang)
	};
}
const siteName = siteModel.name;
/** Trailing-slash-insensitive route key for redirect matching. */
function toRouteKey(routePath) {
	return routePath.replace(/\/+$/, "") || "/";
}
/**
* Redirect rules with exact-match sources. Wildcard patterns are rejected by
* the schema; this guard covers configs that bypassed validation.
*/
function getRedirects() {
	return (siteConfig.redirects || []).filter((rule) => {
		if (!rule?.source || !rule.destination) return false;
		if (/[:*]/.test(rule.source)) {
			console.warn(`[shiso] Redirect source "${rule.source}" uses a wildcard pattern, which is not supported — it will be skipped. Use an exact source path.`);
			return false;
		}
		return true;
	});
}
const redirectBySource = new Map(getRedirects().map((rule) => [toRouteKey(rule.source), rule.destination]));
/** Destination for a base-relative route covered by a redirect rule, if any. */
function matchRedirect(routePath) {
	return redirectBySource.get(toRouteKey(routePath)) || null;
}
function getSeo() {
	const seo = siteConfig.seo || {};
	return {
		metatags: seo.metatags || {},
		indexing: seo.indexing === "all" ? "all" : "navigable"
	};
}
/** True when the last-modified timestamp should show for a page. */
function showTimestamp(frontmatterValue) {
	if (typeof frontmatterValue === "boolean") return frontmatterValue;
	return siteModel.showTimestamp;
}
function getPageByPathname(pathname) {
	return getPageByPathname$1(docsSite, stripBase(pathname));
}
/** Frontmatter for the docs or standalone page that owns a pathname. */
function getPageFrontmatter(pathname) {
	const page = getStandalonePage(pathname) || getPageByPathname(pathname);
	return page ? getDocModule(page.filePath)?.frontmatter : void 0;
}
function getPageTitle(pageTitle) {
	if (pageTitle && siteName) return `${pageTitle} – ${siteName}`;
	return pageTitle || siteName || "";
}

//#endregion
//#region src/components/LanguageSwitcher.tsx
/**
* Language selector for multi-language sites. Each option is a language's
* landing scope — its default version — so switching languages always lands
* on that language's default-version first page. Hidden languages never
* appear as options.
*/
function LanguageSwitcher() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const current = getScopeByPathname(pathname);
	const options = getLanguageScopes(docsSite);
	if (!current.language || options.length < 2 && !current.hidden) return null;
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsxs(DropdownMenuTrigger, {
		render: /* @__PURE__ */ jsx(Button, {
			variant: "outline",
			className: "h-auto gap-1.5 rounded-md bg-card px-2.5 py-1.5 text-sm font-medium text-foreground"
		}),
		children: [current.language, /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 rotate-90 text-muted-foreground" })]
	}), /* @__PURE__ */ jsx(DropdownMenuContent, {
		align: "start",
		className: "min-w-32",
		children: options.map((scope) => /* @__PURE__ */ jsxs(DropdownMenuItem, {
			onClick: () => {
				if (scope.language !== current.language) navigate(scope.firstPageUrl);
			},
			children: [/* @__PURE__ */ jsx("span", {
				className: "grow",
				children: scope.language
			}), scope.language === current.language ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : null]
		}, scope.id))
	})] });
}

//#endregion
//#region ../../node_modules/.pnpm/cmdk@1.1.1_@types+react-dom_b7833f22e642c0a58838e454e2cd1ba9/node_modules/cmdk/dist/chunk-NZJY6EH4.mjs
var U = 1;
var Y$1 = .9;
var H = .8;
var J = .17;
var p = .1;
var u = .999;
var $ = .9999;
var k$1 = .99;
var m = /[\\\/_+.#"@\[\(\{&]/;
var B$1 = /[\\\/_+.#"@\[\(\{&]/g;
var K$1 = /[\s-]/;
var X = /[\s-]/g;
function G(_, C, h, P, A, f, O) {
	if (f === C.length) return A === _.length ? U : k$1;
	var T = `${A},${f}`;
	if (O[T] !== void 0) return O[T];
	for (var L = P.charAt(f), c = h.indexOf(L, A), S = 0, E, N, R, M; c >= 0;) E = G(_, C, h, P, c + 1, f + 1, O), E > S && (c === A ? E *= U : m.test(_.charAt(c - 1)) ? (E *= H, R = _.slice(A, c - 1).match(B$1), R && A > 0 && (E *= Math.pow(u, R.length))) : K$1.test(_.charAt(c - 1)) ? (E *= Y$1, M = _.slice(A, c - 1).match(X), M && A > 0 && (E *= Math.pow(u, M.length))) : (E *= J, A > 0 && (E *= Math.pow(u, c - A))), _.charAt(c) !== C.charAt(f) && (E *= $)), (E < p && h.charAt(c - 1) === P.charAt(f + 1) || P.charAt(f + 1) === P.charAt(f) && h.charAt(c - 1) !== P.charAt(f)) && (N = G(_, C, h, P, c + 1, f + 2, O), N * p > E && (E = N * p)), E > S && (S = E), c = h.indexOf(L, c + 1);
	return O[T] = S, S;
}
function D(_) {
	return _.toLowerCase().replace(X, " ");
}
function W(_, C, h) {
	return _ = h && h.length > 0 ? `${_ + " " + h.join(" ")}` : _, G(_, C, D(_), D(C), 0, 0, {});
}

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+primitive@1.1.7/node_modules/@radix-ui/primitive/dist/index.mjs
var __defProp$14 = Object.defineProperty;
var __name$14 = (target, value) => __defProp$14(target, "name", {
	value,
	configurable: true
});
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return /* @__PURE__ */ __name$14(function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event || !event.defaultPrevented) return ourEventHandler?.(event);
	}, "handleEvent");
}
__name$14(composeEventHandlers, "composeEventHandlers");
function getOwnerWindow(element) {
	if (!canUseDOM) throw new Error("Cannot access window outside of the DOM");
	return element?.ownerDocument?.defaultView ?? window;
}
__name$14(getOwnerWindow, "getOwnerWindow");
function getOwnerDocument(element) {
	if (!canUseDOM) throw new Error("Cannot access document outside of the DOM");
	return element?.ownerDocument ?? document;
}
__name$14(getOwnerDocument, "getOwnerDocument");
function getActiveElement(node, activeDescendant = false) {
	const { activeElement } = getOwnerDocument(node);
	if (!activeElement?.nodeName) return null;
	if (isFrame(activeElement) && activeElement.contentDocument) return getActiveElement(activeElement.contentDocument.body, activeDescendant);
	if (activeDescendant) {
		const id = activeElement.getAttribute("aria-activedescendant");
		if (id) {
			const element = getOwnerDocument(activeElement).getElementById(id);
			if (element) return element;
		}
	}
	return activeElement;
}
__name$14(getActiveElement, "getActiveElement");
function isFrame(element) {
	return element.tagName === "IFRAME";
}
__name$14(isFrame, "isFrame");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-compose-ref_60a8f511f5a953d1cc58e5040847ca1c/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
var __defProp$13 = Object.defineProperty;
var __name$13 = (target, value) => __defProp$13(target, "name", {
	value,
	configurable: true
});
function setRef$1(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
__name$13(setRef$1, "setRef");
function composeRefs(...refs) {
	return (node) => {
		let hasCleanup = false;
		const cleanups = refs.map((ref) => {
			const cleanup = setRef$1(ref, node);
			if (!hasCleanup && typeof cleanup == "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup == "function") cleanup();
				else setRef$1(refs[i], null);
			}
		};
	};
}
__name$13(composeRefs, "composeRefs");
function useComposedRefs(...refs) {
	return React.useCallback(composeRefs(...refs), refs);
}
__name$13(useComposedRefs, "useComposedRefs");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-context@1.2_dc174a77f999d3bc0470f0b9c664f7ff/node_modules/@radix-ui/react-context/dist/index.mjs
var __defProp$12 = Object.defineProperty;
var __name$12 = (target, value) => __defProp$12(target, "name", {
	value,
	configurable: true
});
// @__NO_SIDE_EFFECTS__
function createContext2(rootComponentName, defaultContext) {
	const Context = React.createContext(defaultContext);
	Context.displayName = rootComponentName + "Context";
	const Provider = /* @__PURE__ */ __name$12((props) => {
		const { children, ...context } = props;
		const value = React.useMemo(() => context, Object.values(context));
		return /* @__PURE__ */ jsx(Context.Provider, {
			value,
			children
		});
	}, "Provider");
	Provider.displayName = rootComponentName + "Provider";
	function useContext2(consumerName, options = {}) {
		const { optional = false } = options;
		const context = React.useContext(Context);
		if (context) return context;
		if (defaultContext !== void 0) return defaultContext;
		if (optional) return void 0;
		throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
	}
	__name$12(useContext2, "useContext");
	return [Provider, useContext2];
}
__name$12(createContext2, "createContext");
// @__NO_SIDE_EFFECTS__
function createContextScope(scopeName, createContextScopeDeps = []) {
	let defaultContexts = [];
	function createContext3(rootComponentName, defaultContext) {
		const BaseContext = React.createContext(defaultContext);
		BaseContext.displayName = rootComponentName + "Context";
		const index = defaultContexts.length;
		defaultContexts = [...defaultContexts, defaultContext];
		const Provider = /* @__PURE__ */ __name$12((props) => {
			const { scope, children, ...context } = props;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const value = React.useMemo(() => context, Object.values(context));
			return /* @__PURE__ */ jsx(Context.Provider, {
				value,
				children
			});
		}, "Provider");
		Provider.displayName = rootComponentName + "Provider";
		function useContext2(consumerName, scope, options = {}) {
			const { optional = false } = options;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const context = React.useContext(Context);
			if (context) return context;
			if (defaultContext !== void 0) return defaultContext;
			if (optional) return void 0;
			throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
		}
		__name$12(useContext2, "useContext");
		return [Provider, useContext2];
	}
	__name$12(createContext3, "createContext");
	const createScope = /* @__PURE__ */ __name$12(() => {
		const scopeContexts = defaultContexts.map((defaultContext) => {
			return React.createContext(defaultContext);
		});
		return /* @__PURE__ */ __name$12(function useScope(scope) {
			const contexts = scope?.[scopeName] || scopeContexts;
			return React.useMemo(() => ({ [`__scope${scopeName}`]: {
				...scope,
				[scopeName]: contexts
			} }), [scope, contexts]);
		}, "useScope");
	}, "createScope");
	createScope.scopeName = scopeName;
	return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
__name$12(createContextScope, "createContextScope");
function composeContextScopes(...scopes) {
	const baseScope = scopes[0];
	if (scopes.length === 1) return baseScope;
	const createScope = /* @__PURE__ */ __name$12(() => {
		const scopeHooks = scopes.map((createScope2) => ({
			useScope: createScope2(),
			scopeName: createScope2.scopeName
		}));
		return /* @__PURE__ */ __name$12(function useComposedScopes(overrideScopes) {
			const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
				const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
				return {
					...nextScopes2,
					...currentScope
				};
			}, {});
			return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
		}, "useComposedScopes");
	}, "createScope");
	createScope.scopeName = baseScope.scopeName;
	return createScope;
}
__name$12(composeContextScopes, "composeContextScopes");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-use-layout-_c99e7a4bfc0168fd072fc8506ded8cde/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var useLayoutEffect2 = globalThis?.document ? React.useLayoutEffect : () => {};

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-id@1.1.4_@types+react@19.2.18_react@19.2.8/node_modules/@radix-ui/react-id/dist/index.mjs
var __defProp$11 = Object.defineProperty;
var __name$11 = (target, value) => __defProp$11(target, "name", {
	value,
	configurable: true
});
var useReactId = React[" useId ".trim().toString()] || (() => void 0);
var count$1 = 0;
function useId(deterministicId) {
	const [id, setId] = React.useState(useReactId());
	useLayoutEffect2(() => {
		if (!deterministicId) setId((reactId) => reactId ?? String(count$1++));
	}, [deterministicId]);
	return deterministicId || (id ? `radix-${id}` : "");
}
__name$11(useId, "useId");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-use-effect-_e8d5e8242c04825bf34212c7f6280f14/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
var __defProp$10 = Object.defineProperty;
var __name$10 = (target, value) => __defProp$10(target, "name", {
	value,
	configurable: true
});
var useReactEffectEvent = React[" useEffectEvent ".trim().toString()];
var useReactInsertionEffect = React[" useInsertionEffect ".trim().toString()];
function useEffectEvent(callback) {
	if (typeof useReactEffectEvent === "function") return useReactEffectEvent(callback);
	const ref = React.useRef(() => {
		throw new Error("Cannot call an event handler while rendering.");
	});
	if (typeof useReactInsertionEffect === "function") useReactInsertionEffect(() => {
		ref.current = callback;
	});
	else useLayoutEffect2(() => {
		ref.current = callback;
	});
	return React.useMemo(() => ((...args) => ref.current?.(...args)), []);
}
__name$10(useEffectEvent, "useEffectEvent");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-use-control_22187853d61b94632003c277d0370b10/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var __defProp$9 = Object.defineProperty;
var __name$9 = (target, value) => __defProp$9(target, "name", {
	value,
	configurable: true
});
var useInsertionEffect = React[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({ prop, defaultProp, onChange = /* @__PURE__ */ __name$9(() => {}, "onChange"), caller }) {
	const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
		defaultProp,
		onChange
	});
	const isControlled = prop !== void 0;
	const value = isControlled ? prop : uncontrolledProp;
	if (false) {
		const isControlledRef = React.useRef(prop !== void 0);
		React.useEffect(() => {
			const wasControlled = isControlledRef.current;
			if (wasControlled !== isControlled) console.warn(`${caller} is changing from ${wasControlled ? "controlled" : "uncontrolled"} to ${isControlled ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`);
			isControlledRef.current = isControlled;
		}, [isControlled, caller]);
	}
	return [value, React.useCallback((nextValue) => {
		if (isControlled) {
			const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
			if (value2 !== prop) onChangeRef.current?.(value2);
		} else setUncontrolledProp(nextValue);
	}, [
		isControlled,
		prop,
		setUncontrolledProp,
		onChangeRef
	])];
}
__name$9(useControllableState, "useControllableState");
function useUncontrolledState({ defaultProp, onChange }) {
	const [value, setValue] = React.useState(defaultProp);
	const prevValueRef = React.useRef(value);
	const onChangeRef = React.useRef(onChange);
	useInsertionEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);
	React.useEffect(() => {
		if (prevValueRef.current !== value) {
			onChangeRef.current?.(value);
			prevValueRef.current = value;
		}
	}, [value, prevValueRef]);
	return [
		value,
		setValue,
		onChangeRef
	];
}
__name$9(useUncontrolledState, "useUncontrolledState");
function isFunction(value) {
	return typeof value === "function";
}
__name$9(isFunction, "isFunction");
var SYNC_STATE = Symbol("RADIX:SYNC_STATE");
function useControllableStateReducer(reducer, userArgs, initialArg, init) {
	const { prop: controlledState, defaultProp, onChange: onChangeProp, caller } = userArgs;
	const isControlled = controlledState !== void 0;
	const onChange = useEffectEvent(onChangeProp);
	if (false) {
		const isControlledRef = React.useRef(controlledState !== void 0);
		React.useEffect(() => {
			const wasControlled = isControlledRef.current;
			if (wasControlled !== isControlled) console.warn(`${caller} is changing from ${wasControlled ? "controlled" : "uncontrolled"} to ${isControlled ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`);
			isControlledRef.current = isControlled;
		}, [isControlled, caller]);
	}
	const args = [{
		...initialArg,
		state: defaultProp
	}];
	if (init) args.push(init);
	const [internalState, dispatch] = React.useReducer((state2, action) => {
		if (action.type === SYNC_STATE) return {
			...state2,
			state: action.state
		};
		const next = reducer(state2, action);
		if (isControlled && !Object.is(next.state, state2.state)) onChange(next.state);
		return next;
	}, ...args);
	const uncontrolledState = internalState.state;
	const prevValueRef = React.useRef(uncontrolledState);
	React.useEffect(() => {
		if (prevValueRef.current !== uncontrolledState) {
			prevValueRef.current = uncontrolledState;
			if (!isControlled) onChange(uncontrolledState);
		}
	}, [
		uncontrolledState,
		prevValueRef,
		isControlled
	]);
	const state = React.useMemo(() => {
		if (controlledState !== void 0) return {
			...internalState,
			state: controlledState
		};
		return internalState;
	}, [internalState, controlledState]);
	React.useEffect(() => {
		if (isControlled && !Object.is(controlledState, internalState.state)) dispatch({
			type: SYNC_STATE,
			state: controlledState
		});
	}, [
		controlledState,
		internalState.state,
		isControlled
	]);
	return [state, dispatch];
}
__name$9(useControllableStateReducer, "useControllableStateReducer");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-slot@1.3.3_@types+react@19.2.18_react@19.2.8/node_modules/@radix-ui/react-slot/dist/index.mjs
var __defProp$8 = Object.defineProperty;
var __name$8 = (target, value) => __defProp$8(target, "name", {
	value,
	configurable: true
});
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
	const Slot2 = React.forwardRef((props, forwardedRef) => {
		let { children, ...slotProps } = props;
		let slottableElement = null;
		let hasSlottable = false;
		const newChildren = [];
		if (isLazyComponent(children) && typeof use === "function") children = use(children._payload);
		React.Children.forEach(children, (maybeSlottable) => {
			if (isSlottable(maybeSlottable)) {
				hasSlottable = true;
				const slottable = maybeSlottable;
				let child = "child" in slottable.props ? slottable.props.child : slottable.props.children;
				if (isLazyComponent(child) && typeof use === "function") child = use(child._payload);
				slottableElement = getSlottableElementFromSlottable(slottable, child);
				newChildren.push(slottableElement?.props?.children);
			} else newChildren.push(maybeSlottable);
		});
		if (slottableElement) slottableElement = React.cloneElement(slottableElement, void 0, newChildren);
		else if (!hasSlottable && React.Children.count(children) === 1 && React.isValidElement(children)) slottableElement = children;
		const slottableElementRef = slottableElement ? getElementRef$1(slottableElement) : void 0;
		const composedRef = useComposedRefs(forwardedRef, slottableElementRef);
		if (!slottableElement) {
			if (children || children === 0) throw new Error(hasSlottable ? createSlottableError(ownerName) : createSlotError(ownerName));
			return children;
		}
		const mergedProps = mergeProps(slotProps, slottableElement.props ?? {});
		if (slottableElement.type !== React.Fragment) mergedProps.ref = forwardedRef ? composedRef : slottableElementRef;
		return React.cloneElement(slottableElement, mergedProps);
	});
	Slot2.displayName = `${ownerName}.Slot`;
	return Slot2;
}
__name$8(createSlot, "createSlot");
var SLOTTABLE_IDENTIFIER = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
	const Slottable2 = /* @__PURE__ */ __name$8((props) => "child" in props ? props.children(props.child) : props.children, "Slottable");
	Slottable2.displayName = `${ownerName}.Slottable`;
	Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
	return Slottable2;
}
__name$8(createSlottable, "createSlottable");
var getSlottableElementFromSlottable = /* @__PURE__ */ __name$8((slottable, child) => {
	if ("child" in slottable.props) {
		const child2 = slottable.props.child;
		if (!React.isValidElement(child2)) return null;
		return React.cloneElement(child2, void 0, slottable.props.children(child2.props.children));
	}
	return React.isValidElement(child) ? child : null;
}, "getSlottableElementFromSlottable");
function mergeProps(slotProps, childProps) {
	const overrideProps = { ...childProps };
	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];
		if (/^on[A-Z]/.test(propName)) {
			if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
				const result = childPropValue(...args);
				slotPropValue(...args);
				return result;
			};
			else if (slotPropValue) overrideProps[propName] = slotPropValue;
		} else if (propName === "style") overrideProps[propName] = {
			...slotPropValue,
			...childPropValue
		};
		else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
	}
	return {
		...slotProps,
		...overrideProps
	};
}
__name$8(mergeProps, "mergeProps");
function getElementRef$1(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
__name$8(getElementRef$1, "getElementRef");
function isSlottable(child) {
	return React.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
__name$8(isSlottable, "isSlottable");
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
function isLazyComponent(element) {
	return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
__name$8(isLazyComponent, "isLazyComponent");
function isPromiseLike(value) {
	return typeof value === "object" && value !== null && "then" in value;
}
__name$8(isPromiseLike, "isPromiseLike");
var createSlotError = /* @__PURE__ */ __name$8((ownerName) => {
	return `${ownerName} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`;
}, "createSlotError");
var createSlottableError = /* @__PURE__ */ __name$8((ownerName) => {
	return `${ownerName} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`;
}, "createSlottableError");
var use = React[" use ".trim().toString()];

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-primitive@2_89d529a1bae70a6b01b956c8b2bdbce1/node_modules/@radix-ui/react-primitive/dist/index.mjs
var __defProp$7 = Object.defineProperty;
var __name$7 = (target, value) => __defProp$7(target, "name", {
	value,
	configurable: true
});
var Primitive = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((primitive, node) => {
	const Slot = createSlot(`Primitive.${node}`);
	const Node = React.forwardRef((props, forwardedRef) => {
		const { asChild, ...primitiveProps } = props;
		const Comp = asChild ? Slot : node;
		if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
		return /* @__PURE__ */ jsx(Comp, {
			...primitiveProps,
			ref: forwardedRef
		});
	});
	Node.displayName = `Primitive.${node}`;
	return {
		...primitive,
		[node]: Node
	};
}, {});
function dispatchDiscreteCustomEvent(target, event) {
	if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
}
__name$7(dispatchDiscreteCustomEvent, "dispatchDiscreteCustomEvent");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-use-callbac_b03f33a0fc5867b4ab17368fb2aecc43/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var __defProp$6 = Object.defineProperty;
var __name$6 = (target, value) => __defProp$6(target, "name", {
	value,
	configurable: true
});
function useCallbackRef$1(callback) {
	const callbackRef = React.useRef(callback);
	React.useEffect(() => {
		callbackRef.current = callback;
	});
	return React.useMemo(() => ((...args) => callbackRef.current?.(...args)), []);
}
__name$6(useCallbackRef$1, "useCallbackRef");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-dismissable_40e495cae3a960f65f80435c18b02650/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
var __defProp$5 = Object.defineProperty;
var __name$5 = (target, value) => __defProp$5(target, "name", {
	value,
	configurable: true
});
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = React.createContext({
	layers: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set(),
	dismissableSurfaces: /* @__PURE__ */ new Set()
});
var DismissableLayer = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name$5(function DismissableLayer2(props, forwardedRef) {
	const { disableOutsidePointerEvents = false, deferPointerDownOutside = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
	const context = React.useContext(DismissableLayerContext);
	const [node, setNode] = React.useState(null);
	const ownerDocument = node?.ownerDocument ?? globalThis?.document;
	const [, force] = React.useState({});
	const composedRefs = useComposedRefs(forwardedRef, setNode);
	const layers = Array.from(context.layers);
	const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
	const highestLayerWithOutsidePointerEventsDisabledIndex = highestLayerWithOutsidePointerEventsDisabled ? layers.indexOf(highestLayerWithOutsidePointerEventsDisabled) : -1;
	const index = node ? layers.indexOf(node) : -1;
	const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
	const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
	const isDeferredPointerDownOutsideRef = React.useRef(false);
	const pointerDownOutside = usePointerDownOutside((event) => {
		onPointerDownOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, {
		ownerDocument,
		deferPointerDownOutside,
		isDeferredPointerDownOutsideRef,
		dismissableSurfaces: context.dismissableSurfaces,
		shouldHandlePointerDownOutside: React.useCallback((target) => {
			if (!(target instanceof Node)) return false;
			const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
			return isPointerEventsEnabled && !isPointerDownOnBranch;
		}, [context.branches, isPointerEventsEnabled])
	});
	const focusOutside = useFocusOutside((event) => {
		if (deferPointerDownOutside && isDeferredPointerDownOutsideRef.current) return;
		const target = event.target;
		if ([...context.branches].some((branch) => branch.contains(target))) return;
		onFocusOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, ownerDocument);
	const isHighestLayer = node ? index === layers.length - 1 : false;
	const handleKeyDown = useCallbackRef$1((event) => {
		if (event.key !== "Escape") return;
		onEscapeKeyDown?.(event);
		if (!event.defaultPrevented && onDismiss) {
			event.preventDefault();
			onDismiss();
		}
	});
	React.useEffect(() => {
		if (!isHighestLayer) return;
		ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
	}, [
		ownerDocument,
		isHighestLayer,
		handleKeyDown
	]);
	React.useEffect(() => {
		if (!node) return;
		if (disableOutsidePointerEvents) {
			if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
				originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
				ownerDocument.body.style.pointerEvents = "none";
			}
			context.layersWithOutsidePointerEventsDisabled.add(node);
		}
		context.layers.add(node);
		dispatchUpdate();
		return () => {
			if (disableOutsidePointerEvents) {
				context.layersWithOutsidePointerEventsDisabled.delete(node);
				if (context.layersWithOutsidePointerEventsDisabled.size === 0) ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
			}
		};
	}, [
		node,
		ownerDocument,
		disableOutsidePointerEvents,
		context
	]);
	React.useEffect(() => {
		return () => {
			if (!node) return;
			context.layers.delete(node);
			context.layersWithOutsidePointerEventsDisabled.delete(node);
			dispatchUpdate();
		};
	}, [node, context]);
	React.useEffect(() => {
		const handleUpdate = /* @__PURE__ */ __name$5(() => force({}), "handleUpdate");
		document.addEventListener(CONTEXT_UPDATE, handleUpdate);
		return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
	}, []);
	return /* @__PURE__ */ jsx(Primitive.div, {
		...layerProps,
		ref: composedRefs,
		style: {
			pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
			...props.style
		},
		onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
		onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
		onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)
	});
}, "DismissableLayer"));
function useDismissableLayerSurface() {
	const context = React.useContext(DismissableLayerContext);
	const [node, setNode] = React.useState(null);
	React.useEffect(() => {
		if (!node) return;
		context.dismissableSurfaces.add(node);
		return () => {
			context.dismissableSurfaces.delete(node);
		};
	}, [node, context.dismissableSurfaces]);
	return setNode;
}
__name$5(useDismissableLayerSurface, "useDismissableLayerSurface");
var IS_TRUE = /* @__PURE__ */ __name$5(() => true, "IS_TRUE");
function usePointerDownOutside(onPointerDownOutside, args) {
	const { ownerDocument = globalThis?.document, deferPointerDownOutside = false, isDeferredPointerDownOutsideRef, dismissableSurfaces, shouldHandlePointerDownOutside = IS_TRUE } = args;
	const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
	const isPointerInsideReactTreeRef = React.useRef(false);
	const isPointerDownOutsideRef = React.useRef(false);
	const interceptedOutsideInteractionEventsRef = React.useRef(/* @__PURE__ */ new Map());
	const handleClickRef = React.useRef(() => {});
	React.useEffect(() => {
		function resetOutsideInteraction() {
			isPointerDownOutsideRef.current = false;
			isDeferredPointerDownOutsideRef.current = false;
			interceptedOutsideInteractionEventsRef.current.clear();
		}
		__name$5(resetOutsideInteraction, "resetOutsideInteraction");
		function isOutsideInteractionIntercepted() {
			return Array.from(interceptedOutsideInteractionEventsRef.current.values()).some(Boolean);
		}
		__name$5(isOutsideInteractionIntercepted, "isOutsideInteractionIntercepted");
		function handleInteractionCapture(event) {
			if (!isPointerDownOutsideRef.current) return;
			const target = event.target;
			if (!(target instanceof Node && [...dismissableSurfaces].some((surface) => surface.contains(target)))) interceptedOutsideInteractionEventsRef.current.set(event.type, true);
			if (event.type === "click") window.setTimeout(() => {
				if (isPointerDownOutsideRef.current) handleClickRef.current();
			}, 0);
		}
		__name$5(handleInteractionCapture, "handleInteractionCapture");
		function handleInteractionBubble(event) {
			if (isPointerDownOutsideRef.current) interceptedOutsideInteractionEventsRef.current.set(event.type, false);
		}
		__name$5(handleInteractionBubble, "handleInteractionBubble");
		const handlePointerDown = /* @__PURE__ */ __name$5((event) => {
			if (event.target && !isPointerInsideReactTreeRef.current) {
				let handleAndDispatchPointerDownOutsideEvent2 = function() {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					const wasOutsideInteractionIntercepted = isOutsideInteractionIntercepted();
					resetOutsideInteraction();
					if (!wasOutsideInteractionIntercepted) handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, { discrete: true });
				};
				__name$5(handleAndDispatchPointerDownOutsideEvent2, "handleAndDispatchPointerDownOutsideEvent");
				if (!shouldHandlePointerDownOutside(event.target)) {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					resetOutsideInteraction();
					isPointerInsideReactTreeRef.current = false;
					return;
				}
				const eventDetail = { originalEvent: event };
				isPointerDownOutsideRef.current = true;
				isDeferredPointerDownOutsideRef.current = deferPointerDownOutside && event.button === 0;
				interceptedOutsideInteractionEventsRef.current.clear();
				if (!deferPointerDownOutside || event.button !== 0) handleAndDispatchPointerDownOutsideEvent2();
				else {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
					ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
				}
			} else {
				ownerDocument.removeEventListener("click", handleClickRef.current);
				resetOutsideInteraction();
			}
			isPointerInsideReactTreeRef.current = false;
		}, "handlePointerDown");
		const outsideInteractionEvents = [
			"pointerup",
			"mousedown",
			"mouseup",
			"touchstart",
			"touchend",
			"click"
		];
		for (const eventName of outsideInteractionEvents) {
			ownerDocument.addEventListener(eventName, handleInteractionCapture, true);
			ownerDocument.addEventListener(eventName, handleInteractionBubble);
		}
		const timerId = window.setTimeout(() => {
			ownerDocument.addEventListener("pointerdown", handlePointerDown);
		}, 0);
		return () => {
			window.clearTimeout(timerId);
			ownerDocument.removeEventListener("pointerdown", handlePointerDown);
			ownerDocument.removeEventListener("click", handleClickRef.current);
			for (const eventName of outsideInteractionEvents) {
				ownerDocument.removeEventListener(eventName, handleInteractionCapture, true);
				ownerDocument.removeEventListener(eventName, handleInteractionBubble);
			}
		};
	}, [
		ownerDocument,
		handlePointerDownOutside,
		deferPointerDownOutside,
		isDeferredPointerDownOutsideRef,
		dismissableSurfaces,
		shouldHandlePointerDownOutside
	]);
	return { onPointerDownCapture: /* @__PURE__ */ __name$5(() => isPointerInsideReactTreeRef.current = true, "onPointerDownCapture") };
}
__name$5(usePointerDownOutside, "usePointerDownOutside");
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
	const handleFocusOutside = useCallbackRef$1(onFocusOutside);
	const isFocusInsideReactTreeRef = React.useRef(false);
	React.useEffect(() => {
		const handleFocus = /* @__PURE__ */ __name$5((event) => {
			if (event.target && !isFocusInsideReactTreeRef.current) handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, { originalEvent: event }, { discrete: false });
		}, "handleFocus");
		ownerDocument.addEventListener("focusin", handleFocus);
		return () => ownerDocument.removeEventListener("focusin", handleFocus);
	}, [ownerDocument, handleFocusOutside]);
	return {
		onFocusCapture: /* @__PURE__ */ __name$5(() => isFocusInsideReactTreeRef.current = true, "onFocusCapture"),
		onBlurCapture: /* @__PURE__ */ __name$5(() => isFocusInsideReactTreeRef.current = false, "onBlurCapture")
	};
}
__name$5(useFocusOutside, "useFocusOutside");
function dispatchUpdate() {
	const event = new CustomEvent(CONTEXT_UPDATE);
	document.dispatchEvent(event);
}
__name$5(dispatchUpdate, "dispatchUpdate");
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) target.addEventListener(name, handler, { once: true });
	if (discrete) dispatchDiscreteCustomEvent(target, event);
	else target.dispatchEvent(event);
}
__name$5(handleAndDispatchCustomEvent, "handleAndDispatchCustomEvent");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-focus-scope_3b4e29b84c639c7da7ed6c275ef9f34b/node_modules/@radix-ui/react-focus-scope/dist/index.mjs
var __defProp$4 = Object.defineProperty;
var __name$4 = (target, value) => __defProp$4(target, "name", {
	value,
	configurable: true
});
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
var FocusScope = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name$4(function FocusScope2(props, forwardedRef) {
	const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
	const [container, setContainer] = React.useState(null);
	const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
	const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
	const lastFocusedElementRef = React.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, setContainer);
	const focusScope = React.useRef({
		paused: false,
		pause() {
			this.paused = true;
		},
		resume() {
			this.paused = false;
		}
	}).current;
	React.useEffect(() => {
		if (trapped) {
			let handleFocusIn2 = function(event) {
				if (focusScope.paused || !container) return;
				const target = event.target;
				if (container.contains(target)) lastFocusedElementRef.current = target;
				else focus(lastFocusedElementRef.current, { select: true });
			}, handleFocusOut2 = function(event) {
				if (focusScope.paused || !container) return;
				const relatedTarget = event.relatedTarget;
				if (relatedTarget === null) return;
				if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.current, { select: true });
			}, handleMutations2 = function(mutations) {
				if (document.activeElement !== document.body) return;
				for (const mutation of mutations) if (mutation.removedNodes.length > 0) focus(container);
			};
			__name$4(handleFocusIn2, "handleFocusIn");
			__name$4(handleFocusOut2, "handleFocusOut");
			__name$4(handleMutations2, "handleMutations");
			document.addEventListener("focusin", handleFocusIn2);
			document.addEventListener("focusout", handleFocusOut2);
			const mutationObserver = new MutationObserver(handleMutations2);
			if (container) mutationObserver.observe(container, {
				childList: true,
				subtree: true
			});
			return () => {
				document.removeEventListener("focusin", handleFocusIn2);
				document.removeEventListener("focusout", handleFocusOut2);
				mutationObserver.disconnect();
			};
		}
	}, [
		trapped,
		container,
		focusScope.paused
	]);
	React.useEffect(() => {
		if (container) {
			focusScopesStack.add(focusScope);
			const previouslyFocusedElement = document.activeElement;
			if (!container.contains(previouslyFocusedElement)) {
				const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
				container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				container.dispatchEvent(mountEvent);
				if (!mountEvent.defaultPrevented) {
					focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
					if (document.activeElement === previouslyFocusedElement) focus(container);
				}
			}
			return () => {
				container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				setTimeout(() => {
					const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
					container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					container.dispatchEvent(unmountEvent);
					if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? document.body, { select: true });
					container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					focusScopesStack.remove(focusScope);
				}, 0);
			};
		}
	}, [
		container,
		onMountAutoFocus,
		onUnmountAutoFocus,
		focusScope
	]);
	const handleKeyDown = React.useCallback((event) => {
		if (!loop && !trapped) return;
		if (focusScope.paused) return;
		const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
		const focusedElement = document.activeElement;
		if (isTabKey && focusedElement) {
			const container2 = event.currentTarget;
			const [first, last] = getTabbableEdges(container2);
			if (!(first && last)) {
				if (focusedElement === container2) event.preventDefault();
			} else if (!event.shiftKey && focusedElement === last) {
				event.preventDefault();
				if (loop) focus(first, { select: true });
			} else if (event.shiftKey && focusedElement === first) {
				event.preventDefault();
				if (loop) focus(last, { select: true });
			}
		}
	}, [
		loop,
		trapped,
		focusScope.paused
	]);
	return /* @__PURE__ */ jsx(Primitive.div, {
		tabIndex: -1,
		...scopeProps,
		ref: composedRefs,
		onKeyDown: handleKeyDown
	});
}, "FocusScope"));
function focusFirst(candidates, { select = false } = {}) {
	const previouslyFocusedElement = document.activeElement;
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (document.activeElement !== previouslyFocusedElement) return;
	}
}
__name$4(focusFirst, "focusFirst");
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
}
__name$4(getTabbableEdges, "getTabbableEdges");
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: /* @__PURE__ */ __name$4((node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	}, "acceptNode") });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
__name$4(getTabbableCandidates, "getTabbableCandidates");
function findVisible(elements, container) {
	const canUseCheckVisibility = typeof container.checkVisibility === "function" && container.checkVisibility({ checkVisibilityCSS: true });
	for (const element of elements) if (!(canUseCheckVisibility ? !element.checkVisibility({ checkVisibilityCSS: true }) : isHidden(element, { upTo: container }))) return element;
}
__name$4(findVisible, "findVisible");
function isHidden(node, { upTo }) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		if (upTo !== void 0 && node === upTo) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement;
	}
	return false;
}
__name$4(isHidden, "isHidden");
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
__name$4(isSelectableInput, "isSelectableInput");
function focus(element, { select = false } = {}) {
	if (element && element.focus) {
		const previouslyFocusedElement = document.activeElement;
		element.focus({ preventScroll: true });
		if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
	}
}
__name$4(focus, "focus");
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
	let stack = [];
	return {
		add(focusScope) {
			const activeFocusScope = stack[0];
			if (focusScope !== activeFocusScope) activeFocusScope?.pause();
			stack = arrayRemove(stack, focusScope);
			stack.unshift(focusScope);
		},
		remove(focusScope) {
			stack = arrayRemove(stack, focusScope);
			stack[0]?.resume();
		}
	};
}
__name$4(createFocusScopesStack, "createFocusScopesStack");
function arrayRemove(array, item) {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);
	if (index !== -1) updatedArray.splice(index, 1);
	return updatedArray;
}
__name$4(arrayRemove, "arrayRemove");
function removeLinks(items) {
	return items.filter((item) => item.tagName !== "A");
}
__name$4(removeLinks, "removeLinks");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-portal@1.1._7d49bbd59f67da7ea06e84940374bb40/node_modules/@radix-ui/react-portal/dist/index.mjs
var __defProp$3 = Object.defineProperty;
var __name$3 = (target, value) => __defProp$3(target, "name", {
	value,
	configurable: true
});
var Portal = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name$3(function Portal2(props, forwardedRef) {
	const { container: containerProp, ...portalProps } = props;
	const [mounted, setMounted] = React.useState(false);
	useLayoutEffect2(() => setMounted(true), []);
	const container = containerProp || mounted && globalThis?.document?.body;
	return container ? ReactDOM.createPortal(/* @__PURE__ */ jsx(Primitive.div, {
		...portalProps,
		ref: forwardedRef
	}), container) : null;
}, "Portal"));

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-presence@1._c16522d094fa2977c5a9a5cd628ab890/node_modules/@radix-ui/react-presence/dist/index.mjs
var __defProp$2 = Object.defineProperty;
var __name$2 = (target, value) => __defProp$2(target, "name", {
	value,
	configurable: true
});
function useStateMachine(initialState, machine) {
	return React.useReducer((state, event) => {
		return machine[state][event] ?? state;
	}, initialState);
}
__name$2(useStateMachine, "useStateMachine");
var Presence = /* @__PURE__ */ __name$2((props) => {
	const { present, children } = props;
	const presence = usePresence(present);
	const child = typeof children === "function" ? children({ present: presence.isPresent }) : React.Children.only(children);
	const ref = useStableComposedRefs(presence.ref, getElementRef(child));
	return typeof children === "function" || presence.isPresent ? React.cloneElement(child, { ref }) : null;
}, "Presence");
function usePresence(present) {
	const [node, setNode] = React.useState();
	const stylesRef = React.useRef(null);
	const prevPresentRef = React.useRef(present);
	const prevAnimationNameRef = React.useRef("none");
	const mountAnimationNameRef = React.useRef(void 0);
	const [state, send] = useStateMachine(present ? "mounted" : "unmounted", {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	React.useEffect(() => {
		if (state === "mounted") {
			prevAnimationNameRef.current = mountAnimationNameRef.current ?? getAnimationName(stylesRef.current);
			mountAnimationNameRef.current = void 0;
		} else prevAnimationNameRef.current = "none";
	}, [state]);
	useLayoutEffect2(() => {
		const styles = stylesRef.current;
		const wasPresent = prevPresentRef.current;
		if (wasPresent !== present) {
			const prevAnimationName = prevAnimationNameRef.current;
			const currentAnimationName = getAnimationName(styles);
			if (present) {
				mountAnimationNameRef.current = currentAnimationName;
				send("MOUNT");
			} else if (currentAnimationName === "none" || styles?.display === "none") send("UNMOUNT");
			else if (wasPresent && prevAnimationName !== currentAnimationName) send("ANIMATION_OUT");
			else send("UNMOUNT");
			prevPresentRef.current = present;
		}
	}, [present, send]);
	useLayoutEffect2(() => {
		if (node) {
			let timeoutId;
			const ownerWindow = node.ownerDocument.defaultView ?? window;
			const handleAnimationEnd = /* @__PURE__ */ __name$2((event) => {
				const isCurrentAnimation = getAnimationName(stylesRef.current).includes(CSS.escape(event.animationName));
				if (event.target === node && isCurrentAnimation) {
					send("ANIMATION_END");
					if (!prevPresentRef.current) {
						const currentFillMode = node.style.animationFillMode;
						node.style.animationFillMode = "forwards";
						timeoutId = ownerWindow.setTimeout(() => {
							if (node.style.animationFillMode === "forwards") node.style.animationFillMode = currentFillMode;
						});
					}
				}
			}, "handleAnimationEnd");
			const handleAnimationStart = /* @__PURE__ */ __name$2((event) => {
				if (event.target === node) prevAnimationNameRef.current = getAnimationName(stylesRef.current);
			}, "handleAnimationStart");
			node.addEventListener("animationstart", handleAnimationStart);
			node.addEventListener("animationcancel", handleAnimationEnd);
			node.addEventListener("animationend", handleAnimationEnd);
			return () => {
				ownerWindow.clearTimeout(timeoutId);
				node.removeEventListener("animationstart", handleAnimationStart);
				node.removeEventListener("animationcancel", handleAnimationEnd);
				node.removeEventListener("animationend", handleAnimationEnd);
			};
		} else send("ANIMATION_END");
	}, [node, send]);
	return {
		isPresent: ["mounted", "unmountSuspended"].includes(state),
		ref: React.useCallback((node2) => {
			if (node2) {
				const styles = getComputedStyle(node2);
				stylesRef.current = styles;
				mountAnimationNameRef.current = getAnimationName(styles);
			} else stylesRef.current = null;
			setNode(node2);
		}, [])
	};
}
__name$2(usePresence, "usePresence");
function setRef(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
__name$2(setRef, "setRef");
function useStableComposedRefs(...refs) {
	const refsRef = React.useRef(refs);
	refsRef.current = refs;
	return React.useCallback((node) => {
		const currentRefs = refsRef.current;
		let hasCleanup = false;
		const cleanups = currentRefs.map((ref) => {
			const cleanup = setRef(ref, node);
			if (!hasCleanup && typeof cleanup === "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup === "function") cleanup();
				else setRef(currentRefs[i], null);
			}
		};
	}, []);
}
__name$2(useStableComposedRefs, "useStableComposedRefs");
function getAnimationName(styles) {
	return styles?.animationName || "none";
}
__name$2(getAnimationName, "getAnimationName");
function getElementRef(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
__name$2(getElementRef, "getElementRef");

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-focus-guard_0b6dc35411495c11d7017f4d480bfd1d/node_modules/@radix-ui/react-focus-guards/dist/index.mjs
var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", {
	value,
	configurable: true
});
var count = 0;
var guards = null;
function FocusGuards(props) {
	useFocusGuards();
	return props.children;
}
__name$1(FocusGuards, "FocusGuards");
function useFocusGuards() {
	React.useEffect(() => {
		if (!guards) guards = {
			start: createFocusGuard(),
			end: createFocusGuard()
		};
		const { start, end } = guards;
		if (document.body.firstElementChild !== start) document.body.insertAdjacentElement("afterbegin", start);
		if (document.body.lastElementChild !== end) document.body.insertAdjacentElement("beforeend", end);
		count++;
		return () => {
			if (count === 1) {
				guards?.start.remove();
				guards?.end.remove();
				guards = null;
			}
			count = Math.max(0, count - 1);
		};
	}, []);
}
__name$1(useFocusGuards, "useFocusGuards");
function createFocusGuard() {
	const element = document.createElement("span");
	element.setAttribute("data-radix-focus-guard", "");
	element.tabIndex = 0;
	element.style.outline = "none";
	element.style.opacity = "0";
	element.style.position = "fixed";
	element.style.pointerEvents = "none";
	return element;
}
__name$1(createFocusGuard, "createFocusGuard");

//#endregion
//#region ../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __spreadArray(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
}

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll-bar@2.3_6765803d5ca9f56610f613c0cdac7218/node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zeroRightClassName = "right-scroll-bar-position";
var fullWidthClassName = "width-before-scroll-bar";
var noScrollbarsClassName = "with-scroll-bars-hidden";
/**
* Name of a CSS variable containing the amount of "hidden" scrollbar
* ! might be undefined ! use will fallback!
*/
var removedBarSizeVariable = "--removed-body-scroll-bar-size";

//#endregion
//#region ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.18_react@19.2.8/node_modules/use-callback-ref/dist/es2015/assignRef.js
/**
* Assigns a value for a given ref, no matter of the ref format
* @param {RefObject} ref - a callback function or ref object
* @param value - a new value
*
* @see https://github.com/theKashey/use-callback-ref#assignref
* @example
* const refObject = useRef();
* const refFn = (ref) => {....}
*
* assignRef(refObject, "refValue");
* assignRef(refFn, "refValue");
*/
function assignRef(ref, value) {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
	return ref;
}

//#endregion
//#region ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.18_react@19.2.8/node_modules/use-callback-ref/dist/es2015/useRef.js
/**
* creates a MutableRef with ref change callback
* @param initialValue - initial ref value
* @param {Function} callback - a callback to run when value changes
*
* @example
* const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
* ref.current = 1;
* // prints 0 -> 1
*
* @see https://reactjs.org/docs/hooks-reference.html#useref
* @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
* @returns {MutableRefObject}
*/
function useCallbackRef(initialValue, callback) {
	var ref = useState(function() {
		return {
			value: initialValue,
			callback,
			facade: {
				get current() {
					return ref.value;
				},
				set current(value) {
					var last = ref.value;
					if (last !== value) {
						ref.value = value;
						ref.callback(value, last);
					}
				}
			}
		};
	})[0];
	ref.callback = callback;
	return ref.facade;
}

//#endregion
//#region ../../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.18_react@19.2.8/node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
var currentValues = /* @__PURE__ */ new WeakMap();
/**
* Merges two or more refs together providing a single interface to set their value
* @param {RefObject|Ref} refs
* @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
*
* @see {@link mergeRefs} a version without buit-in memoization
* @see https://github.com/theKashey/use-callback-ref#usemergerefs
* @example
* const Component = React.forwardRef((props, ref) => {
*   const ownRef = useRef();
*   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
*   return <div ref={domRef}>...</div>
* }
*/
function useMergeRefs(refs, defaultValue) {
	var callbackRef = useCallbackRef(defaultValue || null, function(newValue) {
		return refs.forEach(function(ref) {
			return assignRef(ref, newValue);
		});
	});
	useIsomorphicLayoutEffect(function() {
		var oldValue = currentValues.get(callbackRef);
		if (oldValue) {
			var prevRefs_1 = new Set(oldValue);
			var nextRefs_1 = new Set(refs);
			var current_1 = callbackRef.current;
			prevRefs_1.forEach(function(ref) {
				if (!nextRefs_1.has(ref)) assignRef(ref, null);
			});
			nextRefs_1.forEach(function(ref) {
				if (!prevRefs_1.has(ref)) assignRef(ref, current_1);
			});
		}
		currentValues.set(callbackRef, refs);
	}, [refs]);
	return callbackRef;
}

//#endregion
//#region ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.18_react@19.2.8/node_modules/use-sidecar/dist/es2015/medium.js
function ItoI(a) {
	return a;
}
function innerCreateMedium(defaults, middleware) {
	if (middleware === void 0) middleware = ItoI;
	var buffer = [];
	var assigned = false;
	return {
		read: function() {
			if (assigned) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
			if (buffer.length) return buffer[buffer.length - 1];
			return defaults;
		},
		useMedium: function(data) {
			var item = middleware(data, assigned);
			buffer.push(item);
			return function() {
				buffer = buffer.filter(function(x) {
					return x !== item;
				});
			};
		},
		assignSyncMedium: function(cb) {
			assigned = true;
			while (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
			}
			buffer = {
				push: function(x) {
					return cb(x);
				},
				filter: function() {
					return buffer;
				}
			};
		},
		assignMedium: function(cb) {
			assigned = true;
			var pendingQueue = [];
			if (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
				pendingQueue = buffer;
			}
			var executeQueue = function() {
				var cbs = pendingQueue;
				pendingQueue = [];
				cbs.forEach(cb);
			};
			var cycle = function() {
				return Promise.resolve().then(executeQueue);
			};
			cycle();
			buffer = {
				push: function(x) {
					pendingQueue.push(x);
					cycle();
				},
				filter: function(filter) {
					pendingQueue = pendingQueue.filter(filter);
					return buffer;
				}
			};
		}
	};
}
function createSidecarMedium(options) {
	if (options === void 0) options = {};
	var medium = innerCreateMedium(null);
	medium.options = __assign({
		async: true,
		ssr: false
	}, options);
	return medium;
}

//#endregion
//#region ../../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.18_react@19.2.8/node_modules/use-sidecar/dist/es2015/exports.js
var SideCar = function(_a) {
	var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
	if (!sideCar) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
	var Target = sideCar.read();
	if (!Target) throw new Error("Sidecar medium not found");
	return React.createElement(Target, __assign({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
	medium.useMedium(exported);
	return SideCar;
}

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.18_react@19.2.8/node_modules/react-remove-scroll/dist/es2015/medium.js
var effectCar = createSidecarMedium();

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.18_react@19.2.8/node_modules/react-remove-scroll/dist/es2015/UI.js
var nothing = function() {};
/**
* Removes scrollbar from the page and contain the scroll within the Lock
*/
var RemoveScroll = React.forwardRef(function(props, parentRef) {
	var ref = React.useRef(null);
	var _a = React.useState({
		onScrollCapture: nothing,
		onWheelCapture: nothing,
		onTouchMoveCapture: nothing
	}), callbacks = _a[0], setCallbacks = _a[1];
	var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, [
		"forwardProps",
		"children",
		"className",
		"removeScrollBar",
		"enabled",
		"shards",
		"sideCar",
		"noRelative",
		"noIsolation",
		"inert",
		"allowPinchZoom",
		"as",
		"gapMode"
	]);
	var SideCar = sideCar;
	var containerRef = useMergeRefs([ref, parentRef]);
	var containerProps = __assign(__assign({}, rest), callbacks);
	return React.createElement(React.Fragment, null, enabled && React.createElement(SideCar, {
		sideCar: effectCar,
		removeScrollBar,
		shards,
		noRelative,
		noIsolation,
		inert,
		setCallbacks,
		allowPinchZoom: !!allowPinchZoom,
		lockRef: ref,
		gapMode
	}), forwardProps ? React.cloneElement(React.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React.createElement(Container, __assign({}, containerProps, {
		className,
		ref: containerRef
	}), children));
});
RemoveScroll.defaultProps = {
	enabled: true,
	removeScrollBar: true,
	inert: false
};
RemoveScroll.classNames = {
	fullWidth: fullWidthClassName,
	zeroRight: zeroRightClassName
};

//#endregion
//#region ../../node_modules/.pnpm/get-nonce@1.0.1/node_modules/get-nonce/dist/es2015/index.js
var currentNonce;
var getNonce = function() {
	if (currentNonce) return currentNonce;
	if (typeof __webpack_nonce__ !== "undefined") return __webpack_nonce__;
};

//#endregion
//#region ../../node_modules/.pnpm/react-style-singleton@2.2.3_b6136bc3c152300a6c842c4b9688e211/node_modules/react-style-singleton/dist/es2015/singleton.js
function makeStyleTag() {
	if (!document) return null;
	var tag = document.createElement("style");
	tag.type = "text/css";
	var nonce = getNonce();
	if (nonce) tag.setAttribute("nonce", nonce);
	return tag;
}
function injectStyles(tag, css) {
	if (tag.styleSheet) tag.styleSheet.cssText = css;
	else tag.appendChild(document.createTextNode(css));
}
function insertStyleTag(tag) {
	(document.head || document.getElementsByTagName("head")[0]).appendChild(tag);
}
var stylesheetSingleton = function() {
	var counter = 0;
	var stylesheet = null;
	return {
		add: function(style) {
			if (counter == 0) {
				if (stylesheet = makeStyleTag()) {
					injectStyles(stylesheet, style);
					insertStyleTag(stylesheet);
				}
			}
			counter++;
		},
		remove: function() {
			counter--;
			if (!counter && stylesheet) {
				stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
				stylesheet = null;
			}
		}
	};
};

//#endregion
//#region ../../node_modules/.pnpm/react-style-singleton@2.2.3_b6136bc3c152300a6c842c4b9688e211/node_modules/react-style-singleton/dist/es2015/hook.js
/**
* creates a hook to control style singleton
* @see {@link styleSingleton} for a safer component version
* @example
* ```tsx
* const useStyle = styleHookSingleton();
* ///
* useStyle('body { overflow: hidden}');
*/
var styleHookSingleton = function() {
	var sheet = stylesheetSingleton();
	return function(styles, isDynamic) {
		React.useEffect(function() {
			sheet.add(styles);
			return function() {
				sheet.remove();
			};
		}, [styles && isDynamic]);
	};
};

//#endregion
//#region ../../node_modules/.pnpm/react-style-singleton@2.2.3_b6136bc3c152300a6c842c4b9688e211/node_modules/react-style-singleton/dist/es2015/component.js
/**
* create a Component to add styles on demand
* - styles are added when first instance is mounted
* - styles are removed when the last instance is unmounted
* - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
*/
var styleSingleton = function() {
	var useStyle = styleHookSingleton();
	var Sheet = function(_a) {
		var styles = _a.styles, dynamic = _a.dynamic;
		useStyle(styles, dynamic);
		return null;
	};
	return Sheet;
};

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll-bar@2.3_6765803d5ca9f56610f613c0cdac7218/node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zeroGap = {
	left: 0,
	top: 0,
	right: 0,
	gap: 0
};
var parse = function(x) {
	return parseInt(x || "", 10) || 0;
};
var getOffset = function(gapMode) {
	var cs = window.getComputedStyle(document.body);
	var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
	var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
	var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
	return [
		parse(left),
		parse(top),
		parse(right)
	];
};
var getGapWidth = function(gapMode) {
	if (gapMode === void 0) gapMode = "margin";
	if (typeof window === "undefined") return zeroGap;
	var offsets = getOffset(gapMode);
	var documentWidth = document.documentElement.clientWidth;
	var windowWidth = window.innerWidth;
	return {
		left: offsets[0],
		top: offsets[1],
		right: offsets[2],
		gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
	};
};

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll-bar@2.3_6765803d5ca9f56610f613c0cdac7218/node_modules/react-remove-scroll-bar/dist/es2015/component.js
var Style = styleSingleton();
var lockAttribute = "data-scroll-locked";
var getStyles = function(_a, allowRelative, gapMode, important) {
	var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
	if (gapMode === void 0) gapMode = "margin";
	return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
		allowRelative && "position: relative ".concat(important, ";"),
		gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
		gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
	].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
	var counter = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
	return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
	React.useEffect(function() {
		document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
		return function() {
			var newCounter = getCurrentUseCounter() - 1;
			if (newCounter <= 0) document.body.removeAttribute(lockAttribute);
			else document.body.setAttribute(lockAttribute, newCounter.toString());
		};
	}, []);
};
/**
* Removes page scrollbar and blocks page scroll when mounted
*/
var RemoveScrollBar = function(_a) {
	var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
	useLockAttribute();
	var gap = React.useMemo(function() {
		return getGapWidth(gapMode);
	}, [gapMode]);
	return React.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
};

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.18_react@19.2.8/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var passiveSupported = false;
if (typeof window !== "undefined") try {
	var options = Object.defineProperty({}, "passive", { get: function() {
		passiveSupported = true;
		return true;
	} });
	window.addEventListener("test", options, options);
	window.removeEventListener("test", options, options);
} catch (err) {
	passiveSupported = false;
}
var nonPassive = passiveSupported ? { passive: false } : false;

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.18_react@19.2.8/node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var alwaysContainsScroll = function(node) {
	return node.tagName === "TEXTAREA";
};
var elementCanBeScrolled = function(node, overflow) {
	if (!(node instanceof Element)) return false;
	var styles = window.getComputedStyle(node);
	return styles[overflow] !== "hidden" && !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible");
};
var elementCouldBeVScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowY");
};
var elementCouldBeHScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowX");
};
var locationCouldBeScrolled = function(axis, node) {
	var ownerDocument = node.ownerDocument;
	var current = node;
	do {
		if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) current = current.host;
		if (elementCouldBeScrolled(axis, current)) {
			var _a = getScrollVariables(axis, current);
			if (_a[1] > _a[2]) return true;
		}
		current = current.parentNode;
	} while (current && current !== ownerDocument.body);
	return false;
};
var getVScrollVariables = function(_a) {
	return [
		_a.scrollTop,
		_a.scrollHeight,
		_a.clientHeight
	];
};
var getHScrollVariables = function(_a) {
	return [
		_a.scrollLeft,
		_a.scrollWidth,
		_a.clientWidth
	];
};
var elementCouldBeScrolled = function(axis, node) {
	return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
	return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
	/**
	* If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
	* and then increasingly negative as you scroll towards the end of the content.
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
	*/
	return axis === "h" && direction === "rtl" ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
	var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
	var delta = directionFactor * sourceDelta;
	var target = event.target;
	var targetInLock = endTarget.contains(target);
	var shouldCancelScroll = false;
	var isDeltaPositive = delta > 0;
	var availableScroll = 0;
	var availableScrollTop = 0;
	do {
		if (!target) break;
		var _a = getScrollVariables(axis, target), position = _a[0];
		var elementScroll = _a[1] - _a[2] - directionFactor * position;
		if (position || elementScroll) {
			if (elementCouldBeScrolled(axis, target)) {
				availableScroll += elementScroll;
				availableScrollTop += position;
			}
		}
		var parent_1 = target.parentNode;
		target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
	} while (!targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target));
	if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) shouldCancelScroll = true;
	else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) shouldCancelScroll = true;
	return shouldCancelScroll;
};

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.18_react@19.2.8/node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var getTouchXY = function(event) {
	return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function(event) {
	return [event.deltaX, event.deltaY];
};
var extractRef = function(ref) {
	return ref && "current" in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
	return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
	return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
	var shouldPreventQueue = React.useRef([]);
	var touchStartRef = React.useRef([0, 0]);
	var activeAxis = React.useRef();
	var id = React.useState(idCounter++)[0];
	var Style = React.useState(styleSingleton)[0];
	var lastProps = React.useRef(props);
	React.useEffect(function() {
		lastProps.current = props;
	}, [props]);
	React.useEffect(function() {
		if (props.inert) {
			document.body.classList.add("block-interactivity-".concat(id));
			var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
			allow_1.forEach(function(el) {
				return el.classList.add("allow-interactivity-".concat(id));
			});
			return function() {
				document.body.classList.remove("block-interactivity-".concat(id));
				allow_1.forEach(function(el) {
					return el.classList.remove("allow-interactivity-".concat(id));
				});
			};
		}
	}, [
		props.inert,
		props.lockRef.current,
		props.shards
	]);
	var shouldCancelEvent = React.useCallback(function(event, parent) {
		if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) return !lastProps.current.allowPinchZoom;
		var touch = getTouchXY(event);
		var touchStart = touchStartRef.current;
		var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
		var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
		var currentAxis;
		var target = event.target;
		var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
		if ("touches" in event && moveDirection === "h" && target.type === "range") return false;
		var selection = window.getSelection();
		var anchorNode = selection && selection.anchorNode;
		if (anchorNode ? anchorNode === target || anchorNode.contains(target) : false) return false;
		var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		if (!canBeScrolledInMainDirection) return true;
		if (canBeScrolledInMainDirection) currentAxis = moveDirection;
		else {
			currentAxis = moveDirection === "v" ? "h" : "v";
			canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		}
		if (!canBeScrolledInMainDirection) return false;
		if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) activeAxis.current = currentAxis;
		if (!currentAxis) return true;
		var cancelingAxis = activeAxis.current || currentAxis;
		return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
	}, []);
	var shouldPrevent = React.useCallback(function(_event) {
		var event = _event;
		if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) return;
		var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
		var sourceEvent = shouldPreventQueue.current.filter(function(e) {
			return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
		})[0];
		if (sourceEvent && sourceEvent.should) {
			if (event.cancelable) event.preventDefault();
			return;
		}
		if (!sourceEvent) {
			var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
				return node.contains(event.target);
			});
			if (shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation) {
				if (event.cancelable) event.preventDefault();
			}
		}
	}, []);
	var shouldCancel = React.useCallback(function(name, delta, target, should) {
		var event = {
			name,
			delta,
			target,
			should,
			shadowParent: getOutermostShadowParent(target)
		};
		shouldPreventQueue.current.push(event);
		setTimeout(function() {
			shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
				return e !== event;
			});
		}, 1);
	}, []);
	var scrollTouchStart = React.useCallback(function(event) {
		touchStartRef.current = getTouchXY(event);
		activeAxis.current = void 0;
	}, []);
	var scrollWheel = React.useCallback(function(event) {
		shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	var scrollTouchMove = React.useCallback(function(event) {
		shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	React.useEffect(function() {
		lockStack.push(Style);
		props.setCallbacks({
			onScrollCapture: scrollWheel,
			onWheelCapture: scrollWheel,
			onTouchMoveCapture: scrollTouchMove
		});
		document.addEventListener("wheel", shouldPrevent, nonPassive);
		document.addEventListener("touchmove", shouldPrevent, nonPassive);
		document.addEventListener("touchstart", scrollTouchStart, nonPassive);
		return function() {
			lockStack = lockStack.filter(function(inst) {
				return inst !== Style;
			});
			document.removeEventListener("wheel", shouldPrevent, nonPassive);
			document.removeEventListener("touchmove", shouldPrevent, nonPassive);
			document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
		};
	}, []);
	var removeScrollBar = props.removeScrollBar, inert = props.inert;
	return React.createElement(React.Fragment, null, inert ? React.createElement(Style, { styles: generateStyle(id) }) : null, removeScrollBar ? React.createElement(RemoveScrollBar, {
		noRelative: props.noRelative,
		gapMode: props.gapMode
	}) : null);
}
function getOutermostShadowParent(node) {
	var shadowParent = null;
	while (node !== null) {
		if (node instanceof ShadowRoot) {
			shadowParent = node.host;
			node = node.host;
		}
		node = node.parentNode;
	}
	return shadowParent;
}

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.18_react@19.2.8/node_modules/react-remove-scroll/dist/es2015/sidecar.js
var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);

//#endregion
//#region ../../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.18_react@19.2.8/node_modules/react-remove-scroll/dist/es2015/Combination.js
var ReactRemoveScroll = React.forwardRef(function(props, ref) {
	return React.createElement(RemoveScroll, __assign({}, props, {
		ref,
		sideCar: sidecar_default
	}));
});
ReactRemoveScroll.classNames = RemoveScroll.classNames;

//#endregion
//#region ../../node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
var getDefaultParent = function(originalTarget) {
	if (typeof document === "undefined") return null;
	return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
};
var counterMap = /* @__PURE__ */ new WeakMap();
var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
	return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
	return targets.map(function(target) {
		if (parent.contains(target)) return target;
		var correctedTarget = unwrapHost(target);
		if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
		console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
		return null;
	}).filter(function(x) {
		return Boolean(x);
	});
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @param {String} [controlAttribute] - html Attribute to control
* @return {Undo} undo command
*/
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
	var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	if (!markerMap[markerName]) markerMap[markerName] = /* @__PURE__ */ new WeakMap();
	var markerCounter = markerMap[markerName];
	var hiddenNodes = [];
	var elementsToKeep = /* @__PURE__ */ new Set();
	var elementsToStop = new Set(targets);
	var keep = function(el) {
		if (!el || elementsToKeep.has(el)) return;
		elementsToKeep.add(el);
		keep(el.parentNode);
	};
	targets.forEach(keep);
	var deep = function(parent) {
		if (!parent || elementsToStop.has(parent)) return;
		Array.prototype.forEach.call(parent.children, function(node) {
			if (elementsToKeep.has(node)) deep(node);
			else try {
				var attr = node.getAttribute(controlAttribute);
				var alreadyHidden = attr !== null && attr !== "false";
				var counterValue = (counterMap.get(node) || 0) + 1;
				var markerValue = (markerCounter.get(node) || 0) + 1;
				counterMap.set(node, counterValue);
				markerCounter.set(node, markerValue);
				hiddenNodes.push(node);
				if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
				if (markerValue === 1) node.setAttribute(markerName, "true");
				if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
			} catch (e) {
				console.error("aria-hidden: cannot operate on ", node, e);
			}
		});
	};
	deep(parentNode);
	elementsToKeep.clear();
	lockCount++;
	return function() {
		hiddenNodes.forEach(function(node) {
			var counterValue = counterMap.get(node) - 1;
			var markerValue = markerCounter.get(node) - 1;
			counterMap.set(node, counterValue);
			markerCounter.set(node, markerValue);
			if (!counterValue) {
				if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
				uncontrolledNodes.delete(node);
			}
			if (!markerValue) node.removeAttribute(markerName);
		});
		lockCount--;
		if (!lockCount) {
			counterMap = /* @__PURE__ */ new WeakMap();
			counterMap = /* @__PURE__ */ new WeakMap();
			uncontrolledNodes = /* @__PURE__ */ new WeakMap();
			markerMap = {};
		}
	};
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @return {Undo} undo command
*/
var hideOthers = function(originalTarget, parentNode, markerName) {
	if (markerName === void 0) markerName = "data-aria-hidden";
	var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	var activeParentNode = parentNode || getDefaultParent(originalTarget);
	if (!activeParentNode) return function() {
		return null;
	};
	targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
	return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};

//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-dialog@1.1._f43cda4f5f60c6fd8f384ced683c6d90/node_modules/@radix-ui/react-dialog/dist/index.mjs
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = /* @__PURE__ */ __name((props) => {
	const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const triggerRef = React.useRef(null);
	const contentRef = React.useRef(null);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DIALOG_NAME
	});
	const [titleCount, setTitleCount] = React.useState(0);
	const [descriptionCount, setDescriptionCount] = React.useState(0);
	return /* @__PURE__ */ jsx(DialogProvider, {
		scope: __scopeDialog,
		triggerRef,
		contentRef,
		contentId: useId(),
		titleId: useId(),
		descriptionId: useId(),
		titlePresent: titleCount > 0,
		descriptionPresent: descriptionCount > 0,
		setTitleCount,
		setDescriptionCount,
		open,
		onOpenChange: setOpen,
		onOpenToggle: React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		children
	});
}, "Dialog");
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, { forceMount: void 0 });
var DialogPortal = /* @__PURE__ */ __name((props) => {
	const { __scopeDialog, forceMount, children, container } = props;
	const context = useDialogContext(PORTAL_NAME, __scopeDialog);
	return /* @__PURE__ */ jsx(PortalProvider, {
		scope: __scopeDialog,
		forceMount,
		children: React.Children.map(children, (child) => /* @__PURE__ */ jsx(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ jsx(Portal, {
				asChild: true,
				container,
				children: child
			})
		}))
	});
}, "DialogPortal");
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name(function DialogOverlay2(props, forwardedRef) {
	const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
	return context.modal ? /* @__PURE__ */ jsx(Presence, {
		present: forceMount || context.open,
		children: /* @__PURE__ */ jsx(DialogOverlayImpl, {
			...overlayProps,
			ref: forwardedRef
		})
	}) : null;
}, "DialogOverlay"));
var Slot = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name(function DialogOverlayImpl2(props, forwardedRef) {
	const { __scopeDialog, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
	const registerDismissableSurface = useDismissableLayerSurface();
	const composedRefs = useComposedRefs(forwardedRef, registerDismissableSurface);
	return /* @__PURE__ */ jsx(ReactRemoveScroll, {
		as: Slot,
		allowPinchZoom: true,
		shards: [context.contentRef],
		children: /* @__PURE__ */ jsx(Primitive.div, {
			"data-state": getState(context.open),
			...overlayProps,
			ref: composedRefs,
			style: {
				pointerEvents: "auto",
				...overlayProps.style
			}
		})
	});
}, "DialogOverlayImpl"));
var CONTENT_NAME = "DialogContent";
var DialogContent = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name(function DialogContent2(props, forwardedRef) {
	const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	return /* @__PURE__ */ jsx(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ jsx(DialogContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ jsx(DialogContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
}, "DialogContent"));
var DialogContentModal = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name(function DialogContentModal2(props, forwardedRef) {
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	const contentRef = React.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
	React.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ jsx(DialogContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: context.open,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			event.preventDefault();
			context.triggerRef.current?.focus();
		}),
		onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
		}),
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault())
	});
}, "DialogContentModal"));
var DialogContentNonModal = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name(function DialogContentNonModal2(props, forwardedRef) {
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	const hasInteractedOutsideRef = React.useRef(false);
	const hasPointerDownOutsideRef = React.useRef(false);
	return /* @__PURE__ */ jsx(DialogContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		onCloseAutoFocus: (event) => {
			props.onCloseAutoFocus?.(event);
			if (!event.defaultPrevented) {
				if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
				event.preventDefault();
			}
			hasInteractedOutsideRef.current = false;
			hasPointerDownOutsideRef.current = false;
		},
		onInteractOutside: (event) => {
			props.onInteractOutside?.(event);
			if (!event.defaultPrevented) {
				hasInteractedOutsideRef.current = true;
				if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.current = true;
			}
			const target = event.target;
			if (context.triggerRef.current?.contains(target)) event.preventDefault();
			if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) event.preventDefault();
		}
	});
}, "DialogContentNonModal"));
var DialogContentImpl = /* @__PURE__ */ React.forwardRef(/* @__PURE__ */ __name(function DialogContentImpl2(props, forwardedRef) {
	const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME, __scopeDialog);
	useFocusGuards();
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(FocusScope, {
		asChild: true,
		loop: true,
		trapped: trapFocus,
		onMountAutoFocus: onOpenAutoFocus,
		onUnmountAutoFocus: onCloseAutoFocus,
		children: /* @__PURE__ */ jsx(DismissableLayer, {
			role: "dialog",
			id: context.contentId,
			"aria-describedby": context.descriptionPresent ? context.descriptionId : void 0,
			"aria-labelledby": context.titlePresent ? context.titleId : void 0,
			"data-state": getState(context.open),
			...contentProps,
			ref: forwardedRef,
			deferPointerDownOutside: true,
			onDismiss: () => context.onOpenChange(false)
		})
	}) });
}, "DialogContentImpl"));
function getState(open) {
	return open ? "open" : "closed";
}
__name(getState, "getState");

//#endregion
//#region ../../node_modules/.pnpm/cmdk@1.1.1_@types+react-dom_b7833f22e642c0a58838e454e2cd1ba9/node_modules/cmdk/dist/index.mjs
var N = "[cmdk-group=\"\"]";
var Y = "[cmdk-group-items=\"\"]";
var be = "[cmdk-group-heading=\"\"]";
var le = "[cmdk-item=\"\"]";
var ce = `${le}:not([aria-disabled="true"])`;
var Z = "cmdk-item-select";
var T = "data-value";
var Re = (r, o, n) => W(r, o, n);
var ue = React.createContext(void 0);
var K = () => React.useContext(ue);
var de = React.createContext(void 0);
var ee = () => React.useContext(de);
var fe = React.createContext(void 0);
var me = React.forwardRef((r, o) => {
	let n = L(() => {
		var e, a;
		return {
			search: "",
			value: (a = (e = r.value) != null ? e : r.defaultValue) != null ? a : "",
			selectedItemId: void 0,
			filtered: {
				count: 0,
				items: /* @__PURE__ */ new Map(),
				groups: /* @__PURE__ */ new Set()
			}
		};
	}), u = L(() => /* @__PURE__ */ new Set()), c = L(() => /* @__PURE__ */ new Map()), d = L(() => /* @__PURE__ */ new Map()), f = L(() => /* @__PURE__ */ new Set()), p = pe(r), { label: b, children: m, value: R, onValueChange: x, filter: C, shouldFilter: S, loop: A, disablePointerSelection: ge = !1, vimBindings: j = !0, ...O } = r, $ = useId(), q = useId(), _ = useId(), I = React.useRef(null), v = ke();
	k(() => {
		if (R !== void 0) {
			let e = R.trim();
			n.current.value = e, E.emit();
		}
	}, [R]), k(() => {
		v(6, ne);
	}, []);
	let E = React.useMemo(() => ({
		subscribe: (e) => (f.current.add(e), () => f.current.delete(e)),
		snapshot: () => n.current,
		setState: (e, a, s) => {
			var i, l, g, y;
			if (!Object.is(n.current[e], a)) {
				if (n.current[e] = a, e === "search") J(), z(), v(1, W);
				else if (e === "value") {
					if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
						let h = document.getElementById(_);
						h ? h.focus() : (i = document.getElementById($)) == null || i.focus();
					}
					if (v(7, () => {
						var h;
						n.current.selectedItemId = (h = M()) == null ? void 0 : h.id, E.emit();
					}), s || v(5, ne), ((l = p.current) == null ? void 0 : l.value) !== void 0) {
						let h = a != null ? a : "";
						(y = (g = p.current).onValueChange) == null || y.call(g, h);
						return;
					}
				}
				E.emit();
			}
		},
		emit: () => {
			f.current.forEach((e) => e());
		}
	}), []), U = React.useMemo(() => ({
		value: (e, a, s) => {
			var i;
			a !== ((i = d.current.get(e)) == null ? void 0 : i.value) && (d.current.set(e, {
				value: a,
				keywords: s
			}), n.current.filtered.items.set(e, te(a, s)), v(2, () => {
				z(), E.emit();
			}));
		},
		item: (e, a) => (u.current.add(e), a && (c.current.has(a) ? c.current.get(a).add(e) : c.current.set(a, /* @__PURE__ */ new Set([e]))), v(3, () => {
			J(), z(), n.current.value || W(), E.emit();
		}), () => {
			d.current.delete(e), u.current.delete(e), n.current.filtered.items.delete(e);
			let s = M();
			v(4, () => {
				J(), (s == null ? void 0 : s.getAttribute("id")) === e && W(), E.emit();
			});
		}),
		group: (e) => (c.current.has(e) || c.current.set(e, /* @__PURE__ */ new Set()), () => {
			d.current.delete(e), c.current.delete(e);
		}),
		filter: () => p.current.shouldFilter,
		label: b || r["aria-label"],
		getDisablePointerSelection: () => p.current.disablePointerSelection,
		listId: $,
		inputId: _,
		labelId: q,
		listInnerRef: I
	}), []);
	function te(e, a) {
		var i, l;
		let s = (l = (i = p.current) == null ? void 0 : i.filter) != null ? l : Re;
		return e ? s(e, n.current.search, a) : 0;
	}
	function z() {
		if (!n.current.search || p.current.shouldFilter === !1) return;
		let e = n.current.filtered.items, a = [];
		n.current.filtered.groups.forEach((i) => {
			let l = c.current.get(i), g = 0;
			l.forEach((y) => {
				let h = e.get(y);
				g = Math.max(h, g);
			}), a.push([i, g]);
		});
		let s = I.current;
		V().sort((i, l) => {
			var h, F;
			let g = i.getAttribute("id"), y = l.getAttribute("id");
			return ((h = e.get(y)) != null ? h : 0) - ((F = e.get(g)) != null ? F : 0);
		}).forEach((i) => {
			let l = i.closest(Y);
			l ? l.appendChild(i.parentElement === l ? i : i.closest(`${Y} > *`)) : s.appendChild(i.parentElement === s ? i : i.closest(`${Y} > *`));
		}), a.sort((i, l) => l[1] - i[1]).forEach((i) => {
			var g;
			let l = (g = I.current) == null ? void 0 : g.querySelector(`${N}[${T}="${encodeURIComponent(i[0])}"]`);
			l?.parentElement.appendChild(l);
		});
	}
	function W() {
		let e = V().find((s) => s.getAttribute("aria-disabled") !== "true"), a = e == null ? void 0 : e.getAttribute(T);
		E.setState("value", a || void 0);
	}
	function J() {
		var a, s, i, l;
		if (!n.current.search || p.current.shouldFilter === !1) {
			n.current.filtered.count = u.current.size;
			return;
		}
		n.current.filtered.groups = /* @__PURE__ */ new Set();
		let e = 0;
		for (let g of u.current) {
			let F = te((s = (a = d.current.get(g)) == null ? void 0 : a.value) != null ? s : "", (l = (i = d.current.get(g)) == null ? void 0 : i.keywords) != null ? l : []);
			n.current.filtered.items.set(g, F), F > 0 && e++;
		}
		for (let [g, y] of c.current) for (let h of y) if (n.current.filtered.items.get(h) > 0) {
			n.current.filtered.groups.add(g);
			break;
		}
		n.current.filtered.count = e;
	}
	function ne() {
		var a, s, i;
		let e = M();
		e && (((a = e.parentElement) == null ? void 0 : a.firstChild) === e && ((i = (s = e.closest(N)) == null ? void 0 : s.querySelector(be)) == null || i.scrollIntoView({ block: "nearest" })), e.scrollIntoView({ block: "nearest" }));
	}
	function M() {
		var e;
		return (e = I.current) == null ? void 0 : e.querySelector(`${le}[aria-selected="true"]`);
	}
	function V() {
		var e;
		return Array.from(((e = I.current) == null ? void 0 : e.querySelectorAll(ce)) || []);
	}
	function X(e) {
		let s = V()[e];
		s && E.setState("value", s.getAttribute(T));
	}
	function Q(e) {
		var g;
		let a = M(), s = V(), i = s.findIndex((y) => y === a), l = s[i + e];
		(g = p.current) != null && g.loop && (l = i + e < 0 ? s[s.length - 1] : i + e === s.length ? s[0] : s[i + e]), l && E.setState("value", l.getAttribute(T));
	}
	function re(e) {
		let a = M(), s = a == null ? void 0 : a.closest(N), i;
		for (; s && !i;) s = e > 0 ? we(s, N) : De(s, N), i = s == null ? void 0 : s.querySelector(ce);
		i ? E.setState("value", i.getAttribute(T)) : Q(e);
	}
	let oe = () => X(V().length - 1), ie = (e) => {
		e.preventDefault(), e.metaKey ? oe() : e.altKey ? re(1) : Q(1);
	}, se = (e) => {
		e.preventDefault(), e.metaKey ? X(0) : e.altKey ? re(-1) : Q(-1);
	};
	return React.createElement(Primitive.div, {
		ref: o,
		tabIndex: -1,
		...O,
		"cmdk-root": "",
		onKeyDown: (e) => {
			var s;
			(s = O.onKeyDown) == null || s.call(O, e);
			let a = e.nativeEvent.isComposing || e.keyCode === 229;
			if (!(e.defaultPrevented || a)) switch (e.key) {
				case "n":
				case "j":
					j && e.ctrlKey && ie(e);
					break;
				case "ArrowDown":
					ie(e);
					break;
				case "p":
				case "k":
					j && e.ctrlKey && se(e);
					break;
				case "ArrowUp":
					se(e);
					break;
				case "Home":
					e.preventDefault(), X(0);
					break;
				case "End":
					e.preventDefault(), oe();
					break;
				case "Enter": {
					e.preventDefault();
					let i = M();
					if (i) {
						let l = new Event(Z);
						i.dispatchEvent(l);
					}
				}
			}
		}
	}, React.createElement("label", {
		"cmdk-label": "",
		htmlFor: U.inputId,
		id: U.labelId,
		style: Te
	}, b), B(r, (e) => React.createElement(de.Provider, { value: E }, React.createElement(ue.Provider, { value: U }, e))));
});
var he = React.forwardRef((r, o) => {
	var _, I;
	let n = useId(), u = React.useRef(null), c = React.useContext(fe), d = K(), f = pe(r), p = (I = (_ = f.current) == null ? void 0 : _.forceMount) != null ? I : c == null ? void 0 : c.forceMount;
	k(() => {
		if (!p) return d.item(n, c == null ? void 0 : c.id);
	}, [p]);
	let b = ve(n, u, [
		r.value,
		r.children,
		u
	], r.keywords), m = ee(), R = P((v) => v.value && v.value === b.current), x = P((v) => p || d.filter() === !1 ? !0 : v.search ? v.filtered.items.get(n) > 0 : !0);
	React.useEffect(() => {
		let v = u.current;
		if (!(!v || r.disabled)) return v.addEventListener(Z, C), () => v.removeEventListener(Z, C);
	}, [
		x,
		r.onSelect,
		r.disabled
	]);
	function C() {
		var v, E;
		S(), (E = (v = f.current).onSelect) == null || E.call(v, b.current);
	}
	function S() {
		m.setState("value", b.current, !0);
	}
	if (!x) return null;
	let { disabled: A, value: ge, onSelect: j, forceMount: O, keywords: $, ...q } = r;
	return React.createElement(Primitive.div, {
		ref: composeRefs(u, o),
		...q,
		id: n,
		"cmdk-item": "",
		role: "option",
		"aria-disabled": !!A,
		"aria-selected": !!R,
		"data-disabled": !!A,
		"data-selected": !!R,
		onPointerMove: A || d.getDisablePointerSelection() ? void 0 : S,
		onClick: A ? void 0 : C
	}, r.children);
});
var Ee = React.forwardRef((r, o) => {
	let { heading: n, children: u, forceMount: c, ...d } = r, f = useId(), p = React.useRef(null), b = React.useRef(null), m = useId(), R = K(), x = P((S) => c || R.filter() === !1 ? !0 : S.search ? S.filtered.groups.has(f) : !0);
	k(() => R.group(f), []), ve(f, p, [
		r.value,
		r.heading,
		b
	]);
	let C = React.useMemo(() => ({
		id: f,
		forceMount: c
	}), [c]);
	return React.createElement(Primitive.div, {
		ref: composeRefs(p, o),
		...d,
		"cmdk-group": "",
		role: "presentation",
		hidden: x ? void 0 : !0
	}, n && React.createElement("div", {
		ref: b,
		"cmdk-group-heading": "",
		"aria-hidden": !0,
		id: m
	}, n), B(r, (S) => React.createElement("div", {
		"cmdk-group-items": "",
		role: "group",
		"aria-labelledby": n ? m : void 0
	}, React.createElement(fe.Provider, { value: C }, S))));
});
var ye = React.forwardRef((r, o) => {
	let { alwaysRender: n, ...u } = r, c = React.useRef(null), d = P((f) => !f.search);
	return !n && !d ? null : React.createElement(Primitive.div, {
		ref: composeRefs(c, o),
		...u,
		"cmdk-separator": "",
		role: "separator"
	});
});
var Se = React.forwardRef((r, o) => {
	let { onValueChange: n, ...u } = r, c = r.value != null, d = ee(), f = P((m) => m.search), p = P((m) => m.selectedItemId), b = K();
	return React.useEffect(() => {
		r.value != null && d.setState("search", r.value);
	}, [r.value]), React.createElement(Primitive.input, {
		ref: o,
		...u,
		"cmdk-input": "",
		autoComplete: "off",
		autoCorrect: "off",
		spellCheck: !1,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": !0,
		"aria-controls": b.listId,
		"aria-labelledby": b.labelId,
		"aria-activedescendant": p,
		id: b.inputId,
		type: "text",
		value: c ? r.value : f,
		onChange: (m) => {
			c || d.setState("search", m.target.value), n?.(m.target.value);
		}
	});
});
var Ce = React.forwardRef((r, o) => {
	let { children: n, label: u = "Suggestions", ...c } = r, d = React.useRef(null), f = React.useRef(null), p = P((m) => m.selectedItemId), b = K();
	return React.useEffect(() => {
		if (f.current && d.current) {
			let m = f.current, R = d.current, x, C = new ResizeObserver(() => {
				x = requestAnimationFrame(() => {
					let S = m.offsetHeight;
					R.style.setProperty("--cmdk-list-height", S.toFixed(1) + "px");
				});
			});
			return C.observe(m), () => {
				cancelAnimationFrame(x), C.unobserve(m);
			};
		}
	}, []), React.createElement(Primitive.div, {
		ref: composeRefs(d, o),
		...c,
		"cmdk-list": "",
		role: "listbox",
		tabIndex: -1,
		"aria-activedescendant": p,
		"aria-label": u,
		id: b.listId
	}, B(r, (m) => React.createElement("div", {
		ref: composeRefs(f, b.listInnerRef),
		"cmdk-list-sizer": ""
	}, m)));
});
var xe = React.forwardRef((r, o) => {
	let { open: n, onOpenChange: u, overlayClassName: c, contentClassName: d, container: f, ...p } = r;
	return React.createElement(Dialog, {
		open: n,
		onOpenChange: u
	}, React.createElement(DialogPortal, { container: f }, React.createElement(DialogOverlay, {
		"cmdk-overlay": "",
		className: c
	}), React.createElement(DialogContent, {
		"aria-label": r.label,
		"cmdk-dialog": "",
		className: d
	}, React.createElement(me, {
		ref: o,
		...p
	}))));
});
var Ie = React.forwardRef((r, o) => P((u) => u.filtered.count === 0) ? React.createElement(Primitive.div, {
	ref: o,
	...r,
	"cmdk-empty": "",
	role: "presentation"
}) : null);
var Pe = React.forwardRef((r, o) => {
	let { progress: n, children: u, label: c = "Loading...", ...d } = r;
	return React.createElement(Primitive.div, {
		ref: o,
		...d,
		"cmdk-loading": "",
		role: "progressbar",
		"aria-valuenow": n,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": c
	}, B(r, (f) => React.createElement("div", { "aria-hidden": !0 }, f)));
});
var _e = Object.assign(me, {
	List: Ce,
	Item: he,
	Input: Se,
	Group: Ee,
	Separator: ye,
	Dialog: xe,
	Empty: Ie,
	Loading: Pe
});
function we(r, o) {
	let n = r.nextElementSibling;
	for (; n;) {
		if (n.matches(o)) return n;
		n = n.nextElementSibling;
	}
}
function De(r, o) {
	let n = r.previousElementSibling;
	for (; n;) {
		if (n.matches(o)) return n;
		n = n.previousElementSibling;
	}
}
function pe(r) {
	let o = React.useRef(r);
	return k(() => {
		o.current = r;
	}), o;
}
var k = typeof window == "undefined" ? React.useEffect : React.useLayoutEffect;
function L(r) {
	let o = React.useRef();
	return o.current === void 0 && (o.current = r()), o;
}
function P(r) {
	let o = ee(), n = () => r(o.snapshot());
	return React.useSyncExternalStore(o.subscribe, n, n);
}
function ve(r, o, n, u = []) {
	let c = React.useRef(), d = K();
	return k(() => {
		var b;
		let f = (() => {
			var m;
			for (let R of n) {
				if (typeof R == "string") return R.trim();
				if (typeof R == "object" && "current" in R) return R.current ? (m = R.current.textContent) == null ? void 0 : m.trim() : c.current;
			}
		})(), p = u.map((m) => m.trim());
		d.value(r, f, p), (b = o.current) == null || b.setAttribute(T, f), c.current = f;
	}), c;
}
var ke = () => {
	let [r, o] = React.useState(), n = L(() => /* @__PURE__ */ new Map());
	return k(() => {
		n.current.forEach((u) => u()), n.current = /* @__PURE__ */ new Map();
	}, [r]), (u, c) => {
		n.current.set(u, c), o({});
	};
};
function Me(r) {
	let o = r.type;
	return typeof o == "function" ? o(r.props) : "render" in o ? o.render(r.props) : r;
}
function B({ asChild: r, children: o }, n) {
	return r && React.isValidElement(o) ? React.cloneElement(Me(o), { ref: o.ref }, n(o.props.children)) : n(o);
}
var Te = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0"
};

//#endregion
//#region src/components/ui/command.tsx
function Command({ className, ...props }) {
	return /* @__PURE__ */ jsx(_e, {
		"data-slot": "command",
		className: cn("flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground", className),
		...props
	});
}
function CommandInput({ className, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "command-input-wrapper",
		className: "flex items-center gap-2 px-4 py-3",
		children: [/* @__PURE__ */ jsx(Search$1, { className: "size-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ jsx(_e.Input, {
			"data-slot": "command-input",
			className: cn("w-full border-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
			...props
		})]
	});
}
function CommandList({ className, ...props }) {
	return /* @__PURE__ */ jsx(_e.List, {
		"data-slot": "command-list",
		className: cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className),
		...props
	});
}
function CommandEmpty({ className, ...props }) {
	return /* @__PURE__ */ jsx(_e.Empty, {
		"data-slot": "command-empty",
		className: cn("py-6 text-center text-sm", className),
		...props
	});
}
function CommandGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx(_e.Group, {
		"data-slot": "command-group",
		className: cn("overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground", className),
		...props
	});
}
function CommandItem({ className, children, ...props }) {
	return /* @__PURE__ */ jsxs(_e.Item, {
		"data-slot": "command-item",
		className: cn("group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-muted data-[selected=true]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[selected=true]:*:[svg]:text-foreground", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(Check, { className: "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" })]
	});
}

//#endregion
//#region src/components/Search.tsx
/** Enough results to make the list scroll; the dialog caps its own height. */
const RESULT_LIMIT = 30;
/**
* Renders a snippet, turning provider-supplied `<mark>` tags into highlight
* elements. Snippets are parsed — never injected as HTML — so any other
* markup in the text renders literally.
*/
function renderSnippet(snippet) {
	const parts = snippet.split(/<mark>(.*?)<\/mark>/g);
	if (parts.length === 1) return snippet;
	return parts.map((part, index) => index % 2 ? /* @__PURE__ */ jsx("mark", {
		className: "rounded-xs bg-primary/15 px-px text-primary",
		children: part
	}, index) : part);
}
function renderWithQueryHighlight(text, query) {
	const terms = query.trim().split(/\s+/).filter(Boolean);
	if (!terms.length) return text;
	return renderSnippet(highlightTerms(text, terms));
}
/**
* Provider-neutral search dialog. The selected provider and its index or
* client are loaded on demand, so search stays out of the initial bundle.
*/
function Search({ config, labels, className }) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [status, setStatus] = useState("idle");
	const provider = useRef(null);
	const requestId = useRef(0);
	const loadProvider = useCallback(() => {
		if (!provider.current) provider.current = resolveSearchProvider(config.provider, config.options).then((resolved) => {
			if (resolved.fellBack) console.warn(`[shiso] Unknown search provider "${config.provider}" — using the built-in local provider.`);
			return resolved.provider;
		}).catch((error) => {
			provider.current = null;
			throw error;
		});
		return provider.current;
	}, [config.options, config.provider]);
	const runQuery = useCallback(async (value) => {
		const currentRequest = ++requestId.current;
		setQuery(value);
		if (!value.trim()) {
			setResults([]);
			setStatus("idle");
			return;
		}
		setResults([]);
		setStatus("loading");
		try {
			const activeProvider = await loadProvider();
			const scope = getScopeByPathname(pathname);
			const nextResults = await activeProvider.search(value, RESULT_LIMIT, {
				scopeId: scope.id,
				language: scope.language,
				version: scope.version
			});
			if (currentRequest === requestId.current) {
				setResults(nextResults);
				setStatus("ready");
			}
		} catch (error) {
			if (currentRequest === requestId.current) {
				console.error("[shiso] Search provider failed:", error);
				setResults([]);
				setStatus("error");
			}
		}
	}, [loadProvider, pathname]);
	const openDialog = useCallback(() => {
		if (!config.enabled) return;
		setOpen(true);
		loadProvider().catch((error) => {
			console.error("[shiso] Search provider failed to load:", error);
		});
	}, [config.enabled, loadProvider]);
	const closeDialog = useCallback(() => {
		requestId.current += 1;
		setOpen(false);
		setQuery("");
		setResults([]);
		setStatus("idle");
	}, []);
	useEffect(() => {
		const onKeyDown = (event) => {
			if (config.enabled && config.shortcut && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === config.shortcut) {
				event.preventDefault();
				openDialog();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [
		config.enabled,
		config.shortcut,
		openDialog
	]);
	const select = (result) => {
		closeDialog();
		navigate(result.url);
	};
	if (!config.enabled) return null;
	const hasQuery = !!query.trim();
	return /* @__PURE__ */ jsxs(Dialog$1, {
		open,
		onOpenChange: (nextOpen) => nextOpen ? openDialog() : closeDialog(),
		children: [/* @__PURE__ */ jsxs(DialogTrigger, {
			render: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				className: cn("h-auto gap-2 rounded-md bg-card px-2.5 py-1.5 text-muted-foreground hover:border-input hover:bg-card hover:text-foreground", className)
			}),
			children: [
				/* @__PURE__ */ jsx(Search$1, { className: "size-3.5" }),
				/* @__PURE__ */ jsx("span", {
					className: "min-w-24 grow text-left",
					children: config.prompt
				}),
				config.shortcut ? /* @__PURE__ */ jsx("kbd", {
					className: "rounded-sm border border-border bg-muted px-[0.3rem] py-[0.05rem] text-[0.7rem] font-sans",
					children: config.shortcutLabel
				}) : null
			]
		}), /* @__PURE__ */ jsxs(DialogContent$1, {
			showCloseButton: false,
			overlayClassName: "bg-black/40 supports-backdrop-filter:backdrop-blur-none",
			className: "top-[10vh] max-w-[calc(100%-2rem)] -translate-y-0 gap-0 overflow-hidden rounded-lg border border-border bg-background p-0 ring-0 shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:max-w-[34rem]",
			children: [/* @__PURE__ */ jsx(DialogTitle, {
				className: "sr-only",
				children: labels.searchTitle
			}), /* @__PURE__ */ jsxs(Command, {
				shouldFilter: false,
				className: "rounded-none bg-background p-0",
				children: [/* @__PURE__ */ jsx(CommandInput, {
					autoFocus: true,
					className: "text-base md:text-base",
					placeholder: config.prompt,
					value: query,
					onValueChange: runQuery,
					onKeyDownCapture: (event) => {
						if (event.key === "Home" || event.key === "End") event.stopPropagation();
					}
				}), /* @__PURE__ */ jsxs(CommandList, {
					className: "max-h-[50vh] border-border border-t",
					children: [hasQuery ? /* @__PURE__ */ jsx(CommandEmpty, { children: status === "loading" ? labels.searching : status === "error" ? labels.searchUnavailable : labels.noResults }) : null, hasQuery && results.length ? /* @__PURE__ */ jsx(CommandGroup, {
						className: "p-2",
						children: results.map((result) => /* @__PURE__ */ jsxs(CommandItem, {
							value: result.url,
							className: "block whitespace-normal rounded-md px-3 py-2 text-left [&>svg:last-child]:hidden",
							onSelect: () => select(result),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "text-[0.9rem] font-semibold text-foreground",
								children: [renderWithQueryHighlight(result.page, query), result.heading ? /* @__PURE__ */ jsxs(Fragment, { children: [" › ", renderWithQueryHighlight(result.heading, query)] }) : null]
							}), result.snippet && /* @__PURE__ */ jsx("div", {
								className: "mt-[0.15rem] line-clamp-2 text-[0.8rem] text-muted-foreground",
								children: renderSnippet(result.snippet)
							})]
						}, result.url))
					}) : null]
				})]
			})]
		})]
	});
}
/**
* Renders the search control only when `search.position` targets this slot.
* Layout components drop one of these into each position they support; the
* per-page `search: false` frontmatter flag is honored here as well.
*/
function SearchSlot({ site, position, className }) {
	const { pathname } = useLocation();
	if (!site.search.enabled || site.search.position !== position) return null;
	if (getPageFrontmatter(pathname)?.search === false) return null;
	return /* @__PURE__ */ jsx(Search, {
		config: site.search,
		labels: site.labels,
		className
	});
}

//#endregion
//#region src/components/ThemeToggle.tsx
/**
* Both icons are always rendered and toggled via CSS on [data-theme], so the
* server render matches the client regardless of the user's stored theme.
*/
function ThemeToggle({ label }) {
	const handleClick = () => {
		const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
		document.documentElement.setAttribute("data-theme", next);
		try {
			localStorage.setItem("shiso-theme", next);
		} catch {}
	};
	return /* @__PURE__ */ jsxs(Button, {
		type: "button",
		variant: "ghost",
		size: "icon",
		className: "inline-flex size-8 items-center justify-center rounded-md text-foreground hover:bg-accent",
		onClick: handleClick,
		"aria-label": label,
		children: [/* @__PURE__ */ jsx(Sun, { className: "size-3.5 dark:hidden" }), /* @__PURE__ */ jsx(Moon, { className: "hidden size-3.5 dark:block" })]
	});
}

//#endregion
//#region src/components/TopNav.tsx
function collectMenuLinks(nodes) {
	const links = [];
	for (const node of nodes) if (node.kind === "page") {
		if (!node.page.hidden) links.push({
			label: node.page.label,
			href: node.page.url,
			target: "_self",
			routed: true
		});
	} else if (node.kind === "link") {
		if (!node.hidden) links.push({
			label: node.label,
			href: node.href,
			target: node.target,
			routed: false
		});
	} else if (!node.hidden) {
		if (node.root && !node.root.page.hidden) links.push({
			label: node.root.page.label,
			href: node.root.page.url,
			target: "_self",
			routed: true
		});
		links.push(...collectMenuLinks(node.children));
	}
	return links;
}
function TopNav({ docs, label }) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const tabs = docs.tabs.filter((tab) => !tab.hidden);
	if (!tabs.length) return null;
	const page = docs.pages.find((item) => item.url === pathname);
	const matchedTabId = [...tabs].sort((a, b) => b.url.length - a.url.length).find((tab) => pathname === tab.url || pathname.startsWith(`${tab.url}/`))?.id;
	const fallbackTabId = getStandalonePage(pathname) ? void 0 : tabs[0]?.id;
	const selected = page?.tabId || matchedTabId || fallbackTabId;
	const tabClass = (tab) => cn("flex h-full items-center gap-1 whitespace-nowrap border-transparent border-b-2 font-medium", {
		"border-b-primary text-foreground": tab.id === selected,
		"text-muted-foreground hover:text-foreground": tab.id !== selected
	});
	return /* @__PURE__ */ jsx("nav", {
		className: "hidden h-[calc(100%+1px)] max-w-screen self-start items-center gap-7 overflow-x-auto text-sm [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden",
		"aria-label": label,
		children: tabs.map((tab) => {
			if (tab.presentation === "dropdown") {
				const menuLinks = collectMenuLinks(docs.navigation[tab.id] || []);
				return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsxs(DropdownMenuTrigger, {
					render: /* @__PURE__ */ jsx("button", {
						type: "button",
						className: tabClass(tab)
					}),
					children: [
						/* @__PURE__ */ jsx(ConfiguredIcon, { icon: tab.icon }),
						tab.label,
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 rotate-90" })
					]
				}), /* @__PURE__ */ jsx(DropdownMenuContent, {
					align: "start",
					className: "min-w-48",
					children: menuLinks.map((item) => /* @__PURE__ */ jsx(DropdownMenuItem, {
						onClick: () => {
							if (item.routed) navigate(item.href);
							else window.open(item.href, item.target, item.target === "_blank" ? "noreferrer" : void 0);
						},
						children: item.label
					}, item.href))
				})] }, tab.id);
			}
			if (tab.link && isExternalHref(tab.url)) return /* @__PURE__ */ jsxs("a", {
				href: tab.url,
				className: tabClass(tab),
				target: "_blank",
				rel: "noreferrer",
				children: [/* @__PURE__ */ jsx(ConfiguredIcon, { icon: tab.icon }), tab.label]
			}, tab.id);
			return /* @__PURE__ */ jsxs(Link, {
				to: tab.url,
				className: tabClass(tab),
				"aria-current": tab.id === selected ? "page" : void 0,
				children: [/* @__PURE__ */ jsx(ConfiguredIcon, { icon: tab.icon }), tab.label]
			}, tab.id);
		})
	});
}

//#endregion
//#region src/components/VersionSwitcher.tsx
/**
* Version selector for multi-version sites. Options come from the visible
* version scopes of the active language; selecting one navigates to that
* scope's first visible page. Hidden versions never appear as options, but a
* hidden version still shows as the current value while it is being viewed.
*/
function VersionSwitcher() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const current = getScopeByPathname(pathname);
	const options = docsSite.scopes.filter((scope) => scope.version && !scope.hidden && scope.language === current.language);
	if (!current.version || options.length < 2 && !current.hidden) return null;
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsxs(DropdownMenuTrigger, {
		render: /* @__PURE__ */ jsx(Button, {
			variant: "outline",
			className: "h-auto gap-1.5 rounded-md bg-card px-2.5 py-1.5 text-sm font-medium text-foreground"
		}),
		children: [current.version, /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 rotate-90 text-muted-foreground" })]
	}), /* @__PURE__ */ jsx(DropdownMenuContent, {
		align: "start",
		className: "min-w-32",
		children: options.map((scope) => /* @__PURE__ */ jsxs(DropdownMenuItem, {
			onClick: () => {
				if (scope.id !== current.id) navigate(scope.firstPageUrl);
			},
			children: [/* @__PURE__ */ jsx("span", {
				className: "grow",
				children: scope.version
			}), scope.id === current.id ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : null]
		}, scope.id))
	})] });
}

//#endregion
//#region src/components/Header.tsx
/**
* Header hrefs come from config, so they may point inside the site or off it.
* In-app routes go through react-router; anything external (or explicitly
* opened in a new tab) stays a plain anchor and triggers a document load.
*/
function isRoutedHref(href, target) {
	return href.startsWith("/") && !isExternalHref(href) && target !== "_blank";
}
function NavbarLinkItem({ link, primary = false }) {
	const iconOnly = !link.label;
	const accessibleLabel = link.ariaLabel || link.icon || link.href;
	const className = primary ? `ml-1 inline-flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 ${iconOnly ? "size-8" : "gap-1.5 px-3.5 py-1.5"}` : `inline-flex items-center rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-foreground ${iconOnly ? "size-8 justify-center" : "gap-1.5 px-2.5 py-1.5"}`;
	const content = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ConfiguredIcon, { icon: link.icon }), link.label] });
	if (isRoutedHref(link.href, link.target)) return /* @__PURE__ */ jsx(Link, {
		to: link.href,
		className,
		"aria-label": iconOnly ? accessibleLabel : void 0,
		children: content
	});
	return /* @__PURE__ */ jsx("a", {
		href: link.href,
		className,
		target: link.target,
		rel: link.target === "_blank" ? "noreferrer" : void 0,
		"aria-label": iconOnly ? accessibleLabel : void 0,
		children: content
	});
}
function Header({ site }) {
	const { logo, navbar, name, appearance, labels } = site;
	const { pathname } = useLocation();
	const docs = getScopeByPathname(pathname).docs;
	const brandHref = logo?.href || (hasRootStandalonePage ? "/" : docsHomeUrl);
	const hasBrand = !!name || !!logo?.light || !!logo?.dark;
	const brandClassName = "inline-flex items-center gap-2 text-xl font-bold text-foreground tracking-[-0.03em]";
	const brandContent = /* @__PURE__ */ jsxs(Fragment, { children: [logo?.invert && logo.light ? /* @__PURE__ */ jsx("img", {
		src: logo.light,
		alt: "",
		className: "h-6 w-auto dark:brightness-0 dark:invert"
	}) : /* @__PURE__ */ jsxs(Fragment, { children: [logo?.light ? /* @__PURE__ */ jsx("img", {
		src: logo.light,
		alt: "",
		className: "h-6 w-auto dark:hidden"
	}) : null, logo?.dark ? /* @__PURE__ */ jsx("img", {
		src: logo.dark,
		alt: "",
		className: "hidden h-6 w-auto dark:block"
	}) : null] }), name ? /* @__PURE__ */ jsx("span", { children: name }) : null] });
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-50 h-[var(--header-height)] shrink-0 border-border border-b bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur-md",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid h-full max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 items-center gap-5 justify-self-start",
					children: [hasBrand ? isRoutedHref(brandHref, logo?.target) ? /* @__PURE__ */ jsx(Link, {
						to: brandHref,
						className: brandClassName,
						children: brandContent
					}) : /* @__PURE__ */ jsx("a", {
						href: brandHref,
						target: logo?.target,
						rel: logo?.target === "_blank" ? "noreferrer" : void 0,
						className: brandClassName,
						children: brandContent
					}) : null, /* @__PURE__ */ jsxs("div", {
						className: "hidden items-center gap-2 lg:flex",
						children: [/* @__PURE__ */ jsx(VersionSwitcher, {}), /* @__PURE__ */ jsx(LanguageSwitcher, {})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "h-full min-w-0 justify-self-center",
					children: docs.showTabs ? /* @__PURE__ */ jsx(TopNav, {
						docs,
						label: labels.sections
					}) : null
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 items-center gap-2 justify-self-end",
					children: [
						/* @__PURE__ */ jsx(SearchSlot, {
							site,
							position: "header"
						}),
						/* @__PURE__ */ jsx(SearchSlot, {
							site,
							position: "sidebar",
							className: "lg:hidden"
						}),
						navbar?.links.map((link) => /* @__PURE__ */ jsx(NavbarLinkItem, { link }, link.href)),
						!appearance.strict && /* @__PURE__ */ jsx(ThemeToggle, { label: labels.toggleTheme }),
						navbar?.primary ? /* @__PURE__ */ jsx(NavbarLinkItem, {
							link: navbar.primary,
							primary: true
						}) : null
					]
				})
			]
		})
	});
}

//#endregion
//#region src/lib/head.ts
/** Marks tags this module owns, so client navigation can replace exactly its own. */
const HEAD_MARKER = "data-shiso-head";
function escapeHtml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/** JSON-LD is script content, not attribute content: only `<` and `&` need care. */
function escapeJsonLd(value) {
	return value.replace(/</g, "\\u003c");
}
function buildHead(pathname) {
	const page = getPageByPathname(pathname);
	const standalone = page ? null : getStandalonePage(pathname);
	const filePath = page?.filePath || standalone?.filePath;
	const frontmatter = (filePath ? getDocModule(filePath) : void 0)?.frontmatter;
	const seo = getSeo();
	const pageTitle = frontmatter?.title || standalone?.title || page?.label;
	const title = getPageTitle(pageTitle);
	const description = frontmatter?.description || siteConfig.description;
	const canonical = page ? toAbsoluteUrl(page.url) : standalone ? toAbsoluteUrl(standalone.path) : void 0;
	const hidden = !!page && (!!page.hidden || !!getScopeByPathname(pathname).hidden);
	const noindex = !page && !standalone || frontmatter?.noindex === true || hidden && seo.indexing !== "all";
	const tags = [{
		tag: "title",
		children: title
	}];
	if (description) tags.push({
		tag: "meta",
		attrs: {
			name: "description",
			content: description
		}
	});
	if (canonical) tags.push({
		tag: "link",
		attrs: {
			rel: "canonical",
			href: canonical
		}
	});
	if (noindex) tags.push({
		tag: "meta",
		attrs: {
			name: "robots",
			content: "noindex"
		}
	});
	tags.push({
		tag: "meta",
		attrs: {
			property: "og:type",
			content: standalone ? "website" : "article"
		}
	}, {
		tag: "meta",
		attrs: {
			property: "og:title",
			content: title
		}
	});
	if (siteName) tags.push({
		tag: "meta",
		attrs: {
			property: "og:site_name",
			content: siteName
		}
	});
	if (description) tags.push({
		tag: "meta",
		attrs: {
			property: "og:description",
			content: description
		}
	});
	if (canonical) tags.push({
		tag: "meta",
		attrs: {
			property: "og:url",
			content: canonical
		}
	});
	tags.push({
		tag: "meta",
		attrs: {
			name: "twitter:card",
			content: "summary_large_image"
		}
	}, {
		tag: "meta",
		attrs: {
			name: "twitter:title",
			content: title
		}
	});
	if (description) tags.push({
		tag: "meta",
		attrs: {
			name: "twitter:description",
			content: description
		}
	});
	const lastModified = filePath && showTimestamp(frontmatter?.timestamp) ? getLastModified(filePath) : void 0;
	if (lastModified) tags.push({
		tag: "meta",
		attrs: {
			property: "article:modified_time",
			content: lastModified
		}
	});
	for (const [key, content] of Object.entries(seo.metatags || {})) {
		if (key === "title" || typeof content !== "string") continue;
		const attribute = /^(og|article|fb|profile|book|music|video):/.test(key) ? "property" : "name";
		tags.push({
			tag: "meta",
			attrs: {
				[attribute]: key,
				content
			}
		});
	}
	if (page && canonical && SITE_URL) {
		const breadcrumbs = [
			siteName ? {
				name: siteName,
				url: toAbsoluteUrl("/")
			} : null,
			page.tabLabel && page.section !== page.tabLabel ? { name: page.tabLabel } : null,
			page.section ? { name: page.section } : null,
			{
				name: page.label,
				url: canonical
			}
		].filter((item) => !!item);
		tags.push({
			tag: "script",
			attrs: { type: "application/ld+json" },
			children: JSON.stringify([{
				"@context": "https://schema.org",
				"@type": "TechArticle",
				headline: pageTitle || page.label,
				description,
				url: canonical,
				inLanguage: resolveLocale(page.language, siteModel.locale),
				...siteName ? { isPartOf: {
					"@type": "WebSite",
					name: siteName,
					url: SITE_URL
				} } : {}
			}, {
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: breadcrumbs.map((item, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: item.name,
					...item.url ? { item: item.url } : {}
				}))
			}])
		});
	}
	return tags;
}
function renderHeadToString(tags) {
	return tags.map(({ tag, attrs, children }) => {
		const attributes = Object.entries(attrs || {}).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join("");
		if (tag === "meta" || tag === "link") return `<${tag}${attributes} ${HEAD_MARKER} />`;
		const content = tag === "script" ? escapeJsonLd(children || "") : escapeHtml(children || "");
		return `<${tag}${attributes} ${HEAD_MARKER}>${content}</${tag}>`;
	}).join("\n    ");
}
function applyHead(tags) {
	const { head } = document;
	head.querySelectorAll(`[${HEAD_MARKER}]`).forEach((node) => {
		node.remove();
	});
	for (const { tag, attrs, children } of tags) {
		const element = document.createElement(tag);
		for (const [key, value] of Object.entries(attrs || {})) element.setAttribute(key, value);
		if (children !== void 0) element.textContent = children;
		element.setAttribute(HEAD_MARKER, "");
		head.append(element);
	}
}
/**
* Applies the head for the current route on client navigation.
*
* The first render after hydration is skipped: the prerendered head is already
* correct, and rewriting it would tear down and recreate every tag on load.
*/
function useHead(pathname) {
	const hydratedPath = useRef(null);
	useEffect(() => {
		if (hydratedPath.current === null) {
			hydratedPath.current = pathname;
			return;
		}
		applyHead(buildHead(pathname));
		const { lang, dir } = getLocaleByPathname(pathname);
		document.documentElement.lang = lang;
		document.documentElement.dir = dir;
	}, [pathname]);
}

//#endregion
//#region src/components/Layout.tsx
function Layout({ children, site }) {
	const { pathname } = useLocation();
	useHead(pathname);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ jsx(Banner, {
				banner: site.banner,
				dismissLabel: site.labels.dismissBanner
			}),
			/* @__PURE__ */ jsx(Header, { site }),
			/* @__PURE__ */ jsx("div", {
				className: "mx-auto flex min-h-0 w-full max-w-[1600px] grow flex-col px-5",
				children: /* @__PURE__ */ jsx("main", {
					className: "flex min-h-0 grow flex-col",
					children
				})
			})
		]
	});
}

//#endregion
//#region src/components/ContextualMenu.tsx
function ContextualMenu({ options, labels }) {
	const [copied, setCopied] = useState(false);
	const primary = options[0];
	if (!primary) return null;
	const runOption = async (option) => {
		if (option.action === "copy") {
			try {
				const response = await fetch(option.href);
				const text = response.ok ? await response.text() : window.location.href;
				await navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			} catch {}
			return;
		}
		window.open(option.href, option.target, option.target === "_blank" ? "noreferrer" : void 0);
	};
	const optionIcon = (option, showCopied = false) => showCopied && copied ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ConfiguredIcon, { icon: option.icon });
	return /* @__PURE__ */ jsxs("div", {
		className: "inline-flex shrink-0 items-stretch",
		children: [/* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			size: "sm",
			className: "rounded-r-none bg-card text-foreground only:rounded-md",
			onClick: () => runOption(primary),
			children: [optionIcon(primary, primary.action === "copy"), primary.action === "copy" && copied ? labels.copied : primary.title]
		}), options.length > 1 && /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			render: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "icon-sm",
				className: "rounded-l-none border-l-0 bg-card",
				"aria-label": labels.moreOptions
			}),
			children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 rotate-90" })
		}), /* @__PURE__ */ jsx(DropdownMenuContent, {
			align: "end",
			className: "w-60",
			children: options.map((option) => /* @__PURE__ */ jsxs(DropdownMenuItem, {
				className: "flex-row items-start gap-2 px-2.5 py-1.5",
				onClick: () => runOption(option),
				children: [/* @__PURE__ */ jsx("span", {
					className: "mt-0.5",
					children: optionIcon(option)
				}), /* @__PURE__ */ jsxs("span", {
					className: "flex flex-col gap-0.5",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[0.85rem] font-medium text-foreground",
						children: option.title
					}), option.description ? /* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: option.description
					}) : null]
				})]
			}, option.key))
		})] })]
	});
}

//#endregion
//#region src/components/DocContent.tsx
/**
* Related-topics entries from frontmatter. Bare paths resolve their title from
* the docs registry; unknown internal paths without an explicit title are
* skipped so dead links never render.
*/
function resolveRelated(entries) {
	if (!Array.isArray(entries)) return [];
	const links = [];
	for (const entry of entries) {
		const href = typeof entry === "string" ? entry : entry?.href;
		if (!href || typeof href !== "string") continue;
		const external = !href.startsWith("/");
		const title = (typeof entry === "object" ? entry.title : void 0) || (external ? href : getPageByPathname(href)?.label);
		if (!title) {
			if (import.meta.env.DEV) console.warn(`[shiso] Related topic "${href}" does not match a page and has no title — skipped.`);
			continue;
		}
		links.push({
			href,
			title,
			external
		});
	}
	return links;
}
function DocContent({ page, doc, site }) {
	const scope = getScopeForPage(docsSite, page);
	const pagerPages = scope.docs.pages.filter((item) => !item.hidden);
	const pageIndex = pagerPages.findIndex((item) => item.slug === page.slug);
	const prev = pageIndex > 0 ? pagerPages[pageIndex - 1] : void 0;
	const next = pageIndex >= 0 ? pagerPages[pageIndex + 1] : void 0;
	const title = doc.frontmatter?.title || page.label;
	const description = doc.frontmatter?.description;
	const Content = doc.default;
	const lastModified = (typeof doc.frontmatter?.timestamp === "boolean" ? doc.frontmatter.timestamp : site.showTimestamp) ? getLastModified(page.filePath) : void 0;
	const eyebrow = site.styling.eyebrows === "breadcrumbs" ? [.../* @__PURE__ */ new Set([page.tabLabel, page.section])].filter(Boolean).join(" / ") : page.section;
	const contextualOptions = resolveContextualOptions(site.contextualOptions, page, site.labels);
	const related = resolveRelated(doc.frontmatter?.related);
	const dateFormat = new Intl.DateTimeFormat(resolveLocale(page.language, site.locale), {
		dateStyle: "medium",
		timeZone: "UTC"
	});
	const pagefindAttrs = page.hidden || scope.hidden ? {} : {
		"data-pagefind-body": "",
		...page.scopeId !== "default" ? {
			"data-pagefind-filter": "scope[data-scope]",
			"data-scope": page.scopeId
		} : {}
	};
	return /* @__PURE__ */ jsxs("article", {
		className: "min-w-0 grow",
		...pagefindAttrs,
		children: [
			eyebrow && /* @__PURE__ */ jsx("div", {
				className: "text-sm font-medium text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-4",
				children: [title && /* @__PURE__ */ jsx("h1", {
					className: "mt-2 text-4xl text-foreground leading-[1.2] tracking-[-0.03em] [font-family:var(--font-heading)] [font-weight:var(--font-heading-weight,700)]",
					children: title
				}), /* @__PURE__ */ jsx(ContextualMenu, {
					options: contextualOptions,
					labels: site.labels
				})]
			}),
			description && /* @__PURE__ */ jsx("p", {
				className: "mt-3 mb-8 text-lg text-muted-foreground leading-relaxed",
				children: description
			}),
			/* @__PURE__ */ jsx("div", {
				className: "docs-markdown",
				children: /* @__PURE__ */ jsx(Content, {})
			}),
			lastModified && /* @__PURE__ */ jsxs("div", {
				className: "mt-8 text-sm text-muted-foreground",
				children: [
					site.labels.lastUpdated,
					" ",
					/* @__PURE__ */ jsx("time", {
						dateTime: lastModified,
						children: dateFormat.format(new Date(lastModified))
					})
				]
			}),
			related.length > 0 && /* @__PURE__ */ jsxs("nav", {
				className: "mt-8",
				"aria-label": site.labels.relatedTopics,
				"data-pagefind-ignore": true,
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-sm text-muted-foreground",
					children: site.labels.relatedTopics
				}), /* @__PURE__ */ jsx("ul", {
					className: "mt-3 flex flex-col gap-2 text-sm",
					children: related.map(({ href, title, external }) => /* @__PURE__ */ jsxs("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(FileText, {
							size: 14,
							className: "shrink-0 text-muted-foreground"
						}), external ? /* @__PURE__ */ jsx("a", {
							href,
							target: "_blank",
							rel: "noreferrer",
							className: "text-foreground hover:text-primary",
							children: title
						}) : /* @__PURE__ */ jsx(Link, {
							to: href,
							className: "text-foreground hover:text-primary",
							children: title
						})]
					}, href))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 flex items-end justify-between",
				"data-pagefind-ignore": true,
				children: [/* @__PURE__ */ jsx(NavigationButton, {
					...prev,
					eyebrow: site.labels.previousPage,
					isPrev: true
				}), /* @__PURE__ */ jsx(NavigationButton, {
					...next,
					eyebrow: site.labels.nextPage
				})]
			})
		]
	});
}
const NavigationButton = ({ label, url, eyebrow, isPrev }) => {
	if (!url || !label) return /* @__PURE__ */ jsx("div", { className: "flex-1" });
	return /* @__PURE__ */ jsxs(Link, {
		to: url,
		className: cn("group flex flex-1 items-end gap-3 py-3 text-base text-foreground", { "justify-end text-right": !isPrev }),
		rel: isPrev ? "prev" : "next",
		children: [
			isPrev && /* @__PURE__ */ jsx(ArrowLeft, {
				size: 14,
				className: "mb-[0.3rem] text-muted-foreground transition-colors group-hover:text-foreground"
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "flex flex-col",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-bold text-muted-foreground",
					children: eyebrow
				}), /* @__PURE__ */ jsx("span", {
					className: "font-medium transition-colors group-hover:text-primary",
					children: label
				})]
			}),
			!isPrev && /* @__PURE__ */ jsx(ArrowRight, {
				size: 14,
				className: "mb-[0.3rem] text-muted-foreground transition-colors group-hover:text-foreground"
			})
		]
	});
};

//#endregion
//#region src/components/Footer.tsx
function Footer({ footer, className = "" }) {
	if (!footer) return null;
	const { socials, links: columns, attribution } = footer;
	return /* @__PURE__ */ jsxs("footer", {
		className: `mt-8 border-border border-t py-8 text-muted-foreground ${className}`,
		children: [columns.length > 0 && /* @__PURE__ */ jsx("div", {
			className: "mb-8 grid grid-cols-[repeat(auto-fit,minmax(10rem,max-content))] gap-x-16 gap-y-8",
			children: columns.map((column, index) => /* @__PURE__ */ jsxs("div", { children: [column.header && /* @__PURE__ */ jsx("div", {
				className: "mb-3 text-sm font-semibold text-foreground",
				children: column.header
			}), /* @__PURE__ */ jsx("ul", {
				className: "m-0 flex list-none flex-col gap-2 p-0",
				children: column.items.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
					href: item.href,
					target: item.target,
					rel: item.target === "_blank" ? "noreferrer" : void 0,
					className: "text-sm text-muted-foreground hover:text-foreground",
					children: item.label
				}) }, item.href))
			})] }, column.header || index))
		}), attribution || socials.length > 0 ? /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-4",
			children: [attribution ? /* @__PURE__ */ jsxs("a", {
				href: "https://shiso.umami.is?ref=docs-footer",
				className: "text-sm hover:text-foreground",
				children: ["Powered by ", /* @__PURE__ */ jsx("span", {
					className: "font-bold",
					children: "shiso"
				})]
			}) : /* @__PURE__ */ jsx("span", {}), socials.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-1",
				children: socials.map((link) => {
					const iconOnly = !link.label;
					return /* @__PURE__ */ jsxs("a", {
						href: link.href,
						target: link.target,
						rel: link.target === "_blank" ? "noreferrer" : void 0,
						className: `inline-flex min-h-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground ${iconOnly ? "size-8" : "gap-1.5 px-2"}`,
						"aria-label": iconOnly ? link.ariaLabel || link.icon || link.href : void 0,
						children: [/* @__PURE__ */ jsx(ConfiguredIcon, { icon: link.icon }), link.label]
					}, link.href);
				})
			})]
		}) : null]
	});
}

//#endregion
//#region src/components/PageLinks.tsx
function PageLinks({ items = [], title, navigationLabel }) {
	const [hash, setHash] = useState(items?.[0]?.id);
	useEffect(() => {
		setHash(items?.[0]?.id);
		const callback = () => {
			const found = [...items].reverse().find(({ id }) => {
				const rect = document.getElementById(id)?.getBoundingClientRect();
				return rect && rect.top <= 0;
			});
			if (found) setHash(found.id);
		};
		window.addEventListener("scroll", callback, false);
		return () => {
			window.removeEventListener("scroll", callback, false);
		};
	}, [items]);
	if (!items?.length) return null;
	const indent = (size) => {
		if (size <= 2) return "0px";
		return `${(size - 2) * 10}px`;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-max min-w-60 flex-col gap-3 text-sm",
		children: [/* @__PURE__ */ jsx("div", {
			className: "font-bold text-foreground",
			children: title
		}), /* @__PURE__ */ jsx("nav", {
			className: "flex flex-col",
			"aria-label": navigationLabel,
			children: items.map(({ name, id, size }) => {
				const isActive = hash === id;
				return /* @__PURE__ */ jsx("a", {
					href: `#${id}`,
					className: cn("block border-l px-3 py-1.5", {
						"border-l-primary font-medium text-primary": isActive,
						"border-border text-muted-foreground hover:text-foreground": !isActive
					}),
					"aria-current": isActive ? "location" : void 0,
					children: /* @__PURE__ */ jsx("span", {
						style: {
							marginLeft: indent(size),
							display: "block"
						},
						children: name
					})
				}, id);
			})
		})]
	});
}

//#endregion
//#region src/components/SideNav.tsx
const sectionLabelClass = "flex min-w-0 items-center gap-[0.4rem] pb-2 pr-1 font-bold text-inherit";
const groupLabelClass = "flex min-w-0 items-center gap-[0.4rem] py-2 pl-3 pr-1 font-medium text-inherit";
const selectedClass = "border-l-sidebar-primary font-bold text-sidebar-primary hover:text-sidebar-primary";
/** True when the group's root or any descendant page is the current page. */
function containsPage(node, pathname) {
	if (node.root?.page.url === pathname) return true;
	return flattenNav(node.children).some((page) => page.url === pathname);
}
/**
* Group section. Groups with `collapsible: false` stay open; otherwise,
* top-level groups start expanded and nested groups start collapsed unless
* `expanded: true` or the current page is inside.
*
* Click behavior follows `interaction.drilldown`:
* - true: expanding also navigates to the group's root or first page
* - false: the header only expands/collapses
* - unset: headers with a root page navigate, others toggle
*/
function CollapsibleGroup({ node, pathname, depth, drilldown, expandLabel, collapseLabel }) {
	const navigate = useNavigate();
	const active = containsPage(node, pathname);
	const collapsible = node.collapsible !== false;
	const [expanded, setExpanded] = useState(!collapsible || depth === 0 || !!node.expanded || active);
	const isExpanded = !collapsible || expanded;
	useEffect(() => {
		if (!collapsible || active) setExpanded(true);
	}, [active, collapsible]);
	const firstPage = node.root?.page || flattenNav(node.children).find((page) => !page.hidden);
	const handleOpenChange = (next) => {
		setExpanded(next);
		if (next && drilldown === true && firstPage) navigate(firstPage.url);
	};
	const chevron = /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 shrink-0 origin-center text-muted-foreground transition-[color,transform] duration-150 group-hover/section:text-sidebar-accent-foreground group-aria-expanded/collapsible-trigger:rotate-90" });
	const isTopLevel = depth === 0;
	const rootSelected = node.root?.page.url === pathname;
	const headerClass = isTopLevel ? "flex min-w-0 items-center text-sidebar-foreground" : cn("flex items-center border-l border-l-sidebar-border text-muted-foreground hover:text-sidebar-accent-foreground", { "pl-6": depth > 1 });
	const fixedHeader = /* @__PURE__ */ jsx("div", {
		className: cn(headerClass, {
			[selectedClass]: rootSelected && !isTopLevel,
			"text-sidebar-primary": rootSelected && isTopLevel
		}),
		children: node.root ? /* @__PURE__ */ jsxs(Link, {
			to: node.root.page.url,
			className: cn(isTopLevel ? sectionLabelClass : groupLabelClass, "flex-1"),
			children: [resolveIcon(node.icon), node.label]
		}) : /* @__PURE__ */ jsxs("span", {
			className: cn(isTopLevel ? sectionLabelClass : groupLabelClass, "flex-1"),
			children: [resolveIcon(node.icon), node.label]
		})
	});
	const header = !collapsible ? fixedHeader : drilldown !== false && node.root ? /* @__PURE__ */ jsxs("div", {
		className: cn(headerClass, "group/section flex items-center", {
			[selectedClass]: rootSelected && !isTopLevel,
			"text-sidebar-primary": rootSelected && isTopLevel
		}),
		children: [/* @__PURE__ */ jsxs(Link, {
			to: node.root.page.url,
			className: isTopLevel ? sectionLabelClass : groupLabelClass,
			children: [resolveIcon(node.icon), node.label]
		}), /* @__PURE__ */ jsx(CollapsibleTrigger, {
			render: /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size: "icon-xs",
				className: "group/collapsible-trigger inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				"aria-label": `${isExpanded ? collapseLabel : expandLabel} ${node.label}`
			}),
			children: chevron
		})]
	}) : /* @__PURE__ */ jsxs(CollapsibleTrigger, {
		render: /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			className: cn(headerClass, "group/section group/collapsible-trigger flex h-auto w-full items-center justify-start gap-[0.4rem] whitespace-normal rounded-none px-0 py-0 text-left hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent", {
				"pb-2 font-bold text-sidebar-foreground": isTopLevel,
				"border-l border-l-sidebar-border px-3 py-2 font-medium text-muted-foreground hover:text-sidebar-accent-foreground": !isTopLevel
			})
		}),
		children: [
			resolveIcon(node.icon),
			node.label,
			chevron
		]
	});
	if (!collapsible) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col",
		children: [fixedHeader, /* @__PURE__ */ jsx("div", {
			className: "flex flex-col",
			children: /* @__PURE__ */ jsx(NavNodes, {
				nodes: node.children,
				pathname,
				depth: depth + 1,
				drilldown,
				expandLabel,
				collapseLabel
			})
		})]
	});
	return /* @__PURE__ */ jsxs(Collapsible, {
		open: expanded,
		onOpenChange: handleOpenChange,
		className: "flex flex-col",
		children: [header, /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx("div", {
			className: "flex flex-col",
			children: /* @__PURE__ */ jsx(NavNodes, {
				nodes: node.children,
				pathname,
				depth: depth + 1,
				drilldown,
				expandLabel,
				collapseLabel
			})
		}) })]
	});
}
function NavNodes({ nodes, pathname, depth, drilldown, expandLabel, collapseLabel }) {
	const rendered = [];
	nodes.forEach((node) => {
		if (isNodeHidden(node)) return;
		if (node.kind === "link") {
			rendered.push(/* @__PURE__ */ jsxs("a", {
				href: node.href,
				target: node.target,
				rel: node.target === "_blank" ? "noreferrer" : void 0,
				className: cn("flex min-w-0 items-center gap-[0.4rem] border-l border-l-sidebar-border px-3 py-[0.55rem] text-muted-foreground hover:text-sidebar-accent-foreground [overflow-wrap:anywhere]", { "pl-6": depth > 1 }),
				children: [
					resolveIcon(node.icon),
					node.label,
					/* @__PURE__ */ jsx(ExternalLink, {
						size: 12,
						className: "ml-auto opacity-60"
					})
				]
			}, `link-${node.href}`));
			return;
		}
		if (node.kind === "page") {
			const { url, label, icon, tag } = node.page;
			const isSelected = url === pathname;
			rendered.push(/* @__PURE__ */ jsxs(Link, {
				to: url,
				className: cn("flex min-w-0 items-center gap-[0.4rem] border-l border-l-sidebar-border px-3 py-[0.55rem] [overflow-wrap:anywhere]", {
					"pl-6": depth > 1,
					[selectedClass]: isSelected,
					"text-muted-foreground hover:text-sidebar-accent-foreground": !isSelected
				}),
				children: [
					resolveIcon(icon),
					label,
					tag ? /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "ml-auto h-auto rounded-sm px-[0.35rem] py-[0.05rem] text-[0.7rem] text-muted-foreground uppercase",
						children: tag
					}) : null
				]
			}, url));
			return;
		}
		rendered.push(/* @__PURE__ */ jsx(CollapsibleGroup, {
			node,
			pathname,
			depth,
			drilldown,
			expandLabel,
			collapseLabel
		}, `group-${node.label}`));
	});
	return /* @__PURE__ */ jsx(Fragment, { children: rendered });
}
function SideNav({ tabs, navigation, anchors, activeTabId, isSticky, drilldown, navigationLabel, expandLabel, collapseLabel }) {
	const { pathname } = useLocation();
	const nodes = navigation[activeTabId] || navigation[tabs[0]?.id] || [];
	return /* @__PURE__ */ jsx(ScrollArea, {
		className: cn("w-full max-w-full", { "min-h-0 grow": isSticky }),
		children: /* @__PURE__ */ jsxs("nav", {
			className: "flex w-full flex-col gap-6 pr-4 text-sm",
			"aria-label": navigationLabel,
			children: [anchors.length ? /* @__PURE__ */ jsx(NavNodes, {
				nodes: anchors,
				pathname,
				depth: 0,
				drilldown,
				expandLabel,
				collapseLabel
			}) : null, /* @__PURE__ */ jsx(NavNodes, {
				nodes,
				pathname,
				depth: 0,
				drilldown,
				expandLabel,
				collapseLabel
			})]
		})
	});
}

//#endregion
//#region src/components/ui/sheet.tsx
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(DialogRoot, {
		"data-slot": "sheet",
		...props
	});
}
function SheetTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(DialogTrigger$1, {
		"data-slot": "sheet-trigger",
		...props
	});
}
function SheetPortal({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPortal$1, {
		"data-slot": "sheet-portal",
		...props
	});
}
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogBackdrop, {
		"data-slot": "sheet-overlay",
		className: cn("fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(DialogPopup, {
		"data-slot": "sheet-content",
		"data-side": side,
		className: cn("fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsxs(DialogClose, {
			"data-slot": "sheet-close",
			render: /* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				className: "absolute top-3 right-3",
				size: "icon-sm"
			}),
			children: [/* @__PURE__ */ jsx(X$1, {}), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogTitle$1, {
		"data-slot": "sheet-title",
		className: cn("text-base font-medium text-foreground", className),
		...props
	});
}

//#endregion
//#region src/components/Docs.tsx
/**
* 404 view driven by the `errors.404` config key. The standard defaults to
* redirecting home; that happens after hydration rather than during render,
* because the prerendered 404.html must stay a static page for hosts that
* serve it for every unknown path.
*/
function NotFound({ site }) {
	const navigate = useNavigate();
	const { redirect, title, description } = site.error404;
	useEffect(() => {
		if (redirect) navigate(docsHomeUrl, { replace: true });
	}, [redirect, navigate]);
	return /* @__PURE__ */ jsxs("div", {
		className: "py-16 text-center",
		children: [/* @__PURE__ */ jsx("h1", { children: title || site.labels.notFound }), description && /* @__PURE__ */ jsx("p", { children: renderInlineMarkdown(description) })]
	});
}
function Docs({ page, doc, site }) {
	const { pathname } = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);
	const scopeDocs = getScopeByPathname(pathname).docs;
	const { tabs, navigation } = scopeDocs;
	useEffect(() => {
		setMenuOpen(false);
		if (!window.location.hash) window.scrollTo({
			top: 0,
			left: 0
		});
	}, [pathname]);
	if (!page || !doc) return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-full flex-col",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grow",
			children: /* @__PURE__ */ jsx(NotFound, { site })
		}), /* @__PURE__ */ jsx(Footer, { footer: site.footer })]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-full flex-col gap-6 lg:gap-0",
		children: [/* @__PURE__ */ jsxs(Sheet, {
			open: menuOpen,
			onOpenChange: setMenuOpen,
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex justify-end lg:hidden",
				children: /* @__PURE__ */ jsxs(SheetTrigger, {
					render: /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						className: "bg-card"
					}),
					children: [/* @__PURE__ */ jsx(Menu, { className: "size-3.5" }), site.labels.menu]
				})
			}), /* @__PURE__ */ jsxs(SheetContent, {
				side: "right",
				className: "w-[min(320px,85vw)] gap-0 overflow-y-auto bg-background p-4 sm:max-w-80",
				children: [/* @__PURE__ */ jsx(SheetTitle, {
					className: "sr-only",
					children: site.labels.documentationNavigation
				}), /* @__PURE__ */ jsxs("div", {
					className: "pt-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 pb-4 lg:hidden",
						children: [/* @__PURE__ */ jsx(VersionSwitcher, {}), /* @__PURE__ */ jsx(LanguageSwitcher, {})]
					}), /* @__PURE__ */ jsx(SideNav, {
						tabs,
						navigation,
						anchors: scopeDocs.anchors,
						activeTabId: page.tabId,
						drilldown: site.drilldown,
						navigationLabel: site.labels.documentationNavigation,
						expandLabel: site.labels.expand,
						collapseLabel: site.labels.collapse
					})]
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-12 lg:min-h-[calc(100dvh-var(--header-height))] lg:pt-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "hidden min-w-0 max-w-60 basis-60 flex-col gap-4 self-start lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:flex lg:h-[calc(100dvh-var(--header-height)-3rem)] lg:shrink-0",
				children: [/* @__PURE__ */ jsx(SearchSlot, {
					site,
					position: "sidebar",
					className: "w-full"
				}), /* @__PURE__ */ jsx(SideNav, {
					tabs,
					navigation,
					anchors: scopeDocs.anchors,
					activeTabId: page.tabId,
					isSticky: true,
					drilldown: site.drilldown,
					navigationLabel: site.labels.documentationNavigation,
					expandLabel: site.labels.expand,
					collapseLabel: site.labels.collapse
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 grow self-stretch flex-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex grow items-start gap-12",
					children: [/* @__PURE__ */ jsx(DocContent, {
						page,
						doc,
						site
					}), /* @__PURE__ */ jsx("div", {
						className: "hidden min-w-0 max-w-60 basis-60 self-start lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:block lg:shrink-0",
						children: /* @__PURE__ */ jsx(PageLinks, {
							items: doc.toc,
							title: site.labels.tableOfContents,
							navigationLabel: site.labels.tableOfContentsNavigation
						})
					})]
				}), /* @__PURE__ */ jsx(Footer, {
					footer: site.footer,
					className: "lg:mr-72"
				})]
			})]
		})]
	});
}

//#endregion
//#region src/pages/DocPage.tsx
function DocPage({ site }) {
	const { pathname } = useLocation();
	const page = getPageByPathname(pathname);
	const doc = page ? getDocModule(page.filePath) : void 0;
	const redirect = page && doc ? null : matchRedirect(pathname);
	const externalRedirect = redirect && isExternalHref(redirect) ? redirect : null;
	useHead(pathname);
	useEffect(() => {
		if (externalRedirect) window.location.replace(externalRedirect);
	}, [externalRedirect]);
	if (redirect) return externalRedirect ? null : /* @__PURE__ */ jsx(Navigate, {
		to: redirect,
		replace: true
	});
	return /* @__PURE__ */ jsx(Docs, {
		page,
		doc: doc || null,
		site
	});
}

//#endregion
//#region src/pages/StandalonePage.tsx
/**
* A standalone (non-docs) page: site chrome from Layout (banner, header),
* content at full container width — no sidebar, TOC, or pager — and the
* footer. Markdown/MDX gets docs typography; TSX owns its presentation.
*/
function StandalonePageView({ page, site }) {
	const { pathname } = useLocation();
	const doc = getDocModule(page.filePath);
	useEffect(() => {
		if (!window.location.hash) window.scrollTo({
			top: 0,
			left: 0
		});
	}, [pathname]);
	if (!doc) return /* @__PURE__ */ jsx(Docs, {
		page: null,
		doc: null,
		site
	});
	const Content = doc.default;
	const isComponentPage = page.filePath.endsWith(".tsx");
	return /* @__PURE__ */ jsxs("div", {
		className: "flex grow flex-col",
		children: [isComponentPage ? /* @__PURE__ */ jsx("div", {
			className: "grow",
			children: /* @__PURE__ */ jsx(Content, {})
		}) : /* @__PURE__ */ jsx("article", {
			className: "grow py-8",
			children: /* @__PURE__ */ jsx("div", {
				className: "docs-markdown",
				children: /* @__PURE__ */ jsx(Content, {})
			})
		}), /* @__PURE__ */ jsx(Footer, { footer: site.footer })]
	});
}

//#endregion
//#region src/App.tsx
const mdxComponents = {
	...docs_exports,
	img: ZoomableImage,
	pre: CodeBlock
};
function App() {
	return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(MDXProvider, {
		components: mdxComponents,
		children: /* @__PURE__ */ jsx(Layout, {
			site: siteModel,
			children: /* @__PURE__ */ jsxs(Routes, { children: [
				standalonePages.map((page) => /* @__PURE__ */ jsx(Route, {
					path: page.path,
					element: /* @__PURE__ */ jsx(StandalonePageView, {
						page,
						site: siteModel
					})
				}, page.path)),
				docsHomeUrl !== "/" && !hasRootStandalonePage ? /* @__PURE__ */ jsx(Route, {
					path: "/",
					element: /* @__PURE__ */ jsx(Navigate, {
						to: docsHomeUrl,
						replace: true
					})
				}) : null,
				/* @__PURE__ */ jsx(Route, {
					path: "*",
					element: /* @__PURE__ */ jsx(DocPage, { site: siteModel })
				})
			] })
		})
	}) });
}

//#endregion
export { docsSite as a, getSeo as c, getDocModule as d, getLastModified as f, toAbsoluteUrl as h, docsHomeUrl as i, siteName as l, BASE_URL as m, buildHead as n, getLocaleByPathname as o, getScopeForPage as p, renderHeadToString as r, getRedirects as s, App as t, standalonePages as u };