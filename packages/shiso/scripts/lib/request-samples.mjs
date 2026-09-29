/**
 * Request building shared by the build-time sample generator and the browser
 * API playground. This module is deliberately free of Node imports: it is
 * bundled into the client runtime as well as executed by the build scripts.
 *
 * `buildRequest` turns an operation plus user-supplied values into a concrete
 * HTTP request description; `buildCodeSamples` renders that description as
 * cURL, JavaScript, and Python. Values that are missing fall back to the
 * spec's examples or to angle-bracket placeholders such as `<token>`, so the
 * static samples and the live playground always agree on the request shape.
 */

const PLACEHOLDER = /^<[^<>]+>$/;

/** Percent-encodes a value unless it is a documentation placeholder. */
function encodeValue(value) {
  return PLACEHOLDER.test(value) ? value : encodeURIComponent(value);
}

function toBase64(value) {
  if (typeof btoa === 'function') return btoa(value);
  return Buffer.from(value, 'utf8').toString('base64');
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Placeholder credential text shown in samples when no value is supplied. */
export function securityPlaceholder(scheme) {
  if (scheme.type === 'http') {
    return scheme.scheme === 'basic' ? '<credentials>' : '<token>';
  }
  if (scheme.type === 'apiKey') return '<api-key>';
  return '<access-token>';
}

/**
 * Applies one security scheme to the request. `value` is a string for token
 * and API key schemes, `{ username, password }` for HTTP basic, or undefined
 * to emit a placeholder.
 */
export function applySecurity(scheme, value, target) {
  const placeholder = securityPlaceholder(scheme);

  if (scheme.type === 'apiKey') {
    const credential = typeof value === 'string' && value ? value : placeholder;
    const name = scheme.paramName || scheme.name;
    if (scheme.in === 'query') target.query[name] = credential;
    else if (scheme.in === 'cookie') target.cookies[name] = credential;
    else target.headers[name] = credential;
    return;
  }

  if (scheme.type === 'http' && scheme.scheme === 'basic') {
    const credential =
      value && typeof value === 'object' && (value.username || value.password)
        ? toBase64(`${value.username || ''}:${value.password || ''}`)
        : typeof value === 'string' && value
          ? value
          : placeholder;
    target.headers.Authorization = `Basic ${credential}`;
    return;
  }

  const prefix =
    scheme.type === 'http' && scheme.scheme && scheme.scheme !== 'bearer'
      ? capitalize(scheme.scheme)
      : 'Bearer';
  const credential = typeof value === 'string' && value ? value : placeholder;
  target.headers.Authorization = `${prefix} ${credential}`;
}

/** Content categories the sample renderers and playground understand. */
export function bodyKind(contentType) {
  if (!contentType) return 'none';
  if (/[+/]json\b/i.test(contentType)) return 'json';
  if (/x-www-form-urlencoded/i.test(contentType)) return 'form';
  if (/multipart\/form-data/i.test(contentType)) return 'multipart';
  return 'raw';
}

function parseFields(body) {
  if (!body) return {};
  try {
    const parsed = JSON.parse(body);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      ]),
    );
  } catch {
    return {};
  }
}

function parameterValue(node, supplied) {
  if (supplied !== undefined && supplied !== null && supplied !== '') return String(supplied);
  return node.example;
}

/**
 * Builds a concrete request from an operation and optional user values:
 * `{ server, path, query, header, cookie, auth, body }`. Without values, the
 * spec's examples fill required parameters and credentials become
 * placeholders, which is the shape rendered in the static code samples.
 */
export function buildRequest(operation, values = {}) {
  const live = values.live === true;
  const target = { headers: {}, query: {}, cookies: {} };

  for (const scheme of operation.security || []) {
    applySecurity(scheme, values.auth?.[scheme.name], target);
  }

  const params = operation.parameters;
  const pathValues = {};
  for (const node of params.path) {
    const value = parameterValue(node, values.path?.[node.name]);
    // Static samples keep `{id}` placeholders so readers recognize the slot.
    if (live && value !== undefined) pathValues[node.name] = value;
  }
  for (const node of params.query) {
    const value = parameterValue(node, values.query?.[node.name]);
    if (value !== undefined && (live || node.required || values.query?.[node.name])) {
      target.query[node.name] = value;
    }
  }
  for (const node of params.header) {
    const value = parameterValue(node, values.header?.[node.name]);
    if (value !== undefined && (live || node.required || values.header?.[node.name])) {
      target.headers[node.name] = value;
    }
  }
  for (const node of params.cookie) {
    const value = parameterValue(node, values.cookie?.[node.name]);
    if (value !== undefined && (live || node.required || values.cookie?.[node.name])) {
      target.cookies[node.name] = value;
    }
  }

  const server = (values.server || operation.servers?.[0]?.url || operation.serverUrl || '')
    .trim()
    .replace(/\/+$/, '');
  const pathname = operation.path.replace(/\{([^}]+)\}/g, (match, name) =>
    pathValues[name] !== undefined ? encodeURIComponent(pathValues[name]) : match,
  );
  const query = Object.entries(target.query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeValue(value)}`)
    .join('&');
  const url = `${server}${pathname}${query ? `?${query}` : ''}`;

  const cookieHeader = Object.entries(target.cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
  if (cookieHeader) target.headers.Cookie = cookieHeader;

  const contentType = operation.requestBody?.contentType;
  const kind = operation.requestBody ? bodyKind(contentType) : 'none';
  const body = values.body !== undefined ? values.body : operation.requestBody?.example;

  return {
    method: operation.method,
    url,
    headers: target.headers,
    contentType,
    bodyKind: kind,
    body: kind === 'none' ? undefined : body,
    fields: kind === 'form' || kind === 'multipart' ? parseFields(body) : undefined,
  };
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function jsString(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
}

function jsKey(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : jsString(key);
}

function pythonString(value) {
  return jsString(value);
}

function pythonLiteral(json) {
  // Request bodies are JSON strings; the Python sample shows them as dict
  // literals, which differ from JSON only in quoting and keyword spelling.
  return json
    .replace(/"/g, "'")
    .replace(/\btrue\b/g, 'True')
    .replace(/\bfalse\b/g, 'False')
    .replace(/\bnull\b/g, 'None');
}

function indentLines(text, indent) {
  return text
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${indent}${line}`))
    .join('\n');
}

