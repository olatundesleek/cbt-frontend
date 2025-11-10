import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { AcademicInformation } from '@/types/profile.types';

interface AcademicInfoSectionProps {
  data: AcademicInformation;
}

/**
 * AcademicInfoSection Component
 * Displays read-only academic information
 */
export default function AcademicInfoSection({
  data,
}: AcademicInfoSectionProps) {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-neutral-900 mb-6'>
        Academic Information
      </h3>

      <div className='space-y-4'>
        {/* Class */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-2'>
            Class
          </label>
          <div className='px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900'>
            {data.className}
          </div>
        </div>

        {/* Registered Courses */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-2'>
            Registered Courses
          </label>
          <div className='flex flex-wrap gap-2'>
            {data.registeredCourses && data.registeredCourses.length > 0 ? (
              data.registeredCourses.map((course) => (
                <Badge key={course} variant='primary'>
                  {course}
                </Badge>
              ))
            ) : (
              <p className='text-sm text-neutral-500 italic'>
                No courses registered yet
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
