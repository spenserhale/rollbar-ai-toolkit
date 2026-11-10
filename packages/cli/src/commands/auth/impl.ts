import { bunSecretStore } from "@rollbar-toolkit/sdk";
import { loadCliConfig } from "../../client-flags.js";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { ValidationError } from "../../validation.js";
import {
  parseResourceId,
  selectCredentialKeys,
  setCredentials,
  listCredentials,
  deleteCredentials,
  migrateCredentials,
} from "../../lib/auth.js";
import { promptHidden, readAllStdin, stdinIsInteractive } from "../../lib/prompt.js";

interface AuthFlags extends OutputFlags {
  readonly dryRun: boolean;
  readonly text: boolean;
}
interface SetFlags extends AuthFlags {
  readonly key?: string;
  readonly stdin: boolean;
}
interface DeleteFlags extends AuthFlags {
  readonly key?: string;
  readonly yes: boolean;
}
interface MigrateFlags extends AuthFlags {
  readonly overwrite: boolean;
}
function validateOutput(flags: AuthFlags, allowCsv = false) {
  if ([flags.json, flags.csv, flags.toon, flags.text].filter(Boolean).length > 1)
    throw new ValidationError("Choose one output format: --toon, --json, --csv, --text.");
  if (flags.csv && !allowCsv)
    throw new ValidationError(
      "--csv is supported by auth list only; use --toon, --json, or --text.",
    );
  if (flags.deliver === "file:" || flags.deliver === "webhook:")
    throw new ValidationError("--deliver requires a nonempty file path or webhook URL.");
  if (
    flags.deliver &&
    flags.deliver !== "stdout" &&
    !flags.deliver.startsWith("file:") &&
    !flags.deliver.startsWith("webhook:")
  )
    throw new ValidationError(
      `Unknown --deliver "${flags.deliver}". Valid: stdout, file:<path>, webhook:<url>.`,
    );
}
export async function set(this: LocalContext, flags: SetFlags, raw: string) {
  validateOutput(flags);
  const resource = parseResourceId(raw);
  const keys = selectCredentialKeys(resource, flags.key);
  if (flags.stdin && keys.length !== 1)
    throw new ValidationError(
      `--stdin needs --key for ${resource}. Example: rollbar auth set ${resource} --key ${keys[0]} --stdin`,
    );
  if (!flags.stdin && !stdinIsInteractive())
    throw new ValidationError(
      `No TTY; pipe a value: pbpaste | rollbar auth set ${resource} --key ${keys[0]} --stdin`,
    );
  const config = await loadCliConfig({}, null);
  const result = await setCredentials({
    resource,
    keys,
    config,
    store: bunSecretStore(),
    dryRun: flags.dryRun,
    readValue: flags.stdin ? readAllStdin : (key) => promptHidden(`${key}: `),
  });
  await writeOutput(this.process.stdout, result, flags);
}
export async function list(this: LocalContext, flags: AuthFlags) {
  validateOutput(flags, true);
  const result = await listCredentials(bunSecretStore(), await loadCliConfig());
  await writeOutput(this.process.stdout, flags.csv ? result.credentials : result, flags);
}
export async function remove(this: LocalContext, flags: DeleteFlags, raw: string) {
  validateOutput(flags);
  const resource = parseResourceId(raw);
  const keys = selectCredentialKeys(resource, flags.key);
  if (!flags.yes)
    throw new ValidationError(
      "Deleting credentials requires --yes. Example: rollbar auth delete project --yes",
    );
  await writeOutput(
    this.process.stdout,
    await deleteCredentials({ resource, keys, store: bunSecretStore(), dryRun: flags.dryRun }),
    flags,
  );
}
export async function migrate(this: LocalContext, flags: MigrateFlags) {
  validateOutput(flags);
  const result = await migrateCredentials({
    store: bunSecretStore(),
    config: await loadCliConfig({}, null),
    dryRun: flags.dryRun,
    overwrite: Boolean(flags.overwrite),
  });
  await writeOutput(
    this.process.stdout,
    {
      ...result,
      hint: "Remove migrated credentials from the listed files yourself; .env values keep overriding the keychain until deleted.",
    },
    flags,
  );
}
