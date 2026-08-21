/** Primary language subtags written right-to-left. */
const RTL_LANGUAGES = new Set(['ar', 'ckb', 'dv', 'fa', 'he', 'iw', 'ps', 'sd', 'ug', 'ur', 'yi']);

/** BCP 47-shaped tags with a 2-3 letter primary subtag, e.g. "es" or "pt-BR". */
const LOCALE_PATTERN = /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i;

export function isValidLocale(value: string | undefined): value is string {
  if (!value || !LOCALE_PATTERN.test(value)) {
    return false;
  }

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
export function resolveLocale(language: string | undefined, fallback: string | undefined): string {
  if (isValidLocale(language)) {
    return Intl.getCanonicalLocales(language)[0];
  }

  if (isValidLocale(fallback)) {
    return Intl.getCanonicalLocales(fallback)[0];
  }

  return 'en-US';
}

/** Document direction for a locale, e.g. "ar" and "he" read right-to-left. */
export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  const primary = locale.split('-')[0]?.toLowerCase() || '';
  return RTL_LANGUAGES.has(primary) ? 'rtl' : 'ltr';
}
