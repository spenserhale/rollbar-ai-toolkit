import { z } from "zod";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export const RollbarConfigSchema = z.object({
  projectToken: z.string().default(""),
  accountToken: z.string().default(""),
  baseUrl: z.string().url().default("https://api.rollbar.com/api/1"),
  projectId: z.number().int().positive().optional(),
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

export interface ListItemsResult {
  items: RollbarItem[];
  page: number;
  total_count: number | null;
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

export interface ListOccurrencesResult {
  instances: RollbarOccurrence[];
  page: number;
  total_count: number | null;
}

// ---------------------------------------------------------------------------
// Item Detailed (item + latest occurrence combined)
// ---------------------------------------------------------------------------

export interface GetItemDetailedParams {
  /** Include local variables / args from stack trace frames (default: false) */
  includeVars?: boolean;
}

export interface ItemDetailed {
  item: RollbarItem;
  latestOccurrence: RollbarOccurrence | null;
}

export interface TopItemsParams {
  /** Time window to look back — "24h", "7d", "30d", "90d" (default: "30d") */
  window?: string;
  limit?: number;
  status?: string;
  level?: string;
  environment?: string;
}

export interface TopItem extends RollbarItem {
  rank: number;
}

export interface TopItemDetailsParams extends TopItemsParams {
  includeVars?: boolean;
}

export interface TopItemDetails extends ItemDetailed {
  rank: number;
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

export interface ListDeploysResult {
  deploys: RollbarDeploy[];
  page: number;
  total_count: number | null;
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
// RQL (Rollbar Query Language) jobs
// ---------------------------------------------------------------------------

export const RQL_TERMINAL_STATUSES = ["success", "failed", "cancelled", "timed_out"] as const;
export const RQL_STATUSES = ["new", "running", ...RQL_TERMINAL_STATUSES] as const;

export type RqlJobStatus = (typeof RQL_STATUSES)[number];
export type RqlTerminalStatus = (typeof RQL_TERMINAL_STATUSES)[number];

export const RqlJobSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  query_string: z.string(),
  status: z.enum(RQL_STATUSES),
  job_hash: z.string(),
  date_created: z.number(),
  date_modified: z.number(),
  result: z.unknown().optional(),
});

export type RqlJob = z.infer<typeof RqlJobSchema>;

export const RqlJobResultPayloadSchema = z.object({
  rows: z.array(z.unknown()).optional(),
  selectionColumns: z.array(z.string()).optional(),
  columns: z.array(z.unknown()).optional(),
  errors: z.array(z.unknown()).optional(),
  warnings: z.array(z.unknown()).optional(),
  rowcount: z.number().optional(),
  executionTime: z.number().optional(),
});

export type RqlJobResultPayload = z.infer<typeof RqlJobResultPayloadSchema>;

export const RqlJobResultSchema = z.object({
  job_id: z.number(),
  result: RqlJobResultPayloadSchema,
  job: RqlJobSchema.optional(),
});

export type RqlJobResult = z.infer<typeof RqlJobResultSchema>;

export interface CreateRqlJobParams {
  queryString: string;
  /** When true, bypasses Rollbar's cache and forces a fresh execution. */
  forceRefresh?: boolean;
}

export interface ListRqlJobsParams {
  page?: number;
}

export interface GetRqlJobParams {
  /** When true, fetches the job with `?expand=result` so the result is included inline. */
  expandResult?: boolean;
}

export interface WaitForRqlJobOptions {
  /** Max wall-clock time to wait before giving up. Default: 300_000 (5 min). */
  timeoutMs?: number;
  /** Initial poll interval. Each poll backs off up to maxIntervalMs. Default: 1_000. */
  initialIntervalMs?: number;
  /** Maximum poll interval after backoff. Default: 10_000. */
  maxIntervalMs?: number;
  /** When the wait times out (per `timeoutMs`), throw instead of returning the last-seen job. Default: true. */
  throwOnTimeout?: boolean;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const RollbarUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
});

export type RollbarUser = z.infer<typeof RollbarUserSchema>;
