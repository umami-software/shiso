import { RenderError, render } from 'ondine/compiler';

/**
 * Build-time Mermaid compilation via Ondine (https://ondine.sh). Node-only:
 * `ondine/compiler` reads its WebAssembly module from disk, so this must never
 * be imported by client components (they use `ondine/compiler/wasm` instead).
 */
export type CompiledMermaid =
  | { svg: string; error?: undefined }
  | { svg?: undefined; error: string };

/** Formats an Ondine failure the way Mermaid reports it, with line context when known. */
export function formatMermaidError(error: unknown): string {
  if (error instanceof RenderError) {
    const message = error.message.trim();
    // Ondine's messages match Mermaid's, which usually name the line already.
    if (!error.line || message.includes(`line ${error.line}`)) {
      return message;
    }
    return `${message} (line ${error.line}${error.column ? `, column ${error.column}` : ''})`;
  }
  return error instanceof Error ? error.message : String(error);
}

/** Compiles Mermaid source to a themeable SVG string, or returns the failure message. */
export function compileMermaid(source: string): CompiledMermaid {
  try {
    return { svg: render(source).svg };
  } catch (error) {
    return { error: formatMermaidError(error) };
  }
}
