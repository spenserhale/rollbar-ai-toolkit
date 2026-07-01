# Upgrade Command, Item-Details Docs, and RQL Helpers — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use hdd-subagent-driven-development (recommended) or hdd-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-`upgrade` command, document the existing `item-details` surface, and add three RQL helper commands (`rql query`, `rql by-url`, `rql affected-users`) across SDK, CLI, and MCP.

**Architecture:** All API/query logic lives in the SDK (`packages/sdk`); CLI and MCP are thin consumers. New pure query-builders live in a focused `packages/sdk/src/rql.ts` so `client.ts` stays readable. RQL is async — helpers submit a job, poll to `success`, fetch results, and (for `by-url` / `--enrich`) hydrate item rows to full item-details.

**Tech Stack:** TypeScript (ESM, `.js` import specifiers), Stricli (CLI), FastMCP (MCP), Zod (types), Vitest (`vp test`). Node built-ins for the upgrade command.

**Conventions reminder:** source imports use `.js` extensions even for `.ts` files; run the gate `vp test && vp check && vp lint && vp format` before finishing.

---

## File Structure

- `packages/cli/src/commands/upgrade.ts` — **new**, self-update command (ported from cloudflare-toolkit).
- `packages/cli/src/commands/upgrade.test.ts` — **new**, ported unit test.
- `packages/sdk/src/rql.ts` — **new**, pure RQL query-builders + row helpers (unit-tested).
- `packages/sdk/tests/rql.test.ts` — **new**, tests for the pure helpers.
- `packages/sdk/src/client.ts` — **modify**, export `parseWindow`, add `runRqlToRows`, `getItemDetailedByCounter`, `rqlQuery`, `rqlByUrl`, `rqlAffectedUsers`.
- `packages/sdk/src/types.ts` — **modify**, add param + result interfaces.
- `packages/sdk/src/index.ts` — **modify**, export new public types + `rql.ts` helpers.
- `packages/sdk/tests/client.test.ts` — **modify**, add mocked-lifecycle tests for the helper methods.
- `packages/cli/src/commands/rql/commands.ts` — **new**, route defs for `query`/`by-url`/`affected-users`.
- `packages/cli/src/commands/rql/impl.ts` — **new**, thin handlers.
- `packages/cli/src/app.ts` — **modify**, wire `upgrade` and the new `rql` subroutes.
- `packages/mcp/src/tools/resources.ts` — **modify**, add `rql_query`/`rql_by_url`/`rql_affected_users` tools.
- `README.md` — **modify**, document `item-details` and the RQL helpers.

---

## Task 1: Port the `upgrade` command

**Files:**
- Create: `packages/cli/src/commands/upgrade.ts`
- Create: `packages/cli/src/commands/upgrade.test.ts`
- Modify: `packages/cli/src/app.ts`

- [ ] **Step 1: Copy the source command and apply substitutions**

Copy `../cloudflare-toolkit/packages/cli/src/commands/upgrade.ts` to `packages/cli/src/commands/upgrade.ts`, then change exactly these four things:

1. `const REPO = "spenserhale/cloudflare-ai-toolkit";` → `const REPO = "spenserhale/rollbar-toolkit";`
2. In `resolveAssetName`, replace every `cloudflare-` prefix with `rollbar-` (five return strings: `rollbar-linux-x64`, `rollbar-linux-arm64`, `rollbar-darwin-x64`, `rollbar-darwin-arm64`, `rollbar-windows-x64.exe`).
3. In `isCompiledBinary`, change the comment and the check `name === "cloudflare"` → `name === "rollbar"`.
4. Replace the three user-facing strings that mention the tool name:
   - the npm/bun hints → `@rollbar-toolkit/cli@latest`
   - the install.sh URL → `https://raw.githubusercontent.com/spenserhale/rollbar-toolkit/main/scripts/install.sh`
   - the temp filename `.cloudflare-upgrade-` → `.rollbar-upgrade-`
   - the two `` `cloudflare upgrade` `` mentions in log/error text → `` `rollbar upgrade` ``
   - `brief: "Upgrade the CLI to the latest release"` stays as-is.

`scripts/install.sh` exists in this repo, so keep the "switch to the standalone binary" hint line.

- [ ] **Step 2: Copy the test and apply substitutions**

Copy `../cloudflare-toolkit/packages/cli/src/commands/upgrade.test.ts` to `packages/cli/src/commands/upgrade.test.ts`, then replace every `cloudflare` with `rollbar` (in `execPath: "/usr/local/bin/rollbar"`, all `resolveAssetName` expectations, the `isCompiledBinary` paths, the `.sha256` response bodies, and the `` "Update available. Run `rollbar upgrade` to install." `` expectation).

- [ ] **Step 3: Run the test to verify it passes**

Run: `cd packages/cli && npx vitest run src/commands/upgrade.test.ts`
Expected: PASS (all `compareSemver`, `resolveAssetName`, `isCompiledBinary`, `runUpgrade` cases green).

- [ ] **Step 4: Wire the command into the app**

In `packages/cli/src/app.ts`, add the import near the other command imports:

