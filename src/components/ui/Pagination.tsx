/**
 * Pagination Component
 * Reusable pagination controls for tables and lists
 * Supports both client-side and server-side pagination
 */

'use client';

import React from 'react';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { PaginationProps } from '@/types/pagination.types';
import {
  generatePageNumbers,
  formatPaginationInfo,
  calculatePagination,
} from '@/utils/pagination';

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  totalItems,
  onPageChange,
  className = '',
  disabled = false,
  showPageNumbers = true,
  showFirstLast = true,
  showPrevNext = true,
  showPageSize = false,
  showTotal = true,
  showPageInfo = false,
  pageRangeDisplayed = 5,
  pageSizeOptions = [5, 10, 20, 50, 100],
}) => {
  const { totalPages, startIndex, endIndex, hasNextPage, hasPreviousPage } =
    calculatePagination(page, limit, totalItems);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (disabled) return;
    if (newPage < 1 || newPage > totalPages) return;
    if (newPage === page) return;
    onPageChange?.(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newLimit: number) => {
    if (disabled) return;
    // Reset to page 1 when changing page size
    onPageChange?.(1);
    // Note: Parent component should handle limit changes via state/URL
    // This can be extended by adding onPageSizeChange callback to props
    console.log('Page size changed to:', newLimit);
  };

  // Generate page numbers to display
  const pageNumbers = generatePageNumbers(page, totalPages, pageRangeDisplayed);

  // Base button classes
  const baseButtonClass =
    'flex items-center justify-center min-w-8 h-8 px-2 rounded transition-colors';
  const enabledButtonClass =
    'hover:bg-primary-100 text-neutral-700 hover:text-primary-700  cursor-pointer';
  const activeButtonClass = 'bg-primary-600 text-white hover:bg-primary-700';
  const disabledButtonClass = 'opacity-40 cursor-not-allowed text-neutral-400';

  // Don't render if no pages
  if (totalPages === 0 || totalItems === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Top section: Page info and page size selector */}
      {(showTotal || showPageSize) && (
        <div className='flex flex-wrap items-center justify-between gap-2 text-sm'>
          {showTotal && (
            <div className='text-neutral-600 text-center w-full'>
              {formatPaginationInfo(startIndex, endIndex, totalItems)}
            </div>
          )}

          {showPageSize && (
            <div className='flex items-center gap-2'>
              <label htmlFor='page-size' className='text-neutral-600'>
                Items per page:
              </label>
              <select
                id='page-size'
                value={limit}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                disabled={disabled}
                className='px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Main pagination controls */}
      <div className='flex flex-wrap items-center justify-center gap-1'>
        {/* First page button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={disabled || !hasPreviousPage}
            className={`${baseButtonClass} ${
              disabled || !hasPreviousPage
                ? disabledButtonClass
                : enabledButtonClass
            }`}
            aria-label='First page'
            title='First page'
          >
            <MdFirstPage size={20} />
          </button>
        )}

        {/* Previous button */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={disabled || !hasPreviousPage}
            className={`${baseButtonClass} ${
              disabled || !hasPreviousPage
                ? disabledButtonClass
                : enabledButtonClass
            }`}
            aria-label='Previous page'
            title='Previous page'
          >
            <GrFormPrevious size={20} />
          </button>
        )}

        {/* Page numbers */}
        {showPageNumbers &&
          pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='flex items-center justify-center min-w-8 h-8 px-2 text-neutral-500'
                >
                  ...
                </span>
              );
            }

            const isActive = pageNum === page;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum as number)}
                disabled={disabled}
                className={`${baseButtonClass} ${
                  isActive
                    ? activeButtonClass
                    : disabled
                    ? disabledButtonClass
                    : enabledButtonClass
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

        {/* Next button */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={disabled || !hasNextPage}
            className={`${baseButtonClass} ${
              disabled || !hasNextPage
                ? disabledButtonClass
                : enabledButtonClass
            }`}
            aria-label='Next page'
            title='Next page'
          >
            <GrFormNext size={20} />
          </button>
        )}

        {/* Last page button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || !hasNextPage}
            className={`${baseButtonClass} ${
              disabled || !hasNextPage
                ? disabledButtonClass
                : enabledButtonClass
            }`}
            aria-label='Last page'
            title='Last page'
          >
            <MdLastPage size={20} />
          </button>
        )}
      </div>

      {/* Page info text */}
      {showPageInfo && (
        <div className='text-center text-sm text-neutral-600'>
          Page {page} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default Pagination;
