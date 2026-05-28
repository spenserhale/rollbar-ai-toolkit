# CLI (`@rollbar-toolkit/cli`)

## Purpose

Use this guide when changing `packages/cli/` — adding/modifying commands, changing output formatting, working with `agent-context`, or touching flag conventions.

> **Mandatory:** invoke the `agent-native-cli-creator` skill before any CLI change. This doc is the project-specific contract; the skill is the canonical reference for _why_ and for cross-CLI patterns. See `AGENTS.md` § "Mandatory: `agent-native-cli-creator` for any CLI work".

## Policy

### Structural

- **`commands.ts` / `impl.ts` split per resource.** Each `packages/cli/src/commands/<resource>/` directory has exactly two files:
  - `commands.ts` — Stricli command metadata (flags, brief/help text, route map exports)
  - `impl.ts` — Handler logic that receives the injected `RollbarClient` from `LocalContext`
    Do not collapse these into one file; the split keeps metadata parseable and impl unit-testable.
- **Build the client via `buildClientForFlags(flags)`.** Never instantiate `RollbarClient` inline in a handler — call the helper from `packages/cli/src/client-flags.ts`. It honors `--token`, `--profile`, `ROLLBAR_DEFAULT_PROFILE`, and the stored default profile per the documented precedence (explicit flag > env > profile > built-in default). The context (`LocalContext`) carries only `process` — the CLI does not eagerly resolve a client at startup, so `--help` and `agent-context` work without credentials.
- **All output flows through `output.ts`.** Use `writeOutput(stdout, data, flags)` with `outputFlagDefs` spread into the command's flag definitions. Default format is TOON. Do not `console.log` API data.
- **Wire new routes in `app.ts`.** Top-level routes go in the `routes` map in `packages/cli/src/app.ts`. Resource subcommands export a `<resource>Routes` route map from their `commands.ts`.
- **Source imports use `.js` extensions** even for sibling `.ts` files (`./commands.js`, `../../output.js`). Project-wide convention.

### Tier 1 — Table stakes (enforced)

- **Non-interactive by default.** No prompts in normal operation. Destructive ops (none today) must require `--force`; non-destructive confirmations bypass with `--yes`.
- **Structured output triplet.** Every data-returning command supports `--toon` (default), `--json`, and `--csv` via `outputFlagDefs`. Never invent `--format=json`. CSV is supported only on list-style flat outputs — nested-object commands return an enumerated error if `--csv` is passed.
- **stdout vs stderr.** Results to stdout, diagnostics to stderr, ANSI suppressed when stdout isn't a TTY.
- **Exit codes** (taxonomy in `bin.ts`):
  - `0` success · `1` generic API/network · `2` validation/usage · `3` config · `4` not found · `5` auth · `6` rate limited · `0` dry-run success
- **Enumerated errors.** When rejecting input against an enum (status, level, output format, deliver scheme), the error must name the valid set and echo the offending value in quotes. Use the `EnumValueError` helper rather than re-rolling.
- **Bounded responses + actionable truncation hints.** All list commands paginate with `--limit` (default 20) and `--page`. `output.ts` `addTruncationHint()` appends `truncated/total/hint` with the _specific_ narrowing flags the agent should add — not a generic "use filters".
- **Idempotency & dry-run.** Mutations (when added) must accept `--idempotency-key` and `--dry-run` per the cross-toolkit standard.

### Tier 2 — Compounding (enforced)

