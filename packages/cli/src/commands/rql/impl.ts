import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

interface WaitFlags {
  readonly timeout: number;
  readonly pollInterval: number;
}

interface QueryFlags extends OutputFlags, ClientFlags, WaitFlags {
  readonly enrich: boolean;
  readonly limit: number;
  readonly window?: string;
  readonly includeVars?: boolean;
}

export async function query(
  this: LocalContext,
  flags: QueryFlags,
  queryString: string,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const outcome = await client.rqlQuery({
    queryString,
    limit: flags.limit,
    window: flags.window,
    enrich: flags.enrich,
    includeVars: flags.includeVars,
    timeoutMs: flags.timeout * 1000,
    initialIntervalMs: flags.pollInterval * 1000,
  });
  for (const w of outcome.warnings) {
    this.process.stderr.write(`warning: ${w}\n`);
  }
  const data = outcome.items ? { items: outcome.items } : outcome.result;
  await writeOutput(this.process.stdout, data, flags);
}

interface ByUrlFlags extends OutputFlags, ClientFlags, WaitFlags {
  readonly limit: number;
  readonly window: string;
  readonly includeVars?: boolean;
}

export async function byUrl(
  this: LocalContext,
  flags: ByUrlFlags,
  domain: string,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const items = await client.rqlByUrl({
    domain,
    limit: flags.limit,
    window: flags.window,
    includeVars: flags.includeVars,
    timeoutMs: flags.timeout * 1000,
    initialIntervalMs: flags.pollInterval * 1000,
  });
  await writeOutput(this.process.stdout, { items }, flags);
}

interface AffectedUsersFlags extends OutputFlags, ClientFlags, WaitFlags {
  readonly limit: number;
  readonly window: string;
}

export async function affectedUsers(
  this: LocalContext,
  flags: AffectedUsersFlags,
  itemId: number,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const users = await client.rqlAffectedUsers({
    itemId,
    limit: flags.limit,
    window: flags.window,
    timeoutMs: flags.timeout * 1000,
    initialIntervalMs: flags.pollInterval * 1000,
  });
  await writeOutput(this.process.stdout, { users }, flags);
}
