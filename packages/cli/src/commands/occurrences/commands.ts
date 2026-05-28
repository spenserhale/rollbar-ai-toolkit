import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";

export const listCommand = buildCommand({
  loader: async () => {
    const { list } = await import("./impl.js");
    return list;
  },
  parameters: {
    positional: { kind: "tuple", parameters: [] },
    flags: {
      ...outputFlagDefs,
      itemId: {
        kind: "parsed",
        parse: Number,
        brief: "Filter by item ID",
        optional: true,
      },
      limit: {
        kind: "parsed",
        parse: Number,
        brief: "Maximum number of occurrences to return",
        default: "20",
      },
      page: {
        kind: "parsed",
        parse: Number,
        brief: "Page number for pagination",
        default: "1",
      },
      token: {
        kind: "parsed",
        parse: String,
        brief: "Project access token override",
        optional: true,
      },
    },
  },
  docs: { brief: "List occurrences of errors" },
});

export const getCommand = buildCommand({
  loader: async () => {
    const { get } = await import("./impl.js");
    return get;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Occurrence ID", parse: String }],
    },
    flags: {
      ...outputFlagDefs,
      token: {
        kind: "parsed",
        parse: String,
        brief: "Project access token override",
        optional: true,
      },
    },
  },
  docs: { brief: "Get a specific occurrence" },
});

export const occurrencesRoutes = buildRouteMap({
  routes: {
    list: listCommand,
    get: getCommand,
  },
  docs: { brief: "Manage Rollbar occurrences" },
});
