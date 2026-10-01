/** Filesystem adapter for the shared navigation module. */
import { statSync } from 'node:fs';
import path from 'node:path';
import { docFileCandidates, normalizeNavigation } from './navigation.mjs';

/**
 * Keeps missing references in the interpreted navigation so content checking
 * can report every missing file. Consumers skip those pages before reading
 * content; runtime's glob adapter rejects missing files during normalization.
 */
export function loadDocsNavigation({ root, config, shiso }) {
  const missingPages = new Set();
  const site = normalizeNavigation(
    config.navigation,
    fileSlug => {
      const candidates = docFileCandidates(fileSlug, shiso.contentDir).map(candidate =>
        path.resolve(root, candidate),
      );
      const filePath = candidates.find(candidate => {
        try {
          return statSync(candidate).isFile();
        } catch {
          return false;
        }
      });
      if (filePath) return filePath;
      missingPages.add(fileSlug);
      return candidates[0];
    },
    { name: config.name, docsPrefix: shiso.docsPrefix },
  );
  return { site, missingPages };
}
