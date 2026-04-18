import { DynamicModule, Module, Provider } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import { AxiosAdapter } from "./adapter";
import type { HttpAdapter, SdkErrorMapper } from "@openapi-sdk-tools/core";

// ─── Options ─────────────────────────────────────────────────────────────────

export interface ClientOptions {
  baseUrl: string;
  adapter?: HttpAdapter;
  errorMapper?: SdkErrorMapper;
  defaultHeaders?: Record<string, string>;
  errorDiscriminatorKey?: string;
  apiVersion?: `${number}`;
}

export interface NestSdkModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Omit<ClientOptions, "adapter"> | Promise<Omit<ClientOptions, "adapter">>;
  inject?: any[];
  imports?: any[];
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
  static register<T>(
    ClientClass: new (options: ClientOptions) => T,
    options: Omit<ClientOptions, "adapter">,
  ): DynamicModule {
    const provider: Provider = {
      provide: ClientClass,
      useFactory: (httpService: HttpService) =>
        new ClientClass({ ...options, adapter: new AxiosAdapter(httpService) }),
      inject: [HttpService],
    };

    return {
      module: NestSdkModule,
      imports: [HttpModule],
      providers: [provider],
      exports: [ClientClass],
    };
  }

  static registerAsync<T>(
    ClientClass: new (options: ClientOptions) => T,
    asyncOptions: NestSdkModuleAsyncOptions,
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
      imports: [HttpModule, ...(asyncOptions.imports ?? [])],
      providers: [provider],
      exports: [ClientClass],
    };
  }
}
