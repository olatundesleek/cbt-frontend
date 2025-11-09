/** Shape backend returns on error responses */
export interface ApiErrorResponse {
  success: false;
  message: string;
  details: unknown | null;
}

/** Normalized application error passed to React Query onError handlers */
export interface AppError extends Error {
  name: 'AppError';
  status?: number; // HTTP status if available
  code?: string; // Axios/network error code
  details: unknown | null; // backend details or raw response data
  isAxiosError?: boolean; // hint original source
}

/** Type guard to check if an unknown value is AppError */
export function isAppError(err: unknown): err is AppError {
  return err instanceof Error && (err as Partial<AppError>).name === 'AppError';
}

/** Extract safe message from unknown error */
export function getErrorMessage(err: unknown): string {
  if (isAppError(err)) return err.message;
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in (err as Record<string, unknown>) &&
    typeof (err as Record<string, unknown>).message === 'string'
  ) {
    return (err as Record<string, string>).message;
  }
  return 'An unexpected error occurred.';
}
