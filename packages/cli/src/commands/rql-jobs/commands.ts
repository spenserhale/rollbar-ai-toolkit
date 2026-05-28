import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";
import { clientFlagDefs } from "../../client-flags.js";

// Keep this string in the command help text — agents read --help to decide whether
// they're holding the CLI right, and an unbounded RQL query can run for minutes.
const RQL_LIMIT_HINT =
  "Tip: include `LIMIT 10` or `LIMIT 100` in your RQL — unbounded queries can run for minutes and may time out.";

export const createCommand = buildCommand({
  loader: async () => {
    const { create } = await import("./impl.js");
    return create;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: 'The RQL query string (e.g. "SELECT * FROM item_occurrence LIMIT 10")',
          parse: String,
        },
      ],
    },
    flags: {
      ...outputFlagDefs,
      wait: {
        kind: "boolean",
        brief: "Block until the job reaches a terminal status, then fetch results inline",
        default: false,
      },
      timeout: {
        kind: "parsed",
        parse: Number,
        brief: "Seconds to wait when --wait is set (default 300)",
        default: "300",
      },
      pollInterval: {
        kind: "parsed",
        parse: Number,
        brief: "Initial poll interval in seconds when --wait is set (default 1; backs off to 10)",
        default: "1",
      },
      forceRefresh: {
        kind: "boolean",
        brief: "Bypass Rollbar's query cache and force a fresh execution",
        default: false,
      },
      ...clientFlagDefs,
    },
  },
  docs: {
    brief: `Submit an RQL query as a job. Returns the job ID. ${RQL_LIMIT_HINT}`,
  },
});

export const listCommand = buildCommand({
  loader: async () => {
    const { list } = await import("./impl.js");
    return list;
  },
  parameters: {
    positional: { kind: "tuple", parameters: [] },
    flags: {
      ...outputFlagDefs,
      page: {
        kind: "parsed",
        parse: Number,
        brief: "Page number for pagination",
        default: "1",
      },
      ...clientFlagDefs,
    },
  },
  docs: { brief: "List RQL jobs for the project (or account, with an account token)" },
});

export const getCommand = buildCommand({
  loader: async () => {
    const { get } = await import("./impl.js");
    return get;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "RQL job ID", parse: Number }],
    },
    flags: {
      ...outputFlagDefs,
      withResults: {
        kind: "boolean",
        brief: "Include the job's result inline (sets ?expand=result on the API call)",
        default: false,
      },
      ...clientFlagDefs,
    },
  },
  docs: { brief: "Check the status of an RQL job by ID" },
});

export const resultsCommand = buildCommand({
  loader: async () => {
    const { results } = await import("./impl.js");
    return results;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "RQL job ID", parse: Number }],
    },
    flags: {
      ...outputFlagDefs,
      ...clientFlagDefs,
    },
  },
  docs: { brief: "Fetch the rows of a completed RQL job" },
});

export const cancelCommand = buildCommand({
  loader: async () => {
    const { cancel } = await import("./impl.js");
    return cancel;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "RQL job ID", parse: Number }],
    },
    flags: {
      ...outputFlagDefs,
      force: {
        kind: "boolean",
        brief: "Required (non-interactive confirm bypass; cancel transitions the job to cancelled)",
        default: false,
      },
      ...clientFlagDefs,
    },
  },
  docs: { brief: "Cancel an in-flight RQL job (requires --force)" },
});

export const rqlJobsRoutes = buildRouteMap({
  routes: {
    create: createCommand,
    list: listCommand,
    get: getCommand,
    results: resultsCommand,
    cancel: cancelCommand,
  },
  docs: {
    brief: `Manage Rollbar Query Language (RQL) jobs. ${RQL_LIMIT_HINT}`,
  },
});
