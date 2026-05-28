import { encode } from "@toon-format/toon";

export interface OutputFlags {
  readonly json: boolean;
}

export const outputFlagDefs = {
  json: {
    kind: "boolean" as const,
    brief: "Output as JSON instead of TOON",
    default: false,
  },
};

export function writeOutput(stdout: NodeJS.WriteStream, data: unknown, flags: OutputFlags): void {
  stdout.write(serialize(data, flags) + "\n");
}

function serialize(data: unknown, flags: OutputFlags): string {
  const enriched = addTruncationHint(data);
  return flags.json ? JSON.stringify(enriched, null, 2) : encode(enriched, { keyFolding: "safe" });
}

// If the API response carries total_count and the returned array is shorter,
// surface a truncation hint so agents know how to narrow the query.
function addTruncationHint(data: unknown): unknown {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;
  const obj = data as Record<string, unknown>;

  const total = obj["total_count"];
  if (typeof total !== "number" || total === null) return data;

  const arrayKey = ["items", "instances", "deploys"].find((k) => Array.isArray(obj[k]));
  if (!arrayKey) return data;

  const arr = obj[arrayKey] as unknown[];
  if (arr.length >= total) return data;

  return {
    ...obj,
    truncated: true,
    total,
    hint: "use --limit or --page to narrow",
  };
}
