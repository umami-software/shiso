import { CodeBlock } from '@/components/CodeBlock';
import { Badge } from '@/components/docs/Badge';
import { CodeGroup } from '@/components/docs/CodeGroup';
import { Expandable } from '@/components/docs/Expandable';
import { ParamField } from '@/components/docs/ParamField';
import { ResponseField } from '@/components/docs/ResponseField';
import { operationSections, statusColor } from '@/lib/openapi';
import type { NormalizedOperation, SchemaNode } from '@/lib/types';

type ParamLocation = 'path' | 'query' | 'header' | 'cookie';

const PARAM_LOCATIONS: ParamLocation[] = ['path', 'query', 'header', 'cookie'];

function FieldChildren({ node }: { node: SchemaNode }) {
  return (
    <>
      {node.description}
      {node.enum && node.enum.length > 0 && (
        <div className="mt-1">
          Options:{' '}
          {node.enum.map((value, index) => (
            <span key={value}>
              {index > 0 && ', '}
              <code>{value}</code>
            </span>
          ))}
        </div>
      )}
      {node.children && node.children.length > 0 && (
        <Expandable title="properties">
          {node.children.map(child => (
            <SchemaField key={child.name || child.type} node={child} />
          ))}
        </Expandable>
      )}
    </>
  );
}

function SchemaField({ node }: { node: SchemaNode }) {
  return (
    <ResponseField
      name={node.name || node.type}
      type={node.name ? node.type : undefined}
      required={node.required}
      deprecated={node.deprecated}
      default={node.default}
    >
      <FieldChildren node={node} />
    </ResponseField>
  );
}

/** Renders a schema tree: a root object's properties, or the node itself. */
function SchemaFields({ node }: { node: SchemaNode }) {
  if (!node.name && node.children?.length) {
    return (
      <>
        {node.children.map(child => (
          <SchemaField key={child.name || child.type} node={child} />
        ))}
      </>
    );
  }

  return <SchemaField node={node} />;
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
  const sections = new Map(operationSections(operation).map(entry => [entry.name, entry.id]));
  const showParameters = sections.has('Parameters');

  return (
    <div className="docs-markdown">
      {showParameters && (
        <section>
          <h2 id={sections.get('Parameters')}>Parameters</h2>
          {operation.security.length > 0 && (
            <ParamField header="Authorization" type="string" required>
              Authentication credentials, e.g. <code>Bearer &lt;token&gt;</code> (
              {operation.security.join(', ')}).
            </ParamField>
          )}
          {PARAM_LOCATIONS.map(location =>
            operation.parameters[location].map(parameter => (
              <ParamField
                key={`${location}-${parameter.name}`}
                {...{ [location]: parameter.name }}
                type={parameter.type}
                required={parameter.required}
              >
                <FieldChildren node={{ ...parameter, name: undefined, description: undefined }} />
                {parameter.description}
              </ParamField>
            )),
          )}
        </section>
      )}
      {operation.requestBody && (
        <section>
          <h2 id={sections.get('Request body')}>Request body</h2>
          <SchemaFields node={operation.requestBody.schema} />
          {operation.requestBody.example && (
            <HighlightedCode
              language="json"
              title="Example request"
              html={operation.requestBody.exampleHtml}
              source={operation.requestBody.example}
            />
          )}
        </section>
      )}
      {operation.responses.length > 0 && (
        <section>
          <h2 id={sections.get('Responses')}>Responses</h2>
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
                  title={`${response.status} example`}
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
          <h2 id={sections.get('Code samples')}>Code samples</h2>
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
