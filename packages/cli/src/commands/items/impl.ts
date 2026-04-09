import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";

interface ListItemsFlags {
  readonly status?: string;
  readonly level?: string;
  readonly environment?: string;
  readonly limit: number;
  readonly page: number;
  readonly token?: string;
}

export async function list(this: LocalContext, flags: ListItemsFlags): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.listItems({
    status: flags.status,
    level: flags.level,
    environment: flags.environment,
    limit: flags.limit,
    page: flags.page,
  });

  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

interface GetItemFlags {
  readonly token?: string;
}

export async function get(this: LocalContext, flags: GetItemFlags, id: number): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getItem(id);
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

interface GetByCounterFlags {
  readonly token?: string;
}

export async function getByCounter(
  this: LocalContext,
  flags: GetByCounterFlags,
  counter: number
): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getItemByCounter(counter);
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

interface GetByUuidFlags {
  readonly token?: string;
}

export async function getByUuid(
  this: LocalContext,
  flags: GetByUuidFlags,
  uuid: string
): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getItemByUuid(uuid);
  this.process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}
