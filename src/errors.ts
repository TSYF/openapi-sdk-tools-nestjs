import { HttpException } from "@nestjs/common";

/**
 * Base exception class for NestJS servers that use this SDK toolchain.
 * Carries a `code` field in the response body so SDK clients can
 * discriminate errors beyond just the HTTP status.
 *
 * The code can be a known ErrorCode or any custom string tag
 * (e.g. 'DATABASE_UNAVAILABLE', 'CART_EXPIRED').
 */
export class ServiceException extends HttpException {
  public readonly code: string;

  constructor(
    code: string,
    status: number,
    message: string,
    provider?: string,
  ) {
    super({ code, status, message, provider: provider ?? undefined }, status);
    this.code = code;
  }
}

export class BadRequestServiceError extends ServiceException {
  constructor(message: string, provider?: string) {
    super("BAD_REQUEST", 400, message, provider);
  }
}
export class UnauthorizedServiceError extends ServiceException {
  constructor(message: string, provider?: string) {
    super("UNAUTHORIZED", 401, message, provider);
  }
}
export class ForbiddenServiceError extends ServiceException {
  constructor(message: string, provider?: string) {
    super("FORBIDDEN", 403, message, provider);
  }
}
export class NotFoundServiceError extends ServiceException {
  constructor(message: string, provider?: string) {
    super("NOT_FOUND", 404, message, provider);
  }
}
export class ConflictServiceError extends ServiceException {
  constructor(message: string, provider?: string) {
    super("CONFLICT", 409, message, provider);
  }
}
export class UnprocessableEntityServiceError extends ServiceException {
  constructor(message: string, provider?: string) {
    super("UNPROCESSABLE_ENTITY", 422, message, provider);
  }
}
export class InternalServerServiceError extends ServiceException {
  constructor(message: string, provider?: string) {
    super("INTERNAL_SERVER_ERROR", 500, message, provider);
  }
}
export class ServiceUnavailableServiceError extends ServiceException {
  constructor(message: string, provider?: string) {
    super("SERVICE_UNAVAILABLE", 503, message, provider);
  }
}

export function customServiceError(
  code: string,
  status: number,
  message: string,
  provider?: string,
): ServiceException {
  return new ServiceException(code, status, message, provider);
}
