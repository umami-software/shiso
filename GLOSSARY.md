# Shiso

Shiso turns authored documentation and OpenAPI descriptions into a documentation site.

## Language

**OpenAPI project**:
The set of OpenAPI specs configured for one documentation site, including their operations,
webhooks, and named schemas. An operation or schema shared by several specs needs its spec
name to identify it unambiguously.
_Avoid_: Spec, when referring to the complete set.

**Reference page**:
A documentation page bound to an OpenAPI operation, webhook, or named schema,
with generated reference sections following its authored content.
_Avoid_: Endpoint page, when including webhook and schema pages.
