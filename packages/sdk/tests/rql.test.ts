import { describe, expect, it } from "vitest";
import {
  buildByUrlQuery,
  buildAffectedUsersQuery,
  injectLimit,
  escapeSqlString,
  findItemColumn,
  readCell,
  uniqueNumbers,
} from "../src/rql.js";

describe("escapeSqlString", () => {
  it("doubles single quotes to prevent breaking out of a literal", () => {
    expect(escapeSqlString("o'brien")).toBe("o''brien");
    expect(escapeSqlString("example.com")).toBe("example.com");
  });
});

describe("buildByUrlQuery", () => {
  it("builds a grouped, ordered, limited query with an escaped LIKE and window", () => {
    const sql = buildByUrlQuery("example.com", 5, 1_700_000_000);
    expect(sql).toContain("FROM item_occurrence");
    expect(sql).toContain("request.url LIKE '%example.com%'");
    expect(sql).toContain("timestamp >= 1700000000");
    expect(sql).toContain("GROUP BY item.counter");
    expect(sql).toContain("ORDER BY occurrences DESC");
    expect(sql).toMatch(/LIMIT 5$/);
  });
  it("escapes quotes in the domain", () => {
    expect(buildByUrlQuery("a'b", 5, 0)).toContain("LIKE '%a''b%'");
  });
  it("rejects a non-integer limit", () => {
    expect(() => buildByUrlQuery("x", 1.5, 0)).toThrow(/limit/);
  });
  it("rejects a non-integer minTimestamp", () => {
    expect(() => buildByUrlQuery("x", 5, 1.5)).toThrow(/minTimestamp/);
  });
});

describe("buildAffectedUsersQuery", () => {
  it("filters by item.id and groups by person columns", () => {
    const sql = buildAffectedUsersQuery(4242, 100, 1_700_000_000);
    expect(sql).toContain("SELECT person.id, person.username, person.email, count(*) AS occurrences");
    expect(sql).toContain("WHERE item.id = 4242");
    expect(sql).toContain("timestamp >= 1700000000");
    expect(sql).toContain("GROUP BY person.id, person.username, person.email");
    expect(sql).toMatch(/LIMIT 100$/);
  });
  it("rejects a non-integer item id (SQL-injection guard)", () => {
    expect(() => buildAffectedUsersQuery(Number("4; DROP"), 100, 0)).toThrow(/item id/);
  });
  it("rejects a non-integer minTimestamp", () => {
    expect(() => buildAffectedUsersQuery(4242, 100, 1.5)).toThrow(/minTimestamp/);
  });
});

describe("injectLimit", () => {
  it("appends LIMIT when none present", () => {
    expect(injectLimit("SELECT * FROM item_occurrence", 100)).toBe(
      "SELECT * FROM item_occurrence LIMIT 100",
    );
  });
  it("leaves an existing LIMIT untouched (case-insensitive)", () => {
    expect(injectLimit("SELECT * FROM item_occurrence limit 10", 100)).toBe(
      "SELECT * FROM item_occurrence limit 10",
    );
  });
  it("strips a trailing semicolon before appending", () => {
    expect(injectLimit("SELECT 1;", 5)).toBe("SELECT 1 LIMIT 5");
  });
  it("does not treat a bare `limit` column name as a LIMIT clause", () => {
    expect(injectLimit("SELECT limit FROM t", 5)).toBe("SELECT limit FROM t LIMIT 5");
  });
  it("rejects a non-integer limit", () => {
    expect(() => injectLimit("SELECT 1", 3.5)).toThrow(/limit/);
  });
});

describe("findItemColumn", () => {
  it("prefers item.counter, then item.id, else null", () => {
    expect(findItemColumn(["item.counter", "occurrences"])).toEqual({ name: "item.counter", kind: "counter" });
    expect(findItemColumn(["item.id"])).toEqual({ name: "item.id", kind: "id" });
    expect(findItemColumn(["timestamp"])).toBeNull();
  });
});

describe("readCell", () => {
  it("reads from array rows by column index", () => {
    expect(readCell([7, 3], ["item.counter", "occurrences"], "occurrences")).toBe(3);
  });
  it("reads from object rows by key", () => {
    expect(readCell({ "item.counter": 7 }, ["item.counter"], "item.counter")).toBe(7);
  });
  it("returns undefined for a missing column", () => {
    expect(readCell([1], ["a"], "b")).toBeUndefined();
  });
});

describe("uniqueNumbers", () => {
  it("dedupes and drops non-numeric values, preserving order", () => {
    expect(uniqueNumbers([3, "3", 1, "x", 1, 2])).toEqual([3, 1, 2]);
  });
  it("skips nullish, empty-string, and boolean values instead of coercing to 0", () => {
    expect(uniqueNumbers([3, null, "", 1, false, 1, 2])).toEqual([3, 1, 2]);
  });
});
