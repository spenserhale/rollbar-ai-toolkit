import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";

interface ListFlags {
  readonly token?: string;
}

export async function list(this: LocalContext, flags: ListFlags): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ accountToken: flags.token }))
    : this.rollbar;

  const result = await client.listProjects();
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

interface GetFlags {
  readonly token?: string;
}

export async function get(this: LocalContext, flags: GetFlags, id: number): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ accountToken: flags.token }))
    : this.rollbar;

  const result = await client.getProject(id);
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}
