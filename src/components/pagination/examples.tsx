/**
 * Pagination Examples
 * Comprehensive examples showing different pagination patterns
 */

'use client';

import { useState, useEffect } from 'react';
import AppTable, { TableDataItem } from '@/components/table';
import { Pagination } from '@/components/ui';
import { useClientPagination } from '@/hooks/useClientPagination';
import { useServerPagination } from '@/hooks/useServerPagination';

// ============================================================================
// EXAMPLE 1: Client-Side Pagination with AppTable (Default Behavior)
// ============================================================================

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
}

const mockStudents: Student[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  email: `student${i + 1}@example.com`,
  course: ['Math', 'Science', 'English'][i % 3],
}));

export function Example1_ClientPaginationTable() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>
        Example 1: Client-Side Pagination (Default)
      </h2>
      <p className='text-sm text-neutral-600'>
        Data is paginated on the client side. Best for small datasets.
      </p>

      <AppTable<Student>
        data={mockStudents}
        headerColumns={['ID', 'Name', 'Email', 'Course']}
        itemKey={({ item }) => `${item.id}`}
        itemsPerPage={10}
        paginationMode='client'
        renderItem={({ item }) => (
          <>
            <TableDataItem>{item.id}</TableDataItem>
            <TableDataItem>{item.name}</TableDataItem>
            <TableDataItem>{item.email}</TableDataItem>
            <TableDataItem>{item.course}</TableDataItem>
          </>
        )}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Client-Side Pagination with useClientPagination Hook
// ============================================================================

export function Example2_ClientPaginationHook() {
  const {
    paginatedData,
    currentPage,
    itemsPerPage,
    goToPage,
    startIndex,
    endIndex,
  } = useClientPagination({
    data: mockStudents,
    initialPage: 1,
    initialItemsPerPage: 10,
  });

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>
        Example 2: Using useClientPagination Hook
      </h2>
      <p className='text-sm text-neutral-600'>
        Manual control with the useClientPagination hook for custom layouts.
      </p>

      <div className='text-sm text-neutral-600'>
        Showing {startIndex + 1}-{endIndex} of {mockStudents.length} students
      </div>

      {/* Custom table or grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {paginatedData.map((student) => (
          <div key={student.id} className='p-4 border rounded-lg'>
            <h3 className='font-semibold'>{student.name}</h3>
            <p className='text-sm text-neutral-600'>{student.email}</p>
            <p className='text-sm text-neutral-500'>{student.course}</p>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <Pagination
        page={currentPage}
        limit={itemsPerPage}
        totalItems={mockStudents.length}
        onPageChange={goToPage}
        showPageNumbers={true}
        showTotal={true}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Server-Side Pagination with AppTable
// ============================================================================

/**
 * Mock API response with pagination metadata
 */
interface ApiResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Mock server fetch function
 */
async function fetchStudentsFromServer(
  page: number,
  limit: number,
): Promise<ApiResponse<Student>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = mockStudents.slice(startIndex, endIndex);

  return {
    data,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(mockStudents.length / limit),
      totalItems: mockStudents.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < mockStudents.length,
      hasPreviousPage: page > 1,
    },
  };
}

export function Example3_ServerPaginationTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse<Student> | null>(null);
  const { page, limit, goToPage } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  // Fetch data when page or limit changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchStudentsFromServer(page, limit);
      setResponse(data);
      setIsLoading(false);
    };
    fetchData();
  }, [page, limit]);

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>
        Example 3: Server-Side Pagination with AppTable
      </h2>
      <p className='text-sm text-neutral-600'>
        Data is fetched from server with pagination. URL is synced with state.
      </p>

      <AppTable<Student>
        data={response?.data ?? []}
        headerColumns={['ID', 'Name', 'Email', 'Course']}
        itemKey={({ item }) => `${item.id}`}
        paginationMode='server'
        paginationMeta={response?.meta}
        onPageChange={goToPage}
        isLoading={isLoading}
        renderItem={({ item }) => (
          <>
            <TableDataItem>{item.id}</TableDataItem>
            <TableDataItem>{item.name}</TableDataItem>
            <TableDataItem>{item.email}</TableDataItem>
            <TableDataItem>{item.course}</TableDataItem>
          </>
        )}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Server-Side Pagination with Filters
