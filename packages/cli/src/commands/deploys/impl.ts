import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

interface ListDeploysFlags extends OutputFlags, ClientFlags {
  readonly projectId?: number;
  readonly environment?: string;
  readonly limit: number;
  readonly page: number;
}

export async function list(this: LocalContext, flags: ListDeploysFlags): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.listDeploys({
    projectId: flags.projectId,
    environment: flags.environment,
    limit: flags.limit,
    page: flags.page,
  });
  await writeOutput(this.process.stdout, result, flags);
}

export async function get(
  this: LocalContext,
  flags: ClientFlags & OutputFlags,
  deployId: number,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.getDeploy(deployId);
  await writeOutput(this.process.stdout, result, flags);
}
