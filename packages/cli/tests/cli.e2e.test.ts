import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
const cli = resolve(import.meta.dirname, "../src/bin.ts");
function run(args: string[], input?: string) {
  return spawnSync("bun", ["--no-env-file", cli, ...args, "--json"], {
    encoding: "utf8",
    input,
    env: { ...process.env, ROLLBAR_KEYCHAIN: "0" },
    stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"],
  });
}
describe("auth CLI", () => {
  it("requires explicit stdin without TTY", () => {
    expect(run(["auth", "set", "project"]).status).toBe(2);
  });
  it("requires key for multi-key stdin", () => {
    expect(run(["auth", "set", "rollbar", "--stdin"], "secret").status).toBe(2);
  });
  it("dry-run stdin never echoes secret", () => {
    const result = run(["auth", "set", "project", "--stdin", "--dry-run"], "unique-secret-value");
    expect(result.status).toBe(0);
    expect(result.stdout + result.stderr).not.toContain("unique-secret-value");
  });
  it("requires delete confirmation", () => {
    expect(run(["auth", "delete", "project"]).status).toBe(2);
  });
  it("rejects unknown resources", () => {
    expect(run(["auth", "set", "unknown"]).status).toBe(2);
  });
});
