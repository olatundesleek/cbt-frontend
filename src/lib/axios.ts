import axios from "axios";
import type { AppError, ApiErrorResponse } from "@/types/errors.types.ts";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Preserve 401 special handling if needed
    if (error.response?.status === 401) {
      console.warn('Unauthorized — redirect to login');
      axios
        .post('/api/auth/logout', null, { withCredentials: true })
        .catch(() => {}) // ignore failures
        .finally(() => {
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        });
    }

    // Normalize error into a friendly AppError so callers can rely on err.message
    const status: number | undefined = error.response?.status;
    const code: string | undefined = error.code;
    const backendData: ApiErrorResponse | unknown = error.response?.data;

    // Try to extract backend-provided message and details if present
    const backendMessage =
      typeof backendData === 'object' &&
      backendData !== null &&
      'message' in (backendData as Record<string, unknown>)
        ? String((backendData as Record<string, unknown>).message ?? '')
        : undefined;
    const backendDetails =
      typeof backendData === 'object' &&
      backendData !== null &&
      'details' in (backendData as Record<string, unknown>)
        ? (backendData as Record<string, unknown>).details
        : undefined;

    // Network and timeout friendly messages
    const message: string =
      backendMessage ||
      (code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : !error.response
        ? 'Network error. Please check your connection.'
        : error.message || 'An unexpected error occurred.');

    const appError = new Error(message) as AppError;
    appError.name = 'AppError';
    appError.status = status;
    appError.code = code;
    appError.details = (backendDetails ?? backendData ?? null) as string | null;
    appError.isAxiosError = Boolean(error.isAxiosError);

    return Promise.reject(error);
  },
);

export default api;

export const errorLogger = (error: unknown) => {
  // Don't show toast for null/undefined errors
  if (!error) return;

  const defaultErrorMessage = 'Server Error. Please try again';

  if (typeof error === 'string') return toast.error(error);

  if (!axios.isAxiosError(error)) return toast.error(defaultErrorMessage);

  if (error.response?.data) {
    const responseError =
      error.response?.data.details ||
      error.response?.data.message ||
      error.response?.data.error ||
      defaultErrorMessage;

    return toast.error(responseError);
  }

  return toast.error(defaultErrorMessage);
};
