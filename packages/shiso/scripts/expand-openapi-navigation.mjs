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

const WEBHOOKS_GROUP = 'Webhooks';

function pageEntry(operation, directory) {
  return {
    page: operation.pageRef || `${directory}/${operation.id}`,
    title:
      operation.summary ||
      (operation.webhook ? operation.path : `${operation.method} ${operation.path}`),
    method: operation.webhook ? 'WEBHOOK' : operation.method,
  };
}

/** Untagged webhooks collect under a "Webhooks" group; tagged ones join their tag. */
function operationTags(operation) {
  const tagged = operation.tags.filter(tag => tag !== 'default');
  if (tagged.length) return tagged;
  return operation.webhook ? [WEBHOOKS_GROUP] : operation.tags;
}

function tagGroups(operations, directory) {
  const tags = [];
  for (const operation of operations) {
    for (const tag of operationTags(operation)) {
      if (!tags.includes(tag)) tags.push(tag);
    }
  }
  return tags.map(tag => ({
    group: tag,
    pages: sortOperations(
      operations.filter(operation => operationTags(operation).includes(tag)),
    ).map(operation => pageEntry(operation, directory)),
  }));
}

function sortOperations(operations) {
  return [...operations].sort(
    (left, right) => left.path.localeCompare(right.path) || left.method.localeCompare(right.method),
  );
}

function expandItem(item, { operations, directory, specs = [] }) {
  assertOpenApiItem(item);

  if (item.openapi === true) {
    return tagGroups(operations, directory);
  }

  const value = item.openapi.trim();

  // A configured spec path or URL expands into that spec's tag groups.
  if (specs.some(spec => spec.id === value)) {
    return tagGroups(
      operations.filter(operation => operation.spec === value),
      directory,
    );
  }

  const matched = sortOperations(
    operations.filter(operation => operationTags(operation).includes(value)),
  );
  if (!matched.length) {
    throw new Error(`Navigation openapi entry "${value}" matched no operations in the API spec.`);
  }
  return matched.map(operation => pageEntry(operation, directory));
}

/** Returns a config copy whose { openapi } entries are ordinary page objects. */
export function expandOpenApiNavigation(config, { operations, directory, specs }) {
  function expandObject(value) {
    if (Array.isArray(value)) return value.map(expandObject);
    if (!value || typeof value !== 'object') return value;

    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => {
        if (key === 'pages' && Array.isArray(child)) {
          const expanded = [];
          for (const item of child) {
            if (isOpenApiItem(item)) {
              expanded.push(...expandItem(item, { operations, directory, specs }));
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
