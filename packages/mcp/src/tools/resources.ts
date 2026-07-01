import type { FastMCP } from "fastmcp";
import { z } from "zod";
import { RollbarClient, resolveConfig } from "@rollbar-toolkit/sdk";

function getClient(): RollbarClient {
  const config = resolveConfig();
  return new RollbarClient(config);
}

export function registerResourceTools(server: FastMCP) {
  // ---------------------------------------------------------------------------
  // Items
  // ---------------------------------------------------------------------------

  server.addTool({
    name: "list_items",
    description:
      "List Rollbar items (error groups) with optional filters for status, level, environment, and pagination.",
    parameters: z.object({
      status: z
        .enum(["active", "resolved", "muted", "archived"])
        .optional()
        .describe("Filter by item status"),
      level: z
        .enum(["debug", "info", "warning", "error", "critical"])
        .optional()
        .describe("Filter by severity level"),
      environment: z.string().optional().describe('Filter by environment name, e.g. "production"'),
      limit: z
        .number()
        .int()
        .positive()
        .max(100)
        .default(20)
        .describe("Maximum number of items to return (1–100, default 20)"),
      page: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Page number for pagination (default 1)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.listItems(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_item",
    description: "Get a single Rollbar item by its internal item ID.",
    parameters: z.object({
      id: z.number().int().positive().describe("The internal Rollbar item ID"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getItem(args.id);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_item_by_counter",
    description:
      "Get a Rollbar item by its project-scoped counter number (the number shown in the Rollbar UI).",
    parameters: z.object({
      counter: z.number().int().positive().describe("The project-scoped item counter number"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getItemByCounter(args.counter);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_item_detailed",
    description:
      "Get a Rollbar item together with its latest occurrence (including stack trace). By default, local variables are stripped from stack frames to avoid leaking secrets — set includeVars to true to include them.",
    parameters: z.object({
      itemId: z.number().int().positive().describe("The internal Rollbar item ID"),
      includeVars: z
        .boolean()
        .default(false)
        .describe(
          "Include local variables / args from stack trace frames (default false, may contain secrets)",
        ),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getItemDetailed(args.itemId, {
        includeVars: args.includeVars,
      });
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "list_top_items",
    description:
      "List the top N most-occurring Rollbar items in a time window, ranked by total_occurrences. Fast — no per-item enrichment. Use list_top_item_details when you also need each item's latest occurrence and stack trace.",
    parameters: z.object({
      window: z
        .string()
        .default("30d")
        .describe("Look-back window: 24h, 7d, 30d, 12w, 3m (default: 30d)"),
      limit: z
        .number()
        .int()
        .positive()
        .max(50)
        .default(10)
        .describe("Number of top items to return (default 10, max 50)"),
      status: z
        .enum(["active", "resolved", "muted", "archived"])
        .default("active")
        .describe("Filter by item status (default: active)"),
      level: z
        .enum(["debug", "info", "warning", "error", "critical"])
        .optional()
        .describe("Filter by severity level"),
      environment: z.string().optional().describe('Filter by environment name, e.g. "production"'),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.listTopItems(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "list_top_item_details",
    description:
      "List the top N most-occurring Rollbar items in a time window, each enriched with its latest occurrence and stack trace. Useful for identifying the noisiest errors without making separate calls per item.",
    parameters: z.object({
      window: z
        .string()
        .default("30d")
        .describe("Look-back window: 24h, 7d, 30d, 12w, 3m (default: 30d)"),
      limit: z
        .number()
        .int()
        .positive()
        .max(50)
        .default(10)
        .describe("Number of top items to return (default 10, max 50)"),
      status: z
        .enum(["active", "resolved", "muted", "archived"])
        .default("active")
        .describe("Filter by item status (default: active)"),
      level: z
        .enum(["debug", "info", "warning", "error", "critical"])
        .optional()
        .describe("Filter by severity level"),
      environment: z.string().optional().describe('Filter by environment name, e.g. "production"'),
      includeVars: z
        .boolean()
        .default(false)
        .describe(
          "Include local variables from stack trace frames (default false, may contain secrets)",
        ),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.listTopItemDetails(args);
      return JSON.stringify(result, null, 2);
    },
  });

  // ---------------------------------------------------------------------------
  // Occurrences
  // ---------------------------------------------------------------------------

  server.addTool({
    name: "list_occurrences",
    description:
      "List Rollbar occurrences (individual error instances). Optionally filter by item ID.",
    parameters: z.object({
      itemId: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Filter occurrences to a specific item ID"),
      limit: z
        .number()
        .int()
        .positive()
        .max(100)
        .default(20)
        .describe("Maximum number of occurrences to return (1–100, default 20)"),
      page: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Page number for pagination (default 1)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.listOccurrences(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_occurrence",
    description: "Get a single Rollbar occurrence by its occurrence ID.",
    parameters: z.object({
      id: z.string().describe("The occurrence ID"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getOccurrence(args.id);
      return JSON.stringify(result, null, 2);
    },
  });

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------

  server.addTool({
    name: "list_projects",
    description: "List all Rollbar projects in the account.",
    parameters: z.object({}),
    execute: async () => {
      const client = getClient();
      const result = await client.listProjects();
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_project",
    description: "Get a single Rollbar project by its project ID.",
    parameters: z.object({
      id: z.number().int().positive().describe("The Rollbar project ID"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getProject(args.id);
      return JSON.stringify(result, null, 2);
    },
  });

  // ---------------------------------------------------------------------------
  // Deploys
  // ---------------------------------------------------------------------------

  server.addTool({
    name: "list_deploys",
    description:
      "List Rollbar deploys with optional filters for project, environment, and pagination.",
    parameters: z.object({
      projectId: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Filter deploys to a specific project ID"),
      environment: z.string().optional().describe('Filter by environment name, e.g. "production"'),
      limit: z
        .number()
        .int()
        .positive()
        .max(100)
        .default(20)
        .describe("Maximum number of deploys to return (1–100, default 20)"),
      page: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Page number for pagination (default 1)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.listDeploys(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_deploy",
    description: "Get a single Rollbar deploy by its deploy ID.",
    parameters: z.object({
      deployId: z.number().int().positive().describe("The Rollbar deploy ID"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getDeploy(args.deployId);
      return JSON.stringify(result, null, 2);
    },
  });

  // ---------------------------------------------------------------------------
  // Environments
  // ---------------------------------------------------------------------------

  server.addTool({
    name: "list_environments",
    description: "List Rollbar environments, optionally scoped to a specific project.",
    parameters: z.object({
      projectId: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Filter environments to a specific project ID"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.listEnvironments(args.projectId);
      return JSON.stringify(result, null, 2);
    },
  });

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  server.addTool({
    name: "list_users",
    description: "List all users in the Rollbar account.",
    parameters: z.object({}),
    execute: async () => {
      const client = getClient();
      const result = await client.listUsers();
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_user",
    description: "Get a single Rollbar user by their user ID.",
    parameters: z.object({
      id: z.number().int().positive().describe("The Rollbar user ID"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getUser(args.id);
      return JSON.stringify(result, null, 2);
    },
  });

  // ---------------------------------------------------------------------------
  // RQL (Rollbar Query Language) jobs
  //
  // Async: create returns a queued job, status transitions through
  // new -> running -> success/failed/cancelled/timed_out. Results live behind
  // a separate `get_rql_job_results` endpoint. The agent composes the poll loop
  // (the CLI's `--wait` is a CLI affordance; MCP tools stay primitive).
  // ---------------------------------------------------------------------------

  server.addTool({
    name: "create_rql_job",
    description:
      "Submit an RQL query as a job. Returns immediately with a queued job. Always include `LIMIT 10` or `LIMIT 100` in the query — unbounded queries can run for minutes and may time out. Poll status via get_rql_job; fetch rows via get_rql_job_results once status is 'success'.",
    parameters: z.object({
      queryString: z
        .string()
        .describe('The RQL query, e.g. "SELECT * FROM item_occurrence LIMIT 10"'),
      forceRefresh: z
        .boolean()
        .default(false)
        .describe("Bypass Rollbar's query cache and force a fresh execution (default false)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.createRqlJob(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "list_rql_jobs",
    description: "List RQL jobs for the project (or account, with an account token).",
    parameters: z.object({
      page: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Page number for pagination (default 1)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.listRqlJobs(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_rql_job",
    description:
      "Check the status of an RQL job. Status is one of new, running, success, failed, cancelled, timed_out.",
    parameters: z.object({
      id: z.number().int().positive().describe("The RQL job ID"),
      expandResult: z
        .boolean()
        .default(false)
        .describe("Include the job's result inline (?expand=result)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getRqlJob(args.id, { expandResult: args.expandResult });
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "get_rql_job_results",
    description:
      "Fetch the rows of a completed RQL job (call after get_rql_job returns status 'success').",
    parameters: z.object({
      id: z.number().int().positive().describe("The RQL job ID"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getRqlJobResults(args.id);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "cancel_rql_job",
    description: "Cancel an in-flight RQL job. Transitions the job's status to 'cancelled'.",
    parameters: z.object({
      id: z.number().int().positive().describe("The RQL job ID"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.cancelRqlJob(args.id);
      return JSON.stringify(result, null, 2);
    },
  });

  // ---------------------------------------------------------------------------
  // RQL one-shot helpers (submit + poll + hydrate, wrapped for convenience)
  // ---------------------------------------------------------------------------

  server.addTool({
    name: "rql_query",
    description:
      "Run an arbitrary RQL query end-to-end (submit job, poll to success, return rows). A LIMIT is appended if the query has none (default 100). Set enrich=true to hydrate rows carrying item.counter/item.id into full item-details. --window is not injected into arbitrary SQL; include your own `timestamp >= ...` clause to bound large scans.",
    parameters: z.object({
      queryString: z.string().describe("The RQL query string"),
      enrich: z.boolean().optional().describe("Hydrate item rows into full item-details"),
      limit: z
        .number()
        .int()
        .positive()
        .default(100)
        .describe("LIMIT to append when the query has none (default 100)"),
      window: z.string().optional().describe("Human window (30d/1w); informational for arbitrary queries"),
      includeVars: z
        .boolean()
        .optional()
        .describe("Include stack-frame locals when enriching (may contain secrets)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.rqlQuery(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "rql_by_url",
    description:
      "Find the top-N items whose occurrences hit a URL/domain substring (default 5), each enriched to full item-details plus its occurrence count. Ranked by occurrence count over the given window (default 30d).",
    parameters: z.object({
      domain: z.string().describe("Domain / host / URL substring to match"),
      limit: z.number().int().positive().default(5).describe("Number of top items (default 5)"),
      window: z.string().default("30d").describe("Look-back window (default 30d)"),
      includeVars: z
        .boolean()
        .optional()
        .describe("Include stack-frame locals (may contain secrets)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.rqlByUrl(args);
      return JSON.stringify(result, null, 2);
    },
  });

  server.addTool({
    name: "rql_affected_users",
    description:
      "List the distinct users affected by an item (person id/username/email + per-user occurrence count) over the given window (default 30d, up to limit=100). Use to build a contact list once an error is resolved.",
    parameters: z.object({
      itemId: z.number().int().positive().describe("Rollbar item ID"),
      limit: z.number().int().positive().default(100).describe("Max distinct users (default 100)"),
      window: z.string().default("30d").describe("Look-back window (default 30d)"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.rqlAffectedUsers(args);
      return JSON.stringify(result, null, 2);
    },
  });
}
