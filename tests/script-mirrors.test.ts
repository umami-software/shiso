import { describe, expect, it } from 'vitest';
import { headingText, toText } from '@/lib/mdast';
import { createSlugger, slugify, slugifyId } from '@/lib/slug';
import {
  headingText as headingTextJs,
  toText as toTextJs,
} from '../packages/shiso/scripts/lib/mdast.mjs';
import {
  createSlugger as createSluggerJs,
  slugifyId as slugifyIdJs,
  slugify as slugifyJs,
} from '../packages/shiso/scripts/lib/slug.mjs';

/**
 * The Node scripts carry plain-JS mirrors of a few TypeScript helpers, because
 * scripts must not depend on Node's experimental type stripping. These tests
 * fail when the implementations drift apart.
 */

const SLUG_SAMPLES = ['Getting Started', '  padded  ', 'v2', 'es-v1', 'Código', '***', ''];

describe('scripts/lib/slug.mjs mirrors src/lib/slug.ts', () => {
  it('slugify matches for representative inputs', () => {
    for (const sample of SLUG_SAMPLES) {
      expect(slugifyJs(sample)).toBe(slugify(sample));
    }
  });

  it('slugifyId matches, including fallbacks', () => {
    for (const sample of SLUG_SAMPLES) {
      expect(slugifyIdJs(sample, 'fallback')).toBe(slugifyId(sample, 'fallback'));
    }
  });

  it('stateful sluggers deduplicate identically', () => {
    const tsSlugger = createSlugger();
    const jsSlugger = createSluggerJs();

    for (const heading of ['Setup', 'Setup', 'Setup', 'Other']) {
      expect(jsSlugger.slug(heading)).toBe(tsSlugger.slug(heading));
    }
  });
});

describe('scripts/lib/mdast.mjs mirrors src/lib/mdast.ts', () => {
  const tree = {
    type: 'heading',
    children: [
      { type: 'text', value: '  API ' },
      { type: 'mdxJsxTextElement', children: [{ type: 'text', value: 'key' }] },
    ],
  };

  it('toText matches', () => {
    expect(toTextJs(tree)).toBe(toText(tree));
    expect(toTextJs(undefined)).toBe(toText(undefined));
  });

  it('headingText matches', () => {
    expect(headingTextJs(tree)).toBe(headingText(tree));
  });
});
