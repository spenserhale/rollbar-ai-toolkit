import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { ValidationError } from "./validation.js";

export interface ProfileEntry {
  readonly projectToken?: string;
  readonly accountToken?: string;
  readonly baseUrl?: string;
  readonly projectId?: number;
}

interface ProfileFile {
  readonly profiles: Readonly<Record<string, ProfileEntry>>;
  readonly default?: string;
}

const EMPTY: ProfileFile = { profiles: {} };

function storePath(): string {
  return process.env.ROLLBAR_PROFILES_PATH ?? join(homedir(), ".rollbar", "profiles.json");
}

export async function readStore(): Promise<ProfileFile> {
  try {
    const raw = await readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || typeof parsed.profiles !== "object") return EMPTY;
    return parsed as ProfileFile;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return EMPTY;
    throw err;
  }
}

export async function writeStore(file: ProfileFile): Promise<void> {
  const path = storePath();
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.tmp.${process.pid}.${Date.now()}`;
  await writeFile(tmp, JSON.stringify(file, null, 2) + "\n", "utf8");
  await rename(tmp, path);
}

export async function listProfiles(): Promise<readonly string[]> {
  const file = await readStore();
  return Object.keys(file.profiles).sort();
}

export async function loadProfile(name: string): Promise<ProfileEntry | undefined> {
  const file = await readStore();
  return file.profiles[name];
}

export async function loadProfileOrThrow(name: string): Promise<ProfileEntry> {
  const file = await readStore();
  const entry = file.profiles[name];
  if (!entry) {
    const available = Object.keys(file.profiles).sort();
    throw new ValidationError(
      available.length > 0
        ? `profile not found: "${name}". Available: ${available.join(", ")}`
        : `profile not found: "${name}". No profiles saved yet — run \`rollbar profile save ${name} --project-token=…\``,
    );
  }
  return entry;
}

export async function getDefaultProfileName(): Promise<string | undefined> {
  const file = await readStore();
  return file.default;
}
