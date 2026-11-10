import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig } from "../src/config.js";
import type { SecretStore } from "../src/secrets.js";

describe("keychain configuration", () => {
  it("uses only the nearest .env and honors its disable switch", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "rollbar-nearest-"));
    const child = join(cwd, "child");
    mkdirSync(child);
    writeFileSync(join(cwd, ".env"), "ROLLBAR_PROJECT_TOKEN=parent\n");
    writeFileSync(join(child, ".env"), "ROLLBAR_KEYCHAIN=off\n");
    let calls = 0;
    const store: SecretStore = {
      description: "memory",
      get: async () => {
        calls++;
        return "secret";
      },
      set: async () => {},
      delete: async () => false,
    };
    try {
      const config = await loadConfig({
        cwd: child,
        env: {},
        configFile: null,
        secretStore: store,
      });
      expect(config.projectToken).toBe("");
      expect(config.keychain.status).toBe("disabled");
      expect(calls).toBe(0);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
  it("resolves precedence and reads only missing keys", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "rollbar-config-"));
    const calls: string[] = [];
    const store: SecretStore = {
      description: "memory",
      get: async (name) => {
        calls.push(name);
        return "stored";
      },
      set: async () => {},
      delete: async () => false,
    };
    try {
      const path = join(cwd, "config.json");
      writeFileSync(path, JSON.stringify({ projectToken: "config", accountToken: "config" }));
      expect(
        (await loadConfig({ cwd, env: {}, configFile: path, secretStore: store })).projectToken,
      ).toBe("stored");
      writeFileSync(join(cwd, ".env"), "ROLLBAR_PROJECT_TOKEN=file\n");
      calls.length = 0;
      const config = await loadConfig({ cwd, env: {}, configFile: path, secretStore: store });
      expect(config.projectToken).toBe("file");
      expect(config.credentialSources.ROLLBAR_PROJECT_TOKEN).toBe(`envfile:${join(cwd, ".env")}`);
      expect(calls).toEqual(["ROLLBAR_ACCOUNT_TOKEN"]);
      expect(
        (
          await loadConfig({
            cwd,
            env: { ROLLBAR_PROJECT_TOKEN: "process" },
            configFile: path,
            secretStore: store,
          })
        ).projectToken,
      ).toBe("process");
      expect(
        (await loadConfig({ cwd, env: {}, configFile: path, secretStore: null })).accountToken,
      ).toBe("config");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
  it("disables reads and survives unavailable stores", async () => {
    let calls = 0;
    const store: SecretStore = {
      description: "broken",
      get: async () => {
        calls++;
        throw new Error("locked");
      },
      set: async () => {},
      delete: async () => false,
    };
    const cwd = mkdtempSync(join(tmpdir(), "rollbar-config-"));
    try {
      expect(
        (
          await loadConfig({
            cwd,
            env: { ROLLBAR_KEYCHAIN: "0" },
            configFile: null,
            secretStore: store,
          })
        ).keychain.status,
      ).toBe("disabled");
      expect(calls).toBe(0);
      const config = await loadConfig({
        cwd,
        env: { ROLLBAR_PROJECT_TOKEN: "explicit" },
        configFile: null,
        secretStore: store,
      });
      expect(config.keychain.status).toBe("unavailable");
      expect(config.projectToken).toBe("explicit");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
