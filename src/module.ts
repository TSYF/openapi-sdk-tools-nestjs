import { DynamicModule, Module, Provider } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import { AxiosAdapter } from "./adapter";
import type { HttpAdapter, SdkErrorMapper } from "@openapi-sdk-tools/core";

// ─── Options ─────────────────────────────────────────────────────────────────

export interface ClientOptions<TError = unknown> {
  baseUrl: string;
  adapter?: HttpAdapter;
  errorMapper?: SdkErrorMapper<TError>;
  defaultHeaders?: Record<string, string>;
  errorDiscriminatorKey?: string[];
  apiVersion?: `${number}`;
  /** How to transmit version: 'header' sends x-api-version (default), 'path' prepends /version to route. */
  apiVersionStrategy?: "header" | "path";
}

export interface NestSdkModuleAsyncOptions<TError = unknown> {
  useFactory: (
    ...args: any[]
  ) =>
    | Omit<ClientOptions<TError>, "adapter">
    | Promise<Omit<ClientOptions<TError>, "adapter">>;
  inject?: any[];
  imports?: any[];
}

export interface NestSdkModuleRegisterOptions {
  /** Make SDK provider globally available across the app. */
  global?: boolean;
}

// ─── NestSdkModule ────────────────────────────────────────────────────────────

/**
 * Wraps any generated SDK client class in a NestJS DynamicModule, making
 * it available for injection by its class token.
 *
 * The module automatically provides an AxiosAdapter backed by @nestjs/axios
 * as the HTTP transport.
 *
 * @example
 * // static options
 * NestSdkModule.register(MyApiClient, { baseUrl: 'http://api.internal' })
 *
 * @example
 * // async options (useFactory)
 * NestSdkModule.registerAsync(MyApiResultClient, {
 *   useFactory: (cfg: ConfigService) => ({ baseUrl: cfg.get('API_URL') }),
 *   inject: [ConfigService],
 * })
 */
@Module({})
export class NestSdkModule {
  static register<T, TError = unknown>(
    ClientClass: new (options: ClientOptions<TError>) => T,
    options: Omit<ClientOptions<TError>, "adapter">,
    moduleOptions: NestSdkModuleRegisterOptions = {},
  ): DynamicModule {
    const provider: Provider = {
      provide: ClientClass,
      useFactory: (httpService: HttpService) =>
        new ClientClass({ ...options, adapter: new AxiosAdapter(httpService) }),
      inject: [HttpService],
    };

    return {
      module: NestSdkModule,
      global: moduleOptions.global ?? false,
      imports: [HttpModule],
      providers: [provider],
      exports: [ClientClass],
    };
  }

  static registerAsync<T, TError = unknown>(
    ClientClass: new (options: ClientOptions<TError>) => T,
    asyncOptions: NestSdkModuleAsyncOptions<TError>,
    moduleOptions: NestSdkModuleRegisterOptions = {},
  ): DynamicModule {
    const provider: Provider = {
      provide: ClientClass,
      useFactory: async (httpService: HttpService, ...args: any[]) => {
        const options = await asyncOptions.useFactory(...args);
        return new ClientClass({
          ...options,
          adapter: new AxiosAdapter(httpService),
        });
      },
      inject: [HttpService, ...(asyncOptions.inject ?? [])],
    };

    return {
      module: NestSdkModule,
      global: moduleOptions.global ?? false,
      imports: [HttpModule, ...(asyncOptions.imports ?? [])],
      providers: [provider],
      exports: [ClientClass],
    };
  }
}
