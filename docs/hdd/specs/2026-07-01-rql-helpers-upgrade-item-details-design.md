# Design: `upgrade` command, item-details docs, and RQL helpers

**Date:** 2026-07-01
**Status:** Approved (pending spec review)

## Overview

Five related additions to the Rollbar toolkit, spanning the CLI, SDK, MCP, and
README:

1. A self-`upgrade` command (port from cloudflare-toolkit) so the standalone
   binary can update itself.
2. Documentation for the already-built `item-details` command surface.
3. Confirming/round-tripping the existing "run RQL" flow.
4. A generic RQL helper that runs an arbitrary query and optionally hydrates the
   returned items to full item-details.
5. Two convenience RQL helpers: search-by-URL and affected-users.

Items 1, 4, and 5 involve code. Items 2 and 3 are documentation/verification.

All new API logic lives in the SDK (`packages/sdk`); the CLI and MCP packages are
thin consumers, per the three-layer architecture.

---

## 1. `rollbar upgrade` — self-update

Port `cloudflare-toolkit/packages/cli/src/commands/upgrade.ts` (and its test) into
`rollbar-toolkit/packages/cli/src/commands/upgrade.ts`, with these substitutions:

- `REPO = "spenserhale/rollbar-toolkit"`
- Asset name prefix `rollbar-*` (matches CI release assets:
  `rollbar-linux-x64`, `rollbar-linux-arm64`, `rollbar-darwin-x64`,
  `rollbar-darwin-arm64`, `rollbar-windows-x64.exe`, each with a `.sha256`).
- `isCompiledBinary` basename check `=== "rollbar"`.
- Version comes from `packages/cli/package.json`.

Behavior (unchanged from the source):

- Flags: `--check` (report only), `--force` (reinstall latest), `--version <v>`
  (install a specific tag).
- Refuses politely when not running as the compiled binary (node/bun/npx),
  printing npm/bun install hints.
- Downloads the platform asset + its `.sha256`, verifies the digest, writes to a
  temp file in the same dir, then atomically swaps (with the Windows `.old`
  rename dance).
- Wire `upgrade: upgradeCommand` into `packages/cli/src/app.ts`.

**Impl dependency to verify:** whether `scripts/install.sh` exists in this repo to
reference in the "switch to the standalone binary" hint. If it does not exist,
drop that line from the error text (do not fabricate a URL).

**Not in scope:** the MCP server does not get an upgrade tool (a model has no
business swapping its own binary).

---

## 2. Item-details documentation

No code change. The `item-details` route already exists in the CLI
(`item-details get <id>`, `get-by-counter <n>`, `top`) and is exposed in MCP
(`get_item_detailed`, `list_top_item_details`). These return the item **plus its
latest occurrence and full stack trace**, with `--include-vars` to include frame
locals (which may contain secrets).

The README currently documents only the leaner `items` route (metadata only) and
even mislabels a couple of lines. Update the README CLI section to:

- Add an `item-details` subsection that clearly distinguishes it from `items`:
  `items *` returns item metadata; `item-details *` returns item + latest
  occurrence + stack trace.
- Show `item-details get`, `get-by-counter`, `top`, and the `--include-vars` flag.
- Fix the existing `items get`/`items top` lines so they no longer imply they
  return occurrences.

---

## 3. Run RQL — already shipped

`rollbar rql jobs create "<sql>" --wait` already submits an RQL job, polls to a
terminal status, and returns rows inline; `rql jobs list|get|results|cancel`
cover the rest of the async lifecycle. No new work here beyond cross-referencing
it from the new `rql query` helper and the README.

---

## 4 & 5. RQL helper commands

RQL is asynchronous: submitting a query returns a job id, which must be polled
until `success`, then its results fetched. The new helpers encapsulate that whole
cycle so the caller gets rows (or enriched items) in a single invocation.

### Command surface

Everything stays grouped under the existing `rql` route:

```
rollbar rql query "<sql>"            Run an arbitrary RQL query end-to-end.
rollbar rql by-url <domain>          Top-N items whose occurrences hit a URL/domain, enriched.
rollbar rql affected-users <item-id> Distinct affected users for an item, with contact details.
rollbar rql jobs create|list|get|results|cancel   Existing async job control (unchanged).
```

