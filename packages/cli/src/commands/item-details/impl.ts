import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

interface ItemDetailsFlags extends OutputFlags, ClientFlags {
  readonly includeVars?: boolean;
}

export async function get(this: LocalContext, flags: ItemDetailsFlags, id: number): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.getItemDetailed(id, { includeVars: flags.includeVars });
  await writeOutput(this.process.stdout, result, flags);
}

export async function getByCounter(
  this: LocalContext,
  flags: ItemDetailsFlags,
  counter: number,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const item = await client.getItemByCounter(counter);
  const result = await client.getItemDetailed(item.id, { includeVars: flags.includeVars });
  await writeOutput(this.process.stdout, result, flags);
}

interface TopItemDetailsFlags extends OutputFlags, ClientFlags {
  readonly window: string;
  readonly limit: number;
  readonly status: "active" | "resolved" | "muted" | "archived";
  readonly level?: "critical" | "error" | "warning" | "info" | "debug";
  readonly environment?: string;
  readonly includeVars?: boolean;
}

export async function top(this: LocalContext, flags: TopItemDetailsFlags): Promise<void> {
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
