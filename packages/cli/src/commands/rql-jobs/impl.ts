import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";
import { ValidationError } from "../../validation.js";

interface CreateFlags extends OutputFlags, ClientFlags {
  readonly wait: boolean;
  readonly timeout: number;
  readonly pollInterval: number;
  readonly forceRefresh: boolean;
}

export async function create(
  this: LocalContext,
  flags: CreateFlags,
  queryString: string,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const job = await client.createRqlJob({
    queryString,
    forceRefresh: flags.forceRefresh,
  });

  if (!flags.wait) {
    await writeOutput(this.process.stdout, job, flags);
    return;
  }

  const final = await client.waitForRqlJob(job.id, {
    timeoutMs: flags.timeout * 1000,
    initialIntervalMs: flags.pollInterval * 1000,
  });

  // When the job finished successfully, fetch results in the same invocation so
  // the agent gets a complete answer in one call. For non-success terminal states
  // (failed/cancelled/timed_out) return the job record — no rows to fetch.
  if (final.status === "success") {
    const result = await client.getRqlJobResults(final.id);
    await writeOutput(this.process.stdout, { job: final, result: result.result }, flags);
    return;
  }

  await writeOutput(this.process.stdout, final, flags);
}

interface ListFlags extends OutputFlags, ClientFlags {
  readonly page: number;
}

export async function list(this: LocalContext, flags: ListFlags): Promise<void> {
  const client = await buildClientForFlags(flags);
  const jobs = await client.listRqlJobs({ page: flags.page });
  await writeOutput(this.process.stdout, { jobs }, flags);
}

interface GetFlags extends OutputFlags, ClientFlags {
  readonly withResults: boolean;
}

export async function get(this: LocalContext, flags: GetFlags, id: number): Promise<void> {
  const client = await buildClientForFlags(flags);
  const job = await client.getRqlJob(id, { expandResult: flags.withResults });
  await writeOutput(this.process.stdout, job, flags);
}

export async function results(
  this: LocalContext,
  flags: OutputFlags & ClientFlags,
  id: number,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.getRqlJobResults(id);
  await writeOutput(this.process.stdout, result, flags);
}

interface CancelFlags extends OutputFlags, ClientFlags {
  readonly force: boolean;
}

export async function cancel(this: LocalContext, flags: CancelFlags, id: number): Promise<void> {
  if (!flags.force) {
    throw new ValidationError("cancel changes job state; pass --force to confirm");
  }
  const client = await buildClientForFlags(flags);
  const job = await client.cancelRqlJob(id);
  await writeOutput(this.process.stdout, job, flags);
}
