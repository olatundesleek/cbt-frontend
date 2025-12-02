import Card from '@/components/ui/Card';
// import Badge from '@/components/ui/Badge';
import { AcademicInformation, TeacherOfType } from '@/types/profile.types';
import RegisteredCoursesSection from '@/features/tests/components/RegisteredCoursesSection';

interface AcademicInfoSectionProps {
  data: AcademicInformation;
  teacherOf?: Array<TeacherOfType>;
  role?: 'admin' | 'student' | 'teacher';
}

/**
 * AcademicInfoSection Component
 * Displays read-only academic information
 */
export default function AcademicInfoSection({
  data,
  role = 'student',
  teacherOf = [],
}: AcademicInfoSectionProps) {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-neutral-900 mb-6'>
        Academic Information
      </h3>

      <div className='space-y-4'>
        {/* Class */}
        <div className='space-y-4'>
          <label className='block text-sm font-medium text-neutral-700 mb-2'>
            Class
          </label>
          {role === 'student' && (
            <div className='px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900'>
              {data.className}
            </div>
          )}

          {role === 'teacher' &&
            teacherOf?.length > 0 &&
            teacherOf?.map((teachingClass) => (
              <div
                key={teachingClass.id}
                className='px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 '
              >
                {teachingClass.className}
              </div>
            ))}

          {role === 'teacher' && teacherOf?.length === 0 && (
            <div className='px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 '>
              You are not assigned to teach any class.
            </div>
          )}
        </div>

        {/* Registered Courses */}
        {role === 'student' && (
          <div>
            <RegisteredCoursesSection />
          </div>
        )}
      </div>
    </Card>
  );
}
