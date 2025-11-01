import { FaLightbulb, FaClock, FaBookOpen } from 'react-icons/fa';

export default function ExamTips() {
  return (
    <aside className='bg-white rounded-2xl shadow-sm p-6 mt-6 w-full lg:w-80'>
      <h2 className='text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4'>
        <FaLightbulb className='text-yellow-500' />
        Exam Tips
      </h2>

      <ul className='space-y-4 text-sm text-gray-700'>
        <li className='flex items-start gap-2'>
          <FaBookOpen className='text-blue-500 mt-0.5' />
          <span>Read all instructions carefully before starting the test.</span>
        </li>
        <li className='flex items-start gap-2'>
          <FaClock className='text-green-500 mt-0.5' />
          <span>Manage your time effectively during the exam.</span>
        </li>
        <li className='flex items-start gap-2'>
          <FaLightbulb className='text-yellow-500 mt-0.5' />
          <span>Review your answers if time permits.</span>
        </li>
      </ul>
    </aside>
  );
}
