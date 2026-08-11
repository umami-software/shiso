# Releasing Shiso

`create-shiso-app` is the public npm package in this repository. Its versions follow
[Semantic Versioning](https://semver.org/) and use tags in the form
`create-shiso-app-vX.Y.Z`. The root application's version is independent and is not
published to npm.

## Prepare a release

1. Update the package version without creating a commit or tag:

   ```bash
   pnpm --dir packages/create-shiso-app version patch --no-git-tag-version
   ```

   Use `minor`, `major`, or an explicit version when appropriate. Prerelease versions such
   as `0.2.0-beta.1` publish under npm's `next` tag; other versions publish under `latest`.

2. Add a dated section for that exact version to
   `packages/create-shiso-app/CHANGELOG.md`:

   ```markdown
   ## 0.2.0 - 2026-08-09

   ### Added

   - Describe the user-visible change.
   ```

3. Run the release checks:

   ```bash
   pnpm release:check
   pnpm test:create-app
   ```

4. Merge the version and changelog changes into `master`. From that reviewed commit, create
   and push the matching tag:

   ```bash
   git tag -a create-shiso-app-v0.2.0 -m "create-shiso-app 0.2.0"
   git push origin create-shiso-app-v0.2.0
   ```

The tag starts `.github/workflows/release.yml`. The workflow revalidates the tag, changelog,
tests, production build, and packed starter project; publishes the exact tarball to npm with
provenance; and creates a GitHub release with that tarball attached.

Versions are immutable. If a published release is broken, prepare a new patch release instead
of moving or reusing its tag.

## One-time npm bootstrap

npm only allows a trusted publisher to be configured after a package exists. For the first
release only:

1. Complete the normal preparation and merge the release commit.
2. Authenticate to npm locally with an owner account protected by two-factor authentication.
3. From the release commit, run:

   ```bash
   pnpm --dir packages/create-shiso-app publish --access public
   ```

4. In the npm settings for `create-shiso-app`, configure a GitHub Actions trusted publisher:

   - Organization: `umami-software`
   - Repository: `shiso`
   - Workflow filename: `release.yml`
   - Environment name: `npm`
   - Allowed action: npm publish

5. Create and push the matching release tag. The workflow detects that the version is already
   on npm, skips republishing it, and creates the GitHub release.

After verifying the first automated OIDC release, configure npm to require two-factor
authentication and disallow token-based publishing. No npm token is required by the release
workflow. Configure the matching GitHub `npm` environment with required reviewers if releases
should require manual approval.
