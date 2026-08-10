export interface ApiMeta {
  [key: string]: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  error: null;
  meta: ApiMeta | null;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiMeta;
  requiresVerification?: boolean;
}

export interface ApiError {
  success: false;
  data: null;
  error: ApiErrorPayload;
  meta: ApiMeta | null;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function createSuccessResponse<T>(data: T, meta: ApiMeta | null = null): ApiSuccess<T> {
  return {
    success: true,
    data,
    error: null,
    meta,
  };
}
