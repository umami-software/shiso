import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useLabels } from '@/lib/label-context';
import { styles } from './styles';

export type MermaidPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface MermaidProps {
  /** Diagram definition. Falls back to string children when omitted. */
  chart?: string;
  title?: ReactNode;
  /**
   * Show zoom/pan/reset controls. Defaults to true when the diagram exceeds
   * 120px in height (Mintlify behavior). Pass false to hide.
   */
  actions?: boolean;
  /** Corner for the controls. Defaults to "bottom-right". */
  placement?: MermaidPlacement;
  /**
   * Precompiled SVG. Shiso's MDX pipeline fills this in at build time for
   * static definitions, so you rarely pass it yourself.
   */
  svg?: string;
  /** Build-time compile error; shown in place of the diagram. */
  error?: string;
  children?: ReactNode;
}

function childrenToText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(childrenToText).join('');
  }
  if (node && typeof node === 'object' && 'props' in (node as object)) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return childrenToText(props?.children);
  }
  return '';
}

/** Extracts raw diagram source from MDX children (string or <code> element). */
export function mermaidSource(chart: string | undefined, children: ReactNode): string {
  const raw = typeof chart === 'string' && chart.trim() ? chart : childrenToText(children);
  return raw.replace(/^\n+|\n+$/g, '').replace(/\\n$/, '');
}

type CompileInBrowser = (source: string) => string;

let browserCompiler: Promise<CompileInBrowser> | undefined;

/**
 * Lazily loads Ondine's WebAssembly compiler for definitions only known at
 * runtime (`chart={someVariable}`). Static diagrams never reach this: they
 * are compiled at build time by `lib/rehype-mermaid.ts`.
 */
function loadBrowserCompiler(): Promise<CompileInBrowser> {
  browserCompiler ??= Promise.all([
    import('ondine/compiler/wasm'),
    import('ondine/compiler/wasm/all'),
  ]).then(([{ create }, { wasm: all }]) => {
    const renderer = create({ modules: { all } });
    return source => renderer.render(source).svg;
  });
  browserCompiler.catch(() => {
    browserCompiler = undefined;
  });
  return browserCompiler;
}

const PLACEMENT_CLASS: Record<MermaidPlacement, string> = {
  'top-left': 'top-2 left-2',
  'top-right': 'top-2 right-2',
  'bottom-left': 'bottom-2 left-2',
  'bottom-right': 'bottom-2 right-2',
};

/**
 * Renders a Mermaid diagram as SVG compiled by Ondine (https://ondine.sh).
 * Static definitions arrive precompiled via `svg`, so server output already
 * contains the diagram and no renderer runs in the browser. Colors and fonts
 * come from `--ondine-*` CSS variables mapped to the site theme, so light and
 * dark mode switch without re-rendering. Dynamic definitions compile on the
 * client; until then (and without JS) the raw definition shows in a <pre>.
 */
export function Mermaid({
  chart,
  title,
  actions,
  placement = 'bottom-right',
  svg: precompiled,
  error: precompileError,
  children,
}: MermaidProps) {
  const labels = useLabels();
  const source = mermaidSource(chart, children);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgHostRef = useRef<HTMLDivElement>(null);
  const [compiled, setCompiled] = useState<{ source: string; svg: string } | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const needsBrowserCompile = !precompiled && !precompileError && Boolean(source.trim());

  useEffect(() => {
    if (!needsBrowserCompile) {
      return;
    }

    let cancelled = false;
    setFailed(null);
    loadBrowserCompiler()
      .then(compile => {
        const rendered = compile(source);
        if (!cancelled) {
          setCompiled({ source, svg: rendered });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(source);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [source, needsBrowserCompile]);

  const svg = precompiled || (compiled?.source === source ? compiled.svg : null);
  const error = Boolean(precompileError) || failed === source;

  // Pan is native scroll; zoom controls scale the SVG host.
  const showControls = actions ?? true;

  return (
    <figure className={styles.mermaid} data-slot="mermaid">
      {title ? <figcaption className={styles.mermaidTitle}>{title}</figcaption> : null}
      <div ref={containerRef} className={styles.mermaidViewport}>
        {svg && !error ? (
          <div
            ref={svgHostRef}
            className={styles.mermaidSvg}
            style={{ transform: `scale(${zoom})` }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Ondine generates this SVG from the page's own diagram source.
            dangerouslySetInnerHTML={{ __html: svg }}
            role="img"
            aria-label={title ? String(title) : labels.diagram}
          />
        ) : (
          <pre className={styles.mermaidFallback} title={labels.diagramSource}>
            {source}
          </pre>
        )}
        {error ? (
          <p className={styles.mermaidError} title={precompileError || undefined}>
            {labels.diagramError}
          </p>
        ) : null}
        {showControls && svg && !error ? (
          <div className={`${styles.mermaidControls} ${PLACEMENT_CLASS[placement]}`}>
            <button
              type="button"
              aria-label={labels.zoomOut}
              onClick={() => setZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))}
            >
              −
            </button>
            <button type="button" aria-label={labels.resetView} onClick={() => setZoom(1)}>
              ⟳
            </button>
            <button
              type="button"
              aria-label={labels.zoomIn}
              onClick={() => setZoom(z => Math.min(2.5, +(z + 0.25).toFixed(2)))}
            >
              +
            </button>
          </div>
        ) : null}
      </div>
    </figure>
  );
}
