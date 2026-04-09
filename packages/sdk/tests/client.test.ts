import { describe, expect, it } from "vitest";
import { RollbarClient } from "../src/client.js";

describe("RollbarClient", () => {
  it("should accept a valid config with project token", () => {
    const client = new RollbarClient({
      projectToken: "test-key",
      baseUrl: "https://api.example.com/api/1",
    });
    expect(client).toBeDefined();
  });

  it("should accept a valid config with account token", () => {
    const client = new RollbarClient({
      accountToken: "test-key",
      baseUrl: "https://api.example.com/api/1",
    });
    expect(client).toBeDefined();
  });

  it("should default baseUrl when not provided", () => {
    const client = new RollbarClient({ projectToken: "test-key" });
    expect(client).toBeDefined();
  });
});
