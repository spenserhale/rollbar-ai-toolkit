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
