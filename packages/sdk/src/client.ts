import type {
  RollbarConfig,
  RollbarItem,
  RollbarOccurrence,
  RollbarProject,
  RollbarDeploy,
  RollbarEnvironment,
  RollbarUser,
  ListItemsParams,
  ListOccurrencesParams,
  ListDeploysParams,
} from "./types.js";
import { RollbarConfigSchema, ErrorResponseSchema } from "./types.js";
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
    body?: unknown
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
        parsed.success && parsed.data.message
          ? parsed.data.message
          : `HTTP ${res.status}`,
        String(res.status),
        res.status
      );
    }

    const json = (await res.json()) as { err: number; result: T; message?: string };

    if (json.err !== 0) {
      throw new RollbarError(
        json.message ?? "Unknown Rollbar API error",
        String(json.err)
      );
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

  async listItems(params: ListItemsParams = {}): Promise<{ items: RollbarItem[] }> {
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

  async listOccurrences(
    params: ListOccurrencesParams = {}
  ): Promise<{ instances: RollbarOccurrence[] }> {
    const query = new URLSearchParams();
    if (params.limit) query.set("limit", String(params.limit));
    if (params.page) query.set("page", String(params.page));
    const qs = query.toString();

    if (params.itemId) {
      return this.projectRequest(
        "GET",
        `/item/${params.itemId}/instances${qs ? `?${qs}` : ""}`
      );
    }
    return this.projectRequest("GET", `/instances${qs ? `?${qs}` : ""}`);
  }

  async getOccurrence(id: string): Promise<RollbarOccurrence> {
    return this.projectRequest("GET", `/instance/${id}`);
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

  async listDeploys(
    params: ListDeploysParams = {}
  ): Promise<{ deploys: RollbarDeploy[] }> {
    const query = new URLSearchParams();
    if (params.environment) query.set("environment", params.environment);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.page) query.set("page", String(params.page));
    const qs = query.toString();

    const projectPath = params.projectId
      ? `/project/${params.projectId}/deploys`
      : "/deploys";
    return this.projectRequest("GET", `${projectPath}${qs ? `?${qs}` : ""}`);
  }

  async getDeploy(deployId: number): Promise<RollbarDeploy> {
    return this.projectRequest("GET", `/deploy/${deployId}`);
  }

  // -------------------------------------------------------------------------
  // Environments (project-scoped)
  // -------------------------------------------------------------------------

  async listEnvironments(
    projectId?: number
  ): Promise<RollbarEnvironment[]> {
    const path = projectId
      ? `/project/${projectId}/environments`
      : "/environments";
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
}