export function curlSample(request) {
  const { method, url, headers, bodyKind: kind, body, fields, contentType } = request;
  const lines = [`curl -X ${method} ${shellQuote(url)}`];

  for (const [key, value] of Object.entries(headers)) {
    lines.push(`  -H ${shellQuote(`${key}: ${value}`)}`);
  }

  if (kind === 'json' && body) {
    lines.push(`  -H ${shellQuote(`Content-Type: ${contentType}`)}`, `  -d ${shellQuote(body)}`);
  } else if (kind === 'form') {
    for (const [key, value] of Object.entries(fields || {})) {
      lines.push(`  --data-urlencode ${shellQuote(`${key}=${value}`)}`);
    }
  } else if (kind === 'multipart') {
    for (const [key, value] of Object.entries(fields || {})) {
      lines.push(`  -F ${shellQuote(`${key}=${value}`)}`);
    }
  } else if (kind === 'raw' && body) {
    lines.push(`  -H ${shellQuote(`Content-Type: ${contentType}`)}`, `  -d ${shellQuote(body)}`);
  }

  return lines.join(' \\\n');
}

export function javascriptSample(request) {
  const { method, url, headers, bodyKind: kind, body, fields, contentType } = request;
  const headerLines = Object.entries(headers).map(
    ([key, value]) => `    ${jsKey(key)}: ${jsString(value)},`,
  );
  if ((kind === 'json' || kind === 'raw') && body) {
    headerLines.unshift(`    'Content-Type': ${jsString(contentType)},`);
  }

  const preamble = [];
  let bodyLine;
  if (kind === 'json' && body) {
    bodyLine = `  body: JSON.stringify(${indentLines(body, '  ')}),`;
  } else if (kind === 'form') {
    const entries = Object.entries(fields || {})
      .map(([key, value]) => `    ${jsKey(key)}: ${jsString(value)},`)
      .join('\n');
    bodyLine = entries
      ? `  body: new URLSearchParams({\n${entries}\n  }),`
      : '  body: new URLSearchParams(),';
  } else if (kind === 'multipart') {
    preamble.push('const body = new FormData();');
    for (const [key, value] of Object.entries(fields || {})) {
      preamble.push(`body.append(${jsString(key)}, ${jsString(value)});`);
    }
    preamble.push('');
    bodyLine = '  body,';
  } else if (kind === 'raw' && body) {
    bodyLine = `  body: ${jsString(body)},`;
  }

  return [
    ...preamble,
    `const response = await fetch(${jsString(url)}, {`,
    `  method: ${jsString(method)},`,
    ...(headerLines.length ? ['  headers: {', ...headerLines, '  },'] : []),
    ...(bodyLine ? [bodyLine] : []),
    '});',
    'const data = await response.json();',
  ].join('\n');
}

export function pythonSample(request) {
  const { method, url, headers, bodyKind: kind, body, fields, contentType } = request;
  const headerEntries = Object.entries(headers);
  if (kind === 'raw' && body) headerEntries.unshift(['Content-Type', contentType]);
  const headerLine = headerEntries.length
    ? `    headers={${headerEntries
        .map(([key, value]) => `${pythonString(key)}: ${pythonString(value)}`)
        .join(', ')}},`
    : undefined;

  let bodyLine;
  if (kind === 'json' && body) {
    bodyLine = `    json=${indentLines(pythonLiteral(body), '    ')},`;
  } else if (kind === 'form') {
    const entries = Object.entries(fields || {})
      .map(([key, value]) => `${pythonString(key)}: ${pythonString(value)}`)
      .join(', ');
    bodyLine = `    data={${entries}},`;
  } else if (kind === 'multipart') {
    const entries = Object.entries(fields || {})
      .map(([key, value]) => `${pythonString(key)}: (None, ${pythonString(value)})`)
      .join(', ');
    bodyLine = `    files={${entries}},`;
  } else if (kind === 'raw' && body) {
    bodyLine = `    data=${pythonString(body)},`;
  }

  return [
    'import requests',
    '',
    `response = requests.${method.toLowerCase()}(`,
    `    ${pythonString(url)},`,
    ...(headerLine ? [headerLine] : []),
    ...(bodyLine ? [bodyLine] : []),
    ')',
    'print(response.json())',
  ].join('\n');
}

/** Builds cURL, JavaScript, and Python request samples for an operation. */
export function buildCodeSamples(operation, values) {
  const request = buildRequest(operation, values);

  return [
    { language: 'bash', label: 'cURL', source: curlSample(request) },
    { language: 'javascript', label: 'JavaScript', source: javascriptSample(request) },
    { language: 'python', label: 'Python', source: pythonSample(request) },
  ];
}
