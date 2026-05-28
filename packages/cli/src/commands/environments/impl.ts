import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";

interface ListEnvironmentsFlags extends OutputFlags {
  readonly projectId?: number;
  readonly token?: string;
}

export async function list(this: LocalContext, flags: ListEnvironmentsFlags): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.listEnvironments(flags.projectId);
  writeOutput(this.process.stdout, result, flags);
}
