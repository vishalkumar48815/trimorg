export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requiresVerification?: boolean;
}

export interface ApiEnvelope<T> {
  success: true;
  data: T;
  error: null;
  meta: Record<string, unknown> | null;
}

export interface ApiErrorEnvelope {
  success: false;
  data: null;
  error: ApiErrorPayload;
  meta: Record<string, unknown> | null;
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly requiresVerification?: boolean;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>,
    requiresVerification?: boolean,
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requiresVerification = requiresVerification;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function parseEnvelope<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as
    ApiEnvelope<T> | ApiErrorEnvelope | null;

  if (!response.ok) {
    const error =
      isRecord(body) && 'error' in body && isRecord(body.error)
        ? (body.error as ApiErrorPayload)
        : { code: 'RequestFailed', message: response.statusText || 'Request failed.' };

    throw new ApiRequestError(
      response.status,
      error.code,
      error.message,
      error.details,
      error.requiresVerification,
    );
  }

  if (!body || !('success' in body) || body.success !== true) {
    throw new ApiRequestError(response.status, 'InvalidResponse', 'Invalid API response.');
  }

  return body.data;
}

let refreshPromise: Promise<void> | null = null;

async function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new ApiRequestError(response.status, 'RefreshFailed', 'Session refresh failed.');
      }

      await parseEnvelope(response);
    })().finally(() => {
      refreshPromise = null;
    });
  }

  await refreshPromise;
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = false, body, headers, ...requestInit } = options;
  const isJsonBody = body !== undefined && body !== null && !(body instanceof FormData);

  const execute = async (): Promise<Response> =>
    fetch(buildUrl(path), {
      ...requestInit,
      body:
        body === undefined || body === null
          ? undefined
          : body instanceof FormData
            ? body
            : typeof body === 'string'
              ? body
              : JSON.stringify(body),
      credentials: 'include',
      headers: {
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
    });

  let response = await execute();

  if (auth && response.status === 401) {
    await refreshSession();
    response = await execute();
  }

  return parseEnvelope<T>(response);
}
