import { RollbarConfigError } from "./errors.js";
export const KEYCHAIN_SERVICE = "rollbar-toolkit";
export const CREDENTIAL_KEYS = ["ROLLBAR_PROJECT_TOKEN", "ROLLBAR_ACCOUNT_TOKEN"] as const;
export const RESOURCE_IDS = ["rollbar", "project", "account"] as const;
export type ResourceId = (typeof RESOURCE_IDS)[number];
export interface SecretStore {
  readonly description: string;
  get(name: string): Promise<string | null>;
  set(name: string, value: string): Promise<void>;
  delete(name: string): Promise<boolean>;
}
export function resourceCredentialKeys(resource: ResourceId): readonly string[] {
  return resource === "rollbar"
    ? CREDENTIAL_KEYS
    : [resource === "project" ? CREDENTIAL_KEYS[0] : CREDENTIAL_KEYS[1]];
}
export function resourceForCredentialKey(key: string): ResourceId | undefined {
  return key === CREDENTIAL_KEYS[0]
    ? "project"
    : key === CREDENTIAL_KEYS[1]
      ? "account"
      : undefined;
}
interface BunSecretsApi {
  get(options: { service: string; name: string }): Promise<string | null>;
  set(options: { service: string; name: string; value: string }): Promise<void>;
  delete(options: { service: string; name: string }): Promise<boolean>;
}

function bunSecretsApi(): BunSecretsApi | undefined {
  const bun = (globalThis as { Bun?: { secrets?: BunSecretsApi } }).Bun;
  return bun?.secrets;
}

/** The OS keychain (macOS Keychain, libsecret, Windows Credential Manager) via Bun.secrets. */
export function bunSecretStore(service: string = KEYCHAIN_SERVICE): SecretStore {
  const api = (): BunSecretsApi => {
    const secrets = bunSecretsApi();
    if (!secrets) {
      throw new RollbarConfigError(
        "The OS keychain is unavailable. Run with Bun 1.3 or newer, or use environment variables.",
      );
    }
    return secrets;
  };
  const wrap = async <T>(action: string, fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof RollbarConfigError) throw error;
      throw new RollbarConfigError(
        `Could not ${action} the OS keychain. On macOS unlock the login keychain and allow access; on Linux start a Secret Service daemon (GNOME Keyring or KWallet).`,
        { cause: error },
      );
    }
  };
  return {
    description: `os-keychain:${service}`,
    get: (name) => wrap("read from", () => api().get({ service, name })),
    set: (name, value) => wrap("write to", () => api().set({ service, name, value })),
    delete: (name) => wrap("delete from", () => api().delete({ service, name })),
  };
}

export type KeychainStatus = "ok" | "disabled" | "unavailable";

export interface KeychainReadResult {
  status: KeychainStatus;
  values: Record<string, string>;
  error?: string;
}

/**
 * Read the given credential names in parallel. A store failure is reported
 * as `unavailable` instead of thrown so a missing keychain never breaks a
 * search that has keys from elsewhere.
 */
export async function readKeychainValues(
  store: SecretStore,
  names: readonly string[],
): Promise<KeychainReadResult> {
  try {
    const entries = await Promise.all(
      names.map(async (name) => [name, await store.get(name)] as const),
    );
    const values: Record<string, string> = {};
    for (const [name, value] of entries) {
      if (value) values[name] = value;
    }
    return { status: "ok", values };
  } catch (error) {
    return {
      status: "unavailable",
      values: {},
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
