import { ApiPlayground } from '@/components/ApiPlayground';
import { CodeBlock } from '@/components/CodeBlock';
import { Badge } from '@/components/docs/Badge';
import { CodeGroup } from '@/components/docs/CodeGroup';
import { Expandable } from '@/components/docs/Expandable';
import { PropertiesTable } from '@/components/docs/PropertiesTable';
import { useLabels } from '@/lib/label-context';
import {
  getOperationSections,
  securityFieldName,
  securityForLocation,
  statusColor,
} from '@/lib/openapi';
import type {
  NormalizedOperation,
  ReferenceSection,
  SchemaNode,
  SecurityScheme,
  ThemeLabels,
} from '@/lib/types';
import { securityPlaceholder } from '../../scripts/lib/request-samples.mjs';

function FieldChildren({ node }: { node: SchemaNode }) {
  const labels = useLabels();
  return (
    <>
      {node.description}
      {node.enum && node.enum.length > 0 && (
        <div className="mt-1">
          {labels.fieldOptions}{' '}
          {node.enum.map((value, index) => (
            <span key={value}>
              {index > 0 && ', '}
              <code>{value}</code>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function schemaDetails(node: SchemaNode, labels: ThemeLabels) {
  if (!node.children?.length) return undefined;

  return (
    <Expandable
      title={
        node.type === 'oneOf' || node.type === 'anyOf' ? labels.allowedTypes : labels.properties
      }
    >
      <SchemaTable nodes={node.children} />
    </Expandable>
  );
}

function SchemaTable({ nodes }: { nodes: SchemaNode[] }) {
  const labels = useLabels();
  return (
    <PropertiesTable>
      {nodes.map(node => (
        <PropertiesTable.Row
          key={node.name || node.type}
          name={node.name || node.type}
          type={node.type}
          required={node.required}
          deprecated={node.deprecated}
          default={node.default}
          details={schemaDetails(node, labels)}
        >
          <FieldChildren node={node} />
        </PropertiesTable.Row>
      ))}
    </PropertiesTable>
  );
}

/** Renders a schema tree: a root object's properties, or the node itself. */
function SchemaFields({ node }: { node: SchemaNode }) {
  const isUnion = node.type === 'oneOf' || node.type === 'anyOf';
  return (
    <SchemaTable nodes={!node.name && !isUnion && node.children?.length ? node.children : [node]} />
  );
}

function HighlightedCode({
  language,
  title,
  html,
  source,
  lineCount,
}: {
  language: string;
  title?: string;
  html?: string;
  source: string;
  lineCount?: number;
}) {
  return (
    <CodeBlock
      data-language={language}
      data-title={title}
      data-line-count={lineCount ? String(lineCount) : undefined}
    >
      {html ? (
        // Highlighted at build time by the openapi generator; same markup as
        // the rehype-shiki pipeline produces for fenced code blocks.
        <code
          className={`language-${language}`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: build-time generated markup from the project's own OpenAPI spec.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <code className={`language-${language}`}>{source}</code>
      )}
    </CodeBlock>
  );
}

/** How a credential is sent, e.g. "Bearer <token>" or "<api-key>". */
function credentialExample(scheme: SecurityScheme): string {
  const placeholder = securityPlaceholder(scheme);
  if (scheme.type === 'apiKey') return placeholder;
  const prefix =
    scheme.type === 'http' && scheme.scheme && scheme.scheme !== 'bearer'
      ? scheme.scheme.charAt(0).toUpperCase() + scheme.scheme.slice(1)
      : 'Bearer';
  return `${prefix} ${placeholder}`;
}

export interface OpenApiOperationProps {
  operation: NormalizedOperation;
  /** Renders the "Try it" panel ahead of the reference; carries the proxy setting. */
  playground?: { proxy?: string } | false;
  sections?: ReferenceSection[];
}

/** The generated reference for one API operation, rendered under the page body. */
export function OpenApiOperation({
  operation,
  playground: requested = false,
  sections: preparedSections,
}: OpenApiOperationProps) {
  const labels = useLabels();
  const plan =
    preparedSections ?? getOperationSections(operation, { labels, playground: !!requested });
  const sections = new Map(plan.map(section => [section.kind, section]));
  const playgroundSection = sections.get('playground');
  const playground = playgroundSection && requested;
  const parameterSections = plan.filter(section => section.kind === 'parameters');
  const requestBody = sections.get('request-body');
  const responses = sections.get('responses');
  const samples = sections.get('code-samples');

  return (
    <div className="docs-markdown">
      {playground && playgroundSection && (
        <section>
          <h2 id={playgroundSection.id}>{playgroundSection.name}</h2>
          <ApiPlayground operation={operation} proxy={playground.proxy} />
        </section>
      )}
      {parameterSections.map(({ location, name, id }) => (
        <section key={location}>
          <h2 id={id}>{name}</h2>
          <PropertiesTable>
            {securityForLocation(operation, location).map(scheme => (
              <PropertiesTable.Row
                key={`security:${scheme.name}`}
                name={securityFieldName(scheme)}
                type="string"
                required
              >
                {scheme.description || labels.apiCredentials}{' '}
                <code>{credentialExample(scheme)}</code>.
              </PropertiesTable.Row>
            ))}
            {operation.parameters[location].map(parameter => (
              <PropertiesTable.Row
                key={parameter.name}
                name={parameter.name || parameter.type}
                type={parameter.type}
                required={parameter.required}
                deprecated={parameter.deprecated}
                default={parameter.default}
                details={schemaDetails(parameter, labels)}
              >
                <FieldChildren node={parameter} />
              </PropertiesTable.Row>
            ))}
          </PropertiesTable>
        </section>
      ))}
      {requestBody && operation.requestBody && (
        <section>
          <h2 id={requestBody.id}>{requestBody.name}</h2>
          <SchemaFields node={operation.requestBody.schema} />
          {operation.requestBody.example && (
            <HighlightedCode
              language="json"
              title={labels.apiExampleRequest}
              html={operation.requestBody.exampleHtml}
              source={operation.requestBody.example}
            />
          )}
        </section>
      )}
      {responses && (
        <section>
          <h2 id={responses.id}>{responses.name}</h2>
          {operation.responses.map(response => (
            <div key={response.status} className="mt-6 first:mt-0">
              <div className="flex items-center gap-2">
                <Badge color={statusColor(response.status)} size="sm">
                  {response.status}
                </Badge>
                {response.description && (
                  <span className="text-muted-foreground text-sm">{response.description}</span>
                )}
              </div>
              {response.schema && <SchemaFields node={response.schema} />}
              {response.example && (
                <HighlightedCode
                  language="json"
                  title={labels.apiExampleResponse.replace('{status}', () => response.status)}
                  html={response.exampleHtml}
                  source={response.example}
                />
              )}
            </div>
          ))}
        </section>
      )}
      {samples && (
        <section>
          <h2 id={samples.id}>{samples.name}</h2>
          <CodeGroup>
            {operation.samples.map(sample => (
              <HighlightedCode
                key={sample.language}
                language={sample.language}
                title={sample.label}
                html={sample.html}
                source={sample.source}
                lineCount={sample.lineCount}
              />
            ))}
          </CodeGroup>
        </section>
      )}
    </div>
  );
}
