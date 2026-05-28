import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";
import { clientFlagDefs } from "../../client-flags.js";

export const getCommand = buildCommand({
  loader: async () => {
    const { get } = await import("./impl.js");
    return get;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Item ID",
          parse: Number,
        },
      ],
    },
    flags: {
      ...outputFlagDefs,
      includeVars: {
        kind: "boolean",
        brief: "Include local variables from stack trace frames (may contain secrets)",
        optional: true,
      },
      ...clientFlagDefs,
    },
  },
  docs: {
    brief: "Get an item with its latest occurrence and stack trace",
  },
});

export const getByCounterCommand = buildCommand({
  loader: async () => {
    const { getByCounter } = await import("./impl.js");
    return getByCounter;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Project counter (visible in Rollbar UI)",
          parse: Number,
        },
      ],
    },
    flags: {
      ...outputFlagDefs,
      includeVars: {
        kind: "boolean",
        brief: "Include local variables from stack trace frames (may contain secrets)",
        optional: true,
      },
      ...clientFlagDefs,
    },
  },
  docs: {
    brief: "Get an item by project counter with its latest occurrence and stack trace",
  },
});

export const itemDetailsRoutes = buildRouteMap({
  routes: {
    get: getCommand,
    "get-by-counter": getByCounterCommand,
  },
  docs: {
    brief: "Item details — item metadata combined with its latest occurrence and stack trace",
  },
});
