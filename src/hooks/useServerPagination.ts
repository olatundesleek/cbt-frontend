/**
 * Server-Side Pagination Hook
 * Manages pagination state with URL sync for server-side data fetching
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { PaginationParams } from '@/types/pagination.types';
import { buildSearchParams, parsePaginationParams } from '@/utils/pagination';

interface UseServerPaginationProps {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
}

interface UseServerPaginationReturn {
  /** Current pagination params from URL */
  params: PaginationParams;
  /** Current page number */
  page: number;
  /** Current items per page */
  limit: number;
  /** Update pagination params (will update URL) */
  updateParams: (newParams: Partial<PaginationParams>) => void;
  /** Navigate to specific page */
  goToPage: (page: number) => void;
  /** Change items per page */
  setLimit: (limit: number) => void;
  /** Set sort field and order */
  //   setSort: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;
  /** Reset all params to defaults */
  reset: () => void;
}

/**
 * Hook for server-side pagination with URL synchronization
 * Automatically syncs pagination state with URL search params
 *
 * @example
 * const { params, page, goToPage, setLimit } = useServerPagination({
 *   defaultPage: 1,
 *   defaultLimit: 10,
 * });
 *
 * // Use params in your data fetching
 * const { data } = useQuery(['items', params], () => fetchItems(params));
 */
export function useServerPagination({
  defaultPage = 1,
  defaultLimit = 10,
  defaultSortBy,
  defaultSortOrder = 'asc',
}: UseServerPaginationProps = {}): UseServerPaginationReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current params from URL
  const params = useMemo(() => {
    const urlParams = parsePaginationParams(searchParams);
    return {
      page: urlParams.page ?? defaultPage,
      limit: urlParams.limit ?? defaultLimit,
      //   sortBy: urlParams.sortBy ?? defaultSortBy,
      //   sortOrder: urlParams.sortOrder ?? defaultSortOrder,
    };
  }, [
    searchParams,
    defaultPage,
    defaultLimit,
    // defaultSortBy,
    // defaultSortOrder,
  ]);

  // Update URL with new params
  const updateParams = useCallback(
    (newParams: Partial<PaginationParams>) => {
      const currentParams = parsePaginationParams(searchParams);
      const merged = { ...currentParams, ...newParams };

      // Remove undefined/null values
      Object.keys(merged).forEach((key) => {
        if (merged[key] === undefined || merged[key] === null) {
          delete merged[key];
        }
      });

      const newSearchParams = buildSearchParams(merged);
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // Navigate to specific page
  const goToPage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams],
  );

  // Change items per page (resets to page 1)
  const setLimit = useCallback(
    (limit: number) => {
      updateParams({ page: 1, limit });
    },
    [updateParams],
  );

  // Set sort parameters
  //   const setSort = useCallback(
  //     (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
  //       updateParams({ sortBy, sortOrder });
  //     },
  //     [updateParams],
  //   );

  // Reset to defaults
  const reset = useCallback(() => {
    updateParams({
      page: defaultPage,
      limit: defaultLimit,
      sortBy: defaultSortBy,
      sortOrder: defaultSortOrder,
    });
  }, [
    defaultPage,
    defaultLimit,
    defaultSortBy,
    defaultSortOrder,
    updateParams,
  ]);

  return {
    params,
    page: params.page ?? defaultPage,
    limit: params.limit ?? defaultLimit,
    updateParams,
    goToPage,
    setLimit,
    // setSort,
    reset,
  };
}
