import { type FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { Badge } from '@/components/docs/Badge';
import { Expandable } from '@/components/docs/Expandable';
import { Button } from '@/components/ui/button';
import { useLabels } from '@/lib/label-context';
import { methodColor, statusColor } from '@/lib/openapi';
import type { NormalizedOperation, SchemaNode, SecurityScheme } from '@/lib/types';
import { cn } from '@/lib/utils';
import { buildRequest, curlSample } from '../../scripts/lib/request-samples.mjs';

const REQUEST_TIMEOUT_MS = 30_000;
const AUTH_STORAGE_KEY = 'shiso:api-auth';
const BODYLESS_METHODS = new Set(['GET', 'HEAD']);
const PARAMETER_LOCATIONS = ['path', 'query', 'header'] as const;

type ParameterLocation = (typeof PARAMETER_LOCATIONS)[number];
type BasicCredentials = { username: string; password: string };
type AuthValue = string | BasicCredentials;
type AuthValues = Record<string, AuthValue>;
type ParameterValues = Record<ParameterLocation, Record<string, string>>;

interface PlaygroundResponse {
  status: number;
  statusText: string;
  headers: [string, string][];
  body: string;
  json: boolean;
  elapsed: number;
}

const inputClass =
  'h-8 w-full min-w-0 rounded-md border border-border bg-background px-2.5 font-mono text-foreground text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50';

function isBasic(scheme: SecurityScheme): boolean {
  return scheme.type === 'http' && scheme.scheme === 'basic';
}

function initialParameters(operation: NormalizedOperation): ParameterValues {
  const values = { path: {}, query: {}, header: {} } as ParameterValues;
  for (const location of PARAMETER_LOCATIONS) {
    for (const node of operation.parameters[location]) {
      if (node.name) values[location][node.name] = node.example ?? '';
    }
  }
  return values;
}

function readStoredAuth(): AuthValues {
  try {
    const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : undefined;
    return parsed && typeof parsed === 'object' ? (parsed as AuthValues) : {};
  } catch {
    return {};
  }
}

function writeStoredAuth(values: AuthValues) {
  try {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(values));
  } catch {
    // Storage may be unavailable (private mode, quota); credentials then live
    // only in component state.
  }
}

/** Resolves the playground proxy template into the URL to fetch. */
export function proxiedUrl(url: string, proxy?: string): string {
  if (!proxy) return url;
  const encoded = encodeURIComponent(url);
  return proxy.includes('$url') ? proxy.replaceAll('$url', encoded) : `${proxy}${encoded}`;
}

