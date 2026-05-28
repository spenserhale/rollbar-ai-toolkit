import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";

interface ItemDetailsFlags extends OutputFlags {
  readonly includeVars?: boolean;
  readonly token?: string;
}

export async function get(this: LocalContext, flags: ItemDetailsFlags, id: number): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getItemDetailed(id, { includeVars: flags.includeVars });
  writeOutput(this.process.stdout, result, flags);
}

export async function getByCounter(
  this: LocalContext,
  flags: ItemDetailsFlags,
  counter: number,
): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const item = await client.getItemByCounter(counter);
  const result = await client.getItemDetailed(item.id, { includeVars: flags.includeVars });
  writeOutput(this.process.stdout, result, flags);
}
