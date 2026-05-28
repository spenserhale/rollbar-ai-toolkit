import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";

interface TopItemDetailsFlags extends OutputFlags {
  readonly window: string;
  readonly limit: number;
  readonly status: string;
  readonly level?: string;
  readonly environment?: string;
  readonly includeVars?: boolean;
  readonly token?: string;
}

export async function topItemDetails(
  this: LocalContext,
  flags: TopItemDetailsFlags,
): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.listTopItemDetails({
    window: flags.window,
    limit: flags.limit,
    status: flags.status,
    level: flags.level,
    environment: flags.environment,
    includeVars: flags.includeVars,
  });

  writeOutput(this.process.stdout, result, flags);
}
