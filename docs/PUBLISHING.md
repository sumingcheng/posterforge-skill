# Publishing

PosterForge publishes the npm package named `posterforge`.

## Prerequisites

- An npm account with permission to publish `posterforge`.
- A granular npm automation token.
- The GitHub repository secret `NPM_TOKEN` set to that token.

Create the token in npm:

1. Open npm account settings.
2. Create an access token.
3. Prefer an automation/granular token scoped to this package.
4. Copy the token into GitHub repository settings as `NPM_TOKEN`.

## Release Flow

1. Update `package.json` version.
2. Run local checks:

```bash
pnpm lint
pnpm build
pnpm check
npm pack --dry-run
```

3. Commit the change.
4. Create and publish a GitHub Release.
5. The `Publish` workflow runs `npm publish --provenance --access public`.

The workflow can also be started manually from GitHub Actions after the version has been updated.

## Package Contents

The npm package intentionally includes only:

- CLI entrypoint in `bin/`
- renderer source in `src/`
- examples
- docs
- skill definition
- package metadata and license

Generated build output, local cache, node modules, and screenshots under `dist/` are not published.
