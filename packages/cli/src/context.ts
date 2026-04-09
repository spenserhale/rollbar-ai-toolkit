import type { CommandContext } from "@stricli/core";
import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";

export interface LocalContext extends CommandContext {
  readonly process: NodeJS.Process;
  readonly rollbar: RollbarClient;
}

export function buildContext(process: NodeJS.Process): LocalContext {
  const rollbar = new RollbarClient(resolveConfig());
  return {
    process,
    rollbar,
  };
}
