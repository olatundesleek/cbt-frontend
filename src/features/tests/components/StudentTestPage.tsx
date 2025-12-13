'use client';

import Calender from '@/components/ui/Calender';
import Pagination from '@/components/ui/Pagination';
import ActivitiesSection from '@/features/dashboard/components/ActivitiesSection';
import RegisteredCoursesSection from '@/features/tests/components/RegisteredCoursesSection';
import AvailableTestList from '@/features/tests/components/AvailableTestList';
import useTests from '../hooks/useTests';
import { useServerPagination } from '@/hooks/useServerPagination';
import ResultsFiltersBar, {
  type ResultFilterField,
} from '@/features/results/components/ResultsFiltersBar';
import { useCallback, useMemo, useState } from 'react';

export default function StudentTestPage() {
  // Add server pagination hook with sort/order for server
  const { params, goToPage, setLimit, updateParams } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const { testsData, testsDataError, isTestsDataLoading } = useTests(params);

  // Client-side filter state
  const [clientFilters, setClientFilters] = useState<{
    search?: string;
    courseTitle?: string;
    type?: string;
    testState?: string;
  }>({});

  const handleFilterChange = useCallback(
    (nextParams: Record<string, string | number | undefined>) => {
      // Extract server params (sort, order) and client filters
      const { sort, order, search, courseTitle, type, testState, ...rest } =
        nextParams;

      // Update client filters
      setClientFilters({
        search: search as string | undefined,
        courseTitle: courseTitle as string | undefined,
        type: type as string | undefined,
        testState: testState as string | undefined,
      });

      // Update server params (sort, order, page, limit)
      updateParams({
        page: 1,
        sort: sort as string | undefined,
        order: order as string | undefined,
        ...rest,
      });
    },
    [updateParams],
  );

  const tests = useMemo(
    () => testsData?.data.data || [],
    [testsData?.data.data],
  );

  // Extract unique course titles for filter options
  const courseOptions = useMemo(
    () =>
      Array.from(new Set(tests.map((t) => t.course.title))).map((title) => ({
        value: title,
        label: title,
      })),
    [tests],
  );

  // Filter fields configuration
  const filterFields = useMemo<ResultFilterField[]>(
    () => [
      {
        label: 'Search',
        type: 'search',
        name: 'search',
        placeholder: 'Search by test title',
      },
      {
        type: 'select',
        name: 'courseTitle',
        label: 'Course',
        options: courseOptions,
        placeholder: 'All courses',
      },
      {
        type: 'select',
        name: 'type',
        label: 'Test Type',
        options: [
          { label: 'Exam', value: 'Exam' },
          { label: 'Test', value: 'Test' },
          { label: 'Practice', value: 'Practice' },
          // { label: 'Quiz', value: 'Quiz' },
          // { label: 'Assignment', value: 'Assignment' },
        ],
        placeholder: 'All types',
      },
      {
        type: 'select',
        name: 'testState',
        label: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Completed', value: 'completed' },
        ],
        placeholder: 'All statuses',
      },
      {
        type: 'select',
        name: 'sort',
        label: 'Sort By',
        options: [
          { label: 'Title', value: 'title' },
          { label: 'Created Date', value: 'createdAt' },
          { label: 'Type', value: 'type' },
        ],
        placeholder: 'Default',
      },
      {
        type: 'select',
        name: 'order',
        label: 'Order',
        options: [
          { label: 'Descending', value: 'desc' },
          { label: 'Ascending', value: 'asc' },
        ],
        placeholder: 'Default',
      },
    ],
    [courseOptions],
  );

  // Client-side filtering
  const filteredTests = useMemo(() => {
    let filtered = tests;

    if (clientFilters.search) {
      const search = clientFilters.search.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(search));
    }

    if (clientFilters.courseTitle) {
      filtered = filtered.filter(
        (t) => t.course.title === clientFilters.courseTitle,
      );
    }

    if (clientFilters.type) {
      filtered = filtered.filter(
        (t) => t.type.toLowerCase() === clientFilters.type?.toLowerCase(),
      );
    }

    if (clientFilters.testState) {
      filtered = filtered.filter(
        (t) => t.testState === clientFilters.testState,
      );
    }

    return filtered;
  }, [tests, clientFilters]);

  // Loading state
  if (isTestsDataLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center space-y-3'>
          <div className='w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto'></div>
          <p className='text-neutral-600'>Loading tests...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (testsDataError) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center space-y-3 max-w-md'>
          <div className='w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto'>
            <svg
              className='w-8 h-8 text-error-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-foreground'>
            Failed to load tests
          </h3>
          <p className='text-neutral-600'>
            {testsDataError.message || 'Something went wrong'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:flex gap-6'>
      <div className='space-y-8 flex-1'>
        {/* Available Tests */}
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold'>Available Tests</h1>
          <p className='font-light'>
            View and manage your current, upcoming, and completed tests
          </p>
        </div>

        <div className='space-y-4'>
          {/* Filter Bar */}
          <ResultsFiltersBar
            fields={filterFields}
            limit={params.limit}
            limitOptions={[5, 10, 20, 30, 40]}
            initialValues={{
              sort: params.sort,
              order: params.order,
              ...clientFilters,
            }}
            onChange={handleFilterChange}
            onLimitChange={setLimit}
            onReset={() => {
              setClientFilters({});
              updateParams({ page: 1, limit: params.limit });
            }}
          />

          {/* Tests List */}
          <AvailableTestList tests={filteredTests} />

          {/* No results message */}
          {tests.length > 0 && filteredTests.length === 0 && (
            <p className='text-sm text-gray-500 px-2'>
              No tests match the current filters.
            </p>
          )}

          {/* Pagination */}
          {tests.length > 0 && (
            <div className='pt-4 border-t'>
              <Pagination
                page={params.page || 1}
                limit={params.limit || 10}
                totalItems={testsData?.data?.pagination?.total || 0}
                onPageChange={goToPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Registered courses and calender */}

      <div className='w-68 space-y-6 border-neutral-200 pl-2 md:border-l'>
        {/* Registered courses */}
        <div className='space-y-2'>
          <h1 className='text-2xl'>Registered Courses</h1>

          <RegisteredCoursesSection />
        </div>

        <div>
          {/* Calender */}
          <Calender />
        </div>
      </div>
    </div>
  );
}
