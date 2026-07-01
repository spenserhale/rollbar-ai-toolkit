import { describe, expect, it, vi } from "vitest";
import { RollbarClient } from "../src/client.js";
import type { RqlJob, RqlJobResult } from "../src/types.js";

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

function stubbedClient() {
  const client = new RollbarClient({ projectToken: "t", baseUrl: "https://api.example.com/api/1" });
  const job: RqlJob = {
    id: 1,
    project_id: 1,
    query_string: "",
    status: "success",
    job_hash: "h",
    date_created: 0,
    date_modified: 0,
  };
  vi.spyOn(client, "createRqlJob").mockResolvedValue(job);
  vi.spyOn(client, "waitForRqlJob").mockResolvedValue(job);
  return { client, job };
}

describe("rqlAffectedUsers", () => {
  it("maps result rows to AffectedUser records", async () => {
    const { client } = stubbedClient();
    const result: RqlJobResult = {
      job_id: 1,
      result: {
        selectionColumns: ["person.id", "person.username", "person.email", "occurrences"],
        rows: [
          ["42", "alice", "alice@example.com", 9],
          [null, null, null, 3],
        ],
      },
    };
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue(result);

    const users = await client.rqlAffectedUsers({ itemId: 7, window: "30d" });
    expect(users).toEqual([
      { id: "42", username: "alice", email: "alice@example.com", occurrences: 9 },
      { id: null, username: null, email: null, occurrences: 3 },
    ]);
  });
});

describe("rqlByUrl", () => {
  it("hydrates each returned counter to item-details with its occurrence count", async () => {
    const { client } = stubbedClient();
    const result: RqlJobResult = {
      job_id: 1,
      result: { selectionColumns: ["item.counter", "occurrences"], rows: [[12, 100], [34, 50]] },
    };
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue(result);
    const detail = { item: { id: 999 }, latestOccurrence: null } as unknown as Awaited<
      ReturnType<typeof client.getItemDetailedByCounter>
    >;
    const spy = vi.spyOn(client, "getItemDetailedByCounter").mockResolvedValue(detail);

    const items = await client.rqlByUrl({ domain: "example.com" });
    expect(spy).toHaveBeenCalledWith(12, { includeVars: undefined });
    expect(items).toHaveLength(2);
    expect(items[0]?.occurrences).toBe(100);
  });
});

describe("rqlQuery", () => {
  it("warns when --window is set but the query has no timestamp clause", async () => {
    const { client } = stubbedClient();
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue({
      job_id: 1,
      result: { selectionColumns: ["a"], rows: [] },
    });
    const outcome = await client.rqlQuery({ queryString: "SELECT a FROM item_occurrence", window: "30d" });
    expect(outcome.warnings.some((w) => w.includes("window not applied"))).toBe(true);
  });

  it("warns and skips enrich when no item column is present", async () => {
    const { client } = stubbedClient();
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue({
      job_id: 1,
      result: { selectionColumns: ["a"], rows: [[1]] },
    });
    const outcome = await client.rqlQuery({ queryString: "SELECT a FROM item_occurrence", enrich: true });
    expect(outcome.items).toBeUndefined();
    expect(outcome.warnings.some((w) => w.includes("enrich skipped"))).toBe(true);
  });

  it("hydrates item rows when enrich is requested and an item column is present", async () => {
    const { client } = stubbedClient();
    vi.spyOn(client, "getRqlJobResults").mockResolvedValue({
      job_id: 1,
      result: { selectionColumns: ["item.counter"], rows: [[12]] },
    });
    const detail = { item: { id: 999 }, latestOccurrence: null } as unknown as Awaited<
      ReturnType<typeof client.getItemDetailedByCounter>
    >;
    const spy = vi.spyOn(client, "getItemDetailedByCounter").mockResolvedValue(detail);

    const outcome = await client.rqlQuery({
      queryString: "SELECT item.counter FROM item_occurrence",
      enrich: true,
    });
    expect(outcome.items).toHaveLength(1);
    expect(spy).toHaveBeenCalledWith(12, { includeVars: undefined });
  });
});

describe("runRqlToRows (via helpers)", () => {
  it("rejects when the job ends in a non-success terminal status", async () => {
    const client = new RollbarClient({ projectToken: "t", baseUrl: "https://api.example.com/api/1" });
    const job = { id: 1, project_id: 1, query_string: "", status: "failed", job_hash: "h", date_created: 0, date_modified: 0 } as const;
    vi.spyOn(client, "createRqlJob").mockResolvedValue(job as unknown as RqlJob);
    vi.spyOn(client, "waitForRqlJob").mockResolvedValue(job as unknown as RqlJob);
    await expect(client.rqlAffectedUsers({ itemId: 7 })).rejects.toThrow(/did not complete successfully/);
  });
});
