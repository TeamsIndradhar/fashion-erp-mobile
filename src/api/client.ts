import { ApiError, toApiError } from "./errors";
import type { ApiErrorBody } from "./types";
import type { Session } from "../auth/session";
import { strings } from "../config/strings";

export interface ClientConfig {
  baseUrl: string;
  appVersion: string;
  platform: "android" | "ios";
  fetchImpl?: typeof fetch;
  newRequestId?: () => string;
  timeoutMs?: number;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Public endpoints (app-config, login, refresh) send no bearer and never refresh. */
  auth?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  /** Return the whole envelope (`{ data, meta }`) instead of only `data` — paged lists. */
  envelope?: boolean;
}

/** Server list meta (fashion-erp buildListMeta). */
export interface ListMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface Paged<T> {
  data: T[];
  meta: ListMeta;
}

const DEFAULT_TIMEOUT_MS = 15_000;

function randomId(): string {
  // RFC 4122 v4 shape; only used for log correlation, not security.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * fetch wrapper: base URL, Bearer, X-App-Version / X-App-Platform / X-Request-Id,
 * timeouts, error envelope → ApiError, and one replay after a refresh on
 * AUTH_TOKEN_EXPIRED (docs/02 §6).
 */
export function createApiClient(config: ClientConfig, getSession: () => Session | null) {
  const doFetch = config.fetchImpl ?? fetch;
  const newId = config.newRequestId ?? randomId;

  async function send<T>(path: string, opts: RequestOptions, token: string | null): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-App-Version": config.appVersion,
      "X-App-Platform": config.platform,
      "X-Request-Id": newId(),
    };
    let body: BodyInit | undefined;
    if (opts.body instanceof FormData) {
      body = opts.body;
    } else if (opts.body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(opts.body);
    }
    if (token) headers.Authorization = `Bearer ${token}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? config.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    const onOuterAbort = () => controller.abort();
    opts.signal?.addEventListener("abort", onOuterAbort);

    let res: Response;
    try {
      res = await doFetch(`${config.baseUrl}${path}`, { method: opts.method ?? "GET", headers, body, signal: controller.signal });
    } catch (err: unknown) {
      if (controller.signal.aborted && !opts.signal?.aborted) throw new ApiError(0, "TIMEOUT", strings.errors.timeout);
      // A file that cannot be read or attached is not a connection problem.
      if (err instanceof Error && (err.name === "LocalFileReadError" || /FormData/i.test(err.message))) {
        throw new ApiError(0, "FILE_UNREADABLE", `${strings.errors.fileUnreadable} [${err.message}]`);
      }
      const detail = err instanceof Error ? err.message : String(err || "");
      throw new ApiError(0, "NETWORK_ERROR", detail ? `${strings.errors.network} [${detail}]` : strings.errors.network);
    } finally {
      clearTimeout(timer);
      opts.signal?.removeEventListener("abort", onOuterAbort);
    }

    let json: unknown = null;
    const text = await res.text();
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }
    if (!res.ok) throw toApiError(res.status, json as ApiErrorBody | null);
    if (opts.envelope) return json as T;
    return ((json as { data?: T } | null)?.data ?? (json as T)) as T;
  }

  async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const session = opts.auth === false ? null : getSession();
    const token = session ? await session.accessToken() : null;
    try {
      try {
        return await send<T>(path, opts, token);
      } catch (err) {
        if (!(err instanceof ApiError) || !session || err.code !== "AUTH_TOKEN_EXPIRED") throw err;
        const fresh = await session.refresh();
        return await send<T>(path, opts, fresh.accessToken);
      }
    } catch (err) {
      // refresh() already ended the session when it was refused; this covers the request itself.
      if (err instanceof ApiError && session && err.endsSession && (await session.hasSession())) await session.end(err);
      throw err;
    }
  }

  return {
    request,
    get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) => request<T>(path, { ...opts, method: "GET" }),
    getPage: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body" | "envelope">) => request<Paged<T>>(path, { ...opts, method: "GET", envelope: true }),
    post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) => request<T>(path, { ...opts, method: "POST", body }),
    del: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) => request<T>(path, { ...opts, method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
