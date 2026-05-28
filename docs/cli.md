# CLI (`@rollbar-toolkit/cli`)

## Purpose

Use this guide when changing `packages/cli/` — adding/modifying commands, changing output formatting, working with `agent-context`, or touching flag conventions.

## Policy

- **`commands.ts` / `impl.ts` split per resource.** Each `packages/cli/src/commands/<resource>/` directory has exactly two files:
  - `commands.ts` — Stricli command metadata (flags, brief/help text, route map exports)
  - `impl.ts` — Handler logic that receives the injected `RollbarClient` from `LocalContext`
  Do not collapse these into one file; the split keeps metadata parseable and impl unit-testable.
- **Inject the client via `LocalContext`.** Never instantiate `RollbarClient` inside a command handler. The middleware in `packages/cli/src/context.ts` resolves config (honoring `--token` overrides) and provides `client` on the context.
- **All output flows through `output.ts`.** Use `writeOutput(stdout, data, flags)` with `outputFlagDefs` spread into the command's flag definitions. Default format is TOON; `--json` switches to JSON. Do not `console.log` API data.
- **Truncation hints come for free.** `output.ts` `addTruncationHint()` inspects responses with `total_count` and `items|instances|deploys` arrays and appends `truncated/total/hint` when the response is paged-short. Preserve those array key names when shaping new SDK responses, or extend the helper.
- **Every command accepts `--token`.** Already wired through `LocalContext`; new commands inherit it without extra code.
- **Wire new routes in `app.ts`.** Top-level routes go in the `routes` map in `packages/cli/src/app.ts`. Resource subcommands export a `<resource>Routes` route map from their `commands.ts`.
- **Agent-native by default.** No interactive prompts. Mutations (none today, but when added) must support `--dry-run` and `--idempotency-key` per the cross-toolkit standard in `/Users/spenser/Code/Toolkits/CLAUDE.md`.

## Implementation notes

- **`agent-context` command:** Already wired at top-level. It emits the full route/flag schema as JSON so agents can introspect available operations without parsing help text. When adding commands, the schema picks them up automatically via Stricli — no manual entry needed.
- **`bin.ts` vs `app.ts`:** `bin.ts` is the entrypoint that calls `app.run()`. `app.ts` builds the route tree. Add routes to `app.ts`, not `bin.ts`.
- **Stricli flag kinds:** Use `"boolean"`, `"parsed"` (with a parser function), or `"enum"` for typed values. Mirror the patterns already in `commands/items/commands.ts` rather than inventing new shapes.
- **Source imports use `.js` extensions** even for sibling `.ts` files (`./commands.js`, `../../output.js`). This is the project-wide convention.
- **Error handling:** Let typed SDK errors propagate; the CLI shell catches them and exits with the appropriate code. Do not wrap in `try/catch` inside handlers unless you have a reason to convert or annotate.

## Adding a command quickly

1. Create `packages/cli/src/commands/<resource>/commands.ts` and `impl.ts`
2. In `commands.ts`, define the command with `buildCommand({ ... })` and export a `<resource>Routes` route map (or single command if no subroutes)
3. In `impl.ts`, write `async function handler(this: LocalContext, flags, ...positional) { const data = await this.client.<sdkMethod>(...); writeOutput(this.process.stdout, data, flags); }`
4. Wire the route into `app.ts`

For the full SDK→CLI→MCP flow, follow `.agents/skills/add-api-operation/SKILL.md`.

## Related docs

- `docs/sdk.md` — The SDK methods CLI handlers call
- `docs/mcp.md` — The MCP server mirrors many of these commands as tools
- `.agents/skills/add-api-operation/SKILL.md` — End-to-end workflow
