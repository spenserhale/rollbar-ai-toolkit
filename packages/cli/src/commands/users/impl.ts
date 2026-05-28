import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";

interface ListUsersFlags extends OutputFlags {
  readonly token?: string;
}

export async function list(this: LocalContext, flags: ListUsersFlags): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ accountToken: flags.token }))
    : this.rollbar;

  const result = await client.listUsers();
  writeOutput(this.process.stdout, result, flags);
}

interface GetUserFlags extends OutputFlags {
  readonly token?: string;
}

export async function get(this: LocalContext, flags: GetUserFlags, id: number): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ accountToken: flags.token }))
    : this.rollbar;

  const result = await client.getUser(id);
  writeOutput(this.process.stdout, result, flags);
}
