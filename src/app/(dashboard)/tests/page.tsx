import Calender from '@/components/Calender';
import ActivitiesSection from '@/components/ActivitiesSection';
import RegisteredCoursesSection from '@/components/RegisteredCoursesSection';
import AvailableTestList from '@/components/AvailableTestList';

export default function StudentExamsPage() {
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

          <AvailableTestList />
        </div>
      </div>

      {/* Registered courses and calender */}

      <div className='w-68 space-y-6 border-neutral-200 pl-2 md:border-l'>
        {/* Registered courses */}
        <div className='space-y-2'>
          <h1 className='text-2xl'>Registered Courses</h1>

          {/* Dummy registered courses */}
          <RegisteredCoursesSection />
        </div>

        <div>
          {/* Calender */}
          <Calender />
        </div>

        <div>
          {/* Activities */}
          <h1 className='text-2xl'>Registered Courses</h1>
          <ActivitiesSection />
        </div>
      </div>
    </div>
  );
}
