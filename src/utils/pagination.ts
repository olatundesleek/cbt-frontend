/**
 * Pagination Utilities
 * Helper functions for pagination logic and URL management
 */

import { PaginationParams, PaginationMeta } from '@/types/pagination.types';

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number,
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

/**
 * Normalize pagination metadata - fills in missing navigation flags
 * Calculates hasNextPage and hasPreviousPage if not provided by backend
 */
export function normalizePaginationMeta(
  meta: Partial<PaginationMeta>,
): PaginationMeta {
  const {
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 10,
    hasNextPage,
    hasPreviousPage,
  } = meta;

  // Calculate if not provided
  const calculatedHasNextPage =
    hasNextPage !== undefined ? hasNextPage : currentPage < totalPages;
  const calculatedHasPreviousPage =
    hasPreviousPage !== undefined ? hasPreviousPage : currentPage > 1;

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: calculatedHasNextPage,
    hasPreviousPage: calculatedHasPreviousPage,
  };
}

/**
 * Get paginated slice of data for client-side pagination
 */
export function getPaginatedData<T>(
  data: T[],
  page: number,
  limit: number,
): T[] {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return data.slice(startIndex, endIndex);
}

/**
 * Build URL search params from pagination and filter params
 */
export function buildSearchParams(params: PaginationParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
}

/**
 * Parse pagination params from URL search params
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
): PaginationParams {
  const parsed: PaginationParams = {};

  searchParams.forEach((value, key) => {
    if (value === '') return;

    if (key === 'page') {
      parsed.page = Number.isNaN(parseInt(value, 10)) ? 1 : parseInt(value, 10);
      return;
    }

    if (key === 'limit') {
      parsed.limit = Number.isNaN(parseInt(value, 10))
        ? 10
        : parseInt(value, 10);
      return;
    }

    if (key === 'sortBy') {
      parsed.sortBy = value;
      return;
    }

    if (key === 'sortOrder') {
      parsed.sortOrder = (value as 'asc' | 'desc') || undefined;
      return;
    }

    parsed[key] = value;
  });

  if (parsed.page === undefined) parsed.page = 1;
  if (parsed.limit === undefined) parsed.limit = 10;

  return parsed;
}

/**
 * Validate page number
 */
export function validatePage(page: number, totalPages: number): number {
  if (page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

/**
 * Generate page numbers array for display
 * Example: Current page 5, total 10, range 5 => [3, 4, 5, 6, 7]
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  rangeDisplayed: number = 5,
): (number | string)[] {
  if (totalPages <= rangeDisplayed + 2) {
    // Show all pages if total is small
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const halfRange = Math.floor(rangeDisplayed / 2);

  // Always show first page
  pages.push(1);

  // Calculate start and end of range
  let rangeStart = Math.max(2, currentPage - halfRange);
  let rangeEnd = Math.min(totalPages - 1, currentPage + halfRange);

  // Adjust range if at edges
  if (currentPage <= halfRange + 1) {
    rangeEnd = Math.min(totalPages - 1, rangeDisplayed);
  }
  if (currentPage >= totalPages - halfRange) {
    rangeStart = Math.max(2, totalPages - rangeDisplayed);
  }

  // Add ellipsis before range if needed
  if (rangeStart > 2) {
    pages.push('...');
  }

  // Add range pages
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Add ellipsis after range if needed
  if (rangeEnd < totalPages - 1) {
    pages.push('...');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Format pagination info text
 * Example: "Showing 1-10 of 100"
 */
export function formatPaginationInfo(
  startIndex: number,
  endIndex: number,
  totalItems: number,
): string {
  if (totalItems === 0) return 'No items';
  return `Showing ${startIndex + 1}-${endIndex} of ${totalItems}`;
}

/**
 * Merge filter params with pagination params
 */
export function mergeFilterParams<T extends Record<string, unknown>>(
  filters: T,
  pagination: PaginationParams,
): PaginationParams & T {
  return {
    ...filters,
    ...pagination,
  };
}
