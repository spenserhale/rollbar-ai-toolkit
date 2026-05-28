# AGENTS.md

## Purpose

Rollbar Toolkit is a VitePlus monorepo providing three AI-first integrations for the [Rollbar](https://rollbar.com) API: a typed SDK (`@rollbar-toolkit/sdk`), a Stricli CLI (`rollbar`), and a FastMCP stdio server (`rollbar-mcp`). The SDK is the source of truth — CLI and MCP are thin wrappers. This file is the router for AI coding agents working in this repo; read the linked policy docs only when your task touches that domain.

For cross-toolkit conventions shared with sibling toolkits (claude/cloudflare/invoca/salesforce/sendgrid/totango/zendesk), see `/Users/spenser/Code/Toolkits/CLAUDE.md`. This file covers Rollbar-specific details only.

## Quick start

```bash
bun install                                       # install workspace deps (also symlinks root .env into each package)
vp test                                           # run all Vitest tests
vp check                                          # lint (Oxlint) + format (Oxfmt) + typecheck
vp dev --filter @rollbar-toolkit/cli -- items list   # run CLI from source
vp dev --filter @rollbar-toolkit/mcp              # run MCP server in stdio mode
bun run build                                     # bundle to dist/rollbar-cli.js + dist/rollbar-mcp.js
bun run compile                                   # standalone binaries: dist/rollbar, dist/rollbar-mcp
bun run docs:generate                             # regenerate packages/api-docs/docs/ (OpenAPI → md)
bun run docs:import                               # refresh docs/api/ from docs.rollbar.com (llms.txt + .md)
```

Configure via `.env` at the repo root (copy from `.env.example`) — `ROLLBAR_PROJECT_TOKEN`, `ROLLBAR_ACCOUNT_TOKEN`, `ROLLBAR_PROJECT_ID`, `ROLLBAR_BASE_URL`. The `bun install` postinstall hook symlinks the root `.env` into each `packages/*/.env` so commands work regardless of cwd.

## Repo layout

```
packages/sdk/          Zod schemas, RollbarClient, config, typed errors — foundation
packages/cli/          Stricli CLI; commands/<resource>/{commands,impl}.ts split
packages/mcp/          FastMCP stdio server; tools registered in src/tools/resources.ts
packages/api-docs/     Generates packages/api-docs/docs/ from Rollbar's OpenAPI spec
packages/docs-import/  Python (uv) importer; fetches Rollbar's llms.txt + .md pages into docs/api/
scripts/               link-env.sh, install.sh
ref/                   Reference Python/JS implementations (gitignored, do not modify)
docs/                  Agent + human policy docs (this layer) + imported Rollbar docs
  ├── sdk.md, cli.md, mcp.md, testing.md    # policy docs for this toolkit
  └── api/                                   # imported snapshot of docs.rollbar.com (do not hand-edit)
.agents/skills/        Repeatable agent workflows
```

### `docs/api/` — imported Rollbar reference

`bun run docs:import` populates `docs/api/` from Rollbar's [llms.txt](https://llmstxt.org/) manifest + the `<page>.md` endpoints that readme.io serves natively. Layout mirrors URL paths:

- `docs/api/llms.txt` — the original manifest (titles, URLs, one-line descriptions; great starting point for navigation)
- `docs/api/docs/<slug>.md` — Rollbar guides (SDKs, integrations, account setup, etc.)
- `docs/api/reference/<slug>.md` — Rollbar REST API reference pages

This is a committed snapshot — grep it freely, but do not hand-edit. To refresh, run `bun run docs:import` (incremental; add `-- --force` to re-fetch existing files). The separate `packages/api-docs/docs/` is the machine-readable OpenAPI 3.0 spec for the same API; prefer it when you need exact schemas, `docs/api/reference/` when you need prose explanations and examples.

## Progressive disclosure

Before editing, check whether the task touches one of these areas and read the referenced doc first:

- SDK changes (types, client, config, errors): read `docs/sdk.md`
- CLI changes (commands, flags, output format, agent-context): read `docs/cli.md`
- MCP changes (tool registration, schemas, stdio): read `docs/mcp.md`
- Writing or updating tests: read `docs/testing.md`

## Skills

Use `.agents/skills/` when the task matches a documented workflow:

- `.agents/skills/add-api-operation/` — Add a new Rollbar API operation end-to-end (SDK → CLI → MCP)

## Done criteria

Before finishing any task:

- Run `vp check` and fix lint/format/type failures before declaring done
- Run `vp test` for any SDK change; add a test alongside SDK behavior changes
- If a check was skipped, say why
- When CLI flags, output shape, or MCP tool surfaces change, update `README.md` and the relevant policy doc
- Flag risky assumptions explicitly — especially anything about Rollbar API behavior that isn't reflected in `packages/api-docs/docs/` or `docs/api/`
