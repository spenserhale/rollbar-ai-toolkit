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
      projectId: {
        kind: "parsed",
        parse: Number,
        brief: "Project ID",
        optional: true,
      },
      token: {
        kind: "parsed",
        parse: String,
        brief: "Override project access token",
        optional: true,
      },
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
