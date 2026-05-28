import { encode } from "@toon-format/toon";
import { EnumValueError, ValidationError } from "./validation.js";

export interface OutputFlags {
  readonly toon: boolean;
  readonly json: boolean;
  readonly csv: boolean;
  readonly deliver?: string;
}

// Spread into every data-returning command's flag definitions.
// All three format flags are booleans, mutually exclusive, default false.
// When all three are false (the common case), output falls through to TOON.
export const outputFlagDefs = {
  toon: {
    kind: "boolean" as const,
    brief: "Output as TOON (default)",
    default: false,
  },
  json: {
    kind: "boolean" as const,
    brief: "Output as JSON",
    default: false,
  },
  csv: {
    kind: "boolean" as const,
    brief: "Output as CSV (list-style responses only)",
    default: false,
  },
  deliver: {
    kind: "parsed" as const,
    parse: String,
    brief: "Where to deliver output: stdout (default), file:<path>, or webhook:<url>",
    optional: true as const,
  },
} as const;

type Format = "toon" | "json" | "csv";

function pickFormat(flags: OutputFlags): Format {
  const picked = [
    flags.csv ? "csv" : null,
    flags.json ? "json" : null,
    flags.toon ? "toon" : null,
  ].filter(Boolean) as Format[];
  if (picked.length > 1) {
    throw new ValidationError(
      `output format flags are mutually exclusive: pick one of --toon / --json / --csv (got: ${picked
        .map((f) => `--${f}`)
        .join(", ")})`,
    );
  }
  return picked[0] ?? "toon";
}

export async function writeOutput(
  stdout: NodeJS.WriteStream,
  data: unknown,
  flags: OutputFlags,
): Promise<void> {
  const format = pickFormat(flags);
  const serialized = serialize(data, format) + "\n";
  const sink = flags.deliver ?? "stdout";
  await deliver(stdout, serialized, sink);
}

function serialize(data: unknown, format: Format): string {
  const enriched = addTruncationHint(data);
  if (format === "json") return JSON.stringify(enriched, null, 2);
  if (format === "csv") return toCsv(enriched);
  return encode(enriched, { keyFolding: "safe" });
}

async function deliver(stdout: NodeJS.WriteStream, payload: string, sink: string): Promise<void> {
  if (sink === "stdout") {
    stdout.write(payload);
    return;
  }
  if (sink.startsWith("file:")) {
    const path = sink.slice("file:".length);
    if (!path) throw new ValidationError("--deliver=file: requires a path (e.g. file:./out.toon)");
    await writeFileAtomic(path, payload);
    stdout.write(`delivered_to: ${sink}\nbytes: ${Buffer.byteLength(payload)}\n`);
    return;
  }
  if (sink.startsWith("webhook:")) {
    const url = sink.slice("webhook:".length);
    if (!url) throw new ValidationError("--deliver=webhook: requires a URL");
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: payload,
    });
    stdout.write(`delivered_to: ${sink}\nstatus: ${res.status}\n`);
    return;
  }
  throw new EnumValueError("--deliver", sink, ["stdout", "file:<path>", "webhook:<url>"]);
}

async function writeFileAtomic(path: string, payload: string): Promise<void> {
  const { writeFile, rename, mkdir } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.tmp.${process.pid}.${Date.now()}`;
  await writeFile(tmp, payload, "utf8");
  await rename(tmp, path);
}

// CSV is only meaningful for tabular outputs. Look for the common shape
// { items|instances|deploys|projects|users|environments: [...] } and flatten.
// Refuse cleanly when the response isn't list-shaped.
function toCsv(data: unknown): string {
  if (!data || typeof data !== "object") {
    throw new ValidationError(
      "--csv is only supported for list-style responses; got a scalar. Use --toon or --json.",
    );
  }
  const obj = data as Record<string, unknown>;
  const arrayKey = ["items", "instances", "deploys", "projects", "users", "environments"].find(
    (k) => Array.isArray(obj[k]),
  );
  const rows = arrayKey
    ? (obj[arrayKey] as unknown[])
    : Array.isArray(data)
      ? (data as unknown[])
      : null;
  if (!rows) {
    throw new ValidationError(
      "--csv is only supported for list-style responses; this command returns a nested object. Use --toon (default) or --json.",
    );
  }
  if (rows.length === 0) return "";
  const headers = collectHeaders(rows);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvCell(getNested(row, h))).join(","));
  }
  return lines.join("\n");
}

function collectHeaders(rows: unknown[]): string[] {
  const seen = new Set<string>();
  for (const row of rows) {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      for (const k of Object.keys(row)) {
        const v = (row as Record<string, unknown>)[k];
        if (v && typeof v === "object" && !Array.isArray(v)) continue; // skip nested objects for top-level CSV
        seen.add(k);
      }
    }
  }
  return [...seen];
}

function getNested(row: unknown, key: string): unknown {
  if (!row || typeof row !== "object") return undefined;
  return (row as Record<string, unknown>)[key];
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "object" ? JSON.stringify(value) : String(value);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// If the response carries total_count and the returned array is shorter, surface a
// truncation hint that names the exact flags the agent should add to narrow the next call.
function addTruncationHint(data: unknown): unknown {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;
  const obj = data as Record<string, unknown>;

  const total = obj["total_count"];
  if (typeof total !== "number") return data;

  const arrayKey = ["items", "instances", "deploys"].find((k) => Array.isArray(obj[k]));
  if (!arrayKey) return data;

  const arr = obj[arrayKey] as unknown[];
  if (arr.length >= total) return data;

  return {
    ...obj,
    truncated: true,
    total,
    returned: arr.length,
    hint: `${arr.length} of ${total} ${arrayKey}; pass --limit=<n> --page=<n> to paginate, or add resource filters (--status, --level, --environment) to narrow`,
  };
}
