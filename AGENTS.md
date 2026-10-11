# Project rules

## Before every push

From the repository root, lint and build. Both commands must exit 0. Do not push if either one fails, and do not push while either is still running.

```bash
bun run lint
bun run build
```

`bun run check` runs them in that order.

## Cloudflare install

Workers Builds installs Bun 1.2.15 unless the build variable `BUN_VERSION` is set. This lockfile is version 3, written by Bun 1.4.2, and 1.2.15 rejects it before the site compiles. A passing local build does not prove the Cloudflare install will pass. Keep `packageManager` and `.bun-version` at `1.4.2`, and set the Cloudflare build variable `BUN_VERSION` to `1.4.2`.
