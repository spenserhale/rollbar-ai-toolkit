import { expect, it } from "vitest";
import type { FastMCP } from "fastmcp";
import { resolveConfig } from "@rollbar-toolkit/sdk";
import { registerResourceTools } from "../src/tools/resources.js";
it("reloads credentials per call without exposing secret mutations", async () => {
  const tools: Array<{ name: string; execute: (args: unknown) => Promise<string> }> = [];
  let loads = 0;
  const original = globalThis.fetch;
  const tokens: string[] = [];
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    tokens.push(String(new Headers(init?.headers).get("X-Rollbar-Access-Token")));
    return new Response(JSON.stringify({ err: 0, result: { items: [], page: 1, total_count: 0 } }));
  }) as typeof fetch;
  try {
    registerResourceTools(
      { addTool: (tool: (typeof tools)[number]) => tools.push(tool) } as unknown as FastMCP,
      async () =>
        resolveConfig(
          { projectToken: ++loads === 1 ? "first" : "rotated" },
          { env: {}, configFile: null },
        ),
    );
    const tool = tools.find((t) => t.name === "list_items")!;
    await tool.execute({});
    await tool.execute({});
    expect(loads).toBe(2);
    expect(tokens).toEqual(["first", "rotated"]);
    expect(tools.some((t) => /auth|secret|credential/.test(t.name))).toBe(false);
  } finally {
    globalThis.fetch = original;
  }
});
