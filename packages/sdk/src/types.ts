import { z } from "zod";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export const RollbarConfigSchema = z.object({
  projectToken: z.string().default(""),
  accountToken: z.string().default(""),
  baseUrl: z.string().url().default("https://api.rollbar.com/api/1"),
});

export type RollbarConfig = z.infer<typeof RollbarConfigSchema>;

// ---------------------------------------------------------------------------
// API response wrapper — all Rollbar responses use { err, result }
// ---------------------------------------------------------------------------

export const ErrorResponseSchema = z.object({
  err: z.number(),
  message: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export const RollbarItemSchema = z.object({
  id: z.number(),
  counter: z.number(),
  environment: z.string(),
  framework: z.string(),
  level: z.string(),
  timestamp: z.number(),
  title: z.string(),
  total_occurrences: z.number(),
  last_occurrence_timestamp: z.number(),
  first_occurrence_timestamp: z.number(),
  status: z.string(),
  assigned_user_id: z.number().nullable().optional(),
});

export type RollbarItem = z.infer<typeof RollbarItemSchema>;

export interface ListItemsParams {
  status?: string;
  level?: string;
  environment?: string;
  limit?: number;
  page?: number;
}

// ---------------------------------------------------------------------------
// Occurrences
// ---------------------------------------------------------------------------

export const RollbarOccurrenceSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  item_id: z.number(),
  language: z.string().optional(),
  level: z.string(),
  framework: z.string().optional(),
  body: z.record(z.unknown()),
  request: z.record(z.unknown()).optional(),
  person: z
    .object({
      id: z.string(),
      username: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
});

export type RollbarOccurrence = z.infer<typeof RollbarOccurrenceSchema>;

export interface ListOccurrencesParams {
  itemId?: number;
  limit?: number;
  page?: number;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const RollbarProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  account_id: z.number(),
});

export type RollbarProject = z.infer<typeof RollbarProjectSchema>;

// ---------------------------------------------------------------------------
// Deploys
// ---------------------------------------------------------------------------

export const RollbarDeploySchema = z.object({
  id: z.number(),
  environment: z.string(),
  revision: z.string(),
  comment: z.string().optional(),
  timestamp: z.number(),
  local_username: z.string().optional(),
  project_id: z.number(),
});

export type RollbarDeploy = z.infer<typeof RollbarDeploySchema>;

export interface ListDeploysParams {
  projectId?: number;
  environment?: string;
  limit?: number;
  page?: number;
}

// ---------------------------------------------------------------------------
// Environments
// ---------------------------------------------------------------------------

export const RollbarEnvironmentSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type RollbarEnvironment = z.infer<typeof RollbarEnvironmentSchema>;

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const RollbarUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
});

export type RollbarUser = z.infer<typeof RollbarUserSchema>;