function prettyBody(text: string, contentType: string | null): { body: string; json: boolean } {
  const looksJson = /json/i.test(contentType || '') || /^\s*[{[]/.test(text);
  if (looksJson) {
    try {
      return { body: JSON.stringify(JSON.parse(text), null, 2), json: true };
    } catch {
      // Not JSON after all; show the raw text.
    }
  }
  return { body: text, json: false };
}

function ParameterInput({
  id,
  node,
  value,
  onChange,
}: {
  id: string;
  node: SchemaNode;
  value: string;
  onChange: (value: string) => void;
}) {
  const options = node.enum ?? (node.type === 'boolean' ? ['true', 'false'] : undefined);

  if (options) {
    return (
      <select
        id={id}
        className={inputClass}
        value={value}
        required={node.required}
        onChange={event => onChange(event.target.value)}
      >
        {!node.required && <option value="">—</option>}
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={id}
      type="text"
      className={inputClass}
      value={value}
      required={node.required}
      placeholder={node.type}
      autoComplete="off"
      spellCheck={false}
      onChange={event => onChange(event.target.value)}
    />
  );
}

function Field({
  id,
  label,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  const labels = useLabels();
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-1 sm:grid-cols-[minmax(8rem,30%)_minmax(0,1fr)] sm:items-center sm:gap-3">
      <label htmlFor={id} className="flex flex-wrap items-baseline gap-1.5 text-sm">
        <span className="font-mono text-foreground">{label}</span>
        {required ? (
          <span className="text-destructive text-xs">{labels.fieldRequired}</span>
        ) : hint ? (
          <span className="text-muted-foreground text-xs">{hint}</span>
        ) : null}
      </label>
      {children}
    </div>
  );
}

export interface ApiPlaygroundProps {
  operation: NormalizedOperation;
  /** Optional CORS proxy template from `api.playground.proxy`. */
  proxy?: string;
}

/**
 * The "Try it" panel: a form built from the operation's servers, security
 * schemes, parameters, and request body that sends real requests from the
 * browser and shows the response. Credentials persist in sessionStorage so a
 * token entered once is reused on every endpoint page during the tab's life.
 */
export function ApiPlayground({ operation, proxy }: ApiPlaygroundProps) {
  const labels = useLabels();
  const idPrefix = useId();
  const [server, setServer] = useState(operation.servers[0]?.url ?? operation.serverUrl);
  const [auth, setAuth] = useState<AuthValues>({});
  const [parameters, setParameters] = useState(() => initialParameters(operation));
  const [body, setBody] = useState(operation.requestBody?.example ?? '');
  const [status, setStatus] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [response, setResponse] = useState<PlaygroundResponse>();
  const [error, setError] = useState<string>();
  const controller = useRef<AbortController | null>(null);

  // Stored credentials are read after hydration so server and client markup match.
  useEffect(() => {
    setAuth(readStoredAuth());
  }, []);

  useEffect(() => () => controller.current?.abort(), []);

  const hasBody = !!operation.requestBody && !BODYLESS_METHODS.has(operation.method);
  const requestValues = useMemo(
    () => ({ live: true, server, auth, body: hasBody ? body : undefined, ...parameters }),
    [server, auth, body, hasBody, parameters],
  );
  const preview = useMemo(
    () => curlSample(buildRequest(operation, requestValues)),
    [operation, requestValues],
  );

  function updateAuth(name: string, value: AuthValue) {
    setAuth(current => {
      const next = { ...current, [name]: value };
      writeStoredAuth(next);
      return next;
    });
  }

  function updateParameter(location: ParameterLocation, name: string, value: string) {
    setParameters(current => ({
      ...current,
      [location]: { ...current[location], [name]: value },
    }));
  }

  function cancel() {
    controller.current?.abort();
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (status === 'pending') return;

    const request = buildRequest(operation, requestValues);
    const abort = new AbortController();
    controller.current = abort;
    setStatus('pending');
    setError(undefined);
    const timeout = window.setTimeout(() => abort.abort('timeout'), REQUEST_TIMEOUT_MS);
    const started = performance.now();

    try {
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers as Record<string, string>)) {
        // Browsers refuse to set Cookie from scripts; leave it to the user agent.
        if (key.toLowerCase() !== 'cookie') headers.set(key, value);
      }

      let payload: BodyInit | undefined;
      if (hasBody) {
        const fields = (request.fields ?? {}) as Record<string, string>;
        if (request.bodyKind === 'form') {
          payload = new URLSearchParams(fields);
        } else if (request.bodyKind === 'multipart') {
          const form = new FormData();
          for (const [key, value] of Object.entries(fields)) form.append(key, value);
          payload = form;
        } else if (request.body) {
          payload = request.body as string;
          if (request.contentType) headers.set('Content-Type', request.contentType);
        }
      }

      const result = await fetch(proxiedUrl(request.url, proxy), {
        method: request.method,
        headers,
        body: payload,
        signal: abort.signal,
      });
      const text = await result.text();
      const { body: pretty, json } = prettyBody(text, result.headers.get('content-type'));
      const responseHeaders: [string, string][] = [];
      result.headers.forEach((value, key) => {
        responseHeaders.push([key, value]);
      });

      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: responseHeaders,
        body: pretty,
        json,
        elapsed: Math.round(performance.now() - started),
      });
      setStatus('done');
    } catch (caught) {
      if (abort.signal.aborted && abort.signal.reason === 'timeout') {
        setError(labels.apiRequestTimedOut);
        setStatus('error');
      } else if (abort.signal.aborted) {
        setStatus(response ? 'done' : 'idle');
      } else {
        const detail = caught instanceof Error && caught.message ? ` (${caught.message})` : '';
        setError(`${labels.apiRequestFailed}${detail}`);
        setStatus('error');
      }
    } finally {
      window.clearTimeout(timeout);
      if (controller.current === abort) controller.current = null;
    }
  }

  const serverListId = `${idPrefix}-servers`;
  const parameterGroups = PARAMETER_LOCATIONS.map(location => ({
    location,
    name: {
      path: labels.apiPathParameters,
      query: labels.apiQueryParameters,
      header: labels.apiHeaders,
    }[location],
    nodes: operation.parameters[location].filter(node => node.name),
  })).filter(group => group.nodes.length > 0);

  return (
    <form
      onSubmit={send}
      className="not-prose my-4 flex flex-col gap-5 rounded-lg border border-border bg-card p-4 text-sm"
      data-slot="api-playground"
      data-pagefind-ignore
      aria-busy={status === 'pending'}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-server`} className="text-muted-foreground text-xs">
          {labels.apiServer}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Badge color={methodColor(operation.method)} size="sm" className="font-mono">
            {operation.method}
          </Badge>
          <input
            id={`${idPrefix}-server`}
            type="text"
            className={cn(inputClass, 'flex-1 basis-48')}
            value={server}
            list={operation.servers.length > 1 ? serverListId : undefined}
            autoComplete="off"
            spellCheck={false}
            onChange={event => setServer(event.target.value)}
          />
          {operation.servers.length > 1 && (
            <datalist id={serverListId}>
              {operation.servers.map(item => (
                <option key={item.url} value={item.url}>
                  {item.description}
                </option>
              ))}
            </datalist>
          )}
          <code className="font-mono text-muted-foreground">{operation.path}</code>
        </div>
      </div>

      {operation.security.length > 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-muted-foreground text-xs">{labels.apiAuthorization}</legend>
          {operation.security.map(scheme => {
            const value = auth[scheme.name];
            const fieldId = `${idPrefix}-auth-${scheme.name}`;
            if (isBasic(scheme)) {
              const basic =
                value && typeof value === 'object' ? value : { username: '', password: '' };
              return (
                <div key={scheme.name} className="flex flex-col gap-2">
                  <Field id={`${fieldId}-user`} label={labels.apiUsername} hint={scheme.name}>
                    <input
                      id={`${fieldId}-user`}
                      type="text"
                      className={inputClass}
                      value={basic.username}
                      autoComplete="off"
                      onChange={event =>
                        updateAuth(scheme.name, { ...basic, username: event.target.value })
                      }
                    />
                  </Field>
                  <Field id={`${fieldId}-pass`} label={labels.apiPassword}>
                    <input
                      id={`${fieldId}-pass`}
                      type="password"
                      className={inputClass}
                      value={basic.password}
                      autoComplete="off"
                      onChange={event =>
                        updateAuth(scheme.name, { ...basic, password: event.target.value })
                      }
                    />
                  </Field>
                </div>
              );
            }
            const label =
              scheme.type === 'apiKey'
                ? scheme.paramName || labels.apiApiKey
                : scheme.type === 'http' && scheme.scheme !== 'bearer'
                  ? 'Authorization'
                  : labels.apiToken;
            return (
              <Field key={scheme.name} id={fieldId} label={label} hint={scheme.label}>
                <input
                  id={fieldId}
                  type="password"
                  className={inputClass}
                  value={typeof value === 'string' ? value : ''}
                  autoComplete="off"
                  onChange={event => updateAuth(scheme.name, event.target.value)}
                />
              </Field>
            );
          })}
          <p className="m-0 text-muted-foreground text-xs">{labels.apiCredentialsStored}</p>
        </fieldset>
      )}

      {parameterGroups.map(group => (
        <fieldset key={group.location} className="flex flex-col gap-3">
          <legend className="mb-2 text-muted-foreground text-xs">{group.name}</legend>
          {group.nodes.map(node => {
            const name = node.name as string;
            const fieldId = `${idPrefix}-${group.location}-${name}`;
            return (
              <Field
                key={name}
                id={fieldId}
                label={name}
                required={node.required}
                hint={labels.apiOptional}
              >
                <ParameterInput
                  id={fieldId}
                  node={node}
                  value={parameters[group.location][name] ?? ''}
                  onChange={value => updateParameter(group.location, name, value)}
                />
              </Field>
            );
          })}
        </fieldset>
      ))}

      {operation.parameters.cookie.length > 0 && (
        <p className="m-0 text-muted-foreground text-xs">{labels.apiCookiesUnsupported}</p>
      )}

      {hasBody && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${idPrefix}-body`}
            className="flex items-baseline gap-2 text-muted-foreground text-xs"
          >
            {labels.apiBody}
            <span className="font-mono">{operation.requestBody?.contentType}</span>
          </label>
          <textarea
            id={`${idPrefix}-body`}
            className={cn(inputClass, 'h-auto min-h-32 resize-y py-2 leading-relaxed')}
            value={body}
            spellCheck={false}
            onChange={event => setBody(event.target.value)}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={status === 'pending'}>
          {status === 'pending' ? labels.apiSending : labels.apiSend}
        </Button>
        {status === 'pending' && (
          <Button type="button" variant="outline" onClick={cancel}>
            {labels.apiCancel}
          </Button>
        )}
      </div>

      <Expandable title={labels.apiRequest}>
        <CodeBlock
          data-language="bash"
          data-line-count={String(preview.split('\n').length)}
          className="text-xs"
        >
          <code className="language-bash">{preview}</code>
        </CodeBlock>
      </Expandable>

      <div className="flex flex-col gap-2" role="status" aria-live="polite">
        <div className="text-muted-foreground text-xs">{labels.apiResponse}</div>
        {status === 'error' && error && <p className="m-0 text-destructive">{error}</p>}
        {response ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge color={statusColor(String(response.status))} size="sm">
                {response.status}
              </Badge>
              {response.statusText && (
                <span className="text-muted-foreground">{response.statusText}</span>
              )}
              <span className="text-muted-foreground text-xs">
                {labels.apiElapsed.replace('{ms}', () => String(response.elapsed))}
              </span>
            </div>
            {response.headers.length > 0 && (
              <Expandable title={labels.apiResponseHeaders}>
                <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-xs">
                  {response.headers.map(([key, value]) => (
                    <div key={key} className="contents">
                      <dt className="text-muted-foreground">{key}</dt>
                      <dd className="m-0 break-all text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Expandable>
            )}
            <CodeBlock
              data-language={response.json ? 'json' : 'text'}
              data-title={labels.apiResponseBody}
              data-line-count={String(response.body.split('\n').length)}
              className="text-xs"
            >
              <code className={response.json ? 'language-json' : 'language-text'}>
                {response.body || ' '}
              </code>
            </CodeBlock>
          </>
        ) : (
          status !== 'error' && <p className="m-0 text-muted-foreground">{labels.apiNoResponse}</p>
        )}
      </div>
    </form>
  );
}
