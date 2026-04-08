import { applyDecorators } from "@nestjs/common";

/**
 * Declares which error codes a controller method can emit.
 * Each code is a string — either a known ErrorCode or a custom domain tag.
 *
 * At runtime this calls @nestjs/swagger's ApiExtension, injecting an
 * `x-errors` field into the generated OpenAPI operation. The generator
 * reads that field to build per-method discriminated error unions.
 *
 * @example
 * @Errors('NOT_FOUND', 'DATABASE_UNAVAILABLE')
 * @Get(':id')
 * findOne(@Param('id') id: string) { ... }
 */
export function Errors(...codes: string[]): MethodDecorator {
  // Lazy-require so the package stays installable without @nestjs/swagger
  // (servers that only need NestSdkModule don't have to install swagger).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ApiExtension } = require("@nestjs/swagger");
  return applyDecorators(ApiExtension("x-errors", codes));
}

/**
 * Tags a controller or method with an SDK grouping name.
 * Injects `x-sdk-tag` into the OpenAPI operation, overriding the default
 * OpenAPI `tags` for SDK client class grouping purposes.
 *
 * Apply to the controller class to tag all its methods at once, or to
 * individual methods to override the class-level tag.
 *
 * @example
 * @SdkTag('UserManagement')
 * @Controller('users')
 * export class UserController { ... }
 */
export function SdkTag(tag: string): ClassDecorator & MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ApiExtension } = require("@nestjs/swagger");
  return applyDecorators(ApiExtension("x-sdk-tag", tag));
}
