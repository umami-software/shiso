import { describe, expect, it } from 'vitest';
import { buildHead, HEAD_MARKER, type HeadTag, renderHeadToString } from '@/lib/head';
import { docsConfig } from '@/lib/site-config';

/** Convenience lookups over the tag list, which is order-significant but sparse. */
function findMeta(tags: HeadTag[], key: 'name' | 'property', value: string) {
  return tags.find(tag => tag.tag === 'meta' && tag.attrs?.[key] === value)?.attrs?.content;
}

function findLink(tags: HeadTag[], rel: string) {
  return tags.find(tag => tag.tag === 'link' && tag.attrs?.rel === rel)?.attrs?.href;
}

const firstPage = docsConfig.pages[0];

describe('buildHead', () => {
  it('builds a full tag set for a real page', () => {
    const tags = buildHead(firstPage.url);

    expect(tags[0].tag).toBe('title');
    expect(tags[0].children).toContain(docsConfig.name);
    expect(findMeta(tags, 'name', 'description')).toBeTruthy();
    expect(findLink(tags, 'canonical')).toBe(`https://shiso.umami.is${firstPage.url}`);
    expect(findMeta(tags, 'property', 'og:url')).toBe(`https://shiso.umami.is${firstPage.url}`);
    expect(findMeta(tags, 'property', 'og:type')).toBe('article');
    expect(findMeta(tags, 'name', 'twitter:card')).toBe('summary_large_image');
    expect(findMeta(tags, 'name', 'robots')).toBeUndefined();
  });

  it('mirrors the title into og:title and twitter:title', () => {
    const tags = buildHead(firstPage.url);
    const title = tags[0].children;

    expect(findMeta(tags, 'property', 'og:title')).toBe(title);
    expect(findMeta(tags, 'name', 'twitter:title')).toBe(title);
  });

  it('emits TechArticle and BreadcrumbList structured data', () => {
    const tags = buildHead(firstPage.url);
    const jsonLd = tags.find(tag => tag.tag === 'script');

    expect(jsonLd?.attrs?.type).toBe('application/ld+json');

    const parsed = JSON.parse(jsonLd?.children || '[]');

    expect(parsed.map((entry: { '@type': string }) => entry['@type'])).toEqual([
      'TechArticle',
      'BreadcrumbList',
    ]);
    expect(parsed[1].itemListElement[0].position).toBe(1);
  });

  it('marks unknown routes noindex', () => {
    const tags = buildHead('/docs/does-not-exist');

    expect(findMeta(tags, 'name', 'robots')).toBe('noindex');
    expect(findLink(tags, 'canonical')).toBeUndefined();
  });

  it('is a pure function of the pathname', () => {
    expect(buildHead(firstPage.url)).toEqual(buildHead(firstPage.url));
  });
});

describe('renderHeadToString', () => {
  it('self-closes void tags and marks everything it owns', () => {
    const html = renderHeadToString([
      { tag: 'title', children: 'Hi' },
      { tag: 'meta', attrs: { name: 'description', content: 'Hello' } },
    ]);

    expect(html).toContain(`<title ${HEAD_MARKER}>Hi</title>`);
    expect(html).toContain(`<meta name="description" content="Hello" ${HEAD_MARKER} />`);
  });

  it('escapes attribute values that could break out of the tag', () => {
    const html = renderHeadToString([
      { tag: 'meta', attrs: { name: 'description', content: 'a "quote" & <tag>' } },
    ]);

    expect(html).toContain('a &quot;quote&quot; &amp; &lt;tag&gt;');
    expect(html).not.toContain('<tag>');
  });

  it('escapes < inside JSON-LD rather than HTML-escaping the JSON', () => {
    const html = renderHeadToString([
      { tag: 'script', attrs: { type: 'application/ld+json' }, children: '{"a":"</script>"}' },
    ]);

    expect(html).not.toContain('</script>"}');
    expect(html).toContain('\\u003c/script>');
    // Quotes must survive, or the JSON stops parsing.
    expect(html).toContain('{"a"');
  });
});
