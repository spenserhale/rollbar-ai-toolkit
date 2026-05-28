import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";

export const saveCommand = buildCommand({
  loader: async () => {
    const { save } = await import("./impl.js");
    return save;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Profile name", parse: String }],
    },
    flags: {
      ...outputFlagDefs,
      projectToken: {
        kind: "parsed",
        parse: String,
        brief: "Rollbar project access token to store in the profile",
        optional: true,
      },
      accountToken: {
        kind: "parsed",
        parse: String,
        brief: "Rollbar account access token to store in the profile",
        optional: true,
      },
      baseUrl: {
        kind: "parsed",
        parse: String,
        brief: "Override API base URL for this profile",
        optional: true,
      },
      projectId: {
        kind: "parsed",
        parse: Number,
        brief: "Default project ID for this profile",
        optional: true,
      },
      setDefault: {
        kind: "boolean",
        brief: "Mark this profile as the default for new invocations",
        default: false,
      },
    },
  },
  docs: { brief: "Save a named profile of Rollbar credentials and defaults" },
});

export const useCommand = buildCommand({
  loader: async () => {
    const { use } = await import("./impl.js");
    return use;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Profile name to mark default", parse: String }],
    },
    flags: { ...outputFlagDefs },
  },
  docs: { brief: "Set the default profile used when --profile is not supplied" },
});

export const listCommand = buildCommand({
  loader: async () => {
    const { list } = await import("./impl.js");
    return list;
  },
  parameters: {
    positional: { kind: "tuple", parameters: [] },
    flags: { ...outputFlagDefs },
  },
  docs: { brief: "List all saved profiles" },
});

export const showCommand = buildCommand({
  loader: async () => {
    const { show } = await import("./impl.js");
    return show;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Profile name", parse: String }],
    },
    flags: {
      ...outputFlagDefs,
      revealTokens: {
        kind: "boolean",
        brief: "Print full token values (default redacts to ****last4)",
        default: false,
      },
    },
  },
  docs: { brief: "Show a profile's contents (tokens redacted by default)" },
});

export const deleteCommand = buildCommand({
  loader: async () => {
    const { remove } = await import("./impl.js");
    return remove;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Profile name", parse: String }],
    },
    flags: {
      ...outputFlagDefs,
      force: {
        kind: "boolean",
        brief: "Required for delete (non-interactive confirm bypass)",
        default: false,
      },
    },
  },
  docs: { brief: "Delete a saved profile (requires --force)" },
});

export const profileRoutes = buildRouteMap({
  routes: {
    save: saveCommand,
    use: useCommand,
    list: listCommand,
    show: showCommand,
    delete: deleteCommand,
  },
  docs: { brief: "Manage named Rollbar profiles (~/.rollbar/profiles.json)" },
});
