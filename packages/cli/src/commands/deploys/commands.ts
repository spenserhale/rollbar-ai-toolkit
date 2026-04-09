import { buildCommand, buildRouteMap } from "@stricli/core";

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
      projectId: {
        kind: "parsed",
        parse: Number,
        brief: "Project ID",
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
        brief: "Maximum number of deploys to return",
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
        brief: "Override project access token",
        optional: true,
      },
    },
  },
  docs: {
    brief: "List deploys",
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
          brief: "Deploy ID",
          parse: Number,
        },
      ],
    },
    flags: {
      token: {
        kind: "parsed",
        parse: String,
        brief: "Override project access token",
        optional: true,
      },
    },
  },
  docs: {
    brief: "Get a specific deploy",
  },
});

export const deploysRoutes = buildRouteMap({
  routes: {
    list: listCommand,
    get: getCommand,
  },
  docs: {
    brief: "Manage Rollbar deploys",
  },
});
