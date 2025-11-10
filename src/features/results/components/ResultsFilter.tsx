import React from 'react';

interface ResultsFilterProps {
  //   onFilter: () => void;
  onReset: () => void;
  courses?: Array<{ id: string | number; label: string }>;
  loadingCourses?: boolean;
  selectedCourseId?: string | number | '';
  onCourseChange?: (id: string) => void;
  typeFilter?: string;
  onTypeChange?: (type: string) => void;
  endDateFilter?: string;
  onEndDateChange?: (date: string) => void;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({
  //   onFilter,
  onReset,
  courses = [],
  loadingCourses = false,
  selectedCourseId = '',
  onCourseChange,
  typeFilter = '',
  onTypeChange,
  endDateFilter = '',
  onEndDateChange,
}) => {
  return (
    <div className='flex gap-4 items-end mb-6 flex-wrap'>
      <div>
        <label className='block text-sm font-medium mb-1'>Course</label>
        <select
          className='border rounded px-3 py-2 w-48'
          title='Select course'
          disabled={loadingCourses}
          value={selectedCourseId}
          onChange={(e) => onCourseChange?.(e.target.value)}
        >
          <option value=''>All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Test Type</label>
        <select
          className='border rounded px-3 py-2 w-40'
          title='Select test type'
          value={typeFilter}
          onChange={(e) => onTypeChange?.(e.target.value)}
        >
          <option value=''>All</option>
          <option value='EXAM'>Exam</option>
          <option value='TEST'>Test</option>
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>End Date</label>
        <input
          type='date'
          className='border rounded px-3 py-2 w-40'
          title='Select end date'
          placeholder='End Date'
          value={endDateFilter}
          onChange={(e) => onEndDateChange?.(e.target.value)}
        />
      </div>
      <div className='flex gap-2'>
        {/* <button
          type='button'
          className='bg-primary-600 text-white px-4 py-2 rounded'
          onClick={onFilter}
        >
          Filter
        </button> */}
        <button
          type='button'
          className='bg-gray-400 text-gray-700 px-4 py-2 rounded'
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ResultsFilter;
