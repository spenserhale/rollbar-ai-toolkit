import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";

interface ListDeploysFlags {
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

  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

interface GetDeployFlags {
  readonly token?: string;
}

export async function get(
  this: LocalContext,
  flags: GetDeployFlags,
  deployId: number
): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getDeploy(deployId);
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}
