import { buildCommand } from "@stricli/core";

export const agentContextCommand = buildCommand({
  loader: async () => {
    const { agentContext } = await import("./impl.js");
    return agentContext;
  },
  parameters: {
    positional: { kind: "tuple", parameters: [] },
    flags: {},
  },
  docs: {
    brief: "Output a machine-readable schema of all CLI commands, flags, and exit codes",
  },
});
