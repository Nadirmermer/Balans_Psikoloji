

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API response type
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

// Base API service class
export class ApiService {
  protected async handleError(error: unknown): Promise<ApiError> {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApiError(error.message);
    }

    return new ApiError('Beklenmeyen bir hata oluştu');
  }

  protected async wrapSupabaseCall<T>(
    call: Promise<{ data: T | null; error: { message?: string; code?: string; status?: number; details?: unknown } | null }>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await call;
      
      if (error) {
        return {
          data: null,
          error: new ApiError(
            error.message || 'Veritabanı hatası',
            error.code,
            error.status,
            error.details
          ),
        };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: await this.handleError(error),
      };
    }
  }
}

// Export singleton instances
export const apiService = new ApiService();