```ts
import { upgradeCommand } from "./commands/upgrade.js";
```

Add `upgrade` to the top-level `routes` object (after `"agent-context"`):

```ts
    "agent-context": agentContextCommand,
    upgrade: upgradeCommand,
```

- [ ] **Step 5: Verify the command is wired**

Run: `cd packages/cli && bun run src/bin.ts upgrade --help`
Expected: help text with `--check`, `--force`, `--version` flags and brief "Upgrade the CLI to the latest release".

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/commands/upgrade.ts packages/cli/src/commands/upgrade.test.ts packages/cli/src/app.ts
git commit -m "feat(cli): add self-upgrade command ported from cloudflare toolkit"
```

---

## Task 2: SDK — pure RQL query-builders and row helpers

**Files:**
- Create: `packages/sdk/src/rql.ts`
- Create: `packages/sdk/tests/rql.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/sdk/tests/rql.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  buildByUrlQuery,
  buildAffectedUsersQuery,
  injectLimit,
  escapeSqlString,
  findItemColumn,
  readCell,
  uniqueNumbers,
} from "../src/rql.js";

describe("escapeSqlString", () => {
  it("doubles single quotes to prevent breaking out of a literal", () => {
    expect(escapeSqlString("o'brien")).toBe("o''brien");
    expect(escapeSqlString("example.com")).toBe("example.com");
  });
});

describe("buildByUrlQuery", () => {
  it("builds a grouped, ordered, limited query with an escaped LIKE and window", () => {
    const sql = buildByUrlQuery("example.com", 5, 1_700_000_000);
    expect(sql).toContain("FROM item_occurrence");
    expect(sql).toContain("request.url LIKE '%example.com%'");
    expect(sql).toContain("timestamp >= 1700000000");
    expect(sql).toContain("GROUP BY item.counter");
    expect(sql).toContain("ORDER BY occurrences DESC");
    expect(sql).toMatch(/LIMIT 5$/);
  });
  it("escapes quotes in the domain", () => {
    expect(buildByUrlQuery("a'b", 5, 0)).toContain("LIKE '%a''b%'");
  });
  it("rejects a non-integer limit", () => {
    expect(() => buildByUrlQuery("x", 1.5, 0)).toThrow(/limit/);
  });
});

describe("buildAffectedUsersQuery", () => {
  it("filters by item.id and groups by person columns", () => {
    const sql = buildAffectedUsersQuery(4242, 100, 1_700_000_000);
    expect(sql).toContain("SELECT person.id, person.username, person.email, count(*) AS occurrences");
    expect(sql).toContain("WHERE item.id = 4242");
    expect(sql).toContain("timestamp >= 1700000000");
    expect(sql).toContain("GROUP BY person.id, person.username, person.email");
    expect(sql).toMatch(/LIMIT 100$/);
  });
  it("rejects a non-integer item id (SQL-injection guard)", () => {
    expect(() => buildAffectedUsersQuery(Number("4; DROP"), 100, 0)).toThrow(/item id/);
  });
});

describe("injectLimit", () => {
  it("appends LIMIT when none present", () => {
    expect(injectLimit("SELECT * FROM item_occurrence", 100)).toBe(
      "SELECT * FROM item_occurrence LIMIT 100",
    );
  });
  it("leaves an existing LIMIT untouched (case-insensitive)", () => {
    expect(injectLimit("SELECT * FROM item_occurrence limit 10", 100)).toBe(
      "SELECT * FROM item_occurrence limit 10",
    );
  });
  it("strips a trailing semicolon before appending", () => {
    expect(injectLimit("SELECT 1;", 5)).toBe("SELECT 1 LIMIT 5");
  });
});

describe("findItemColumn", () => {
  it("prefers item.counter, then item.id, else null", () => {
    expect(findItemColumn(["item.counter", "occurrences"])).toEqual({ name: "item.counter", kind: "counter" });
    expect(findItemColumn(["item.id"])).toEqual({ name: "item.id", kind: "id" });
    expect(findItemColumn(["timestamp"])).toBeNull();
  });
});

describe("readCell", () => {
  it("reads from array rows by column index", () => {
    expect(readCell([7, 3], ["item.counter", "occurrences"], "occurrences")).toBe(3);
  });
  it("reads from object rows by key", () => {
    expect(readCell({ "item.counter": 7 }, ["item.counter"], "item.counter")).toBe(7);
  });
  it("returns undefined for a missing column", () => {
    expect(readCell([1], ["a"], "b")).toBeUndefined();
  });
});

