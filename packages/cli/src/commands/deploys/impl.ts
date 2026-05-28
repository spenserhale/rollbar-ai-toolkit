import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";

interface ListDeploysFlags extends OutputFlags {
  readonly projectId?: number;
  readonly environment?: string;
  readonly limit: number;
  readonly page: number;
  readonly token?: string;
}

export async function list(this: LocalContext, flags: ListDeploysFlags): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.listDeploys({
    projectId: flags.projectId,
    environment: flags.environment,
    limit: flags.limit,
    page: flags.page,
  });

  writeOutput(this.process.stdout, result, flags);
}

interface GetDeployFlags extends OutputFlags {
  readonly token?: string;
}

export async function get(
  this: LocalContext,
  flags: GetDeployFlags,
  deployId: number,
): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getDeploy(deployId);
  writeOutput(this.process.stdout, result, flags);
}
