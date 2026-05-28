import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { mkdir, appendFile, readFile } from "node:fs/promises";
import type { LocalContext } from "../../context.js";
import { writeOutput, type OutputFlags } from "../../output.js";

interface RecordFlags extends OutputFlags {}

interface ListFlags extends OutputFlags {
  readonly limit: number;
}

function logPath(): string {
  return process.env.ROLLBAR_FEEDBACK_PATH ?? join(homedir(), ".rollbar", "feedback.jsonl");
}

export async function record(this: LocalContext, flags: RecordFlags, text: string): Promise<void> {
  const entry = {
    timestamp: new Date().toISOString(),
    cli: "rollbar",
    text,
  };
  const path = logPath();
  await mkdir(dirname(path), { recursive: true });
  await appendFile(path, JSON.stringify(entry) + "\n", "utf8");

  let upstream: { status?: number; error?: string } | undefined;
  const endpoint = process.env.ROLLBAR_FEEDBACK_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(entry),
      });
      upstream = { status: res.status };
    } catch (err) {
      upstream = { error: err instanceof Error ? err.message : String(err) };
    }
  }

  await writeOutput(
    this.process.stdout,
    {
      recorded: "local" + (endpoint ? " + upstream" : ""),
      path,
      ...(upstream ? { upstream } : {}),
    },
    flags,
  );
}

export async function list(this: LocalContext, flags: ListFlags): Promise<void> {
  const path = logPath();
  let entries: unknown[] = [];
  try {
    const raw = await readFile(path, "utf8");
    entries = raw
      .split("\n")
      .filter((l) => l.length > 0)
      .map((l) => safeParse(l))
      .filter((e): e is object => e !== null);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
  const items = entries.slice(-flags.limit);
  await writeOutput(this.process.stdout, { items, total_count: entries.length, path }, flags);
}

function safeParse(line: string): unknown {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}
