import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { buildClientForFlags, type ClientFlags } from "../../client-flags.js";

export async function list(this: LocalContext, flags: ClientFlags & OutputFlags): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.listProjects();
  await writeOutput(this.process.stdout, { projects: result }, flags);
}

export async function get(
  this: LocalContext,
  flags: ClientFlags & OutputFlags,
  id: number,
): Promise<void> {
  const client = await buildClientForFlags(flags);
  const result = await client.getProject(id);
  await writeOutput(this.process.stdout, result, flags);
}
