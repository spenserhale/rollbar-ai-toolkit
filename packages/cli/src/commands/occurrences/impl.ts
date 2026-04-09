import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";

interface ListFlags {
  readonly itemId?: number;
  readonly limit: number;
  readonly page: number;
  readonly token?: string;
}

export async function list(this: LocalContext, flags: ListFlags): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.listOccurrences({
    itemId: flags.itemId,
    limit: flags.limit,
    page: flags.page,
  });

  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

interface GetFlags {
  readonly token?: string;
}

export async function get(this: LocalContext, flags: GetFlags, id: string): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getOccurrence(id);
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}
