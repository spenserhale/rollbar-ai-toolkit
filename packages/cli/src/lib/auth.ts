import { ValidationError } from "../validation.js";
import {
  CREDENTIAL_KEYS,
  RESOURCE_IDS,
  resourceCredentialKeys,
  resourceForCredentialKey,
  type ResolvedConfig,
  type SecretStore,
  type ResourceId,
} from "@rollbar-toolkit/sdk";

export function parseResourceId(raw: string): ResourceId {
  const value = raw.trim().toLowerCase();
  if (!(RESOURCE_IDS as readonly string[]).includes(value)) {
    throw new ValidationError(
      `Unknown resource "${raw}". Valid resources: ${RESOURCE_IDS.join(", ")}`,
    );
  }
  return value as ResourceId;
}

/** The keychain entry names to act on: one --key, or every key the resource uses. */
export function selectCredentialKeys(resource: ResourceId, key: string | undefined): string[] {
  const keys = resourceCredentialKeys(resource);
  if (key === undefined) return [...keys];
  const normalized = key.trim().toUpperCase();
  if (!keys.includes(normalized)) {
    throw new ValidationError(
      `Invalid --key "${key}" for ${resource}. Valid keys: ${keys.join(", ")}`,
    );
  }
  return [normalized];
}

/** Sources that outrank the keychain, so a stored value would be ignored. */
function isShadowingSource(source: string | undefined): boolean {
  return source === "env" || (source?.startsWith("envfile:") ?? false);
}

export interface SetCredentialsInput {
  resource: ResourceId;
  keys: readonly string[];
  readValue: (key: string) => Promise<string>;
  store: SecretStore;
  config: ResolvedConfig;
  dryRun: boolean;
}

export interface SetCredentialsResult {
  resource: ResourceId;
  store: string;
  dry_run: boolean;
  credentials: Array<{ key: string; action: "stored" | "would_store"; shadowed_by?: string }>;
}

export async function setCredentials(input: SetCredentialsInput): Promise<SetCredentialsResult> {
  const values: Array<[string, string]> = [];
  for (const key of input.keys) {
    const value = (await input.readValue(key)).trim();
    if (!value) {
      throw new ValidationError(
        `${key} must not be empty. Paste the key at the prompt, or pipe it with --stdin.`,
      );
    }
    values.push([key, value]);
  }
  const credentials: SetCredentialsResult["credentials"] = [];
  for (const [key, value] of values) {
    if (!input.dryRun) await input.store.set(key, value);
    const source = input.config.credentialSources[key];
    credentials.push({
      key,
      action: input.dryRun ? "would_store" : "stored",
      ...(isShadowingSource(source) ? { shadowed_by: source } : {}),
    });
  }
  return {
    resource: input.resource,
    store: input.store.description,
    dry_run: input.dryRun,
    credentials,
  };
}

export interface CredentialListRow {
  resource: ResourceId;
  key: string;
  keychain: "set" | "missing" | "unknown";
  active_source: string;
}

export interface ListCredentialsResult {
  store: string;
  keychain_status: string;
  keychain_error?: string;
  credentials: CredentialListRow[];
}

export async function listCredentials(
  store: SecretStore,
  config: ResolvedConfig,
): Promise<ListCredentialsResult> {
  let stored: Record<string, boolean> | null = null;
  let error: string | undefined;
  try {
    if (config.keychain.status === "disabled") throw new Error("Keychain lookup disabled");
    const entries = await Promise.all(
      CREDENTIAL_KEYS.map(async (key) => [key, Boolean(await store.get(key))] as const),
    );
    stored = Object.fromEntries(entries);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
  }
  return {
    store: store.description,
    keychain_status:
      config.keychain.status === "disabled" ? "disabled" : stored ? "ok" : "unavailable",
    ...(error ? { keychain_error: error } : {}),
    credentials: CREDENTIAL_KEYS.map((key) => ({
      resource: resourceForCredentialKey(key) as ResourceId,
      key,
      keychain: stored ? (stored[key] ? "set" : "missing") : "unknown",
      active_source: config.credentialSources[key] ?? "missing",
    })),
  };
}

export interface DeleteCredentialsResult {
  resource: ResourceId;
  store: string;
  dry_run: boolean;
  credentials: Array<{ key: string; action: "deleted" | "not_found" | "would_delete" }>;
}

export async function deleteCredentials(input: {
  resource: ResourceId;
  keys: readonly string[];
  store: SecretStore;
  dryRun: boolean;
}): Promise<DeleteCredentialsResult> {
  const credentials: DeleteCredentialsResult["credentials"] = [];
  for (const key of input.keys) {
    if (input.dryRun) {
      credentials.push({ key, action: "would_delete" });
      continue;
    }
    const deleted = await input.store.delete(key);
    credentials.push({ key, action: deleted ? "deleted" : "not_found" });
  }
  return {
    resource: input.resource,
    store: input.store.description,
    dry_run: input.dryRun,
    credentials,
  };
}

export interface MigrateCredentialsResult {
  store: string;
  dry_run: boolean;
  credentials: Array<{
    resource: ResourceId;
    key: string;
    from: string;
    action: "stored" | "would_store" | "skipped_exists";
  }>;
  /** Plaintext files that still hold migrated keys; remove the lines yourself. */
  clean_up: string[];
}

function plaintextFile(source: string, config: ResolvedConfig): string | null {
  if (source.startsWith("envfile:")) return source.slice("envfile:".length);
  if (source.startsWith("config:")) return source.slice("config:".length);
  if (source === "config") return config.configFile;
  return null;
}

/**
 * Copy keys whose winning source is a .env file or the user config file
 * into the store. Process-environment keys are left alone: they usually come
 * from op run or CI and are not plaintext at rest. Files are never edited.
 */
export async function migrateCredentials(input: {
  store: SecretStore;
  config: ResolvedConfig;
  dryRun: boolean;
  overwrite: boolean;
}): Promise<MigrateCredentialsResult> {
  const credentials: MigrateCredentialsResult["credentials"] = [];
  const cleanUp = new Set<string>();
  for (const key of CREDENTIAL_KEYS) {
    const source = input.config.credentialSources[key];
    if (!source) continue;
    const file = plaintextFile(source, input.config);
    if (!file) continue;
    const resource = resourceForCredentialKey(key) as ResourceId;
    const value = input.config.credentials[key];
    if (!value) continue;

    if (!input.overwrite && (await input.store.get(key))) {
      credentials.push({ resource, key, from: source, action: "skipped_exists" });
      continue;
    }
    if (!input.dryRun) await input.store.set(key, value);
    credentials.push({
      resource,
      key,
      from: source,
      action: input.dryRun ? "would_store" : "stored",
    });
    cleanUp.add(file);
  }
  return {
    store: input.store.description,
    dry_run: input.dryRun,
    credentials,
    clean_up: [...cleanUp],
  };
}

export function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
