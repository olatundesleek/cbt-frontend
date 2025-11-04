import { LiaBookSolid } from 'react-icons/lia';

interface Course {
  code: string;
  title: string;
}

const registeredCourses: Course[] = [
  { code: 'CSC 202', title: 'Computer Architecture' },
  { code: 'CSC 204', title: 'Data Structures and Algorithms' },
  { code: 'CSC 210', title: 'Operating Systems' },
  { code: 'CSC 215', title: 'Database Management Systems' },
  { code: 'CSC 220', title: 'Web Development Fundamentals' },
];

export default function RegisteredCoursesSection() {
  return (
    <section className='p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4'>
      <h2 className='text-lg font-semibold text-gray-700 border-b pb-2'>
        Registered Courses
      </h2>

      <div className='space-y-3'>
        {registeredCourses.map((course, index) => (
          <div
            key={index}
            className='flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg p-3 shadow-sm'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-100 text-blue-600 rounded-full'>
                <LiaBookSolid size={20} />
              </div>
              <div>
                <h4 className='font-medium text-gray-800'>{course.code}</h4>
                <p className='text-sm text-gray-600'>{course.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
