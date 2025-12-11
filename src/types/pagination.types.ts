/**
 * Pagination Types
 * Type definitions for pagination components and hooks
 */

/**
 * Base pagination metadata returned from server
 * Note: hasNextPage and hasPreviousPage are optional and will be calculated automatically
 * if not provided by the backend
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

/**
 * Generic paginated response from server
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Pagination configuration options
 */
export interface PaginationConfig {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  totalItems: number;
  /** Optional callback when page changes */
  onPageChange?: (page: number) => void;
}

/**
 * Filter and pagination params for server requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | undefined;
}

/**
 * Pagination state for client-side pagination
 */
export interface ClientPaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Pagination state for server-side pagination
 */
export interface ServerPaginationState {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * Pagination display options
 */
export interface PaginationDisplayOptions {
  /** Show page number buttons */
  showPageNumbers?: boolean;
  /** Show first/last buttons */
  showFirstLast?: boolean;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Show page size selector */
  showPageSize?: boolean;
  /** Show total items count */
  showTotal?: boolean;
  /** Show page info (e.g., "Page 1 of 10") */
  showPageInfo?: boolean;
  /** Number of page buttons to display */
  pageRangeDisplayed?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
}

/**
 * Complete pagination props
 */
export interface PaginationProps
  extends PaginationConfig,
    PaginationDisplayOptions {
  /** Optional className for custom styling */
  className?: string;
  /** Disable pagination controls */
  disabled?: boolean;
}
