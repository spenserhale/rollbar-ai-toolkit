import { describe, it, expect } from "vitest";
import { resolveConfig, type SecretStore } from "@rollbar-toolkit/sdk";
import { setCredentials, listCredentials, migrateCredentials } from "../src/lib/auth.js";
function memory() {
  const values = new Map<string, string>();
  const store: SecretStore = {
    description: "memory",
    get: async (key) => values.get(key) ?? null,
    set: async (key, value) => {
      values.set(key, value);
    },
    delete: async (key) => values.delete(key),
  };
  return { store, values };
}
const key = "ROLLBAR_PROJECT_TOKEN";
const config = () =>
  resolveConfig({}, { env: {}, cwd: "/tmp", configFile: "/nonexistent/config.json" });
describe("auth", () => {
  it("trims values, reports shadows, never lists values", async () => {
    const { store, values } = memory();
    const resolved = config();
    resolved.keychain.status = "ok";
    resolved.credentialSources[key] = "env";
    const result = await setCredentials({
      resource: "project",
      keys: [key],
      store,
      config: resolved,
      dryRun: false,
      readValue: async () => "  unique-secret  ",
    });
    expect(values.get(key)).toBe("unique-secret");
    expect(result.credentials[0]?.shadowed_by).toBe("env");
    expect(JSON.stringify(await listCredentials(store, resolved))).not.toContain("unique-secret");
  });
  it("dry run writes nothing and rejects empty input", async () => {
    const { store, values } = memory();
    const input = {
      resource: "project" as const,
      keys: [key],
      store,
      config: config(),
      dryRun: true,
    };
    await setCredentials({ ...input, readValue: async () => "secret" });
    expect(values.size).toBe(0);
    await expect(setCredentials({ ...input, readValue: async () => " " })).rejects.toThrow(
      "must not be empty",
    );
  });
  it("migrates files, skips existing and ignores process env", async () => {
    const { store, values } = memory();
    const resolved = config();
    resolved.credentialSources[key] = "envfile:/tmp/project/.env";
    resolved.credentials[key] = "file-secret";
    resolved.credentialSources.ROLLBAR_ACCOUNT_TOKEN = "env";
    resolved.credentials.ROLLBAR_ACCOUNT_TOKEN = "process-secret";
    const input = { store, config: resolved, dryRun: false, overwrite: false };
    const result = await migrateCredentials(input);
    expect(result.clean_up).toEqual(["/tmp/project/.env"]);
    expect(values.get(key)).toBe("file-secret");
    expect(values.has("ROLLBAR_ACCOUNT_TOKEN")).toBe(false);
    expect((await migrateCredentials(input)).credentials[0]?.action).toBe("skipped_exists");
  });
});
