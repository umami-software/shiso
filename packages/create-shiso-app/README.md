# create-shiso-app

Create a new Shiso documentation site without cloning the Shiso repository.

```bash
pnpm dlx create-shiso-app@latest my-docs
```

You can also use npm, Yarn, or Bun:

```bash
npm create shiso-app@latest my-docs
yarn create shiso-app@latest my-docs
bunx create-shiso-app@latest my-docs
```

The CLI copies a minimal starter, installs the upgradeable `@umami/shiso` framework
dependency with the invoking package manager, and initializes a fresh Git
repository without an upstream remote.

Run `create-shiso-app --help` to see all options.
