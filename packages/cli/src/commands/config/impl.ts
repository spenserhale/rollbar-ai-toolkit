import { redactedConfig } from "@rollbar-toolkit/sdk";
import { loadCliConfig } from "../../client-flags.js";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
export async function show(this: LocalContext, flags: OutputFlags) {
  await writeOutput(this.process.stdout, redactedConfig(await loadCliConfig()), flags);
}
