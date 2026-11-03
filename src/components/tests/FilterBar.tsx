'use client';
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type FilterState = {
  query: string;
  courseId?: string | number;
  classId?: string | number;
  status?: string;
  testId?: string | number;
  startDate?: string;
};

export type FilterOption = {
  value: string | number;
  label: string;
};

type Props = {
  courses?: FilterOption[];
  classes?: FilterOption[];
  statuses?: string[];
  initial?: Partial<FilterState>;
  onChange?: (state: FilterState) => void;
  onReset?: () => void;
  tests?: FilterOption[];
  showStatusFilter?: boolean;
  showTestTitleFilter?: boolean;
  children?: ReactNode;
};

export default function FilterBar({
  courses = [],
  classes = [],
  statuses = ['active', 'scheduled', 'completed'],
  initial,
  onChange,
  onReset,
  tests = [],
  showStatusFilter = true,
  showTestTitleFilter = true,
  children,
}: Props) {
  const initialState = useMemo<FilterState>(
    () => ({
      query: initial?.query ?? '',
      courseId: initial?.courseId ?? '',
      classId: initial?.classId ?? '',
      status: initial?.status ?? '',
      testId: initial?.testId ?? '',
      startDate: initial?.startDate ?? '',
    }),
    [initial],
  );

  const [state, setState] = useState<FilterState>(initialState);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(state);
  }, [state]);

  const handleReset = () => {
    setState(initialState);
    onReset?.();
  };

  return (
    <div className='w-full bg-white rounded-md p-4 shadow-sm'>
      <div className='flex flex-col gap-3'>
        <div className='flex w-full gap-4'>
          <input
            className='w-full md:flex-1 min-w-0 border border-slate-200 rounded-md px-3 py-2'
            placeholder='Search by Name or Username'
            value={state.query}
            onChange={(e) => setState((s) => ({ ...s, query: e.target.value }))}
          />

          <button
            className='w-full md:w-auto bg-slate-100 border border-slate-200 px-4 py-2 rounded-md hidden md:block cursor-pointer'
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        <div className='flex gap-3 items-center flex-wrap '>
          <select
            aria-label='course-select'
            className='w-full md:w-auto min-w-[140px] border border-slate-200 rounded-md px-3 py-2'
            value={state.courseId ?? ''}
            onChange={(e) =>
              setState((s) => ({ ...s, courseId: e.target.value || undefined }))
            }
          >
            <option value=''>Course</option>
            {courses.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>

          <select
            aria-label='class-select'
            className='w-full md:w-auto min-w-[120px] border border-slate-200 rounded-md px-3 py-2'
            value={state.classId ?? ''}
            onChange={(e) =>
              setState((s) => ({ ...s, classId: e.target.value || undefined }))
            }
          >
            <option value=''>Class</option>
            {classes.map((classOption) => (
              <option key={classOption.value} value={classOption.value}>
                {classOption.label}
              </option>
            ))}
          </select>

          {showStatusFilter && (
            <select
              aria-label='status-select'
              className='w-full md:w-auto min-w-[120px] border border-slate-200 rounded-md px-3 py-2'
              value={state.status}
              onChange={(e) =>
                setState((s) => ({ ...s, status: e.target.value }))
              }
            >
              <option value='' disabled>
                Status
              </option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {showTestTitleFilter && (
            <select
              aria-label='test-title-select'
              className='w-full md:w-auto min-w-40 border border-slate-200 rounded-md px-3 py-2'
              value={state.testId ?? ''}
              onChange={(e) =>
                setState((s) => ({ ...s, testId: e.target.value || undefined }))
              }
            >
              <option value=''>Test</option>
              {tests.map((test) => (
                <option key={test.value} value={test.value}>
                  {test.label}
                </option>
              ))}
            </select>
          )}

          <input
            type='date'
            className='w-full md:w-auto min-w-[100px] border border-slate-200 rounded-md px-3 py-2'
            value={state.startDate ?? ''}
            onChange={(e) =>
              setState((s) => ({ ...s, startDate: e.target.value }))
            }
            aria-label='start-date'
          />

          <button
            className='w-full md:w-auto bg-slate-100 border border-slate-200 px-4 py-2 rounded-md md:hidden'
            onClick={handleReset}
          >
            Reset
          </button>
          {children && <>{children}</>}
        </div>
      </div>
    </div>
  );
}
