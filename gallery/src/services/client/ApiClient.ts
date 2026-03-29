type TokenProvider = () => string | null | Promise<string | null>;

interface ApiClientOptions {
  baseUrl: string;
  getToken?: TokenProvider;
}

class ApiClient {
  private baseUrl: string;
  private getToken?: TokenProvider;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl;
    this.getToken = options.getToken;
  }

  private async buildHeaders(
    init?: HeadersInit,
    skipContentType?: boolean,
  ): Promise<Headers> {
    const headers = new Headers(init || {});

    // Default content type if not already set
    if (!headers.has("Content-Type") && !skipContentType) {
      headers.set("Content-Type", "application/json");
    }

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const headers = await this.buildHeaders(
      options.headers,
      options.body instanceof FormData,
    );

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });
  }

  put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });
  }

  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient({
  baseUrl: import.meta.env.PUBLIC_API_BASE_URL,
  getToken: () => localStorage.getItem("access_token"),
});
