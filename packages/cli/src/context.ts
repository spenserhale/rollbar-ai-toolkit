import type { CommandContext } from "@stricli/core";

export interface LocalContext extends CommandContext {
  readonly process: NodeJS.Process;
}

// The CLI no longer eagerly resolves a default client at startup — handlers
// build one per call via `buildClientForFlags(flags)` so that token/profile
// precedence is honored and config errors only surface on actual API calls
// (not on `--help` or `agent-context`).
export function buildContext(process: NodeJS.Process): LocalContext {
  return { process };
}
