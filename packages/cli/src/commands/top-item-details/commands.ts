import { buildCommand } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";
import { clientFlagDefs } from "../../client-flags.js";

export const topItemDetailsCommand = buildCommand({
  loader: async () => {
    const { topItemDetails } = await import("./impl.js");
    return topItemDetails;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [],
    },
    flags: {
      ...outputFlagDefs,
      window: {
        kind: "parsed",
        parse: String,
        brief: "Look-back window: 24h, 7d, 30d, 12w, 3m (default: 30d)",
        default: "30d",
      },
      limit: {
        kind: "parsed",
        parse: Number,
        brief: "Number of top items to return (default: 10)",
        default: "10",
      },
      status: {
        kind: "enum",
        values: ["active", "resolved", "muted", "archived"] as const,
        brief: "Filter by item status",
        default: "active",
      },
      level: {
        kind: "enum",
        values: ["critical", "error", "warning", "info", "debug"] as const,
        brief: "Filter by severity level",
        optional: true,
      },
      environment: {
        kind: "parsed",
        parse: String,
        brief: "Filter by environment",
        optional: true,
      },
      includeVars: {
        kind: "boolean",
        brief: "Include local variables from stack trace frames (may contain secrets)",
        optional: true,
      },
      ...clientFlagDefs,
    },
  },
  docs: {
    brief:
      "List the top N most-occurring items in a time window, each with its latest occurrence and stack trace",
  },
});
