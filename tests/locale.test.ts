import { describe, expect, it } from 'vitest';
import { getTextDirection, isValidLocale, resolveLocale } from '@/lib/locale';

describe('isValidLocale', () => {
  it('accepts language codes and full tags', () => {
    expect(isValidLocale('es')).toBe(true);
    expect(isValidLocale('pt-BR')).toBe(true);
    expect(isValidLocale('zh-Hant')).toBe(true);
  });

  it('rejects labels, empty values, and malformed tags', () => {
    expect(isValidLocale(undefined)).toBe(false);
    expect(isValidLocale('')).toBe(false);
    expect(isValidLocale('English')).toBe(false);
    expect(isValidLocale('not a locale')).toBe(false);
  });
});

describe('resolveLocale', () => {
  it('prefers the scope language when valid', () => {
    expect(resolveLocale('es', 'en-US')).toBe('es');
    expect(resolveLocale('pt-br', 'en-US')).toBe('pt-BR');
  });

  it('falls back to the site locale, then en-US', () => {
    expect(resolveLocale('Español', 'fr-FR')).toBe('fr-FR');
    expect(resolveLocale(undefined, undefined)).toBe('en-US');
    expect(resolveLocale('nope!', 'also nope')).toBe('en-US');
  });
});

describe('getTextDirection', () => {
  it('marks Arabic and Hebrew right-to-left', () => {
    expect(getTextDirection('ar')).toBe('rtl');
    expect(getTextDirection('he')).toBe('rtl');
    expect(getTextDirection('ar-EG')).toBe('rtl');
  });

  it('defaults to left-to-right', () => {
    expect(getTextDirection('en-US')).toBe('ltr');
    expect(getTextDirection('es')).toBe('ltr');
  });
});
