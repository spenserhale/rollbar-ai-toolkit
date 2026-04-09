import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";

interface ListUsersFlags {
  readonly token?: string;
}

export async function list(this: LocalContext, flags: ListUsersFlags): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ accountToken: flags.token }))
    : this.rollbar;

  const result = await client.listUsers();
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

interface GetUserFlags {
  readonly token?: string;
}

export async function get(this: LocalContext, flags: GetUserFlags, id: number): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ accountToken: flags.token }))
    : this.rollbar;

  const result = await client.getUser(id);
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}
