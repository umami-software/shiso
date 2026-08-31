/** Expands { openapi } navigation entries into ordinary { page } entries. */

const OPENAPI_KEYS = new Set(['openapi']);

function isOpenApiItem(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value) && 'openapi' in value;
}

function assertOpenApiItem(item) {
  const unknown = Object.keys(item).filter(key => !OPENAPI_KEYS.has(key));
  if (unknown.length) {
    throw new Error(
      `Invalid navigation openapi entry: unknown ${unknown.length === 1 ? 'key' : 'keys'} ${unknown.map(key => `"${key}"`).join(', ')}.`,
    );
  }
  if (item.openapi !== true && (typeof item.openapi !== 'string' || !item.openapi.trim())) {
    throw new Error('Invalid navigation openapi entry: use true or a non-empty tag name.');
  }
}

/** True when a navigation tree contains at least one { openapi } page entry. */
export function hasOpenApiItems(navigation) {
  if (Array.isArray(navigation)) return navigation.some(hasOpenApiItems);
  if (!navigation || typeof navigation !== 'object') return false;
  if (isOpenApiItem(navigation)) return true;
  return Object.values(navigation).some(hasOpenApiItems);
}

function pageEntry(operation, directory) {
  return {
    page: `${directory}/${operation.id}`,
    title: operation.summary || `${operation.method} ${operation.path}`,
    method: operation.method,
  };
}

function sortOperations(operations) {
  return [...operations].sort(
    (left, right) => left.path.localeCompare(right.path) || left.method.localeCompare(right.method),
  );
}

function expandItem(item, { operations, directory }) {
  assertOpenApiItem(item);

  if (item.openapi === true) {
    const tags = [];
    for (const operation of operations) {
      for (const tag of operation.tags) {
        if (!tags.includes(tag)) tags.push(tag);
      }
    }
    return tags.map(tag => ({
      group: tag,
      pages: sortOperations(operations.filter(operation => operation.tags.includes(tag))).map(
        operation => pageEntry(operation, directory),
      ),
    }));
  }

  const tag = item.openapi.trim();
  const matched = sortOperations(operations.filter(operation => operation.tags.includes(tag)));
  if (!matched.length) {
    throw new Error(`Navigation openapi entry "${tag}" matched no operations in the API spec.`);
  }
  return matched.map(operation => pageEntry(operation, directory));
}

/** Returns a config copy whose { openapi } entries are ordinary page objects. */
export function expandOpenApiNavigation(config, { operations, directory }) {
  function expandObject(value) {
    if (Array.isArray(value)) return value.map(expandObject);
    if (!value || typeof value !== 'object') return value;

    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => {
        if (key === 'pages' && Array.isArray(child)) {
          const expanded = [];
          for (const item of child) {
            if (isOpenApiItem(item)) {
              expanded.push(...expandItem(item, { operations, directory }));
            } else {
              expanded.push(expandObject(item));
            }
          }
          return [key, expanded];
        }
        return [key, expandObject(child)];
      }),
    );
  }

  return { ...config, navigation: expandObject(config.navigation) };
}
