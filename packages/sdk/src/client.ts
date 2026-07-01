import type {
  RollbarConfig,
  RollbarItem,
  RollbarOccurrence,
  RollbarProject,
  RollbarDeploy,
  RollbarEnvironment,
  RollbarUser,
  ListItemsParams,
  ListItemsResult,
  ListOccurrencesParams,
  ListOccurrencesResult,
  ListDeploysParams,
  ListDeploysResult,
  GetItemDetailedParams,
  ItemDetailed,
  TopItemsParams,
  TopItem,
  TopItemDetailsParams,
  TopItemDetails,
  RqlJob,
  RqlJobResult,
  CreateRqlJobParams,
  ListRqlJobsParams,
  GetRqlJobParams,
  WaitForRqlJobOptions,
} from "./types.js";
import { RollbarConfigSchema, ErrorResponseSchema, RQL_TERMINAL_STATUSES } from "./types.js";
import { RollbarError, RollbarAuthError, RollbarNotFoundError } from "./errors.js";

export class RollbarClient {
  private readonly config: RollbarConfig;

  constructor(config: Partial<RollbarConfig>) {
    this.config = RollbarConfigSchema.parse(config);
  }

  // -------------------------------------------------------------------------
  // HTTP helpers
  // -------------------------------------------------------------------------

  private async request<T>(
    token: string,
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Rollbar-Access-Token": token,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      if (res.status === 401) throw new RollbarAuthError();
      if (res.status === 404) {
        throw new RollbarNotFoundError("resource", path);
      }

      const errorBody = await res.json().catch(() => null);
      const parsed = ErrorResponseSchema.safeParse(errorBody);

      throw new RollbarError(
        parsed.success && parsed.data.message ? parsed.data.message : `HTTP ${res.status}`,
        String(res.status),
        res.status,
      );
    }

    const json = (await res.json()) as { err: number; result: T; message?: string };

    if (json.err !== 0) {
      throw new RollbarError(json.message ?? "Unknown Rollbar API error", String(json.err));
    }