- **Vocabulary.** Always `get` / `list` / `create` / `update` / `delete`. Never `info` / `show` / `ls` / `add` / `set` / `rm`. Always `--force` (never `--skip-confirmations` / `-y`). Always `--toon` / `--json` / `--csv` (never `--format=`/`-j`). Always `--limit` + `--page` (or `--cursor`), `--profile`, `--dry-run`. Flag display is kebab-case via Stricli's `allow-kebab-for-camel` + `convert-camel-to-kebab` (set in `app.ts`); declare flag keys in camelCase and Stricli renders `--project-id`, `--include-vars`, etc.
- **Three-layer introspection.**
  1. `rollbar --help` / `rollbar <cmd> --help` — human, comes for free from Stricli.
  2. `rollbar agent-context` — machine-readable, JSON, `schema_version`-stamped, **derived from the actual route tree** (no hand-written duplicate). Surfaces commands, flags, exit codes, output formats, deliver sinks, and `available_profiles`.
  3. Skill manifests under `.agents/skills/` — long-form workflows the agent composes from individual commands.
- **Async.** Rollbar API is synchronous, so `--wait` and the job ledger do not apply. If a future endpoint becomes async, add `--wait` + a `jobs` subcommand per the skill.
- **Profiles.** `rollbar profile save|use|list|show|delete`, stored at `~/.rollbar/profiles.json`. Root `--profile <name>` flag with precedence: explicit flag > env var > profile > built-in default. Available profile names are surfaced in `agent-context`.
- **Two-way I/O.**
  - `--deliver=stdout|file:<path>|webhook:<url>` on every data-returning command. File sinks write atomically (temp + rename). Webhook sinks POST and report HTTP status. Unknown schemes return an enumerated error.
  - `rollbar feedback "<text>"` appends to `~/.rollbar/feedback.jsonl`. If `ROLLBAR_FEEDBACK_ENDPOINT` is set, also POST upstream and report status. `rollbar feedback list` reads the local log back.

### Vocabulary lint

The acceptable verbs, flag names, and required flag triplets are listed in this doc. If you find yourself wanting to introduce a new verb (`describe`, `fetch`, `apply`) or a new format flag (`--format=`), the skill explicitly rejects it — bring it up for discussion before coding.

## Implementation notes

- **`agent-context` is derived, not authored.** Its impl walks the Stricli route tree; do not edit a hand-written schema. When you add a command, the schema picks it up automatically. The only thing you may hand-author in `agent-context/impl.ts` is the top-level metadata (exit codes, output formats, deliver sinks).
- **`bin.ts` vs `app.ts`:** `bin.ts` is the entrypoint that calls `app.run()`. `app.ts` builds the route tree and configures `allow-kebab-for-camel` scanner mode.
- **Stricli flag kinds:** Use `"boolean"`, `"parsed"` (with a parser function), or `"enum"` for typed values. For enumerated flags (status, level, output format), prefer `kind: "enum"` so Stricli enforces validity and the help text lists options — fall back to a custom parser that throws `EnumValueError` only when you need cross-flag validation.
- **Error handling:** Let typed SDK errors propagate; `bin.ts` catches and exits with the right code. Throw `ValidationError` (exit 2) for argument-level rejections — do not raw-throw or print to stderr from a handler.

## Adding a command quickly

1. Create `packages/cli/src/commands/<resource>/commands.ts` and `impl.ts`
2. In `commands.ts`, define the command with `buildCommand({ ... })`. Spread `outputFlagDefs` so you get `--toon`/`--json`/`--csv`/`--deliver` for free. Use camelCase flag keys; Stricli renders them as kebab-case.
3. In `impl.ts`, write `async function handler(this: LocalContext, flags, ...positional) { const client = await buildClientForFlags(flags); const data = await client.<sdkMethod>(...); await writeOutput(this.process.stdout, data, flags); }`
4. Wire the route into `app.ts`
5. Run `rollbar agent-context | jq '.commands.<resource>'` to confirm the new command surfaces correctly

For the full SDK→CLI→MCP flow, follow `.agents/skills/add-api-operation/SKILL.md`.

## Related docs

- `docs/sdk.md` — The SDK methods CLI handlers call
- `docs/mcp.md` — The MCP server mirrors many of these commands as tools
- `.agents/skills/add-api-operation/SKILL.md` — End-to-end workflow
- `agent-native-cli-creator` skill (mandatory) — cross-CLI design system
