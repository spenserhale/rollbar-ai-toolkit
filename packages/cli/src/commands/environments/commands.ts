import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";
import { clientFlagDefs } from "../../client-flags.js";

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
      projectId: {
        kind: "parsed",
        parse: Number,
        brief: "Project ID",
        optional: true,
      },
      ...clientFlagDefs,
    },
  },
  docs: {
    brief: "List environments for a project",
  },
});

export const environmentsRoutes = buildRouteMap({
  routes: {
    list: listCommand,
  },
  docs: {
    brief: "Manage Rollbar environments",
  },
});