    return json.result;
  }

  private projectRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
    return this.request<T>(this.config.projectToken, method, path, body);
  }

  private accountRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
    return this.request<T>(this.config.accountToken, method, path, body);
  }

  // -------------------------------------------------------------------------
  // Items (project-scoped)
  // -------------------------------------------------------------------------

  async listItems(params: ListItemsParams = {}): Promise<ListItemsResult> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.level) query.set("level", params.level);
    if (params.environment) query.set("environment", params.environment);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.page) query.set("page", String(params.page));
    const qs = query.toString();
    return this.projectRequest("GET", `/items${qs ? `?${qs}` : ""}`);
  }

  async getItem(id: number): Promise<RollbarItem> {
    return this.projectRequest("GET", `/item/${id}`);
  }

  async getItemByCounter(counter: number): Promise<RollbarItem> {
    return this.projectRequest("GET", `/item_by_counter/${counter}`);
  }

  async getItemByUuid(uuid: string): Promise<RollbarItem> {
    return this.projectRequest("GET", `/item/${uuid}`);
  }

  // -------------------------------------------------------------------------
  // Occurrences (project-scoped)
  // -------------------------------------------------------------------------

  async listOccurrences(params: ListOccurrencesParams = {}): Promise<ListOccurrencesResult> {
    const query = new URLSearchParams();
    if (params.limit) query.set("limit", String(params.limit));
    if (params.page) query.set("page", String(params.page));
    const qs = query.toString();

    if (params.itemId) {
      return this.projectRequest("GET", `/item/${params.itemId}/instances${qs ? `?${qs}` : ""}`);
    }
    return this.projectRequest("GET", `/instances${qs ? `?${qs}` : ""}`);
  }

  async getOccurrence(id: string): Promise<RollbarOccurrence> {
    return this.projectRequest("GET", `/instance/${id}`);
  }

  // -------------------------------------------------------------------------
  // Item Detailed (item + latest occurrence combined)
  // -------------------------------------------------------------------------

  async getItemDetailed(itemId: number, params: GetItemDetailedParams = {}): Promise<ItemDetailed> {
    const item = await this.getItem(itemId);
    return this.enrichItemWithOccurrence(item, params);
  }

  async getItemDetailedByUuid(
    uuid: string,
    params: GetItemDetailedParams = {},
  ): Promise<ItemDetailed> {
    const item = await this.getItemByUuid(uuid);
    return this.enrichItemWithOccurrence(item, params);
  }

  // Bare top-N items ranked by total_occurrences within a time window. Fast — single
  // listItems call, no per-item enrichment. Use this when you just need the ranking;
  // use listTopItemDetails when you also need each item's latest occurrence + stack trace.
  async listTopItems(params: TopItemsParams = {}): Promise<TopItem[]> {
    const ranked = await this.rankTopItems(params);
    return ranked.map((item, i) => ({ ...item, rank: i + 1 }));
  }

  async listTopItemDetails(params: TopItemDetailsParams = {}): Promise<TopItemDetails[]> {
    const ranked = await this.rankTopItems(params);
    return Promise.all(
      ranked.map((item, i) =>
        this.enrichItemWithOccurrence(item, { includeVars: params.includeVars }).then((d) => ({
          ...d,
          rank: i + 1,
        })),
      ),
    );
  }

  private async rankTopItems(params: TopItemsParams): Promise<RollbarItem[]> {
    const { window: windowStr = "30d", limit = 10, status = "active", level, environment } = params;
    const minTimestamp = parseWindow(windowStr);
    const { items } = await this.listItems({ status, level, environment, limit: 100 });
    return items
      .filter((item) => item.last_occurrence_timestamp >= minTimestamp)
      .sort((a, b) => b.total_occurrences - a.total_occurrences)
      .slice(0, limit);
  }

  private async enrichItemWithOccurrence(
    item: RollbarItem,
    params: GetItemDetailedParams = {},
  ): Promise<ItemDetailed> {
    const { instances } = await this.listOccurrences({ itemId: item.id, limit: 1 });
    let latestOccurrence = instances[0] ?? null;
    if (latestOccurrence && !params.includeVars) {
      latestOccurrence = {
        ...latestOccurrence,
        body: stripVarsFromBody(latestOccurrence.body),
      };
    }
    return { item, latestOccurrence };
  }

  // -------------------------------------------------------------------------
  // Projects (account-scoped)
  // -------------------------------------------------------------------------

  async listProjects(): Promise<RollbarProject[]> {
    return this.accountRequest("GET", "/projects");
  }

  async getProject(id: number): Promise<RollbarProject> {
    return this.accountRequest("GET", `/project/${id}`);
  }

  // -------------------------------------------------------------------------
  // Deploys (project-scoped)
  // -------------------------------------------------------------------------

  async listDeploys(params: ListDeploysParams = {}): Promise<ListDeploysResult> {
    const query = new URLSearchParams();
    if (params.environment) query.set("environment", params.environment);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.page) query.set("page", String(params.page));
    const qs = query.toString();

    const projectId = params.projectId ?? this.config.projectId;
    const projectPath = projectId ? `/project/${projectId}/deploys` : "/deploys";
    return this.projectRequest("GET", `${projectPath}${qs ? `?${qs}` : ""}`);
  }

  async getDeploy(deployId: number): Promise<RollbarDeploy> {
    return this.projectRequest("GET", `/deploy/${deployId}`);
  }

  // -------------------------------------------------------------------------
  // Environments (project-scoped)
  // -------------------------------------------------------------------------

  async listEnvironments(projectId?: number): Promise<RollbarEnvironment[]> {
    const resolvedProjectId = projectId ?? this.config.projectId;
    const path = resolvedProjectId ? `/project/${resolvedProjectId}/environments` : "/environments";
    return this.projectRequest("GET", path);
  }

  // -------------------------------------------------------------------------
  // Users (account-scoped)
  // -------------------------------------------------------------------------

  async listUsers(): Promise<RollbarUser[]> {
    return this.accountRequest("GET", "/users");
  }

  async getUser(id: number): Promise<RollbarUser> {
    return this.accountRequest("GET", `/user/${id}`);
  }

  // -------------------------------------------------------------------------
  // RQL (Rollbar Query Language) jobs
  //
  // RQL jobs are asynchronous: create returns immediately with a queued job,
  // status transitions through new -> running -> success/failed/cancelled/timed_out,
  // and results live behind a separate /result endpoint.
  // -------------------------------------------------------------------------

  async createRqlJob(params: CreateRqlJobParams): Promise<RqlJob> {
    return this.projectRequest("POST", "/rql/jobs/", {
      query_string: params.queryString,
      ...(params.forceRefresh !== undefined ? { force_refresh: params.forceRefresh } : {}),
    });
  }

  async listRqlJobs(params: ListRqlJobsParams = {}): Promise<RqlJob[]> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    const qs = query.toString();
    return this.projectRequest("GET", `/rql/jobs/${qs ? `?${qs}` : ""}`);
  }

  async getRqlJob(id: number, params: GetRqlJobParams = {}): Promise<RqlJob> {
    const qs = params.expandResult ? "?expand=result" : "";
    return this.projectRequest("GET", `/rql/job/${id}${qs}`);
  }

  async getRqlJobResults(id: number): Promise<RqlJobResult> {
    return this.projectRequest("GET", `/rql/job/${id}/result`);
  }

  async cancelRqlJob(id: number): Promise<RqlJob> {
    return this.projectRequest("POST", `/rql/job/${id}/cancel`);
  }

  // Poll getRqlJob until the job reaches a terminal status (success/failed/cancelled/timed_out)
  // or the wall-clock timeout elapses. Uses exponential backoff with jitter so a slow
  // query doesn't hammer the API. Callers fetch results separately via getRqlJobResults.
  async waitForRqlJob(id: number, options: WaitForRqlJobOptions = {}): Promise<RqlJob> {
    const timeoutMs = options.timeoutMs ?? 300_000;
    const initialIntervalMs = options.initialIntervalMs ?? 1_000;
    const maxIntervalMs = options.maxIntervalMs ?? 10_000;
    const throwOnTimeout = options.throwOnTimeout ?? true;

    const deadline = Date.now() + timeoutMs;
    let interval = initialIntervalMs;
    let job = await this.getRqlJob(id);

    while (!isTerminalRqlStatus(job.status)) {
      if (Date.now() >= deadline) {
        if (throwOnTimeout) {
          throw new RollbarError(
            `Timed out after ${timeoutMs}ms waiting for RQL job ${id} (last status: ${job.status})`,
            "rql_wait_timeout",
          );
        }
        return job;
      }

      const jitter = Math.random() * interval * 0.25;
      const sleepMs = Math.min(interval + jitter, deadline - Date.now());
      if (sleepMs <= 0) continue;
      await new Promise((resolve) => setTimeout(resolve, sleepMs));
      interval = Math.min(interval * 2, maxIntervalMs);

      job = await this.getRqlJob(id);
    }

    return job;
  }
}