describe("uniqueNumbers", () => {
  it("dedupes and drops non-numeric values, preserving order", () => {
    expect(uniqueNumbers([3, "3", 1, "x", 1, 2])).toEqual([3, 1, 2]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/sdk && npx vitest run tests/rql.test.ts`
Expected: FAIL — cannot find module `../src/rql.js`.

- [ ] **Step 3: Write the implementation**

Create `packages/sdk/src/rql.ts`:

```ts
// Pure, side-effect-free helpers for building RQL queries and reading result rows.
// Kept out of client.ts so the query-shaping logic is independently testable.

function intOrThrow(n: number, label: string): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(`${label} must be a non-negative integer, got ${n}`);
  }
  return n;
}

/** Neutralize single quotes so interpolated input can't break out of a string literal. */
export function escapeSqlString(input: string): string {
  return input.replace(/'/g, "''");
}

/**
 * Top-N items whose occurrences hit a URL substring, ranked by occurrence count.
 * `minTimestamp` is a unix-epoch-seconds lower bound (see parseWindow).
 */
export function buildByUrlQuery(domain: string, limit: number, minTimestamp: number): string {
  intOrThrow(limit, "limit");
  return [
    "SELECT item.counter, count(*) AS occurrences",
    "FROM item_occurrence",
    `WHERE request.url LIKE '%${escapeSqlString(domain)}%' AND timestamp >= ${minTimestamp}`,
    "GROUP BY item.counter",
    "ORDER BY occurrences DESC",
    `LIMIT ${limit}`,
  ].join(" ");
}

/** Distinct affected users for one item, ranked by per-user occurrence count. */
export function buildAffectedUsersQuery(itemId: number, limit: number, minTimestamp: number): string {
  intOrThrow(itemId, "item id");
  intOrThrow(limit, "limit");
  return [
    "SELECT person.id, person.username, person.email, count(*) AS occurrences",
    "FROM item_occurrence",
    `WHERE item.id = ${itemId} AND timestamp >= ${minTimestamp}`,
    "GROUP BY person.id, person.username, person.email",
    "ORDER BY occurrences DESC",
    `LIMIT ${limit}`,
  ].join(" ");
}

/** Append `LIMIT n` only when the query has no LIMIT of its own. Safe append-only rewrite. */
export function injectLimit(sql: string, limit: number): string {
  if (/\blimit\b/i.test(sql)) return sql;
  return `${sql.trimEnd().replace(/;\s*$/, "")} LIMIT ${limit}`;
}

export interface ItemColumn {
  name: string;
  kind: "counter" | "id";
}

/** Which column identifies items in a result set, if any (counter preferred). */
export function findItemColumn(columns: string[]): ItemColumn | null {
  if (columns.includes("item.counter")) return { name: "item.counter", kind: "counter" };
  if (columns.includes("item.id")) return { name: "item.id", kind: "id" };
  return null;
}

/** Read a named cell from a result row, tolerating array-aligned OR object-keyed rows. */
export function readCell(row: unknown, columns: string[], name: string): unknown {
  if (Array.isArray(row)) {
    const idx = columns.indexOf(name);
    return idx >= 0 ? row[idx] : undefined;
  }
  if (row && typeof row === "object") {
    return (row as Record<string, unknown>)[name];
  }
  return undefined;
}

/** Coerce to finite numbers, dedupe, preserve first-seen order. */
export function uniqueNumbers(values: unknown[]): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const v of values) {
    const n = Number(v);
    if (Number.isFinite(n) && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/sdk && npx vitest run tests/rql.test.ts`
Expected: PASS (all cases green).

- [ ] **Step 5: Commit**

```bash
git add packages/sdk/src/rql.ts packages/sdk/tests/rql.test.ts
git commit -m "feat(sdk): add pure RQL query-builders and row helpers"
```

---

## Task 3: SDK — RQL helper methods on the client

**Files:**
- Modify: `packages/sdk/src/types.ts`
- Modify: `packages/sdk/src/client.ts`
- Modify: `packages/sdk/src/index.ts`
- Modify: `packages/sdk/tests/client.test.ts`

- [ ] **Step 1: Add the new types**

In `packages/sdk/src/types.ts`, append after the `CreateRqlJobParams` block (near line 233), before the next section marker:

```ts
export interface AffectedUser {
  id: string | null;
  username: string | null;
  email: string | null;
  occurrences: number;
}

/** Wait/poll knobs shared by the one-shot RQL helpers. */
export interface RqlWaitOptions {
  timeoutMs?: number;
  initialIntervalMs?: number;
}

export interface RqlByUrlParams extends RqlWaitOptions {
  domain: string;
  /** default 5 */
  limit?: number;
  /** human window, e.g. "30d" / "1w" (default "30d") */
  window?: string;
  includeVars?: boolean;
}

export interface RqlByUrlItem extends ItemDetailed {
  occurrences: number;
}

export interface RqlAffectedUsersParams extends RqlWaitOptions {
  itemId: number;
  /** default 100 */
  limit?: number;
  /** human window, e.g. "30d" (default "30d") */
  window?: string;
}

export interface RqlQueryParams extends RqlWaitOptions {
  queryString: string;
  /** master default 100; appended only if the query has no LIMIT */
  limit?: number;
  /** human window; not injected into arbitrary SQL — see warnings */
  window?: string;
  /** hydrate item.counter/item.id rows to full item-details */
  enrich?: boolean;
  includeVars?: boolean;
}

export interface RqlQueryOutcome {
  result: RqlJobResultPayload;
  /** present only when enrich requested AND an item column was found */
  items?: ItemDetailed[];
  /** non-fatal notices (e.g. window-not-applied, enrich-no-item-column) */
  warnings: string[];
}
```

- [ ] **Step 2: Write the failing client tests**

In `packages/sdk/tests/client.test.ts`, add at the end of the file (inside the top level, after the existing `describe`):

```ts
import { vi } from "vitest";
import type { RqlJob, RqlJobResult } from "../src/types.js";

function stubbedClient() {
  const client = new RollbarClient({ projectToken: "t", baseUrl: "https://api.example.com/api/1" });
  const job: RqlJob = {
    id: 1,
    project_id: 1,
    query_string: "",
    status: "success",
    job_hash: "h",
    date_created: 0,
    date_modified: 0,
  };
  vi.spyOn(client, "createRqlJob").mockResolvedValue(job);
  vi.spyOn(client, "waitForRqlJob").mockResolvedValue(job);
  return { client, job };
}

describe("rqlAffectedUsers", () => {
  it("maps result rows to AffectedUser records", async () => {
    const { client } = stubbedClient();
    const result: RqlJobResult = {
      job_id: 1,
      result: {
        selectionColumns: ["person.id", "person.username", "person.email", "occurrences"],
        rows: [
          ["42", "alice", "alice@example.com", 9],
          [null, null, null, 3],
        ],
      },
    };
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue(result);

    const users = await client.rqlAffectedUsers({ itemId: 7, window: "30d" });
    expect(users).toEqual([
      { id: "42", username: "alice", email: "alice@example.com", occurrences: 9 },
      { id: null, username: null, email: null, occurrences: 3 },
    ]);
  });
});

describe("rqlByUrl", () => {
  it("hydrates each returned counter to item-details with its occurrence count", async () => {
    const { client } = stubbedClient();
    const result: RqlJobResult = {
      job_id: 1,
      result: { selectionColumns: ["item.counter", "occurrences"], rows: [[12, 100], [34, 50]] },
    };
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue(result);
    const detail = { item: { id: 999 }, latestOccurrence: null } as unknown as Awaited<
      ReturnType<typeof client.getItemDetailedByCounter>
    >;
    const spy = vi.spyOn(client, "getItemDetailedByCounter").mockResolvedValue(detail);

    const items = await client.rqlByUrl({ domain: "example.com" });
    expect(spy).toHaveBeenCalledWith(12, { includeVars: undefined });
    expect(items).toHaveLength(2);
    expect(items[0]?.occurrences).toBe(100);
  });
});

describe("rqlQuery", () => {
  it("warns when --window is set but the query has no timestamp clause", async () => {
    const { client } = stubbedClient();
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue({
      job_id: 1,
      result: { selectionColumns: ["a"], rows: [] },
    });
    const outcome = await client.rqlQuery({ queryString: "SELECT a FROM item_occurrence", window: "30d" });
    expect(outcome.warnings.some((w) => w.includes("window not applied"))).toBe(true);
  });

  it("warns and skips enrich when no item column is present", async () => {
    const { client } = stubbedClient();
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue({
      job_id: 1,
      result: { selectionColumns: ["a"], rows: [[1]] },
    });
    const outcome = await client.rqlQuery({ queryString: "SELECT a FROM item_occurrence", enrich: true });
    expect(outcome.items).toBeUndefined();
    expect(outcome.warnings.some((w) => w.includes("enrich skipped"))).toBe(true);
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `cd packages/sdk && npx vitest run tests/client.test.ts`
Expected: FAIL — `client.rqlAffectedUsers is not a function` (and the others).

- [ ] **Step 4: Implement the client methods**

In `packages/sdk/src/client.ts`:

(a) Extend the type import block (around lines 15–26) to add the new types:

```ts
  GetItemDetailedParams,
  ItemDetailed,
  // ...existing...
  RqlByUrlParams,
  RqlByUrlItem,
  RqlAffectedUsersParams,
  RqlQueryParams,
  RqlQueryOutcome,
  AffectedUser,
```

(b) Add the `rql.ts` import near the top of the file (with the other imports):

```ts
import {
  buildByUrlQuery,
  buildAffectedUsersQuery,
  injectLimit,
  findItemColumn,
  readCell,
  uniqueNumbers,
} from "./rql.js";
```

(c) Change `parseWindow` from a bare `function` to an exported one (line ~337):

```ts
export function parseWindow(window: string): number {
```

(d) Add these methods inside the `RollbarClient` class, right after `getItemDetailedByUuid` (near line 158), so item-details helpers sit together:

```ts
  async getItemDetailedByCounter(
    counter: number,
    params: GetItemDetailedParams = {},
  ): Promise<ItemDetailed> {
    const item = await this.getItemByCounter(counter);
    return this.getItemDetailed(item.id, params);
  }
```

(e) Add these methods after `cancelRqlJob` / before `waitForRqlJob` (near line 288), plus a private runner:

```ts
  // Submit a query, wait for it to finish successfully, and return its result payload.
  // The one-shot RQL helpers all build on this.
  private async runRqlToRows(
    queryString: string,
    waitOpts: WaitForRqlJobOptions = {},
  ): Promise<RqlJobResultPayload> {
    const job = await this.createRqlJob({ queryString });
    const final = await this.waitForRqlJob(job.id, waitOpts);
    if (final.status !== "success") {
      throw new RollbarError(
        `RQL job ${final.id} ended with status "${final.status}" (query did not complete successfully)`,
        "rql_not_success",
      );
    }
    const result = await this.getRqlJobResults(final.id);
    return result.result;
  }

  async rqlByUrl(params: RqlByUrlParams): Promise<RqlByUrlItem[]> {
    const { domain, limit = 5, window = "30d", includeVars, timeoutMs, initialIntervalMs } = params;
    const payload = await this.runRqlToRows(buildByUrlQuery(domain, limit, parseWindow(window)), {
      timeoutMs,
      initialIntervalMs,
    });
    const columns = payload.selectionColumns ?? [];
    const rows = payload.rows ?? [];
    const out: RqlByUrlItem[] = [];
    for (const row of rows) {
      const counter = Number(readCell(row, columns, "item.counter"));
      const occurrences = Number(readCell(row, columns, "occurrences")) || 0;
      const detailed = await this.getItemDetailedByCounter(counter, { includeVars });
      out.push({ ...detailed, occurrences });
    }
    return out;
  }

  async rqlAffectedUsers(params: RqlAffectedUsersParams): Promise<AffectedUser[]> {
    const { itemId, limit = 100, window = "30d", timeoutMs, initialIntervalMs } = params;
    const payload = await this.runRqlToRows(
      buildAffectedUsersQuery(itemId, limit, parseWindow(window)),
      { timeoutMs, initialIntervalMs },
    );
    const columns = payload.selectionColumns ?? [];
    return (payload.rows ?? []).map((row) => ({
      id: strOrNull(readCell(row, columns, "person.id")),
      username: strOrNull(readCell(row, columns, "person.username")),
      email: strOrNull(readCell(row, columns, "person.email")),
      occurrences: Number(readCell(row, columns, "occurrences")) || 0,
    }));
  }

  async rqlQuery(params: RqlQueryParams): Promise<RqlQueryOutcome> {
    const { queryString, limit = 100, window, enrich, includeVars, timeoutMs, initialIntervalMs } =
      params;
    const warnings: string[] = [];
    if (window && !/\btimestamp\b/i.test(queryString)) {
      warnings.push(
        "window not applied — RQL queries aren't rewritten; add a `timestamp >= <epoch>` clause to bound your query.",
      );
    }
    const payload = await this.runRqlToRows(injectLimit(queryString, limit), {
      timeoutMs,
      initialIntervalMs,
    });
    const outcome: RqlQueryOutcome = { result: payload, warnings };
    if (enrich) {
      const columns = payload.selectionColumns ?? [];
      const col = findItemColumn(columns);
      if (!col) {
        warnings.push("enrich skipped — result has no `item.counter` or `item.id` column.");
      } else {
        const ids = uniqueNumbers((payload.rows ?? []).map((r) => readCell(r, columns, col.name)));
        const items: ItemDetailed[] = [];
        for (const id of ids) {
          items.push(
            col.kind === "counter"
              ? await this.getItemDetailedByCounter(id, { includeVars })
              : await this.getItemDetailed(id, { includeVars }),
          );
        }
        outcome.items = items;
      }
    }
    return outcome;
  }
```

(f) Add a module-private helper near the other helpers at the bottom of the file (after `parseWindow`):

```ts
function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
}
```

(g) Ensure `RqlJobResultPayload` and `WaitForRqlJobOptions` are in the type import block (add `RqlJobResultPayload` if missing).

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd packages/sdk && npx vitest run tests/client.test.ts tests/rql.test.ts`
Expected: PASS.

- [ ] **Step 6: Export the new public types**

In `packages/sdk/src/index.ts`, add the new type exports and re-export the pure helpers. Add to the existing `export type { ... } from "./types.js";` block:

```ts
  AffectedUser,
  RqlByUrlParams,
  RqlByUrlItem,
  RqlAffectedUsersParams,
  RqlQueryParams,
  RqlQueryOutcome,
```

And add a value export for the builders (used by nothing external yet, but keeps the layer honest and matches the export-for-test convention):

```ts
export { parseWindow } from "./client.js";
```

(If `index.ts` re-exports `client.ts` with `export *`, skip the explicit `parseWindow` line.)

- [ ] **Step 7: Typecheck**

Run: `bun run check` (from the toolkit root) — expect no type errors.
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add packages/sdk/src/types.ts packages/sdk/src/client.ts packages/sdk/src/index.ts packages/sdk/tests/client.test.ts
git commit -m "feat(sdk): add rqlQuery, rqlByUrl, rqlAffectedUsers helper methods"
```

---

## Task 4: CLI — `rql query`, `rql by-url`, `rql affected-users`

**Files:**
- Create: `packages/cli/src/commands/rql/commands.ts`
- Create: `packages/cli/src/commands/rql/impl.ts`
- Modify: `packages/cli/src/app.ts`

- [ ] **Step 1: Write the command definitions**

Create `packages/cli/src/commands/rql/commands.ts`:

```ts
import { buildCommand } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";
import { clientFlagDefs } from "../../client-flags.js";

const WINDOW_HINT = "Look-back window: 24h, 7d, 30d, 12w, 3m";

const waitFlagDefs = {
  timeout: {
    kind: "parsed" as const,
    parse: Number,
    brief: "Seconds to wait for the RQL job (default 300)",
    default: "300",
  },
  pollInterval: {
    kind: "parsed" as const,
    parse: Number,
    brief: "Initial poll interval in seconds (default 1; backs off to 10)",
    default: "1",
  },
} as const;

export const queryCommand = buildCommand({
  loader: async () => (await import("./impl.js")).query,
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "The RQL query string (must include your own LIMIT for large scans)", parse: String }],
    },
    flags: {
      ...outputFlagDefs,
      enrich: {
        kind: "boolean",
        brief: "Hydrate rows that carry item.counter/item.id into full item-details",
        default: false,
      },
      limit: {
        kind: "parsed",
        parse: Number,
        brief: "LIMIT to append when the query has none (default 100)",
        default: "100",
      },
      window: {
        kind: "parsed",
        parse: String,
        brief: `${WINDOW_HINT} — informational for arbitrary queries; not injected into your SQL`,
        optional: true,
      },
      includeVars: {
        kind: "boolean",
        brief: "Include stack-frame local variables when --enrich is set (may contain secrets)",
        optional: true,
      },
      ...waitFlagDefs,
      ...clientFlagDefs,
    },
  },
  docs: {
    brief:
      "Run an arbitrary RQL query end-to-end (submit, poll, return rows). Use --enrich to hydrate item rows.",
  },
});

export const byUrlCommand = buildCommand({
  loader: async () => (await import("./impl.js")).byUrl,
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Domain / host / URL substring to match against occurrence request URLs", parse: String }],
    },
    flags: {
      ...outputFlagDefs,
      limit: {
        kind: "parsed",
        parse: Number,
        brief: "Number of top items to return (default 5)",
        default: "5",
      },
      window: {
        kind: "parsed",
        parse: String,
        brief: `${WINDOW_HINT} (default 30d)`,
        default: "30d",
      },
      includeVars: {
        kind: "boolean",
        brief: "Include stack-frame local variables (may contain secrets)",
        optional: true,
      },
      ...waitFlagDefs,
      ...clientFlagDefs,
    },
  },
  docs: {
    brief: "Top-N items whose occurrences hit a URL/domain, each enriched to full item-details",
  },
});

export const affectedUsersCommand = buildCommand({
  loader: async () => (await import("./impl.js")).affectedUsers,
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Rollbar item ID", parse: Number }],
    },
    flags: {
      ...outputFlagDefs,
      limit: {
        kind: "parsed",
        parse: Number,
        brief: "Max distinct users to return (default 100)",
        default: "100",
      },
      window: {
        kind: "parsed",
        parse: String,
        brief: `${WINDOW_HINT} (default 30d)`,
        default: "30d",
      },
      ...waitFlagDefs,
      ...clientFlagDefs,
    },
  },
  docs: {
    brief: "List the distinct affected users for an item (id/username/email + per-user occurrence count)",
  },
});
```

- [ ] **Step 2: Write the handlers**

Create `packages/cli/src/commands/rql/impl.ts`:

```ts
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

interface WaitFlags {
  readonly timeout: number;
  readonly pollInterval: number;
}

interface QueryFlags extends OutputFlags, ClientFlags, WaitFlags {
  readonly enrich: boolean;
  readonly limit: number;
  readonly window?: string;
  readonly includeVars?: boolean;
}

export async function query(
  this: LocalContext,
  flags: QueryFlags,
  queryString: string,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const outcome = await client.rqlQuery({
    queryString,
    limit: flags.limit,
    window: flags.window,
    enrich: flags.enrich,
    includeVars: flags.includeVars,
    timeoutMs: flags.timeout * 1000,
    initialIntervalMs: flags.pollInterval * 1000,
  });
  for (const w of outcome.warnings) {
    this.process.stderr.write(`warning: ${w}\n`);
  }
  const data = outcome.items ? { items: outcome.items } : outcome.result;
  await writeOutput(this.process.stdout, data, flags);
}

interface ByUrlFlags extends OutputFlags, ClientFlags, WaitFlags {
  readonly limit: number;
  readonly window: string;
  readonly includeVars?: boolean;
}

export async function byUrl(
  this: LocalContext,
  flags: ByUrlFlags,
  domain: string,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const items = await client.rqlByUrl({
    domain,
    limit: flags.limit,
    window: flags.window,
    includeVars: flags.includeVars,
    timeoutMs: flags.timeout * 1000,
    initialIntervalMs: flags.pollInterval * 1000,
  });
  await writeOutput(this.process.stdout, { items }, flags);
}

interface AffectedUsersFlags extends OutputFlags, ClientFlags, WaitFlags {
  readonly limit: number;
  readonly window: string;
}

export async function affectedUsers(
  this: LocalContext,
  flags: AffectedUsersFlags,
  itemId: number,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const users = await client.rqlAffectedUsers({
    itemId,
    limit: flags.limit,
    window: flags.window,
    timeoutMs: flags.timeout * 1000,
    initialIntervalMs: flags.pollInterval * 1000,
  });
  await writeOutput(this.process.stdout, { users }, flags);
}
```

Note: `LocalContext.process` is typed `NodeJS.Process` (see `packages/cli/src/context.ts`), so `this.process.stderr.write(...)` is valid — no extra wiring needed.

- [ ] **Step 3: Wire into the app**

In `packages/cli/src/app.ts`, add the import:

```ts
import { queryCommand, byUrlCommand, affectedUsersCommand } from "./commands/rql/commands.js";
```

Replace the existing `rqlRoutes` definition with:

```ts
const rqlRoutes = buildRouteMap({
  routes: {
    query: queryCommand,
    "by-url": byUrlCommand,
    "affected-users": affectedUsersCommand,
    jobs: rqlJobsRoutes,
  },
  docs: { brief: "Rollbar Query Language (RQL) — run queries, helpers, and manage async jobs" },
});
```

- [ ] **Step 4: Verify the commands are wired**

Run each and confirm help text renders:

```bash
cd packages/cli
bun run src/bin.ts rql --help
bun run src/bin.ts rql query --help
bun run src/bin.ts rql by-url --help
bun run src/bin.ts rql affected-users --help
```

Expected: `rql --help` lists `query`, `by-url`, `affected-users`, `jobs`; each subcommand shows its flags (`--limit`, `--window`, `--enrich` where applicable).

- [ ] **Step 5: Typecheck**

Run: `bun run check`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/commands/rql/ packages/cli/src/app.ts
git commit -m "feat(cli): add rql query/by-url/affected-users helper commands"
```

---

## Task 5: MCP — mirror the RQL helpers as tools

**Files:**
- Modify: `packages/mcp/src/tools/resources.ts`

- [ ] **Step 1: Add the three tools**

In `packages/mcp/src/tools/resources.ts`, after the existing `cancel_rql_job` tool registration, add (matching the file's existing `server.addTool({ name, description, parameters: z.object({...}), execute })` pattern — import `z` is already present in this file; reuse the same client construction the other tools use):

```ts
  server.addTool({
    name: "rql_query",
    description:
      "Run an arbitrary RQL query end-to-end (submit job, poll to success, return rows). A LIMIT is appended if the query has none (default 100). Set enrich=true to hydrate rows carrying item.counter/item.id into full item-details. --window is not injected into arbitrary SQL; include your own `timestamp >= ...` clause to bound large scans.",
    parameters: z.object({
      queryString: z.string().describe("The RQL query string"),
      enrich: z.boolean().optional().describe("Hydrate item rows into full item-details"),
      limit: z.number().optional().describe("LIMIT to append when the query has none (default 100)"),
      window: z.string().optional().describe("Human window (30d/1w); informational for arbitrary queries"),
      includeVars: z.boolean().optional().describe("Include stack-frame locals when enriching (may contain secrets)"),
    }),
    async execute(args) {
      const client = new RollbarClient(resolveConfig());
      const result = await client.rqlQuery(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "rql_by_url",
    description:
      "Find the top-N items whose occurrences hit a URL/domain substring (default 5), each enriched to full item-details plus its occurrence count. Ranked by occurrence count over the given window (default 30d).",
    parameters: z.object({
      domain: z.string().describe("Domain / host / URL substring to match"),
      limit: z.number().optional().describe("Number of top items (default 5)"),
      window: z.string().optional().describe("Look-back window (default 30d)"),
      includeVars: z.boolean().optional().describe("Include stack-frame locals (may contain secrets)"),
    }),
    async execute(args) {
      const client = new RollbarClient(resolveConfig());
      const result = await client.rqlByUrl(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "rql_affected_users",
    description:
      "List the distinct users affected by an item (person id/username/email + per-user occurrence count) over the given window (default 30d, up to limit=100). Use to build a contact list once an error is resolved.",
    parameters: z.object({
      itemId: z.number().describe("Rollbar item ID"),
      limit: z.number().optional().describe("Max distinct users (default 100)"),
      window: z.string().optional().describe("Look-back window (default 30d)"),
    }),
    async execute(args) {
      const client = new RollbarClient(resolveConfig());
      const result = await client.rqlAffectedUsers(args);
      return JSON.stringify(result, null, 2);
    },
  });
```

Confirm `RollbarClient` and `resolveConfig` are already imported at the top of `resources.ts` (the existing RQL tools use them); if this file constructs the client differently (e.g. a shared helper), follow that existing pattern instead.

- [ ] **Step 2: Typecheck**

Run: `bun run check`
Expected: clean.

- [ ] **Step 3: Verify MCP registration**

Run: `cd packages/mcp && npx fastmcp inspect src/index.ts` (or `bun run --filter '@rollbar-toolkit/mcp' inspect` from root).
Expected: `rql_query`, `rql_by_url`, `rql_affected_users` appear in the tool list.

- [ ] **Step 4: Commit**

```bash
git add packages/mcp/src/tools/resources.ts
git commit -m "feat(mcp): expose rql_query, rql_by_url, rql_affected_users tools"
```

---

## Task 6: Documentation — item-details and RQL helpers in the README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Fix the CLI section**

In `README.md`, in the `## CLI` fenced block (lines ~46–71):

Replace the two misleading `items get`/`items top` comments so they no longer imply occurrences, and add an `item-details` group. Change the `items get`/`items top` lines to:

```
rollbar items get 12345                     # Get item metadata by ID
rollbar items get-by-counter 42             # Get item metadata by project counter (#42 in UI)
rollbar items top                           # Top 10 items by occurrence count (metadata only)
```

Then insert, immediately after the `items top --window ...` line, an item-details block:

```
# item-details — item PLUS its latest occurrence and full stack trace
rollbar item-details get 12345              # Item + latest occurrence + stack trace
rollbar item-details get-by-counter 42      # Same, by project counter
rollbar item-details top                    # Top 10 items, each with its latest occurrence
rollbar item-details get 12345 --include-vars   # Also include stack-frame locals (may contain secrets)
```

- [ ] **Step 2: Add the RQL helper lines**

In the same fenced block, replace the RQL section (lines ~65–71) so it includes the new helpers above the low-level `jobs` commands:

```
# RQL (Rollbar Query Language) — async; a LIMIT is auto-appended (default 100)
rollbar rql query "SELECT item.counter, count(*) AS n FROM item_occurrence GROUP BY item.counter"   # run any query
rollbar rql query "... " --enrich             # hydrate item.counter/item.id rows to full item-details
rollbar rql by-url example.com                # top 5 items hitting a domain, each with its occurrence
rollbar rql by-url example.com --limit 10 --window 7d
rollbar rql affected-users 12345             # distinct affected users (id/username/email) for an item
rollbar rql affected-users 12345 --window 30d --limit 100

# Low-level async job control
rollbar rql jobs create "SELECT * FROM item_occurrence LIMIT 10" --wait   # submit, poll, return rows
rollbar rql jobs list                        # List recent RQL jobs
rollbar rql jobs get 12345                   # Check status of an RQL job
rollbar rql jobs results 12345               # Fetch rows from a completed RQL job
rollbar rql jobs cancel 12345 --force        # Cancel an in-flight RQL job
```

- [ ] **Step 3: Add MCP tool rows**

In the `### Available Tools` table, add rows for `get_item_detailed` and `list_top_item_details` if absent, and add the three new tools:

```
| `get_item_detailed`   | Get an item plus its latest occurrence and stack trace         |
| `list_top_item_details` | Top-N items, each with its latest occurrence and stack trace |
| `rql_query`           | Run an arbitrary RQL query end-to-end; optional item enrich    |
| `rql_by_url`          | Top-N items hitting a URL/domain, enriched to item-details     |
| `rql_affected_users`  | Distinct affected users for an item (contact list)             |
```

- [ ] **Step 4: Verify the README renders sanely**

Run: `grep -nE "item-details|rql query|rql by-url|affected-users" README.md`
Expected: the new lines are present in the CLI block and tool table.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document item-details commands and RQL helper commands"
```

---

## Task 7: Full verification gate

**Files:** none (verification only)

- [ ] **Step 1: Run the full test + quality gate**

Run (from the toolkit root): `vp test && vp check && vp lint && vp format`
Expected: all tests pass, no type errors, lint clean, formatting applied (commit any formatting changes).

- [ ] **Step 2: Verify agent-context reflects the new commands**

Run: `cd packages/cli && bun run src/bin.ts agent-context --json | grep -E "upgrade|by-url|affected-users|rql"`
Expected: the new `upgrade` and `rql` subcommands appear in the machine-readable command map.

- [ ] **Step 3: Commit any formatting changes**

```bash
git add -A
git commit -m "chore: apply formatting after rql helpers + upgrade command" || echo "nothing to format"
```

---

## Notes / assumptions for the implementer

- **RQL row shape:** `RqlJobResultPayload.rows` is `unknown[]`; `selectionColumns` names the selected columns. `readCell` tolerates both array-aligned rows (`row[colIndex]`) and object-keyed rows (`row["item.counter"]`). If, during manual testing against a live account, rows come back in a shape neither branch handles, adjust `readCell` — the pure helper is unit-tested so extend those tests first.
- **Window on arbitrary `rql query`:** intentionally NOT injected into user SQL (unsafe to rewrite). The SDK only warns. Builder commands (`by-url`, `affected-users`) fully control their SQL and DO inject `timestamp >=`.
- **Injection safety:** numeric interpolation (`item.id`, `LIMIT`) is guarded by `intOrThrow`; the only string interpolation (`by-url` domain) is single-quote-escaped and wrapped in `LIKE '%…%'`.
- **No new error taxonomy:** a non-`success` terminal job throws `RollbarError`, which the CLI already maps to exit code 1.
