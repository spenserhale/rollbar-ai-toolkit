import type { LocalContext } from "../../context.js";

const SCHEMA_VERSION = "1";

const EXIT_CODES = {
  0: "success",
  1: "generic API or network error",
  2: "validation or usage error",
  3: "config error (missing token, bad env)",
  4: "not found",
  5: "auth error (invalid token)",
  6: "rate limited",
};

const OUTPUT_FLAGS = {
  "--json": { type: "boolean", default: false, brief: "Output as JSON instead of TOON" },
};

const TOKEN_FLAG = {
  "--token": { type: "string", optional: true, brief: "Override API access token for this call" },
};

const SCHEMA = {
  schema_version: SCHEMA_VERSION,
  cli: "rollbar",
  version: "0.1.0",
  exit_codes: EXIT_CODES,
  output_formats: {
    default: "toon",
    flags: { "--json": "JSON" },
    note: "TOON (Token-Oriented Object Notation) is the default output format",
  },
  commands: {
    items: {
      brief: "Manage Rollbar items (errors)",
      subcommands: {
        list: {
          brief: "List items from Rollbar",
          flags: {
            "--status": {
              type: "string",
              optional: true,
              values: ["active", "resolved", "muted", "archived"],
              brief: "Filter by status",
            },
            "--level": {
              type: "string",
              optional: true,
              values: ["critical", "error", "warning", "info", "debug"],
              brief: "Filter by severity level",
            },
            "--environment": { type: "string", optional: true, brief: "Filter by environment" },
            "--limit": { type: "number", default: 20, brief: "Max items to return" },
            "--page": { type: "number", default: 1, brief: "Page number" },
            ...OUTPUT_FLAGS,
            ...TOKEN_FLAG,
          },
        },
        get: {
          brief: "Get an item by ID",
          positional: [{ name: "id", type: "number", brief: "Item ID" }],
          flags: { ...OUTPUT_FLAGS, ...TOKEN_FLAG },
        },
        "get-by-counter": {
          brief: "Get an item by project counter",
          positional: [{ name: "counter", type: "number", brief: "Project counter (shown in UI)" }],
          flags: { ...OUTPUT_FLAGS, ...TOKEN_FLAG },
        },
      },
    },
    "item-details": {
      brief: "Item metadata combined with its latest occurrence and stack trace",
      subcommands: {
        get: {
          brief: "Get an item with its latest occurrence (single call, no chaining needed)",
          positional: [{ name: "id", type: "number", brief: "Item ID" }],
          flags: {
            "--include-vars": {
              type: "boolean",
              default: false,
              brief: "Include local variables from stack frames (may contain secrets)",
            },
            ...OUTPUT_FLAGS,
            ...TOKEN_FLAG,
          },
        },
        "get-by-counter": {
          brief: "Get an item by project counter with its latest occurrence",
          positional: [{ name: "counter", type: "number", brief: "Project counter (shown in UI)" }],
          flags: {
            "--include-vars": {
              type: "boolean",
              default: false,
              brief: "Include local variables from stack frames (may contain secrets)",
            },
            ...OUTPUT_FLAGS,
            ...TOKEN_FLAG,
          },
        },
      },
    },
    "top-item-details": {
      brief:
        "Top N most-occurring items in a time window, each with latest occurrence and stack trace",
      flags: {
        "--window": {
          type: "string",
          default: "30d",
          brief: "Look-back window",
          examples: ["24h", "7d", "30d", "12w", "3m"],
        },
        "--limit": { type: "number", default: 10, brief: "Number of top items to return" },
        "--status": {
          type: "string",
          default: "active",
          values: ["active", "resolved", "muted", "archived"],
          brief: "Filter by status",
        },
        "--level": {
          type: "string",
          optional: true,
          values: ["critical", "error", "warning", "info", "debug"],
          brief: "Filter by severity level",
        },
        "--environment": { type: "string", optional: true, brief: "Filter by environment" },
        "--include-vars": {
          type: "boolean",
          default: false,
          brief: "Include local variables from stack frames (may contain secrets)",
        },
        ...OUTPUT_FLAGS,
        ...TOKEN_FLAG,
      },
    },
    occurrences: {
      brief: "Manage Rollbar occurrences (individual error instances)",
      subcommands: {
        list: {
          brief: "List occurrences",
          flags: {
            "--item-id": { type: "number", optional: true, brief: "Filter to a specific item ID" },
            "--limit": { type: "number", default: 20, brief: "Max occurrences to return" },
            "--page": { type: "number", default: 1, brief: "Page number" },
            ...OUTPUT_FLAGS,
            ...TOKEN_FLAG,
          },
        },
        get: {
          brief: "Get a specific occurrence",
          positional: [{ name: "id", type: "string", brief: "Occurrence ID" }],
          flags: { ...OUTPUT_FLAGS, ...TOKEN_FLAG },
        },
      },
    },
    projects: {
      brief: "Manage Rollbar projects (account-scoped)",
      subcommands: {
        list: {
          brief: "List all projects",
          flags: { ...OUTPUT_FLAGS, ...TOKEN_FLAG },
        },
        get: {
          brief: "Get a project by ID",
          positional: [{ name: "id", type: "number", brief: "Project ID" }],
          flags: { ...OUTPUT_FLAGS, ...TOKEN_FLAG },
        },
      },
    },
    deploys: {
      brief: "Manage Rollbar deploys",
      subcommands: {
        list: {
          brief: "List deploys",
          flags: {
            "--project-id": { type: "number", optional: true, brief: "Filter by project ID" },
            "--environment": { type: "string", optional: true, brief: "Filter by environment" },
            "--limit": { type: "number", default: 20, brief: "Max deploys to return" },
            "--page": { type: "number", default: 1, brief: "Page number" },
            ...OUTPUT_FLAGS,
            ...TOKEN_FLAG,
          },
        },
        get: {
          brief: "Get a specific deploy",
          positional: [{ name: "deployId", type: "number", brief: "Deploy ID" }],
          flags: { ...OUTPUT_FLAGS, ...TOKEN_FLAG },
        },
      },
    },
    environments: {
      brief: "Manage Rollbar environments",
      subcommands: {
        list: {
          brief: "List environments for a project",
          flags: {
            "--project-id": { type: "number", optional: true, brief: "Filter by project ID" },
            ...OUTPUT_FLAGS,
            ...TOKEN_FLAG,
          },
        },
      },
    },
    users: {
      brief: "Manage Rollbar users (account-scoped)",
      subcommands: {
        list: {
          brief: "List all users",
          flags: { ...OUTPUT_FLAGS, ...TOKEN_FLAG },
        },
        get: {
          brief: "Get a user by ID",
          positional: [{ name: "id", type: "number", brief: "User ID" }],
          flags: { ...OUTPUT_FLAGS, ...TOKEN_FLAG },
        },
      },
    },
    "agent-context": {
      brief: "Output this schema (you are here)",
      flags: {},
    },
  },
};

export async function agentContext(this: LocalContext): Promise<void> {
  this.process.stdout.write(JSON.stringify(SCHEMA, null, 2) + "\n");
}
