import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

interface ListEnvironmentsFlags extends OutputFlags, ClientFlags {
  readonly projectId?: number;
}

export async function list(this: LocalContext, flags: ListEnvironmentsFlags): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.listEnvironments(flags.projectId);
  await writeOutput(this.process.stdout, { environments: result }, flags);
}
