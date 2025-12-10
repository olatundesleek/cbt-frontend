'use client';
import React, { useMemo, useState } from 'react';
import ResultsFilter from './ResultsFilter';
import ResultsTable, { TestResult } from './ResultsTable';
import PerformanceSummary from './PerformanceSummary';
import Pagination from '@/components/ui/Pagination';
import { useResultCourses } from '@/hooks/useResultCourses';
import { useServerPagination } from '@/hooks/useServerPagination';

const StudentResultsPage: React.FC = () => {
  // Add server pagination hook
  const { params, goToPage } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const {
    courses,
    overallStats,
    student,
    pagination,
    isLoading: loadingCourses,
  } = useResultCourses(params);
  const [selectedCourseId, setSelectedCourseId] = useState<
    string | number | ''
  >('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  const effectiveCourses = courses;
  const effectiveOverallStats = overallStats;

  // Flatten tests across courses based on filters
  const filteredResults: TestResult[] = useMemo(() => {
    const relevantCourses = selectedCourseId
      ? effectiveCourses.filter((c) => c.course.id === Number(selectedCourseId))
      : effectiveCourses;
    const tests: TestResult[] = [];
    relevantCourses.forEach((c) => {
      c.tests.forEach((t) => {
        if (typeFilter && t.type !== typeFilter) return;

        // Date filter: compare endedAt date with selected end date
        if (endDateFilter) {
          const testEndDate = new Date(
            t.session.endedAt || t.session.startedAt,
          );
          const filterDate = new Date(endDateFilter);
          // Only include tests that ended on or before the selected date
          if (testEndDate > filterDate) return;
        }

        const dateObj = new Date(t.session.endedAt || t.session.startedAt);
        const dateStr = `${dateObj.toLocaleString('default', {
          month: 'short',
        })} ${dateObj.getDate().toString().padStart(2, '0')}`; // stable formatting to reduce hydration mismatch risk
        tests.push({
          course: c.course.title,
          title: t.title,
          type: t.type,
          date: dateStr,
          score: t.session.score,
          status: t.session.status,
        });
      });
    });
    // Sort by endedAt desc using actual date objects for stability
    return tests;
  }, [effectiveCourses, selectedCourseId, typeFilter, endDateFilter]);

  // const handleFilter = () => {
  //   // Currently filters applied immediately via state; this can trigger refetch later
  // };
  const handleReset = () => {
    setSelectedCourseId('');
    setTypeFilter('');
    setEndDateFilter('');
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 md:px-12'>
      <div className='max-w-6xl mx-auto flex gap-4'>
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
            <ResultsFilter
              // onFilter={handleFilter}
              onReset={handleReset}
              courses={effectiveCourses.map((c) => ({
                id: c.course.id,
                label: c.course.title,
              }))}
              loadingCourses={loadingCourses}
              selectedCourseId={selectedCourseId}
              onCourseChange={(id) => setSelectedCourseId(id)}
              typeFilter={typeFilter}
              onTypeChange={(t) => setTypeFilter(t)}
              endDateFilter={endDateFilter}
              onEndDateChange={(date) => setEndDateFilter(date)}
            />
            {loadingCourses ? (
              <div className='flex justify-center items-center py-12'>
                <p className='text-gray-500'>Loading results...</p>
              </div>
            ) : (
              <>
                <ResultsTable results={filteredResults} />
                {effectiveCourses.length > 0 &&
                  filteredResults.length === 0 && (
                    <p className='text-sm text-gray-500 px-2'>
                      No tests found for current filters.
                    </p>
                  )}
                {effectiveCourses.length === 0 && (
                  <p className='text-sm text-gray-500 px-2'>
                    No test results available yet.
                  </p>
                )}

                {/* Pagination */}
                {effectiveCourses.length > 0 && pagination && (
                  <div className='pt-4 border-t'>
                    <Pagination
                      page={pagination.page || 1}
                      limit={pagination.limit || 10}
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
            effectiveOverallStats?.totalTests ??
            effectiveCourses.reduce((s, c) => s + c.tests.length, 0);
          const passed = effectiveCourses.reduce(
            (s, c) =>
              s +
              c.tests.filter(
                (t) => t.session.status?.toUpperCase() === 'PASSED',
              ).length,
            0,
          );
          const passRate = total ? Math.round((passed / total) * 100) : 0;
          const avgPercent = Math.min(
            100,
            Math.round((effectiveOverallStats?.averageScore ?? 0) * 10),
          );
          return (
            <PerformanceSummary
              averageScore={avgPercent}
              passRate={passRate}
              totalTests={total}
              // recentActivity={[]}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default StudentResultsPage;
