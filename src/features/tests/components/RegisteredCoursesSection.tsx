'use client';

import { LiaBookSolid } from 'react-icons/lia';
import useRegisteredCourses from '@/features/tests/hooks/useRegisteredCourses';

export default function RegisteredCoursesSection() {
  const {
    registeredCourses,
    isRegisteredCoursesLoading,
    registeredCoursesError,
  } = useRegisteredCourses();

  console.log(registeredCourses);

  const courses = registeredCourses?.data || [];
  const hasCourses = courses.length > 0;

  return (
    <section className='p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4'>
      <label className='block text-sm font-medium text-neutral-700 mb-2'>
        Registered Courses
      </label>

      {/* Loading State */}
      {isRegisteredCoursesLoading && (
        <div className='flex flex-col items-center justify-center py-8 px-4'>
          <div className='w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3'></div>
          <p className='text-gray-600 font-medium'>Loading courses...</p>
          <p className='text-sm text-gray-500 text-center mt-1'>
            Please wait while we fetch your registered courses
          </p>
        </div>
      )}

      {/* Error State */}
      {registeredCoursesError && !isRegisteredCoursesLoading && (
        <div className='flex flex-col items-center justify-center py-8 px-4'>
          <div className='w-12 h-12 bg-error-50 rounded-full flex items-center justify-center mb-3'>
            <svg
              className='w-6 h-6 text-error-500'
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
          <p className='text-error-600 font-medium'>Failed to load courses</p>
          <p className='text-sm text-gray-500 text-center mt-1'>
            {registeredCoursesError instanceof Error
              ? registeredCoursesError.message
              : 'Something went wrong while fetching your courses'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors text-sm'
          >
            Try Again
          </button>
        </div>
      )}

      {/* Success State with Courses */}
      {!isRegisteredCoursesLoading && !registeredCoursesError && hasCourses && (
        <div className='space-y-3'>
          {courses.map((course) => (
            <div
              key={course.id}
              className='flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg p-3 shadow-sm'
            >
              <div className='flex items-center gap-3 flex-1'>
                <div className='p-2 bg-blue-100 text-blue-600 rounded-full'>
                  <LiaBookSolid size={20} />
                </div>
                <div className='flex-1'>
                  <h4 className='font-medium text-gray-800'>{course.title}</h4>
                  <p className='text-sm text-gray-500'>
                    {course.description || 'No description available'}
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    Instructor: {course.teacher.firstname}{' '}
                    {course.teacher.lastname}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isRegisteredCoursesLoading &&
        !registeredCoursesError &&
        !hasCourses && (
          <div className='flex flex-col items-center justify-center py-8 px-4'>
            <svg
              className='w-12 h-12 text-gray-300 mb-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
            <p className='text-gray-600 font-medium'>No courses registered</p>
            <p className='text-sm text-gray-500 text-center mt-1'>
              You haven&apos;t been enrolled in any courses yet
            </p>
          </div>
        )}
    </section>
  );
}
