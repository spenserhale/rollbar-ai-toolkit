import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";
import { clientFlagDefs } from "../../client-flags.js";

export const listCommand = buildCommand({
  loader: async () => {
    const { list } = await import("./impl.js");
    return list;
  },
  parameters: {
    positional: { kind: "tuple", parameters: [] },
    flags: {
      ...outputFlagDefs,
      status: {
        kind: "enum",
        values: ["active", "resolved", "muted", "archived"] as const,
        brief: "Filter by status",
        optional: true,
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
      limit: {
        kind: "parsed",
        parse: Number,
        brief: "Maximum number of items to return",
        default: "20",
      },
      page: {
        kind: "parsed",
        parse: Number,
        brief: "Page number for pagination",
        default: "1",
      },
      ...clientFlagDefs,
    },
  },
  docs: { brief: "List items (errors) from Rollbar" },
});

export const getCommand = buildCommand({
  loader: async () => {
    const { get } = await import("./impl.js");
    return get;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Item ID", parse: String }],
    },
    flags: {
      ...outputFlagDefs,
      ...clientFlagDefs,
    },
  },
  docs: { brief: "Get an item by ID" },
});

export const getByCounterCommand = buildCommand({
  loader: async () => {
    const { getByCounter } = await import("./impl.js");
    return getByCounter;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Project counter (visible in Rollbar UI)", parse: Number }],
    },
    flags: {
      ...outputFlagDefs,
      ...clientFlagDefs,
    },
  },
  docs: { brief: "Get an item by project counter" },
});

export const itemsRoutes = buildRouteMap({
  routes: {
    list: listCommand,
    get: getCommand,
    "get-by-counter": getByCounterCommand,
  },
  docs: { brief: "Manage Rollbar items (errors)" },
});
