import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiError, ApiErrorPayload } from './api-response';

function normalizeErrorPayload(exception: unknown): ApiErrorPayload {
  if (exception instanceof HttpException) {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return {
        code: exception.name,
        message: response,
      };
    }

    if (typeof response === 'object' && response !== null) {
      const payload = response as Record<string, unknown>;
      const message = typeof payload.message === 'string' ? payload.message : exception.message;
      const code = typeof payload.code === 'string' ? payload.code : exception.name;
      const details =
        typeof payload.details === 'object'
          ? (payload.details as Record<string, unknown>)
          : undefined;
      const requiresVerification =
        typeof payload.requiresVerification === 'boolean'
          ? payload.requiresVerification
          : undefined;

      return {
        code,
        message,
        ...(details ? { details } : {}),
        ...(requiresVerification !== undefined ? { requiresVerification } : {}),
      };
    }
  }

  if (exception instanceof Error) {
    return {
      code: exception.name,
      message: exception.message,
    };
  }

  return {
    code: 'InternalServerError',
    message: 'An unexpected error occurred.',
  };
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = normalizeErrorPayload(exception);

    if (!(exception instanceof HttpException)) {
      this.logger.error(payload.message, exception instanceof Error ? exception.stack : undefined);
    }

    const body: ApiError = {
      success: false,
      data: null,
      error: payload,
      meta: null,
    };

    response.status(status).json(body);
  }
}
