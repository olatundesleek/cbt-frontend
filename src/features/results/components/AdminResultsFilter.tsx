import { Button } from '@/components/ui';
import { useState } from 'react';

interface CourseOption {
  id: number;
  title: string;
}

interface Filters {
  className?: string;
  courseId?: number | '';
  type?: string;
  testTitle?: string;
  startDate?: string;
  endDate?: string;
}

interface Props {
  classes?: string[];
  courses?: CourseOption[];
  tests?: string[];
  onFilter?: (filters: Filters) => void;
}

export default function AdminResultsFilter({
  classes = [],
  courses = [],
  tests = [],
  onFilter,
}: Props) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTestTitle, setSelectedTestTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const apply = () => {
    onFilter?.({
      className: selectedClass || undefined,
      courseId: selectedCourse === '' ? undefined : selectedCourse,
      type: selectedType || undefined,
      testTitle: selectedTestTitle || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const reset = () => {
    setSelectedClass('');
    setSelectedCourse('');
    setSelectedType('');
    setSelectedTestTitle('');
    setStartDate('');
    setEndDate('');
    onFilter?.({});
  };

  return (
    <div className='w-full bg-white rounded p-4 shadow-sm'>
      <div className='flex flex-col md:flex-row gap-3 items-end md:flex-wrap'>
        <div className='flex-1 flex gap-3 w-full'>
          <div>
            <label className='text-sm text-neutral-600' htmlFor='class-select'>
              Class
            </label>
            <select
              id='class-select'
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className='w-full border rounded px-2 py-2 text-sm'
            >
              <option value=''>All Class</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='text-sm text-neutral-600' htmlFor='course-select'>
              Course
            </label>
            <select
              id='course-select'
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(
                  e.target.value === '' ? '' : Number(e.target.value),
                )
              }
              className='w-full border rounded px-3 py-2 text-sm'
            >
              <option value=''>All Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className='text-sm text-neutral-600'
              htmlFor='test-title-select'
            >
              Test Title
            </label>
            <select
              id='test-title-select'
              value={selectedTestTitle}
              onChange={(e) => setSelectedTestTitle(e.target.value)}
              className='w-full border rounded px-3 py-2 text-sm'
            >
              <option value=''>All Tests</option>
              {tests.map((t: string) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className='text-sm text-neutral-600'
              htmlFor='test-type-select'
            >
              Test Type
            </label>
            <select
              id='test-type-select'
              aria-label='Exam Type'
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className='w-full border rounded px-3 py-2 text-sm'
            >
              <option value=''>All Types</option>
              <option value='TEST'>Test</option>
              <option value='EXAM'>Exam</option>
              <option value='PRACTICE'>Practice</option>
            </select>
          </div>

          <div className='flex gap-2'>
            <div className='flex-1'>
              <label className='text-sm text-neutral-600' htmlFor='start-date'>
                Start Date
              </label>
              <input
                aria-label='Start Date'
                id='start-date'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='w-full border rounded px-3 py-2 text-sm'
              />
            </div>

            <div className='flex-1'>
              <label className='text-sm text-neutral-600' htmlFor='end-date'>
                End Date
              </label>
              <input
                aria-label='End Date'
                id='end-date'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='w-full border rounded px-3 py-2 text-sm'
              />
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button onClick={apply}>Filter Results</Button>

          <button
            onClick={reset}
            className='border border-neutral-300 px-4 py-2 rounded text-sm cursor-pointer'
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
