import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { RollbarConfigSchema, type RollbarConfig } from "./types.js";
import { RollbarConfigError } from "./errors.js";
import {
  bunSecretStore,
  CREDENTIAL_KEYS,
  readKeychainValues,
  type SecretStore,
  type KeychainStatus,
} from "./secrets.js";
export type Env = Record<string, string | undefined>;
interface EnvFileData {
  files: string[];
  values: Env;
  sources: Record<string, string>;
}
export interface KeychainState {
  status: KeychainStatus;
  error?: string;
}
export interface ResolvedConfig extends RollbarConfig {
  credentials: Record<string, string>;
  credentialSources: Record<string, string>;
  keychain: KeychainState;
  envFiles: string[];
  configFile: string | null;
  cwd: string;
}
export interface ResolveConfigOptions {
  cwd?: string;
  env?: Env;
  configFile?: string | null;
  keychainValues?: Record<string, string>;
  keychain?: KeychainState;
  fallback?: Partial<RollbarConfig>;
  fallbackSource?: string;
}
export interface LoadConfigOptions extends Omit<
  ResolveConfigOptions,
  "keychainValues" | "keychain"
> {
  overrides?: Partial<RollbarConfig>;
  secretStore?: SecretStore | null;
}
const FIELDS = {
  projectToken: "ROLLBAR_PROJECT_TOKEN",
  accountToken: "ROLLBAR_ACCOUNT_TOKEN",
  baseUrl: "ROLLBAR_BASE_URL",
  projectId: "ROLLBAR_PROJECT_ID",
} as const;
export function resolveConfig(
  overrides: Partial<RollbarConfig> = {},
  options: ResolveConfigOptions = {},
): ResolvedConfig {
  const cwd = resolve(options.cwd ?? process.cwd());
  const env = options.env ?? process.env;
  const envFile = readEnvFiles(cwd);
  const configuredPath =
    options.configFile ??
    env.ROLLBAR_CONFIG_FILE ??
    envFile.values.ROLLBAR_CONFIG_FILE ??
    join(homedir(), ".rollbar", "config.json");
  const candidate = resolve(cwd, configuredPath.replace(/^~(?=$|\/)/, homedir()));
  const configFile = options.configFile === null || !existsSync(candidate) ? null : candidate;
  let saved: Partial<RollbarConfig> = {};
  if (configFile) {
    try {
      saved = RollbarConfigSchema.partial().parse(JSON.parse(readFileSync(configFile, "utf8")));
    } catch {
      throw new RollbarConfigError(
        `Invalid configuration file: ${configFile}. Fix JSON and configuration values.`,
      );
    }
  }
  const values: Record<string, unknown> = {};
  const credentialSources: Record<string, string> = {};
  for (const [field, name] of Object.entries(FIELDS)) {
    const choices: Array<[unknown, string]> = [
      [overrides[field as keyof RollbarConfig], "override"],
      [env[name], "env"],
      [envFile.values[name], `envfile:${envFile.sources[name]}`],
      [options.keychainValues?.[name], "keychain"],
      [saved[field as keyof RollbarConfig], `config:${configFile}`],
      [options.fallback?.[field as keyof RollbarConfig], options.fallbackSource ?? "config"],
    ];
    const selected = choices.find(([value]) => value !== undefined && value !== "");
    if (selected) values[field] = field === "projectId" ? Number(selected[0]) : selected[0];
    if ((CREDENTIAL_KEYS as readonly string[]).includes(name))
      credentialSources[name] = selected?.[1] ?? "missing";
  }
  const parsed = RollbarConfigSchema.safeParse(values);
  if (!parsed.success)
    throw new RollbarConfigError(
      "Invalid Rollbar configuration. Check ROLLBAR_PROJECT_ID and ROLLBAR_BASE_URL.",
    );
  return {
    ...parsed.data,
    credentials: {
      ROLLBAR_PROJECT_TOKEN: parsed.data.projectToken,
      ROLLBAR_ACCOUNT_TOKEN: parsed.data.accountToken,
    },
    credentialSources,
    keychain: options.keychain ?? { status: "disabled" },
    envFiles: envFile.files,
    configFile,
    cwd,
  };
}
export async function loadConfig(options: LoadConfigOptions = {}): Promise<ResolvedConfig> {
  const { secretStore, overrides, ...rest } = options;
  const cwd = resolve(rest.cwd ?? process.cwd());
  const env = rest.env ?? process.env;
  const envFile = readEnvFiles(cwd);
  const flag = env.ROLLBAR_KEYCHAIN ?? envFile.values.ROLLBAR_KEYCHAIN;
  const disabled =
    secretStore === null || ["0", "false", "no", "off"].includes((flag ?? "").trim().toLowerCase());
  if (disabled) return resolveConfig(overrides, { ...rest, keychain: { status: "disabled" } });
  // Node SDK consumers quietly skip Bun-only lookup.
  if (secretStore === undefined && !(globalThis as { Bun?: { secrets?: unknown } }).Bun?.secrets)
    return resolveConfig(overrides, { ...rest, keychain: { status: "disabled" } });
  const missing = CREDENTIAL_KEYS.filter(
    (name) =>
      !env[name] &&
      !envFile.values[name] &&
      !(name === "ROLLBAR_PROJECT_TOKEN" ? overrides?.projectToken : overrides?.accountToken),
  );
  const result = await readKeychainValues(secretStore ?? bunSecretStore(), missing);
  return resolveConfig(overrides, {
    ...rest,
    keychainValues: result.values,
    keychain: { status: result.status, ...(result.error ? { error: result.error } : {}) },
  });
}
export function redactedConfig(config: ResolvedConfig) {
  return {
    schema_version: "1",
    cwd: config.cwd,
    config_file: config.configFile,
    env_files: config.envFiles,
    values: { baseUrl: config.baseUrl, projectId: config.projectId },
    credentials: Object.fromEntries(
      Object.entries(config.credentials).map(([key, value]) => [key, value ? "set" : "missing"]),
    ),
    credential_sources: config.credentialSources,
    keychain: config.keychain,
  };
}
function readEnvFiles(cwd: string): EnvFileData {
  const files: string[] = [];
  let current = cwd;
  while (true) {
    const candidate = join(current, ".env");
    if (existsSync(candidate)) {
      files.push(candidate);
      break;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  // Only the nearest project file participates.

  const values: Env = {};
  const sources: Record<string, string> = {};
  for (const file of files) {
    const parsed = parseEnvFile(file);
    for (const [key, value] of Object.entries(parsed)) {
      values[key] = value;
      sources[key] = file;
    }
  }
  return { files, values, sources };
}

function parseEnvFile(path: string): Env {
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return {};
  }
  const values: Env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const unexported = line.startsWith("export ") ? line.slice("export ".length).trim() : line;
    const equals = unexported.indexOf("=");
    if (equals <= 0) continue;
    const key = unexported.slice(0, equals).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = unexported.slice(equals + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      const comment = value.indexOf(" #");
      if (comment >= 0) value = value.slice(0, comment).trim();
    }
    values[key] = value.replace(/\\n/g, "\n");
  }
  return values;
}