### Shared behavior

- **Async handled inline:** each helper submits a job, waits via
  `client.waitForRqlJob` (same defaults as `rql jobs create --wait`), and fetches
  results. Expose `--timeout` (default 300s) and `--poll-interval` (default 1s).
- **LIMIT injection:** every query gets a `LIMIT`. For the builder commands
  (`by-url`, `affected-users`) the SDK constructs the full SQL and appends the
  limit directly. For `rql query`, the SDK appends `LIMIT <n>` **only if the query
  does not already contain a `LIMIT`**.
- **Window injection:** `--window` accepts the human format already used by
  `item-details top` — `<n>{h|d|w|m}` (e.g. `30d`, `1w`, `24h`, `3m`) — and is
  parsed by the SDK's existing `parseWindow`, which returns a minimum unix-epoch
  threshold (`now − period`). Reuse it by exporting `parseWindow` from the SDK.
  - For the builder commands, the SDK adds `timestamp >= <threshold>` to the
    `WHERE` clause.
  - For `rql query`, injecting a timestamp filter into arbitrary user SQL is
    unsafe (it can break `GROUP BY`/`HAVING`/nested clauses). Rule: `rql query`
    **never rewrites the user's `WHERE`**. If `--window` is passed and the query
    text already contains `timestamp`, it is honored silently. If `--window` is
    passed and the query has no `timestamp` reference, the SDK emits a one-line
    stderr warning ("window not applied — add a `timestamp >= …` clause to your
    query to bound it") and runs the query as written. LIMIT injection
    (append-only) is always safe and still applies. This keeps the "always try to
    append a limit and a window" intent while staying honest about what can be
    done safely to arbitrary SQL.

- **Default limits** (all overridable via `--limit`):
  - `rql query`: **100** (the master default)
  - `rql by-url`: **5**
  - `rql affected-users`: **100**

- **Output:** all helpers carry the standard output flags
  (`--toon` default / `--json` / `--csv` / `--deliver`) and honor the exit-code
  taxonomy. Commands that return item-details also accept `--include-vars`.

### `rql query "<sql>"`

- Positional: the RQL string.
- Flags: `--enrich`, `--limit` (100), `--window`, `--include-vars`, `--timeout`,
  `--poll-interval`, plus output + client flags.
- Runs the query end-to-end and returns the result rows.
- With `--enrich`: after fetching rows, detect an `item.counter` or `item.id`
  column, dedupe the ids, and hydrate each to full item-details
  (latest occurrence + stack trace). This is feature #4 — "run a query to get the
  items, then behind the scenes fetch their details." If no item column is present
  in the result set, `--enrich` is a no-op and a stderr warning is emitted.

### `rql by-url <domain>`

- Positional: `<domain>` (any substring of the request URL — a bare domain, a host,
  or a path fragment).
- SQL built by the SDK:
  ```sql
  SELECT item.counter, count(*) AS occurrences
  FROM item_occurrence
  WHERE request.url LIKE '%<domain>%'
    AND timestamp >= <window-threshold>
  GROUP BY item.counter
  ORDER BY occurrences DESC
  LIMIT <limit>
  ```
  (`<domain>` is escaped for the `LIKE` pattern; `%` and `_` and quotes in the
  input are neutralized so it cannot break out of the string literal.)
- After the job completes, each returned `item.counter` is hydrated to full
  item-details via a new SDK method `getItemDetailedByCounter` (which composes the
  existing `getItemByCounter` + `getItemDetailed`). The per-item `occurrences`
  count from the RQL result is attached alongside.
- Default `--limit 5`, `--window` default `30d`.

### `rql affected-users <item-id>`

- Positional: `<item-id>` (the numeric Rollbar item id).
- SQL built by the SDK:
  ```sql
  SELECT person.id, person.username, person.email, count(*) AS occurrences
  FROM item_occurrence
  WHERE item.id = <item-id>
    AND timestamp >= <window-threshold>
  GROUP BY person.id, person.username, person.email
  ORDER BY occurrences DESC
  LIMIT <limit>
  ```
- Returns a distinct list of affected users with `id`, `username`, `email`, and a
  per-user `occurrences` count — a contact list to reach out to once the error is
  resolved. Rows where all person fields are null (anonymous traffic) are kept but
  clearly represent unattributed occurrences.
- Default `--limit 100`, `--window` default `30d`.

---

## SDK design

New/changed in `packages/sdk`:

- **`client.ts`**
  - Export the existing `parseWindow` helper (currently module-private) for reuse
    and unit testing.
  - Add a private `runRqlToRows(queryString, { timeoutMs, initialIntervalMs })`
    that submits a job, waits, fetches results, and returns
    `{ columns, rows }`. All three helpers build on it.
  - Add `getItemDetailedByCounter(counter, params)` = `getItemByCounter` then
    `getItemDetailed` (used by `by-url` and available to `item-details`).
  - Add public methods:
    - `rqlQuery({ queryString, limit, window?, enrich, includeVars, ...waitOpts })`
    - `rqlByUrl({ domain, limit, window, includeVars, ...waitOpts })`
    - `rqlAffectedUsers({ itemId, limit, window, ...waitOpts })`
  - Add SQL-building helpers (pure functions, unit-tested): `buildByUrlQuery`,
    `buildAffectedUsersQuery`, `injectLimit(sql, limit)`,
    `escapeLikePattern(input)`, and a `findItemColumn(columns)` used by `--enrich`.
- **`types.ts`**: Zod schemas / inferred types for the new params and the
  `AffectedUser` result shape (`id`, `username`, `email`, `occurrences`).
- **`index.ts`**: export the new public types.

## CLI design

- New folder `packages/cli/src/commands/rql/` with `commands.ts` (route defs) and
  `impl.ts` (thin handlers), OR extend the existing `rql` route wiring in
  `app.ts`. The `rql` route map gains `query`, `by-url`, and `affected-users`
  alongside the existing `jobs` route.
- Handlers follow the established pattern: build client from flags, call the SDK
  method, `writeOutput`.

## MCP design

Mirror the three SDK helpers as MCP tools in
`packages/mcp/src/tools/resources.ts`:

- `rql_query` (with an `enrich` boolean)
- `rql_by_url`
- `rql_affected_users`

Each stringifies the SDK result, consistent with the existing RQL tools. Include
the LIMIT/window guidance in each tool description.

---

## Error handling

- Reuse the existing typed errors (`RollbarError`, `RollbarAuthError`,
  `RollbarNotFoundError`) and CLI exit-code taxonomy — no new error types.
- A job that reaches a non-`success` terminal state (`failed`, `cancelled`,
  `timed_out`) surfaces the job record with a clear message; the CLI exits with
  the appropriate code.
- Empty result sets are returned as empty lists, not errors.

## Testing

- Port and keep `upgrade.test.ts` (dependency-injected; no real network).
- Unit-test the pure SQL builders and helpers: `buildByUrlQuery`,
  `buildAffectedUsersQuery`, `injectLimit` (present vs absent LIMIT),
  `escapeLikePattern` (quote/`%`/`_` neutralization), `parseWindow` (each unit +
  invalid input), and `findItemColumn`.
- Unit-test the helper methods with a mocked job lifecycle (stub
  `createRqlJob`/`waitForRqlJob`/`getRqlJobResults`) to assert enrichment and
  row-shaping without hitting the API.
- Run the full gate: `vp test && vp check && vp lint && vp format`.

## Documentation

- README: add the `item-details` subsection (item #2) and a `rql query` /
  `rql by-url` / `rql affected-users` block under the RQL section, each with a
  one-line example. Note LIMIT/window defaults.
- `agent-context` output picks up the new commands automatically (it introspects
  the route map); verify it reflects them.

## Out of scope (YAGNI)

- No `--enrich` on the builder commands (they always enrich / always shape).
- No new error taxonomy.
- No MCP `upgrade` tool.
- No pagination on RQL helpers beyond `--limit` (RQL itself is bounded by LIMIT).
