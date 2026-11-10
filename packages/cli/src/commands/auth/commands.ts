import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";
const flags = {
  ...outputFlagDefs,
  text: { kind: "boolean" as const, brief: "Render human-readable TOON text", default: false },
  dryRun: {
    kind: "boolean" as const,
    brief: "Preview without writing credentials",
    default: false,
  },
};
const key = {
  kind: "parsed" as const,
  parse: String,
  brief: "Credential environment variable name",
  optional: true as const,
};
const positional = {
  kind: "tuple" as const,
  parameters: [{ brief: "Resource: rollbar, project, account", parse: String }] as const,
};
const set = buildCommand({
  loader: async () => (await import("./impl.js")).set,
  parameters: {
    positional,
    flags: {
      ...flags,
      key,
      stdin: {
        kind: "boolean",
        brief: "Read one credential explicitly from stdin",
        default: false,
      },
    },
  },
  docs: { brief: "Store credentials in the OS keychain (hidden prompt or --stdin)" },
});
const list = buildCommand({
  loader: async () => (await import("./impl.js")).list,
  parameters: { flags },
  docs: { brief: "List keychain state and active sources without secret values" },
});
const remove = buildCommand({
  loader: async () => (await import("./impl.js")).remove,
  parameters: {
    positional,
    flags: {
      ...flags,
      key,
      yes: { kind: "boolean", brief: "Confirm credential deletion", default: false },
    },
  },
  docs: { brief: "Delete keychain credentials (requires --yes)" },
});
const migrate = buildCommand({
  loader: async () => (await import("./impl.js")).migrate,
  parameters: {
    flags: {
      ...flags,
      overwrite: { kind: "boolean", brief: "Replace existing keychain entries", default: false },
    },
  },
  docs: { brief: "Copy plaintext credentials to the keychain; leaves files unchanged" },
});
export const authRoutes = buildRouteMap({
  routes: { set, list, delete: remove, migrate },
  docs: { brief: "Manage OS keychain credentials" },
});
