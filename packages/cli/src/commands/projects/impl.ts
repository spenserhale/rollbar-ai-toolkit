import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";

interface ListFlags extends OutputFlags {
  readonly token?: string;
}

export async function list(this: LocalContext, flags: ListFlags): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ accountToken: flags.token }))
    : this.rollbar;

  const result = await client.listProjects();
  writeOutput(this.process.stdout, result, flags);
}

interface GetFlags extends OutputFlags {
  readonly token?: string;
}

export async function get(this: LocalContext, flags: GetFlags, id: number): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ accountToken: flags.token }))
    : this.rollbar;

  const result = await client.getProject(id);
  writeOutput(this.process.stdout, result, flags);
}
