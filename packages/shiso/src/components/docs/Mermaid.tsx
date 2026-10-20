import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
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

function isDarkMode(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  return document.documentElement.classList.contains('dark');
}

const PLACEMENT_CLASS: Record<MermaidPlacement, string> = {
  'top-left': 'top-2 left-2',
  'top-right': 'top-2 right-2',
  'bottom-left': 'bottom-2 left-2',
  'bottom-right': 'bottom-2 right-2',
};

/**
 * Renders a Mermaid diagram. Server/prerender output is the raw definition in
 * a <pre> so search indexing and no-JS still see the content; the client
 * replaces it with SVG via a lazy `mermaid` import (kept out of the SSR bundle).
 */
export function Mermaid({
  chart,
  title,
  actions,
  placement = 'bottom-right',
  children,
}: MermaidProps) {
  const labels = useLabels();
  const source = mermaidSource(chart, children);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgHostRef = useRef<HTMLDivElement>(null);
  const diagramId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(isDarkMode());
    const observer = new MutationObserver(() => setDark(isDarkMode()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!source.trim() || typeof window === 'undefined') {
      return;
    }

    let cancelled = false;
    setError(false);
    setSvg(null);
    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        if (cancelled) {
          return;
        }
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? 'dark' : 'neutral',
          securityLevel: 'strict',
        });
        const { svg: rendered } = await mermaid.render(`shiso-mermaid-${diagramId}`, source);
        if (!cancelled) {
          setSvg(rendered);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, diagramId, dark]);

  // Pan is native scroll; zoom controls scale the SVG host.
  const showControls = actions ?? true;

  return (
    <figure className={styles.mermaid} data-dark={dark ? '' : undefined}>
      {title ? <figcaption className={styles.mermaidTitle}>{title}</figcaption> : null}
      <div ref={containerRef} className={styles.mermaidViewport}>
        {svg && !error ? (
          <div
            ref={svgHostRef}
            className={styles.mermaidSvg}
            style={{ transform: `scale(${zoom})` }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid generates this SVG from the page's own diagram source.
            dangerouslySetInnerHTML={{ __html: svg }}
            role="img"
            aria-label={title ? String(title) : labels.diagram}
          />
        ) : (
          <pre className={styles.mermaidFallback} title={labels.diagramSource}>
            {source}
          </pre>
        )}
        {error ? <p className={styles.mermaidError}>{labels.diagramError}</p> : null}
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
