'use client';
import React, { useEffect, useMemo, useState } from 'react';

export type FilterState = {
  query: string;
  course?: string;
  className?: string;
  status?: string;
  startDate?: string;
};

type Props = {
  courses?: string[];
  classes?: string[];
  statuses?: string[];
  initial?: Partial<FilterState>;
  onChange?: (state: FilterState) => void;
};

export default function FilterBar({
  courses = [],
  classes = [],
  statuses = ['active', 'scheduled', 'completed'],
  initial,
  onChange,
}: Props) {
  const [state, setState] = useState<FilterState>({
    query: initial?.query ?? '',
    course: initial?.course ?? '',
    className: initial?.className ?? '',
    status: initial?.status ?? '',
    startDate: initial?.startDate ?? '',
  });

  useEffect(() => {
    onChange?.(state);
  }, [state, onChange]);

  const courseOptions = useMemo(() => [''].concat(courses), [courses]);
  const classOptions = useMemo(() => [''].concat(classes), [classes]);

  return (
    <div className='w-full bg-white rounded-md p-4 shadow-sm'>
      <div className='flex flex-col gap-3'>
        <input
          className='w-full md:flex-1 min-w-0 border border-slate-200 rounded-md px-3 py-2'
          placeholder='Search...'
          value={state.query}
          onChange={(e) => setState((s) => ({ ...s, query: e.target.value }))}
        />
        <div className='flex gap-3 items-center'>
          <select
            aria-label='course-select'
            className='w-full md:w-auto min-w-[140px] border border-slate-200 rounded-md px-3 py-2'
            value={state.course}
            onChange={(e) =>
              setState((s) => ({ ...s, course: e.target.value }))
            }
          >
            {courseOptions.map((c) => (
              <option key={c} value={c}>
                {c === '' ? 'Course' : c}
              </option>
            ))}
          </select>

          <select
            aria-label='class-select'
            className='w-full md:w-auto min-w-[120px] border border-slate-200 rounded-md px-3 py-2'
            value={state.className}
            onChange={(e) =>
              setState((s) => ({ ...s, className: e.target.value }))
            }
          >
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c === '' ? 'Class' : c}
              </option>
            ))}
          </select>

          <select
            aria-label='status-select'
            className='w-full md:w-auto min-w-[120px] border border-slate-200 rounded-md px-3 py-2'
            value={state.status}
            onChange={(e) =>
              setState((s) => ({ ...s, status: e.target.value }))
            }
          >
            <option value=''>Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type='date'
            className='w-full md:w-auto min-w-[140px] border border-slate-200 rounded-md px-3 py-2'
            value={state.startDate ?? ''}
            onChange={(e) =>
              setState((s) => ({ ...s, startDate: e.target.value }))
            }
            aria-label='start-date'
          />

          <button
            className='w-full md:w-auto bg-slate-100 border border-slate-200 px-4 py-2 rounded-md'
            onClick={() =>
              setState({
                query: '',
                course: '',
                className: '',
                status: '',
                startDate: '',
              })
            }
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
