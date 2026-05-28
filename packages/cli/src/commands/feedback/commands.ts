import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";

export const recordCommand = buildCommand({
  loader: async () => {
    const { record } = await import("./impl.js");
    return record;
  },
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [{ brief: "Feedback text (wrap in quotes)", parse: String }],
    },
    flags: { ...outputFlagDefs },
  },
  docs: {
    brief: "Record agent feedback locally (and upstream if ROLLBAR_FEEDBACK_ENDPOINT is set)",
  },
});

export const listFeedbackCommand = buildCommand({
  loader: async () => {
    const { list } = await import("./impl.js");
    return list;
  },
  parameters: {
    positional: { kind: "tuple", parameters: [] },
    flags: {
      ...outputFlagDefs,
      limit: {
        kind: "parsed",
        parse: Number,
        brief: "Most recent N entries to return",
        default: "20",
      },
    },
  },
  docs: { brief: "List recent local feedback entries" },
});

// `feedback "text"` defaults to record; `feedback list` shows recent entries.
export const feedbackRoutes = buildRouteMap({
  routes: {
    record: recordCommand,
    list: listFeedbackCommand,
  },
  defaultCommand: "record",
  docs: { brief: "Send feedback about CLI friction to the local log (and optional upstream)" },
});
