import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";
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
export async function buildClientForFlags(flags: ClientFlags): Promise<RollbarClient> {
  const profileName =
    flags.profile ?? process.env.ROLLBAR_DEFAULT_PROFILE ?? (await getDefaultProfileName());
  const profileEntry = profileName ? await loadProfileOrThrow(profileName) : undefined;

  // resolveConfig() already prefers explicit overrides over env. We layer profile values
  // UNDER env by only passing profile entries the env doesn't already define.
  const overrides: Partial<{
    projectToken: string;
    accountToken: string;
    baseUrl: string;
    projectId: number;
  }> = {};

  if (flags.token) {
    overrides.projectToken = flags.token;
    overrides.accountToken = flags.token;
  } else if (profileEntry) {
    if (profileEntry.projectToken && !process.env.ROLLBAR_PROJECT_TOKEN) {
      overrides.projectToken = profileEntry.projectToken;
    }
    if (profileEntry.accountToken && !process.env.ROLLBAR_ACCOUNT_TOKEN) {
      overrides.accountToken = profileEntry.accountToken;
    }
    if (profileEntry.baseUrl && !process.env.ROLLBAR_BASE_URL) {
      overrides.baseUrl = profileEntry.baseUrl;
    }
    if (profileEntry.projectId !== undefined && !process.env.ROLLBAR_PROJECT_ID) {
      overrides.projectId = profileEntry.projectId;
    }
  }

  return new RollbarClient(resolveConfig(overrides));
}
