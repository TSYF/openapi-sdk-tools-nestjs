# AGENTS.md - nestjs

NestJS DI wrapper for generated SDK clients. No result-library dependency.

## Module

`NestSdkModule`:

- `register(ClientClass, options)` — static options; injects `AxiosAdapter`.
- `registerAsync(ClientClass, asyncOptions)` — factory options; injects `AxiosAdapter`.
- options type includes `plugins?: SdkPlugin[]`, passed through to the generated client constructor.
- `ClientOptions` here mirrors the generated `ClientOptions` (baseUrl, adapter, errorMapper, defaultHeaders, errorDiscriminatorKey, apiVersion, apiVersionStrategy, plugins).

`src/index.ts` re-exports `type SdkPlugin` from core for convenience.

## AxiosAdapter

`src/adapter.ts`:

- `request<T>()` returns `Promise<T>`;
- returns `response.data`;
- rejects with `HttpRequestError` shaped as `{ status, body, message }`;
- never imports neverthrow.

## Rules

- Keep `plugins` in both static and async option paths.
- Do not add neverthrow to dependencies or peers.
- Generated promise clients throw; result clients are wrapped by the plugin kernel.

## Verification

There are no package tests. Run:

```bash
pnpm exec tsc --noEmit
```

For plugin end-to-end behavior, install `@openapi-sdk-tools/neverthrow` in the app and pass `plugins: [neverthrowPlugin()]`.
