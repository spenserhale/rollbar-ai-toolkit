import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

interface ListFlags extends OutputFlags, ClientFlags {
  readonly itemId?: number;
  readonly limit: number;
  readonly page: number;
}

export async function list(this: LocalContext, flags: ListFlags): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.listOccurrences({
    itemId: flags.itemId,
    limit: flags.limit,
    page: flags.page,
  });
  await writeOutput(this.process.stdout, result, flags);
}

export async function get(
  this: LocalContext,
  flags: ClientFlags & OutputFlags,
  id: string,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.getOccurrence(id);
  await writeOutput(this.process.stdout, result, flags);
}
