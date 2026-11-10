import { homedir } from "node:os";
import { join } from "node:path";
import type { SecretStore } from "@rollbar-toolkit/sdk";
import { RollbarClient, loadConfig } from "@rollbar-toolkit/sdk";
import { loadProfileOrThrow, getDefaultProfileName } from "./profile-store.js";

// Spread into every data-returning command's flag definitions to get
// --token and --profile for free. Resolution precedence (per the skill):
//   explicit flag (--token) > env var > profile > built-in default
export const clientFlagDefs = {
  token: {
    kind: "parsed" as const,
    parse: String,
    brief: "Override access token for this call (overrides env and profile)",
    optional: true as const,
  },
  profile: {
    kind: "parsed" as const,
    parse: String,
    brief: "Use a named saved profile (see `rollbar profile list`)",
    optional: true as const,
  },
} as const;

export interface ClientFlags {
  readonly token?: string;
  readonly profile?: string;
}

// Build a RollbarClient for a given command invocation, honoring --token, --profile,
// the ROLLBAR_DEFAULT_PROFILE env var, and the stored default-profile pointer.
// Falls back to the bare resolveConfig() when nothing extra is supplied.
export async function loadCliConfig(flags: ClientFlags = {}, secretStore?: SecretStore | null) {
  const profileName =
    flags.profile ?? process.env.ROLLBAR_DEFAULT_PROFILE ?? (await getDefaultProfileName());
  const profileEntry = profileName ? await loadProfileOrThrow(profileName) : undefined;

  const overrides = flags.token ? { projectToken: flags.token, accountToken: flags.token } : {};
  return await loadConfig({
    secretStore,
    overrides,
    fallback: profileEntry,
    fallbackSource: profileName
      ? `config:${process.env.ROLLBAR_PROFILES_PATH ?? join(homedir(), ".rollbar", "profiles.json")}`
      : undefined,
  });
}

export async function buildClientForFlags(flags: ClientFlags): Promise<RollbarClient> {
  return new RollbarClient(await loadCliConfig(flags));
}
