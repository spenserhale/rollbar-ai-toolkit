import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

interface ListItemsFlags extends OutputFlags, ClientFlags {
  readonly status?: "active" | "resolved" | "muted" | "archived";
  readonly level?: "critical" | "error" | "warning" | "info" | "debug";
  readonly environment?: string;
  readonly limit: number;
  readonly page: number;
}

export async function list(this: LocalContext, flags: ListItemsFlags): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.listItems({
    status: flags.status,
    level: flags.level,
    environment: flags.environment,
    limit: flags.limit,
    page: flags.page,
  });
  await writeOutput(this.process.stdout, result, flags);
}

export async function get(
  this: LocalContext,
  flags: ClientFlags & OutputFlags,
  id: string,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.getItem(Number(id));
  await writeOutput(this.process.stdout, result, flags);
}

export async function getByCounter(
  this: LocalContext,
  flags: ClientFlags & OutputFlags,
  counter: number,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.getItemByCounter(counter);
  await writeOutput(this.process.stdout, result, flags);
}

export async function getByUuid(
  this: LocalContext,
  flags: ClientFlags & OutputFlags,
  uuid: string,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.getItemByUuid(uuid);
  await writeOutput(this.process.stdout, result, flags);
}

interface TopItemsFlags extends OutputFlags, ClientFlags {
  readonly window: string;
  readonly limit: number;
  readonly status: "active" | "resolved" | "muted" | "archived";
  readonly level?: "critical" | "error" | "warning" | "info" | "debug";
  readonly environment?: string;
}

export async function top(this: LocalContext, flags: TopItemsFlags): Promise<void> {
  const client = await buildClientForFlags(flags);
  const items = await client.listTopItems({
    window: flags.window,
    limit: flags.limit,
    status: flags.status,
    level: flags.level,
    environment: flags.environment,
  });
  await writeOutput(this.process.stdout, { items }, flags);
}
