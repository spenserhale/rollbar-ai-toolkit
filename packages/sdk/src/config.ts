import type { RollbarConfig } from "./types.js";

/**
 * Resolve configuration from environment variables with optional overrides.
 * Used by both CLI and MCP contexts.
 */
export function resolveConfig(overrides: Partial<RollbarConfig> = {}): RollbarConfig {
  const envProjectId = process.env.ROLLBAR_PROJECT_ID;
  return {
    projectToken: overrides.projectToken ?? process.env.ROLLBAR_PROJECT_TOKEN ?? "",
    accountToken: overrides.accountToken ?? process.env.ROLLBAR_ACCOUNT_TOKEN ?? "",
    baseUrl: overrides.baseUrl ?? process.env.ROLLBAR_BASE_URL ?? "https://api.rollbar.com/api/1",
    projectId: overrides.projectId ?? (envProjectId ? Number(envProjectId) : undefined),
  };
}
