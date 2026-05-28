import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

interface TopItemDetailsFlags extends OutputFlags, ClientFlags {
  readonly window: string;
  readonly limit: number;
  readonly status: "active" | "resolved" | "muted" | "archived";
  readonly level?: "critical" | "error" | "warning" | "info" | "debug";
  readonly environment?: string;
  readonly includeVars?: boolean;
}

export async function topItemDetails(
  this: LocalContext,
  flags: TopItemDetailsFlags,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.listTopItemDetails({
    window: flags.window,
    limit: flags.limit,
    status: flags.status,
    level: flags.level,
    environment: flags.environment,
    includeVars: flags.includeVars,
  });
  await writeOutput(this.process.stdout, result, flags);
}
