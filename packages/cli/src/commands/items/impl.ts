import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";

interface ListItemsFlags extends OutputFlags {
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

  writeOutput(this.process.stdout, result, flags);
}

interface GetItemFlags extends OutputFlags {
  readonly token?: string;
}

export async function get(this: LocalContext, flags: GetItemFlags, id: string): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getItem(Number(id));
  writeOutput(this.process.stdout, result, flags);
}

interface GetByCounterFlags extends OutputFlags {
  readonly token?: string;
}

export async function getByCounter(
  this: LocalContext,
  flags: GetByCounterFlags,
  counter: number,
): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getItemByCounter(counter);
  writeOutput(this.process.stdout, result, flags);
}

interface GetByUuidFlags extends OutputFlags {
  readonly token?: string;
}

export async function getByUuid(
  this: LocalContext,
  flags: GetByUuidFlags,
  uuid: string,
): Promise<void> {
  const client = flags.token
    ? new RollbarClient(resolveConfig({ projectToken: flags.token }))
    : this.rollbar;

  const result = await client.getItemByUuid(uuid);
  writeOutput(this.process.stdout, result, flags);
}
