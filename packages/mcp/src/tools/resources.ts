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
      environment: z
        .string()
        .optional()
        .describe('Filter by environment name, e.g. "production"'),
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
      counter: z
        .number()
        .int()
        .positive()
        .describe("The project-scoped item counter number"),
    }),
    execute: async (args) => {
      const client = getClient();
      const result = await client.getItemByCounter(args.counter);
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
      environment: z
        .string()
        .optional()
        .describe('Filter by environment name, e.g. "production"'),
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
    description:
      "List Rollbar environments, optionally scoped to a specific project.",
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
}
