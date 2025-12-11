'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAdminResult } from '@/hooks/useResultCourses';
import {
  useGetCourses,
  useGetClasses,
} from '@/features/dashboard/queries/useDashboard';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import type { AllCourses } from '@/types/dashboard.types';
import AppTable, { TableDataItem } from '@/components/table';
import Modal from '@/components/modal';
import { useAdminSingleResult } from '@/hooks/useResultCourses';
import { Button } from '@/components/ui';
import { useServerPagination } from '@/hooks/useServerPagination';
import ResultsFiltersBar, {
  type ResultFilterField,
} from '@/features/results/components/ResultsFiltersBar';
import DownloadResults from '@/features/results/components/DownloadResults';

type Row = {
  id: string;
  sessionId: number;
  testId?: number;
  studentName: string;
  className: string;
  courseTitle: string;
  testType: string;
  testTitle: string;
  score: number | null;
  total: number | null;
  percentage: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export default function AdminResultPage() {
  // Add server pagination hook
  const { params, goToPage, setLimit, updateParams } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const { data: resp, isLoading, error } = useAdminResult(params);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedTestSessionId, setSelectedTestSessionId] = useState<
    number | null
  >(null);
  const singleResultQuery = useAdminSingleResult(selectedTestSessionId);

  const handleFilterChange = useCallback(
    (nextParams: Record<string, string | number | undefined>) => {
      updateParams(nextParams);
    },
    [updateParams],
  );

  const coursesData = useMemo(() => resp?.data?.courses ?? [], [resp]);

  const paginationData = useMemo(() => {
    const total = resp?.data?.pagination?.total ?? 0;
    const limit = params.limit ?? 10;
    const pages = Math.ceil(total / limit) || 1;
    return {
      total,
      pages,
      limit,
    };
  }, [resp?.data?.pagination?.total, params.limit]);

  const availableTests = useMemo(() => {
    const map = new Map<number, string>();
    (resp?.data?.courses ?? []).forEach((entry) => {
      (entry.tests ?? []).forEach((t: { id?: number; title?: string }) => {
        if (t?.id) map.set(t.id, t.title ?? `Test ${t.id}`);
      });
    });
    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [resp]);

  // fetch classes and courses for filter selects (from dashboard hooks)
  const { data: classesResp } = useGetClasses();
  const { data: coursesResp } = useGetCourses();

  // fetch total students from admin students hook
  const { data: adminStudentsResp } = useAdminStudents();

  // flatten tests into rows
  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];

    coursesData.forEach((entry) => {
      const parsedCourseTotal =
        entry.stats?.highestScore != null
          ? Number(entry.stats.highestScore)
          : NaN;
      const courseTotal = Number.isFinite(parsedCourseTotal)
        ? parsedCourseTotal
        : null;

      entry.tests.forEach((t) => {
        const parsedScore =
          t.session?.score != null ? Number(String(t.session.score)) : NaN;
        const score = Number.isFinite(parsedScore) ? parsedScore : null;
        const pct =
          score != null && courseTotal != null
            ? Math.round((score / courseTotal) * 100)
            : score != null
            ? `${score}`
            : '-';

        out.push({
          id: `${entry.course.id}-${t.session?.id ?? t.id}`,
          sessionId: t.session?.id ?? t.id,
          testId: t.id,
          studentName: `${t.student?.firstname ?? ''} ${
            t.student?.lastname ?? ''
          }`.trim(),
          className: t.student?.class?.className ?? '',
          courseTitle: entry.course.title,
          testType: t.type,
          testTitle: t.title ?? '',
          score,
          total: courseTotal,
          percentage: typeof pct === 'number' ? `${pct}%` : `${pct}`,
          startDate: t.session?.startedAt
            ? new Date(t.session.startedAt).toISOString().split('T')[0]
            : '',
          endDate: t.session?.endedAt
            ? new Date(t.session.endedAt).toISOString().split('T')[0]
            : '',
          startTime: t.session?.startedAt
            ? new Date(t.session.startedAt).toISOString().split('T')[1]
            : '',
          endTime: t.session?.endedAt
            ? new Date(t.session.endedAt).toISOString().split('T')[1]
            : '',
        });
      });
    });

    return out;
  }, [coursesData]);

  const availableClasses = useMemo(() => {
    return (classesResp?.data ?? []).map((c) => ({
      value: c.id,
      label: c.className,
    }));
  }, [classesResp]);

  const availableCourses = useMemo(() => {
    return (coursesResp?.data ?? []).map((c: AllCourses) => ({
      value: c.id,
      label: c.title,
    }));
  }, [coursesResp]);

  const filterFields = useMemo<ResultFilterField[]>(
    () => [
      {
        label: 'Search',
        type: 'search',
        name: 'search',
        placeholder: 'Search by student, course, or test',
      },
      {
        type: 'select',
        name: 'courseId',
        label: 'Course',
        options: availableCourses,
        placeholder: 'All courses',
      },
      {
        type: 'select',
        name: 'classId',
        label: 'Class',
        options: availableClasses,
        placeholder: 'All classes',
      },
      {
        type: 'select',
        name: 'testId',
        label: 'Test',
        options: availableTests,
        placeholder: 'All tests',
      },
      {
        type: 'select',
        name: 'testType',
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
        type: 'date',
        name: 'startDate',
        label: 'Start Date',
      },
      {
        type: 'date',
        name: 'endDate',
        label: 'End Date',
      },
      {
        type: 'select',
        name: 'sort',
        label: 'Sort By',
        options: [
          { label: 'Date', value: 'date' },
          { label: 'Score', value: 'score' },
          { label: 'Student', value: 'student' },
          { label: 'Course', value: 'course' },
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
    [availableClasses, availableCourses, availableTests],
  );

  // simple aggregated stats; totalStudents is provided by admin students hook per requirement
  const stats = useMemo(() => {
    // const scores = rows
    //   .map((r) => (r.score == null ? null : r.score))
    //   .filter((s): s is number => s !== null);
    const avg = resp?.data.overallStats.averageScore ?? 0;
    const lowest = resp?.data.overallStats.lowestScore ?? 0;
    // console.log({ scores });

    const highest = resp?.data.overallStats.highestScore ?? 0;
    // const lowest = scores.length ? Math.min(...scores) : 0;
    const totalStudents =
      adminStudentsResp?.data.data?.length ??
      new Set(rows.map((r) => r.studentName)).size;

    return { avg, highest, lowest, totalStudents };
  }, [rows, adminStudentsResp, resp]);

  if (error)
    return (
      <div className='w-full'>
        <h1 className='text-2xl font-semibold'>Results</h1>
        <div className='mt-4 p-4 bg-red-50 text-red-700 rounded'>
          Error loading results
        </div>
      </div>
    );

  return (
    <section className='w-full space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='w-full flex items-end justify-between gap-4'>
          <h1 className='text-3xl font-semibold'>Results</h1>
          <div>
            <DownloadResults />
          </div>
        </div>
      </div>
      <ResultsFiltersBar
        fields={filterFields}
        limit={params.limit}
        limitOptions={[5, 10, 20, 30, 40]}
        initialValues={params}
        onChange={handleFilterChange}
        onLimitChange={setLimit}
        onReset={() => updateParams({ page: 1, limit: params.limit })}
      />
      <div className='bg-white rounded shadow-sm p-4'>
        {/* Server pagination using data.pagination from response */}
        <AppTable<Row>
          centralizeLabel={false}
          headerColumns={[
            'S/N',
            'Student Name',
            'Class',
            'Course',
            'Test Type',
            'Score',
            // 'Total',
            // 'Percentage',
            'Start Time',
            'End Time',
            'View Details',
          ]}
          data={rows}
          isLoading={isLoading}
          itemKey={({ item }) => item.id}
          itemsPerPage={paginationData.limit}
          paginationMode='server'
          paginationMeta={{
            currentPage: params.page || 1,
            totalPages: paginationData.pages,
            totalItems: paginationData.total,
            itemsPerPage: paginationData.limit,
          }}
          onPageChange={goToPage}
          renderItem={({ item, itemIndex }) => (
            <>
              <TableDataItem>
                <span className='font-light text-sm text-neutral-600'>
                  {((params?.page ?? 1) - 1) * paginationData.limit +
                    itemIndex +
                    1}.
                </span>
              </TableDataItem>
              <TableDataItem className='capitalize text-center text-sm'>
                {item.studentName}
              </TableDataItem>
              <TableDataItem>{item.className}</TableDataItem>
              <TableDataItem>{item.courseTitle}</TableDataItem>
              <TableDataItem>{item.testType}</TableDataItem>
              <TableDataItem>{item.score ?? '-'}</TableDataItem>
              {/* <TableDataItem>{item.total ?? '-'}</TableDataItem> */}
              {/* <TableDataItem>{item.percentage}</TableDataItem> */}
              <TableDataItem>{item.startDate}</TableDataItem>
              <TableDataItem>{item.endDate}</TableDataItem>
              <TableDataItem>
                <Button
                  onClick={() => {
                    setSelectedTestSessionId(item.sessionId ?? null);
                    setModalOpen(true);
                  }}
                >
                  View
                </Button>
              </TableDataItem>
            </>
          )}
        />
      </div>
      {/* Result detail modal */}
      <Modal modalIsOpen={modalOpen} setModalIsOpen={setModalOpen}>
        <div className='p-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>Result Details</h2>
            <button
              className='text-sm text-neutral-500'
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>

          {/* show loading state while we fetch single result */}
          {singleResultQuery.isLoading ? (
            <div className='mt-6'>
              <div className='text-sm text-neutral-500'>Loading result...</div>
            </div>
          ) : singleResultQuery.data ? (
            (() => {
              const payload = singleResultQuery.data.data;
              const s = payload.session;
              const st = payload.student;
              const t = payload.test;

              return (
                <div className='mt-4 space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-gray-50 p-4 rounded'>
                      <div className='text-sm text-neutral-500'>Test</div>
                      <div className='font-medium'>{t?.title}</div>
                      <div className='text-sm text-neutral-500 mt-2'>Type</div>
                      <div className='font-medium'>{t?.type}</div>
                      <div className='text-sm text-neutral-500 mt-2'>
                        Test ID
                      </div>
                      <div className='font-medium'>{t?.id}</div>
                      <div className='text-sm text-neutral-500 mt-2'>
                        Can view answers
                      </div>
                      <div className='font-medium capitalize'>
                        {String(payload.canViewAnswers)}
                      </div>
                    </div>

                    <div className='bg-gray-50 p-4 rounded'>
                      {/* <div className='text-sm text-neutral-500'>Session</div>
                      <div className='font-medium'>ID: {s?.id}</div> */}
                      <div className='text-sm text-neutral-500 mt-2'>
                        Started At
                      </div>
                      <div className='font-medium'>
                        {s?.startedAt
                          ? new Date(s.startedAt).toLocaleString()
                          : '-'}
                      </div>
                      <div className='text-sm text-neutral-500 mt-2'>
                        Ended At
                      </div>
                      <div className='font-medium'>
                        {s?.endedAt
                          ? new Date(s.endedAt).toLocaleString()
                          : '-'}
                      </div>
                      <div className='text-sm text-neutral-500 mt-2'>Score</div>
                      <div className='font-medium'>{s?.score ?? '-'}</div>
                      <div className='text-sm text-neutral-500 mt-2'>
                        Status
                      </div>
                      <div className='font-medium'>{s?.status}</div>
                    </div>

                    <div className='bg-gray-50 p-4 rounded'>
                      <div className='text-sm text-neutral-500'>Student</div>
                      <div className='font-medium capitalize'>
                        {st?.firstname} {st?.lastname}
                      </div>
                      {/* <div className='text-sm text-neutral-500 mt-2'>
                        Student ID
                      </div>
                      <div className='font-medium'>{st?.id}</div> */}
                      <div className='text-sm text-neutral-500 mt-2'>Class</div>
                      <div className='font-medium'>{st?.class?.className}</div>
                      <div className='text-sm text-neutral-500 mt-2'>
                        Class created at
                      </div>
                      <div className='font-medium'>
                        {st?.class?.createdAt
                          ? new Date(st.class.createdAt).toLocaleString()
                          : '-'}
                      </div>
                      <div className='text-sm text-neutral-500 mt-2'>
                        Class teacher id
                      </div>
                      <div className='font-medium'>
                        {st?.class?.teacherId ?? '-'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className='mt-6'>
              <div className='text-sm text-neutral-500'>No result data</div>
            </div>
          )}
        </div>
      </Modal>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded p-4 shadow-sm text-center'>
          <div className='text-sm text-neutral-500'>Average Score</div>
          <div className='text-2xl font-bold'>
            {stats.avg.toLocaleString('en-US', {
              maximumFractionDigits: 5,
            })}
            %
          </div>
        </div>

        <div className='bg-white rounded p-4 shadow-sm text-center'>
          <div className='text-sm text-neutral-500'>Highest Score</div>
          <div className='text-2xl font-bold'>{stats.highest}</div>
        </div>

        <div className='bg-white rounded p-4 shadow-sm text-center'>
          <div className='text-sm text-neutral-500'>Lowest Score</div>
          <div className='text-2xl font-bold'>{stats.lowest}%</div>
        </div>

        <div className='bg-white rounded p-4 shadow-sm text-center'>
          <div className='text-sm text-neutral-500'>Total Students</div>
          <div className='text-2xl font-bold'>{stats.totalStudents}</div>
        </div>
      </div>
    </section>
  );
}
