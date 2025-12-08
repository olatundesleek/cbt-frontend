'use client';

import Calender from '@/components/ui/Calender';
import ActivitiesSection from '@/features/dashboard/components/ActivitiesSection';
import RegisteredCoursesSection from '@/features/tests/components/RegisteredCoursesSection';
import AvailableTestList from '@/features/tests/components/AvailableTestList';
import useTests from '../hooks/useTests';

export default function StudentTestPage() {
  const { testsData, testsDataError, isTestsDataLoading } = useTests();

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

  const tests = testsData?.data.data || [];

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
          {/* Tests List */}
          <AvailableTestList tests={tests} />
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

        <div>
          {/* Activities */}
          <h1 className='text-2xl'>Activities</h1>
          <ActivitiesSection />
        </div>
      </div>
    </div>
  );
}
