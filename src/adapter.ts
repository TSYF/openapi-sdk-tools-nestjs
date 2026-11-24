import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import type {
  HttpAdapter,
  HttpRequestError,
  RequestOptions,
} from "@openapi-sdk-tools/core";

/**
 * HttpAdapter implementation backed by @nestjs/axios HttpService.
 * Inject this via NestSdkModule to use Axios as the HTTP transport
 * instead of the default FetchAdapter.
 */
@Injectable()
export class AxiosAdapter implements HttpAdapter {
  constructor(private readonly httpService: HttpService) {}

  async request<T>(options: RequestOptions): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.request<T>({
          method: options.method,
          url: options.url,
          params: options.query,
          data: options.body,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
        }),
      );
      return response.data;
    } catch (e) {
      throw {
        status: (e as any)?.response?.status ?? 500,
        body: (e as any)?.response?.data ?? null,
        message: (e as any)?.message ?? "Unknown error",
      } satisfies HttpRequestError;
    }
  }
}
