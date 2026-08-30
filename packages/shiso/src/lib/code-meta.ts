/**
 * Parses the fenced code meta string (the text after the language tag) into
 * the directives Shiso understands:
 *
 *   ```ts title="app.ts" {1,3-5} showLineNumbers=10
 *
 * Anything unrecognized becomes the title, so the bare label form used by
 * `CodeGroup` (```bash npm) keeps working.
 */

export interface CodeMeta {
  title?: string;
  highlightLines: number[];
  showLineNumbers?: boolean;
  startLine?: number;
  /** Unrecognized tokens, in order. */
  rest: string[];
}

/** Splits on whitespace while keeping quoted segments (title="my file.ts") intact. */
function tokenize(meta: string): string[] {
  return meta.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
}

function parseLineList(list: string): number[] {
  const lines = new Set<number>();

  for (const part of list.split(',')) {
    const range = part.trim();
    if (!range) {
      continue;
    }

    const [from, to = from] = range.split('-').map(Number);
    if (!Number.isInteger(from) || from < 1 || !Number.isInteger(to)) {
      continue;
    }

    for (let line = from; line <= to; line += 1) {
      lines.add(line);
    }
  }

  return [...lines].sort((a, b) => a - b);
}

function unquote(value: string): string {
  return value.replace(/^(["'])(.*)\1$/, '$2');
}

export function parseCodeMeta(meta: string | undefined): CodeMeta {
  const result: CodeMeta = { highlightLines: [], rest: [] };
  const lines = new Set<number>();

  for (const token of tokenize((meta || '').trim())) {
    const highlight = token.match(/^\{([\d,\s-]+)\}$/);
    const title = token.match(/^title=(.+)$/);
    const numbered = token.match(/^showLineNumbers(?:=(\d+))?$/);

    if (highlight) {
      for (const line of parseLineList(highlight[1])) {
        lines.add(line);
      }
    } else if (title) {
      result.title = unquote(title[1]);
    } else if (numbered) {
      result.showLineNumbers = true;
      if (numbered[1]) {
        result.startLine = Number(numbered[1]);
      }
    } else if (token === 'hideLineNumbers') {
      result.showLineNumbers = false;
    } else {
      result.rest.push(unquote(token));
    }
  }

  result.highlightLines = [...lines].sort((a, b) => a - b);

  // Back-compat: a bare label (```bash npm) is the title, which CodeGroup uses
  // as the tab name.
  if (!result.title && result.rest.length) {
    result.title = result.rest.join(' ');
  }

  return result;
}
