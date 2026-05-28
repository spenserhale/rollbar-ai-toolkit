import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";

export const listCommand = buildCommand({
  loader: async () => {
    const { list } = await import("./impl.js");
    return list;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [],
    },
    flags: {
      ...outputFlagDefs,
      token: {
        kind: "parsed",
        parse: String,
        brief: "Account access token override",
        optional: true,
      },
    },
  },
  docs: {
    brief: "List all projects",
  },
});

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
          brief: "Project ID",
          parse: Number,
        },
      ],
    },
    flags: {
      ...outputFlagDefs,
      token: {
        kind: "parsed",
        parse: String,
        brief: "Account access token override",
        optional: true,
      },
    },
  },
  docs: {
    brief: "Get a project by ID",
  },
});

export const projectsRoutes = buildRouteMap({
  routes: {
    list: listCommand,
    get: getCommand,
  },
  docs: {
    brief: "Manage Rollbar projects",
  },
});
