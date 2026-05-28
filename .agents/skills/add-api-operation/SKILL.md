---
name: add-api-operation
description: Add a new Rollbar API operation end-to-end — SDK types, client method, exports, CLI command, MCP tool. Use when the user asks to expose a Rollbar endpoint that isn't already wired through the toolkit.
---

# Add a Rollbar API operation (SDK → CLI → MCP)

## When to use

The user wants to expose a Rollbar API endpoint not yet covered by the toolkit, or extend an existing surface (e.g., new query params on `listItems`). Confirm the endpoint exists by checking:

- `packages/api-docs/docs/` — generated OpenAPI 3.0 reference (exact schemas)
- `docs/api/reference/` — Rollbar's own prose docs (examples, edge cases)
- `docs/api/llms.txt` — quick index of all available pages

## Pre-flight

1. Identify the endpoint's scope: **project** (uses `ROLLBAR_PROJECT_TOKEN`) or **account** (uses `ROLLBAR_ACCOUNT_TOKEN`). The OpenAPI spec's auth requirement tells you; if unclear, check `packages/api-docs/docs/openapi.json` for the operation's `security` block.
2. Pick a resource name (singular noun) that maps cleanly to existing CLI subroutes (e.g., `items`, `deploys`, `users`). Reuse an existing resource directory if the operation belongs to one.

## Steps

### 0. Pull reference material

Read both the OpenAPI schema (`packages/api-docs/docs/<resource>/<operation>.md`) and Rollbar's prose docs (`docs/api/reference/<slug>.md`) for the operation. The OpenAPI gives you exact param/response shapes; the prose docs often clarify ambiguous fields and show real-world examples.

### 1. SDK types (`packages/sdk/src/types.ts`)

- Add a Zod schema for request params if the operation takes any: `export const ListThingsParamsSchema = z.object({ ... })` and `export type ListThingsParams = z.infer<typeof ListThingsParamsSchema>`.
- Add a Zod schema for the response: `export const ThingSchema = z.object({ ... })`, plus the list-result envelope if it's a list operation (mirror `ListItemsResultSchema`).
- Reuse existing primitives (`RollbarLevel`, `RollbarStatus`, etc.) — do not redeclare.

### 2. SDK client method (`packages/sdk/src/client.ts`)

- Add a method to the `RollbarClient` class. Pick the right helper:
  - **project-scoped** → `this.projectRequest<ResultType>(method, path, body?)`
  - **account-scoped** → `this.accountRequest<ResultType>(method, path, body?)`
- Method name mirrors the operation: `listThings`, `getThing`, `getThingByX`, `createThing`, etc.
- Build the path with the SDK config — never hardcode `https://api.rollbar.com`. Use `path` argument starting with `/`.
- Validate params with the Zod schema before sending if the schema is non-trivial.

### 3. SDK exports (`packages/sdk/src/index.ts`)

- Export any new types that CLI / MCP need (`ListThingsParams`, `Thing`, etc.).
- Do not export internal helpers.

### 4. SDK test (`packages/sdk/tests/client.test.ts`)

- Add a test that mocks `fetch` and asserts the request URL, method, headers (especially `X-Rollbar-Access-Token`), and that the response is correctly unwrapped from the `{ err, result }` envelope.
- Add an error-path test for 404 → `RollbarNotFoundError` and `err: <nonzero>` → `RollbarError`.

### 5. CLI command (`packages/cli/src/commands/<resource>/`)

If the resource doesn't exist yet, create the directory with both files:

- **`commands.ts`** — Define the command(s) with Stricli's `buildCommand({ ... })`. Spread `outputFlagDefs` into `flags` so `--json` works. Export a `<resource>Routes` route map (or a single command for top-level operations like `agent-context`).
- **`impl.ts`** — Export an `async` handler that takes `this: LocalContext, flags, ...positional`. Call `this.client.<sdkMethod>(...)` and pipe the result through `writeOutput(this.process.stdout, data, flags)`.

If the resource exists, just add the new subcommand to its existing `commands.ts` and a handler to `impl.ts`.

### 6. CLI routing (`packages/cli/src/app.ts`)

- Import the new `<resource>Routes` (or single command) and add it to the top-level `routes` map. Skip this step when adding a subcommand to an existing resource — the resource's own route map already handles it.

### 7. MCP tool (`packages/mcp/src/tools/resources.ts`)

- Add a `server.addTool({ ... })` call inside `registerResourceTools`. Use snake_case for the tool name (`list_things`, `get_thing`).
- Reuse the SDK's Zod params schema for `parameters`.
- The handler: `async (args) => JSON.stringify(await client.<sdkMethod>(args), null, 2)`.

### 8. Documentation

- Update `README.md` CLI table and MCP tools table.
- Update `CLAUDE.md` "API Domains" table.
- If the operation changes how a domain works (new scope, new auth, etc.), update `docs/sdk.md` and `docs/cli.md`.

## Verification

```bash
vp check                                                   # lint + format + types
vp test                                                    # all SDK tests pass
vp dev --filter @rollbar-toolkit/cli -- <resource> <op>    # smoke-test the CLI path
npx fastmcp inspect packages/mcp/src/index.ts              # confirm the MCP tool registered
```

For the CLI smoke test you'll need real env vars in `.env`. If running in CI or without credentials, skip the live smoke test and rely on `vp test`.

## Common pitfalls

- **Wrong scope:** Using `projectRequest` for an account endpoint (or vice versa) returns 401. Re-check the OpenAPI spec.
- **Forgot to export from `src/index.ts`:** CLI/MCP type imports break with "module has no exported member".
- **Inlined the API base URL:** Tests using `ROLLBAR_BASE_URL` (or a mock URL) fail. Always go through the SDK config.
- **Skipped `outputFlagDefs`:** Command works but `--json` does nothing — agents can't get machine-readable output.

## Related

- `docs/sdk.md` — SDK conventions
- `docs/cli.md` — CLI conventions
- `docs/mcp.md` — MCP conventions
- `docs/testing.md` — Test conventions
