/**
 * Client-Side Pagination Hook
 * Manages pagination state for client-side data
 */

'use client';

import { useState, useMemo } from 'react';
import { ClientPaginationState } from '@/types/pagination.types';
import { calculatePagination, getPaginatedData } from '@/utils/pagination';

interface UseClientPaginationProps<T> {
  data: T[];
  initialPage?: number;
  initialItemsPerPage?: number;
}

interface UseClientPaginationReturn<T> extends ClientPaginationState {
  paginatedData: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Hook for client-side pagination
 * @example
 * const { paginatedData, goToPage, currentPage, totalPages } = useClientPagination({
 *   data: myData,
 *   initialPage: 1,
 *   initialItemsPerPage: 10,
 * });
 */
export function useClientPagination<T>({
  data,
  initialPage = 1,
  initialItemsPerPage = 10,
}: UseClientPaginationProps<T>): UseClientPaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate pagination metadata
  const paginationInfo = useMemo(() => {
    return calculatePagination(currentPage, itemsPerPage, data.length);
  }, [currentPage, itemsPerPage, data.length]);

  // Get paginated data slice
  const paginatedData = useMemo(() => {
    return getPaginatedData(data, currentPage, itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  // Navigate to specific page
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, paginationInfo.totalPages));
    setCurrentPage(validPage);
  };

  // Navigate to next page
  const nextPage = () => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Navigate to previous page
  const previousPage = () => {
    if (paginationInfo.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Change items per page and reset to page 1
  const handleSetItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
    paginatedData,
    currentPage,
    itemsPerPage,
    totalPages: paginationInfo.totalPages,
    startIndex: paginationInfo.startIndex,
    endIndex: paginationInfo.endIndex,
    hasNextPage: paginationInfo.hasNextPage,
    hasPreviousPage: paginationInfo.hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    setItemsPerPage: handleSetItemsPerPage,
  };
}
