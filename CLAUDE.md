# CLAUDE.md - nestjs package

NestJS adapter for generated SDKs.

## Key Features

- `NestSdkModule.register(ClientClass, options)` — Registers SDK client with NestJS DI
- `NestSdkModule.registerAsync(ClientClass, asyncOptions)` — Async registration with factory
- `AxiosAdapter` — Promise-based `HttpAdapter` backed by `@nestjs/axios`
- `Errors(...codes)` decorator — Declares operation error codes via `x-errors`
- `SdkTag(tag)` decorator — Overrides SDK grouping tag

## Options

`ClientOptions<TError>` accepts:
- `errorMapper?: SdkErrorMapper<TError>` — Infers error payload type
- `errorDiscriminatorKey?: string[]` — Path array to discriminant field
- `plugins?: SdkPlugin[]` — Kernel plugins passed through to the generated client

NestJS no longer depends on neverthrow. Install
`@openapi-sdk-tools/neverthrow` and pass `plugins: [neverthrowPlugin()]` to
opt in.

## Removed

- `ServiceException` hierarchy — No longer needed with flexible error matching
- neverthrow peer dependency — Replaced by the optional plugin package
