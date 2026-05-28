import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";
import { readStore, writeStore, type ProfileEntry } from "../../profile-store.js";
import { ValidationError } from "../../validation.js";

interface SaveFlags extends OutputFlags {
  readonly projectToken?: string;
  readonly accountToken?: string;
  readonly baseUrl?: string;
  readonly projectId?: number;
  readonly setDefault: boolean;
}

export async function save(this: LocalContext, flags: SaveFlags, name: string): Promise<void> {
  if (
    !flags.projectToken &&
    !flags.accountToken &&
    !flags.baseUrl &&
    flags.projectId === undefined
  ) {
    throw new ValidationError(
      "save requires at least one of --project-token, --account-token, --base-url, --project-id",
    );
  }
  const file = await readStore();
  const existing = file.profiles[name] ?? {};
  const next: ProfileEntry = {
    ...existing,
    ...(flags.projectToken !== undefined ? { projectToken: flags.projectToken } : {}),
    ...(flags.accountToken !== undefined ? { accountToken: flags.accountToken } : {}),
    ...(flags.baseUrl !== undefined ? { baseUrl: flags.baseUrl } : {}),
    ...(flags.projectId !== undefined ? { projectId: flags.projectId } : {}),
  };
  await writeStore({
    profiles: { ...file.profiles, [name]: next },
    default: flags.setDefault ? name : file.default,
  });
  await writeOutput(
    this.process.stdout,
    {
      saved: name,
      is_default: flags.setDefault || file.default === name,
      keys: Object.keys(next),
    },
    flags,
  );
}

export async function use(this: LocalContext, flags: OutputFlags, name: string): Promise<void> {
  const file = await readStore();
  if (!file.profiles[name]) {
    const available = Object.keys(file.profiles).sort();
    throw new ValidationError(
      available.length > 0
        ? `profile not found: "${name}". Available: ${available.join(", ")}`
        : `profile not found: "${name}". No profiles saved yet.`,
    );
  }
  await writeStore({ profiles: file.profiles, default: name });
  await writeOutput(this.process.stdout, { default: name }, flags);
}

export async function list(this: LocalContext, flags: OutputFlags): Promise<void> {
  const file = await readStore();
  const profiles = Object.entries(file.profiles)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, entry]) => ({
      name,
      is_default: name === file.default,
      keys: Object.keys(entry),
    }));
  await writeOutput(this.process.stdout, { profiles, default: file.default }, flags);
}

interface ShowFlags extends OutputFlags {
  readonly revealTokens: boolean;
}

export async function show(this: LocalContext, flags: ShowFlags, name: string): Promise<void> {
  const file = await readStore();
  const entry = file.profiles[name];
  if (!entry) {
    const available = Object.keys(file.profiles).sort();
    throw new ValidationError(
      available.length > 0
        ? `profile not found: "${name}". Available: ${available.join(", ")}`
        : `profile not found: "${name}".`,
    );
  }
  const redacted = flags.revealTokens
    ? entry
    : {
        ...entry,
        projectToken: redact(entry.projectToken),
        accountToken: redact(entry.accountToken),
      };
  await writeOutput(
    this.process.stdout,
    { name, is_default: name === file.default, ...redacted },
    flags,
  );
}

interface DeleteFlags extends OutputFlags {
  readonly force: boolean;
}

export async function remove(this: LocalContext, flags: DeleteFlags, name: string): Promise<void> {
  if (!flags.force) {
    throw new ValidationError("delete is destructive; pass --force to confirm");
  }
  const file = await readStore();
  if (!file.profiles[name]) {
    throw new ValidationError(`profile not found: "${name}"`);
  }
  const { [name]: _, ...remaining } = file.profiles;
  await writeStore({
    profiles: remaining,
    default: file.default === name ? undefined : file.default,
  });
  await writeOutput(this.process.stdout, { deleted: name }, flags);
}

function redact(token: string | undefined): string | undefined {
  if (!token) return token;
  if (token.length <= 4) return "****";
  return `****${token.slice(-4)}`;
}
