'use client';
import React, { useCallback, useMemo } from 'react';
import ResultsTable, { TestResult } from './ResultsTable';
import PerformanceSummary from './PerformanceSummary';
import Pagination from '@/components/ui/Pagination';
import { useResultCourses } from '@/hooks/useResultCourses';
import { useServerPagination } from '@/hooks/useServerPagination';
import ResultsFiltersBar, { type ResultFilterField } from './ResultsFiltersBar';
import { useGetCourses } from '@/features/dashboard/queries/useDashboard';

const StudentResultsPage: React.FC = () => {
  // Add server pagination hook
  const { params, goToPage, setLimit, updateParams } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
    defaultSortBy: undefined,
    defaultSortOrder: undefined,
  });

  const { data, isLoading: loadingCourses } = useResultCourses(params);

  const student = data?.student;
  const pagination = data?.pagination;
  const overallStats = data?.overallStats;

  const { data: allCoursesData } = useGetCourses();

  const effectiveResults = useMemo(() => data?.results ?? [], [data?.results]);
  const allCourses = useMemo(
    () => allCoursesData?.data || [],
    [allCoursesData],
  );
  const effectiveOverallStats = overallStats;

  const courseOptions = useMemo(
    () =>
      allCourses.map((c) => ({
        value: c.id,
        label: c.title,
      })),
    [allCourses],
  );

  const filterFields = useMemo<ResultFilterField[]>(
    () => [
      // {
      //   label: 'Search',
      //   type: 'search',
      //   name: 'search',
      //   placeholder: 'Search by course or test',
      // },
      {
        type: 'select',
        name: 'courseId',
        label: 'Course',
        options: courseOptions,
        loading: loadingCourses,
        placeholder: 'All courses',
      },
      {
        type: 'select',
        name: 'testType',
        label: 'Test Type',
        options: [
          { label: 'Exam', value: 'EXAM' },
          { label: 'Test', value: 'TEST' },
          // { label: 'Practice', value: 'Practice' },
          // { label: 'Quiz', value: 'Quiz' },
          // { label: 'Assignment', value: 'Assignment' },
        ],
        loading: loadingCourses,
        placeholder: 'All types',
      },
      {
        type: 'date',
        name: 'endDate',
        label: 'End Date',
        loading: loadingCourses,
      },
      {
        type: 'select',
        name: 'sort',
        label: 'Sort By',
        options: [
          { label: 'Score', value: 'score' },
          { label: 'Course', value: 'course' },
          { label: 'Date', value: 'date' },
        ],
        loading: loadingCourses,
        placeholder: 'Sort By',
      },
      {
        type: 'select',
        name: 'order',
        label: 'Order By',
        options: [
          { label: 'Desc', value: 'desc' },
          { label: 'Asc', value: 'asc' },
        ],
        loading: loadingCourses,
        placeholder: 'Order By',
      },
    ],
    [courseOptions, loadingCourses],
  );


  const handleFilterChange = useCallback(
    (nextParams: Record<string, string | number | undefined>) => {
      updateParams(nextParams);
    },
    [updateParams],
  );

  // Map API results into table rows
  const filteredResults: TestResult[] = useMemo(() => {
    return effectiveResults.map((r) => {
      const dateObj = new Date(r.session.endedAt || r.session.startedAt);
      const dateStr = `${dateObj.toLocaleString('default', {
        month: 'short',
      })} ${dateObj.getDate().toString().padStart(2, '0')}`; // stable formatting
      return {
        course: r.course.title,
        title: r.test.title,
        type: r.test.type,
        date: dateStr,
        score: r.session.score,
        status: r.session.status,
      } as TestResult;
    });
  }, [effectiveResults]);

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 md:px-12'>
      <div className='max-w-6xl mx-auto flex flex-col lg:flex-row gap-4'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-2'>
            <h1 className='text-3xl font-bold'>Test Results</h1>
            {student && (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500'>Student:</span>
                <span className='font-semibold text-gray-700 capitalize'>
                  {student.name}
                </span>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200'>
                  {student.class.className}
                </span>
              </div>
            )}
          </div>
          <p className='text-gray-500 mb-6'>
            Review your scores, performance, and test feedback.
          </p>
          <div className='flex flex-col gap-4'>
            <ResultsFiltersBar
              fields={filterFields}
              limit={params.limit}
              limitOptions={[5, 10, 20, 30, 40]}
              // sort={params.sort ? String(params.sort) : undefined}
              // sortOptions={sortOptions}
              initialValues={params}
              onChange={handleFilterChange}
              onLimitChange={setLimit}
              onSortChange={(sort) => updateParams({ sort })}
              onReset={() =>
                updateParams({
                  page: 1,
                  limit: undefined,
                  sort: undefined,
                  order: undefined,
                })
              }
            />
            {loadingCourses ? (
              <div className='flex justify-center items-center py-12'>
                <p className='text-gray-500'>Loading results...</p>
              </div>
            ) : (
              <>
                <ResultsTable results={filteredResults} />
                {effectiveResults.length > 0 &&
                  filteredResults.length === 0 && (
                    <p className='text-sm text-gray-500 px-2'>
                      No tests found for current filters.
                    </p>
                  )}
                {effectiveResults.length === 0 && (
                  <p className='text-sm text-gray-500 px-2'>
                    No test results available yet.
                  </p>
                )}

                {/* Pagination */}
                {effectiveResults.length > 0 && pagination && (
                  <div className='pt-4 border-t'>
                    <Pagination
                      page={params.page || 1}
                      limit={params.limit || 10}
                      totalItems={pagination.total || 0}
                      onPageChange={goToPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {(() => {
          const total =
            effectiveOverallStats?.totalTests ?? effectiveResults.length;
          const passed = effectiveResults.filter(
            (r) => r.session.status?.toUpperCase() === 'PASSED',
          ).length;
          const passRate = total ? Math.round((passed / total) * 100) : 0;
          const avgRaw = effectiveOverallStats?.averageScore ?? 0;
          const avgNumber =
            typeof avgRaw === 'string' ? parseFloat(avgRaw) : Number(avgRaw);

          return (
            <PerformanceSummary
              averageScore={Number.isFinite(avgNumber) ? avgNumber : 0}
              passRate={passRate}
              totalTests={total}
              downloadParams={params}

              // recentActivity={[]}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default StudentResultsPage;
