import { CodeBlock } from '@/components/CodeBlock';
import { Expandable } from '@/components/docs/Expandable';
import { PropertiesTable } from '@/components/docs/PropertiesTable';
import { useLabels } from '@/lib/label-context';
import { schemaSections } from '@/lib/openapi';
import type { SchemaNode, SchemaPage, ThemeLabels } from '@/lib/types';

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

function SchemaTable({ nodes, labels }: { nodes: SchemaNode[]; labels: ThemeLabels }) {
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
          details={
            node.children?.length ? (
              <Expandable
                title={
                  node.type === 'oneOf' || node.type === 'anyOf'
                    ? labels.allowedTypes
                    : labels.properties
                }
              >
                <SchemaTable nodes={node.children} labels={labels} />
              </Expandable>
            ) : undefined
          }
        >
          <FieldChildren node={node} />
        </PropertiesTable.Row>
      ))}
    </PropertiesTable>
  );
}

export interface OpenApiSchemaProps {
  page: SchemaPage;
}

/** The generated reference for one named component schema. */
export function OpenApiSchema({ page }: OpenApiSchemaProps) {
  const labels = useLabels();
  const sections = new Map(schemaSections(page, labels).map(entry => [entry.id, entry.name]));
  const properties = sections.get('properties');
  const example = sections.get('example');

  return (
    <div className="docs-markdown">
      {properties && (
        <section>
          <h2 id="properties">{properties}</h2>
          <SchemaTable nodes={page.schema.children ?? []} labels={labels} />
        </section>
      )}
      {example && page.example && (
        <section>
          <h2 id="example">{example}</h2>
          <CodeBlock data-language="json" data-title={page.name}>
            {page.exampleHtml ? (
              <code
                className="language-json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: build-time generated markup from the project's own OpenAPI spec.
                dangerouslySetInnerHTML={{ __html: page.exampleHtml }}
              />
            ) : (
              <code className="language-json">{page.example}</code>
            )}
          </CodeBlock>
        </section>
      )}
    </div>
  );
}
