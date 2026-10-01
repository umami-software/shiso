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

**Navigation scope**:
The documentation navigation for one version, one language, or one version
within a language. A site without versions or languages has one default scope.
Each documentation page belongs to one scope; its content path determines its URL.
_Avoid_: Route prefix, when referring to a scope.