// ============================================================================

export function Example4_ServerPaginationWithFilters() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse<Student> | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>('');

  const { params, goToPage, updateParams } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  // Fetch data when params change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Filter students by course
      const filtered = courseFilter
        ? mockStudents.filter((s) => s.course === courseFilter)
        : mockStudents;

      const data = await fetchStudentsFromServer(
        params.page ?? 1,
        params.limit ?? 10,
      );

      // Apply filter to response
      const startIndex = ((params.page ?? 1) - 1) * (params.limit ?? 10);
      const endIndex = startIndex + (params.limit ?? 10);
      const filteredData = filtered.slice(startIndex, endIndex);

      setResponse({
        data: filteredData,
        meta: {
          ...data.meta,
          totalItems: filtered.length,
          totalPages: Math.ceil(filtered.length / (params.limit ?? 10)),
        },
      });
      setIsLoading(false);
    };
    fetchData();
  }, [params, courseFilter]);

  const handleCourseChange = (course: string) => {
    setCourseFilter(course);
    // Reset to page 1 when filter changes
    updateParams({ page: 1 });
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>
        Example 4: Server Pagination with Filters
      </h2>
      <p className='text-sm text-neutral-600'>
        Combining server-side pagination with filters. URL syncs all state.
      </p>

      {/* Filter Controls */}
      <div className='flex gap-4 items-center'>
        <label htmlFor='course-filter' className='text-sm font-medium'>
          Filter by Course:
        </label>
        <select
          id='course-filter'
          value={courseFilter}
          onChange={(e) => handleCourseChange(e.target.value)}
          className='px-3 py-2 border rounded-lg'
        >
          <option value=''>All Courses</option>
          <option value='Math'>Math</option>
          <option value='Science'>Science</option>
          <option value='English'>English</option>
        </select>
      </div>

      <AppTable<Student>
        data={response?.data ?? []}
        headerColumns={['ID', 'Name', 'Email', 'Course']}
        itemKey={({ item }) => `${item.id}`}
        paginationMode='server'
        paginationMeta={response?.meta}
        onPageChange={goToPage}
        isLoading={isLoading}
        renderItem={({ item }) => (
          <>
            <TableDataItem>{item.id}</TableDataItem>
            <TableDataItem>{item.name}</TableDataItem>
            <TableDataItem>{item.email}</TableDataItem>
            <TableDataItem>{item.course}</TableDataItem>
          </>
        )}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Standalone Pagination Component
// ============================================================================

export function Example5_StandalonePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 100;

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>
        Example 5: Standalone Pagination Component
      </h2>
      <p className='text-sm text-neutral-600'>
        Using the Pagination component independently for custom implementations.
      </p>

      <div className='p-6 border rounded-lg'>
        <p className='mb-4'>Current Page: {currentPage}</p>

        <Pagination
          page={currentPage}
          limit={itemsPerPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          showPageNumbers={true}
          showFirstLast={true}
          showPrevNext={true}
          showTotal={true}
          showPageInfo={true}
          pageRangeDisplayed={5}
        />
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: No Pagination Mode
// ============================================================================

export function Example6_NoPagination() {
  const limitedData = mockStudents.slice(0, 10);

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Example 6: No Pagination</h2>
      <p className='text-sm text-neutral-600'>
        Disable pagination entirely by setting paginationMode to `none`.
      </p>

      <AppTable<Student>
        data={limitedData}
        headerColumns={['ID', 'Name', 'Email', 'Course']}
        itemKey={({ item }) => `${item.id}`}
        paginationMode='none'
        renderItem={({ item }) => (
          <>
            <TableDataItem>{item.id}</TableDataItem>
            <TableDataItem>{item.name}</TableDataItem>
            <TableDataItem>{item.email}</TableDataItem>
            <TableDataItem>{item.course}</TableDataItem>
          </>
        )}
      />
    </div>
  );
}