function isTerminalRqlStatus(status: string): boolean {
  return (RQL_TERMINAL_STATUSES as readonly string[]).includes(status);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WINDOW_UNITS: Record<string, number> = { h: 3600, d: 86400, w: 604800, m: 2592000 };

function parseWindow(window: string): number {
  const match = /^(\d+)(h|d|w|m)$/.exec(window);
  if (!match) {
    throw new Error(`Invalid window "${window}". Expected format: 24h, 7d, 30d, 12w, 3m`);
  }
  const seconds = WINDOW_UNITS[match[2]!]!;
  return Math.floor(Date.now() / 1000) - Number(match[1]) * seconds;
}

const FRAME_VAR_KEYS = ["locals", "args", "kwargs", "varnames"];

/** Strip local variables and arguments from stack trace frames to avoid leaking secrets. */
function stripVarsFromBody(body: Record<string, unknown>): Record<string, unknown> {
  const result = { ...body };

  for (const key of ["trace", "trace_chain"] as const) {
    const value = result[key];
    if (!value) continue;

    if (key === "trace" && isTrace(value)) {
      result[key] = stripTraceVars(value);
    } else if (key === "trace_chain" && Array.isArray(value)) {
      result[key] = value.map((t) => (isTrace(t) ? stripTraceVars(t) : t));
    }
  }

  return result;
}

function isTrace(v: unknown): v is { frames?: unknown[]; exception?: unknown } {
  return typeof v === "object" && v !== null && "frames" in v;
}

function stripTraceVars(trace: { frames?: unknown[]; exception?: unknown }): {
  frames?: unknown[];
  exception?: unknown;
} {
  if (!Array.isArray(trace.frames)) return trace;
  return {
    ...trace,
    frames: trace.frames.map((frame) => {
      if (typeof frame !== "object" || frame === null) return frame;
      const cleaned = { ...frame } as Record<string, unknown>;
      for (const k of FRAME_VAR_KEYS) {
        delete cleaned[k];
      }
      return cleaned;
    }),
  };
}
