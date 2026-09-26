import { CodeBlock } from '@/components/CodeBlock';
import { Badge } from '@/components/docs/Badge';
import { CodeGroup } from '@/components/docs/CodeGroup';
import { Expandable } from '@/components/docs/Expandable';
import { PropertiesTable } from '@/components/docs/PropertiesTable';
import { useLabels } from '@/lib/label-context';
import { operationParameterSections, operationSections, statusColor } from '@/lib/openapi';
import type { NormalizedOperation, SchemaNode, ThemeLabels } from '@/lib/types';

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

export interface OpenApiOperationProps {
  operation: NormalizedOperation;
}

/** The generated reference for one API operation, rendered under the page body. */
export function OpenApiOperation({ operation }: OpenApiOperationProps) {
  const labels = useLabels();
  const sectionEntries = operationSections(operation);
  const sections = new Map(sectionEntries.map(entry => [entry.name, entry.id]));

  return (
    <div className="docs-markdown">
      {operationParameterSections(operation, labels).map(({ location, name }, index) => (
        <section key={location}>
          <h2 id={sectionEntries[index].id}>{name}</h2>
          <PropertiesTable>
            {location === 'header' && operation.security.length > 0 && (
              <PropertiesTable.Row name="Authorization" type="string" required>
                {labels.apiCredentials} <code>Bearer &lt;token&gt;</code>.
              </PropertiesTable.Row>
            )}
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
      {operation.requestBody && (
        <section>
          <h2 id={sections.get('Request body')}>{labels.apiRequestBody}</h2>
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
      {operation.responses.length > 0 && (
        <section>
          <h2 id={sections.get('Responses')}>{labels.apiResponses}</h2>
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
      {operation.samples.length > 0 && (
        <section>
          <h2 id={sections.get('Code samples')}>{labels.apiCodeSamples}</h2>
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
