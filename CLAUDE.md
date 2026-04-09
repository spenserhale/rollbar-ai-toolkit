# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

VitePlus monorepo providing an SDK, CLI, and MCP server for the Rollbar API. Uses Bun as the runtime/package manager.

## Commands

```bash
bun install              # Install dependencies
vp test                  # Run tests (Vitest)
vp check                 # Lint and format
vp lint                  # Lint only (Oxlint)
vp format                # Format only (Oxfmt)

# Dev mode
vp dev --filter @rollbar-toolkit/cli -- items list
vp dev --filter @rollbar-toolkit/mcp

# Bundle to single JS files (requires bun to run)
bun run build            # → dist/rollbar-cli.js, dist/rollbar-mcp.js
bun run build:cli        # CLI only
bun run build:mcp        # MCP only

# Compile to standalone binaries (no runtime needed)
bun run compile          # → dist/rollbar, dist/rollbar-mcp
bun run compile:cli      # CLI only
bun run compile:mcp      # MCP only

# Inspect MCP server
npx fastmcp inspect packages/mcp/src/index.ts
```

## Architecture

```
packages/sdk/    → Foundation: types (Zod schemas), API client, config, errors
    ↑       ↑
    │       │
packages/cli/   packages/mcp/
(Stricli)       (FastMCP, stdio)
```

- **SDK** (`@rollbar-toolkit/sdk`): `RollbarClient` with project-scoped and account-scoped request helpers. Auth via `X-Rollbar-Access-Token` header. All responses unwrapped from Rollbar's `{ err, result }` envelope. Config resolves from env vars via `resolveConfig()`.
- **CLI** (`@rollbar-toolkit/cli`): Stricli app with route-based command structure. Commands live in `packages/cli/src/commands/<resource>/` with separate `commands.ts` (Stricli definitions) and `impl.ts` (logic) files. Uses `LocalContext` from `context.ts` to inject the SDK client. Each command accepts a `--token` flag to override the default token.
- **MCP** (`@rollbar-toolkit/mcp`): FastMCP server running in stdio mode. Tools registered via `registerResourceTools(server)` in `packages/mcp/src/tools/resources.ts`.

Both CLI and MCP are thin wrappers—business logic belongs in the SDK.

## API Domains

| Domain | Scope | CLI commands | MCP tools |
|--------|-------|-------------|-----------|
| Items | project | list, get, get-by-counter, get-by-uuid | list_items, get_item, get_item_by_counter |
| Occurrences | project | list, get | list_occurrences, get_occurrence |
| Projects | account | list, get | list_projects, get_project |
| Deploys | project | list, get | list_deploys, get_deploy |
| Environments | project | list | list_environments |
| Users | account | list, get | list_users, get_user |

## Adding a New API Operation

1. Add Zod schemas and types to `packages/sdk/src/types.ts`
2. Add client method to `packages/sdk/src/client.ts` (use `projectRequest` or `accountRequest`)
3. Export new types/schemas from `packages/sdk/src/index.ts`
4. Add CLI command in `packages/cli/src/commands/<resource>/` (commands.ts + impl.ts)
5. Wire route in `packages/cli/src/app.ts`
6. Add MCP tool in `packages/mcp/src/tools/resources.ts`

## Reference Material

`ref/` and `references/` (gitignored) contain an existing Rollbar CLI, Python SDK, and API docs for reference when implementing new operations.

## Environment

Two token types required depending on operations used:
- `ROLLBAR_PROJECT_TOKEN` — for items, occurrences, deploys, environments
- `ROLLBAR_ACCOUNT_TOKEN` — for projects, users
- `ROLLBAR_BASE_URL` — optional, defaults to `https://api.rollbar.com/api/1`

See `.env.example`.
