// Helper to extract a user-friendly error message from various error shapes
export default function getErrorDetails(err: unknown): string {
  type ErrLike = {
    details?: unknown;
    response?: { data?: { details?: unknown; message?: unknown; error?: unknown } };
    message?: unknown;
    toString?: () => string;
  };

  const anyErr = err as ErrLike | undefined;

  if (!anyErr) return 'An unexpected error occurred.';

  // Prefer `details` when present (normalized AppError)
  if (typeof anyErr.details === 'string' && anyErr.details) return anyErr.details;

  // Axios-style: response.data.details/message/error
  if (anyErr.response && anyErr.response.data) {
    const d = anyErr.response.data as Record<string, unknown>;
    if (typeof d.details === 'string' && d.details) return d.details;
    if (typeof d.message === 'string' && d.message) return d.message;
    if (typeof d.error === 'string' && d.error) return d.error;
  }

  // Fallback to message
  if (typeof anyErr.message === 'string' && anyErr.message) return anyErr.message;

  // toString fallback
  if (anyErr.toString) return anyErr.toString();

  return 'An unexpected error occurred.';
}
