import { describe, expect, it, vi } from 'vitest';
import { resolveSearchConfig } from '@/lib/search/config';
import {
  registerSearchProvider,
  resolveSearchProvider,
  type SearchProvider,
} from '@/lib/search/provider';

describe('search configuration', () => {
  it('uses the local provider by default', () => {
    expect(resolveSearchConfig(undefined)).toEqual({
      enabled: true,
      prompt: 'Search...',
      provider: 'local',
      options: {},
      shortcut: 'k',
      shortcutLabel: 'Ctrl K',
    });
  });

  it('normalizes configured values', () => {
    const options = { applicationId: 'test' };

    expect(resolveSearchConfig({ prompt: ' Search docs ', provider: ' Hosted ', options })).toEqual(
      {
        enabled: true,
        prompt: 'Search docs',
        provider: 'hosted',
        options,
        shortcut: 'k',
        shortcutLabel: 'Ctrl K',
      },
    );
  });

  it('can disable search', () => {
    expect(resolveSearchConfig(false).enabled).toBe(false);
  });

  it('can configure or disable the keyboard shortcut', () => {
    expect(resolveSearchConfig({ shortcut: 's', shortcutLabel: 'Ctrl S' })).toMatchObject({
      shortcut: 's',
      shortcutLabel: 'Ctrl S',
    });
    expect(resolveSearchConfig({ shortcut: false }).shortcut).toBe(false);
  });
});

describe('search providers', () => {
  it('registers and resolves a custom provider with its options', async () => {
    const provider: SearchProvider = {
      async search(query) {
        return [{ url: '/custom', page: query, snippet: 'Custom result', score: 1 }];
      },
    };
    let receivedOptions: Record<string, unknown> | undefined;
    const unregister = registerSearchProvider('test-provider', options => {
      receivedOptions = options;
      return provider;
    });

    try {
      const resolved = await resolveSearchProvider('TEST-PROVIDER', { index: 'docs' });

      expect(resolved).toMatchObject({ providerId: 'test-provider', fellBack: false });
      expect(receivedOptions).toEqual({ index: 'docs' });
      expect(await resolved.provider.search('hello')).toEqual([
        { url: '/custom', page: 'hello', snippet: 'Custom result', score: 1 },
      ]);
    } finally {
      unregister();
    }
  });

  it('falls back to local for an unknown provider', async () => {
    const resolved = await resolveSearchProvider('missing-provider');

    expect(resolved).toMatchObject({ providerId: 'local', fellBack: true });
  });

  it('does not allow replacing the built-in providers', () => {
    expect(() => registerSearchProvider('local', () => ({ search: async () => [] }))).toThrow(
      'cannot replace',
    );
    expect(() => registerSearchProvider('pagefind', () => ({ search: async () => [] }))).toThrow(
      'cannot replace',
    );
  });

  it('resolves the built-in pagefind provider', async () => {
    const resolved = await resolveSearchProvider('Pagefind');

    expect(resolved).toMatchObject({ providerId: 'pagefind', fellBack: false });
  });

  it('pagefind falls back to local search when the bundle cannot load', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      const resolved = await resolveSearchProvider('pagefind');

      // In this environment the pagefind bundle import rejects, so the
      // provider must delegate to local (stub index -> empty results).
      expect(await resolved.provider.search('anything')).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    } finally {
      warn.mockRestore();
    }
  });
});
