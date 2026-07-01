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
  intOrThrow(minTimestamp, "minTimestamp");
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
export function buildAffectedUsersQuery(
  itemId: number,
  limit: number,
  minTimestamp: number,
): string {
  intOrThrow(itemId, "item id");
  intOrThrow(limit, "limit");
  intOrThrow(minTimestamp, "minTimestamp");
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
  intOrThrow(limit, "limit");
  if (/\blimit\s+\d+/i.test(sql)) return sql;
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
    if (v === null || v === undefined || v === "" || typeof v === "boolean") continue;
    const n = Number(v);
    if (Number.isFinite(n) && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}
