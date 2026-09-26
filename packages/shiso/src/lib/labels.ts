import { resolveLocale } from '@/lib/locale';
import de from '@/lib/translations/de.json';
import en from '@/lib/translations/en.json';
import es from '@/lib/translations/es.json';
import fr from '@/lib/translations/fr.json';
import ja from '@/lib/translations/ja.json';
import zhHans from '@/lib/translations/zh-Hans.json';
import zhHant from '@/lib/translations/zh-Hant.json';
import type { ThemeLabels, Translations } from '@/lib/types';

export const englishLabels: ThemeLabels = en;
const dictionaries: Record<string, ThemeLabels> = {
  en,
  de,
  es,
  fr,
  ja,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
};

/** Merge from least to most specific; overrides win at each locale level. */
export function resolveLabels(locale: string, overrides: Translations = {}): ThemeLabels {
  const tag = new Intl.Locale(resolveLocale(locale, 'en'));
  const script = tag.script || (tag.language === 'zh' ? tag.maximize().script : undefined);
  const candidates = new Set([
    'en',
    tag.language,
    ...(script ? [`${tag.language}-${script}`] : []),
    tag.baseName,
  ]);
  const labels = { ...englishLabels };
  for (const candidate of candidates) {
    Object.assign(labels, dictionaries[candidate], overrides[candidate]);
  }
  return labels;
}
