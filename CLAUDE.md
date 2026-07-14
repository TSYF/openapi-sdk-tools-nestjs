# CLAUDE.md - nestjs package

NestJS adapter for generated SDKs.

## Key Features

- `NestSdkModule.register(ClientClass, options)` — Registers SDK client with NestJS DI
- `NestSdkModule.registerAsync(ClientClass, asyncOptions)` — Async registration with factory
- `Errors(...codes)` decorator — Declares operation error codes via `x-errors`
- `SdkTag(tag)` decorator — Overrides SDK grouping tag

## Options

`ClientOptions<TError>` accepts:
- `errorMapper?: SdkErrorMapper<TError>` — Infers error payload type
- `errorDiscriminatorKey?: string[]` — Path array to discriminant field

## Removed

- `ServiceException` hierarchy — No longer needed with flexible error matching