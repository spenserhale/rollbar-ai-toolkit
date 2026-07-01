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
      parameters: [
        {
          brief: "The RQL query string (must include your own LIMIT for large scans)",
          parse: String,
        },
      ],
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
      parameters: [
        {
          brief: "Domain / host / URL substring to match against occurrence request URLs",
          parse: String,
        },
      ],
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
    brief:
      "List the distinct affected users for an item (id/username/email + per-user occurrence count)",
  },
});
