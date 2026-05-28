import type { LocalContext } from "../../context.js";
import { app } from "../../app.js";
import { listProfiles, getDefaultProfileName } from "../../profile-store.js";

// Derived from the live Stricli route tree — never hand-maintained.
// Any new command/flag/positional shows up automatically.

const SCHEMA_VERSION = "1";

const EXIT_CODES = {
  0: "success (also dry-run success)",
  1: "generic API or network error",
  2: "validation or usage error",
  3: "config error (missing token, bad env)",
  4: "not found",
  5: "auth error (invalid token)",
  6: "rate limited",
};

const OUTPUT_FORMATS = {
  default: "toon",
  flags: {
    "--toon": "TOON (Token-Oriented Object Notation) — default, lowest token cost",
    "--json": "JSON",
    "--csv": "CSV (list-style responses only; nested-object responses return error)",
  },
  note: "Format flags are mutually exclusive. When none is passed, output defaults to TOON.",
};

const DELIVER_SINKS = {
  flag: "--deliver",
  default: "stdout",
  schemes: {
    stdout: "Write to stdout (default)",
    "file:<path>": "Atomic write (temp file + rename); creates parent dirs",
    "webhook:<url>": "POST payload as text/plain; reports HTTP status",
  },
  note: "Unknown schemes return an enumerated error.",
};

export async function agentContext(this: LocalContext): Promise<void> {
  const [available_profiles, default_profile] = await Promise.all([
    listProfiles(),
    getDefaultProfileName(),
  ]);
  const schema = {
    schema_version: SCHEMA_VERSION,
    cli: app.config.name,
    version:
      app.config.versionInfo && "currentVersion" in app.config.versionInfo
        ? app.config.versionInfo.currentVersion
        : undefined,
    exit_codes: EXIT_CODES,
    output_formats: OUTPUT_FORMATS,
    deliver: DELIVER_SINKS,
    profiles: {
      flag: "--profile",
      precedence: "explicit --token > env var > profile entry > built-in default",
      available: available_profiles,
      default: default_profile,
      note: "Set ROLLBAR_DEFAULT_PROFILE to override the stored default for one shell.",
    },
    feedback: {
      command: 'rollbar feedback "<text>"',
      local_log: "~/.rollbar/feedback.jsonl",
      upstream_env: "ROLLBAR_FEEDBACK_ENDPOINT (POSTs each entry when set)",
    },
    commands: describeTarget(app.root),
  };
  this.process.stdout.write(JSON.stringify(schema, null, 2) + "\n");
}

interface CommandDescription {
  brief: string;
  positional?: PositionalDescription[];
  flags?: Record<string, FlagDescription>;
  subcommands?: Record<string, CommandDescription>;
}

interface PositionalDescription {
  name: string;
  brief: string;
  optional?: boolean;
  default?: unknown;
}

interface FlagDescription {
  type: "boolean" | "string" | "number" | "enum" | "counter";
  brief: string;
  default?: unknown;
  optional?: boolean;
  values?: readonly string[];
  variadic?: boolean;
}

function describeTarget(target: unknown): CommandDescription | Record<string, CommandDescription> {
  if (isRouteMap(target)) {
    const subs: Record<string, CommandDescription> = {};
    for (const entry of target.getAllEntries()) {
      if (entry.hidden) continue;
      const displayName =
        entry.name["convert-camel-to-kebab"] ?? entry.name["original"] ?? "<unnamed>";
      subs[displayName] = describeOneTarget(entry.target);
    }
    return subs;
  }
  return describeOneTarget(target);
}

function describeOneTarget(target: unknown): CommandDescription {
  if (isCommand(target)) {
    return describeCommand(target);
  }
  if (isRouteMap(target)) {
    const subs: Record<string, CommandDescription> = {};
    for (const entry of target.getAllEntries()) {
      if (entry.hidden) continue;
      const displayName =
        entry.name["convert-camel-to-kebab"] ?? entry.name["original"] ?? "<unnamed>";
      subs[displayName] = describeOneTarget(entry.target);
    }
    return { brief: target.brief, subcommands: subs };
  }
  return { brief: "<unknown>" };
}

function describeCommand(cmd: {
  brief: string;
  parameters: { flags?: Record<string, unknown>; positional?: unknown };
}): CommandDescription {
  const description: CommandDescription = { brief: cmd.brief };

  const positional = describePositional(cmd.parameters.positional);
  if (positional.length > 0) description.positional = positional;

  const flags = cmd.parameters.flags;
  if (flags && Object.keys(flags).length > 0) {
    description.flags = {};
    for (const [key, def] of Object.entries(flags)) {
      const displayKey = `--${camelToKebab(key)}`;
      description.flags[displayKey] = describeFlag(def);
    }
  }

  return description;
}

function describePositional(positional: unknown): PositionalDescription[] {
  if (!positional || typeof positional !== "object") return [];
  const p = positional as { kind?: string; parameters?: unknown[] };
  if (p.kind !== "tuple" || !Array.isArray(p.parameters)) return [];
  return p.parameters.map((param, idx) => {
    const entry = param as {
      brief?: string;
      placeholder?: string;
      optional?: boolean;
      default?: unknown;
    };
    return {
      name: entry.placeholder ?? `arg${idx + 1}`,
      brief: entry.brief ?? "",
      ...(entry.optional ? { optional: true } : {}),
      ...(entry.default !== undefined ? { default: entry.default } : {}),
    };
  });
}

function describeFlag(def: unknown): FlagDescription {
  const d = def as {
    kind: string;
    brief?: string;
    default?: unknown;
    optional?: boolean;
    values?: readonly string[];
    variadic?: boolean;
  };
  const base: FlagDescription = {
    type: mapFlagKind(d.kind),
    brief: d.brief ?? "",
  };
  if (d.default !== undefined) base.default = d.default;
  if (d.optional) base.optional = true;
  if (d.values) base.values = d.values;
  if (d.variadic) base.variadic = true;
  return base;
}

function mapFlagKind(kind: string): FlagDescription["type"] {
  switch (kind) {
    case "boolean":
      return "boolean";
    case "enum":
      return "enum";
    case "counter":
      return "counter";
    case "parsed":
      // Stricli stores the parser function; we don't introspect it. Default to string;
      // commands that use Number get flagged as string here — acceptable trade-off for
      // automatic schema. Override with explicit metadata if it ever matters for an agent.
      return "string";
    default:
      return "string";
  }
}

function camelToKebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function isRouteMap(target: unknown): target is {
  brief: string;
  getAllEntries: () => Array<{
    name: Record<string, string>;
    target: unknown;
    hidden: boolean;
  }>;
} {
  return (
    typeof target === "object" &&
    target !== null &&
    typeof (target as { getAllEntries?: unknown }).getAllEntries === "function"
  );
}

function isCommand(target: unknown): target is {
  brief: string;
  parameters: { flags?: Record<string, unknown>; positional?: unknown };
} {
  return (
    typeof target === "object" &&
    target !== null &&
    "parameters" in target &&
    typeof (target as { usesFlag?: unknown }).usesFlag === "function"
  );
}
