'use client';
import Button from '@/components/ui/Button';
import Timer from './Timer';
import { StartTestSessionResponse } from '@/types/tests.types';

// Tailwind dynamic width helper (mapped to nearest 5%) to avoid inline style lint error
function progressWidthClass(percent: number) {
  const clamped = Math.max(0, Math.min(100, percent));
  const rounded = Math.round(clamped / 5) * 5; // nearest 5%
  // Map to predefined width classes
  const map: Record<number, string> = {
    0: 'w-0',
    5: 'w-[5%]',
    10: 'w-[10%]',
    15: 'w-[15%]',
    20: 'w-[20%]',
    25: 'w-[25%]',
    30: 'w-[30%]',
    35: 'w-[35%]',
    40: 'w-[40%]',
    45: 'w-[45%]',
    50: 'w-[50%]',
    55: 'w-[55%]',
    60: 'w-[60%]',
    65: 'w-[65%]',
    70: 'w-[70%]',
    75: 'w-[75%]',
    80: 'w-[80%]',
    85: 'w-[85%]',
    90: 'w-[90%]',
    95: 'w-[95%]',
    100: 'w-full',
  };
  return map[rounded] || 'w-0';
}

export default function TestAttemptSidebar({
  answered,
  total,
  marked,
  handleSubmit,
  remainingSeconds,
  studentName,
  course,
}: {
  answered: number;
  total: number;
  marked: number;
  handleSubmit: () => void;
  remainingSeconds: number | null;
  studentName: string;
  course: StartTestSessionResponse['data']['course'] | null;
}) {
  // Calculate progress percentage
  const progress = Math.round((answered / total) * 100);

  return (
    <aside className='bg-white p-6  shadow-sm w-64'>
      <div className='flex flex-col items-center mb-6'>
        <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl'>
          👤
        </div>
        <p className='font-semibold mt-3 capitalize'>{studentName}</p>
        <p className='text-sm text-gray-500'>{course?.courseTitle}</p>
        <p className='text-xs text-gray-500'>{course?.testTitle}</p>
      </div>

      {/* Time Section */}
      <div className='mb-4'>
        <p className='text-sm text-gray-500'>Time remaining</p>
        <div className='text-2xl font-semibold text-gray-800 mt-1'>
          <Timer remainingSeconds={remainingSeconds} />
        </div>

        {/* Blue Progress Bar */}
        <div className='w-full h-2 bg-gray-200 rounded-full mt-2'>
          <div
            className={`h-2 bg-blue-500 rounded-full transition-all duration-500 ${progressWidthClass(
              progress,
            )}`}
            role='progressbar'
            aria-label='Answered question progress'
          />
        </div>
      </div>

      {/* Quick Summary */}
      <div className='mt-6'>
        <p className='font-semibold mb-2'>Quick Summary</p>
        <ul className='space-y-2 text-sm'>
          <li className='flex justify-between'>
            <span className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-green-500'></span>
              Answered
            </span>
            <span>{answered}</span>
          </li>
          <li className='flex justify-between'>
            <span className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-gray-300'></span>
              Unanswered
            </span>
            <span>{total - answered}</span>
          </li>
          <li className='flex justify-between'>
            <span className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-yellow-400'></span>Marked
            </span>
            <span>{marked}</span>
          </li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className='mt-10'>
        <Button label='Submit' onClick={handleSubmit} />
      </div>

      <p className='text-xs text-gray-400 mt-3'>
        Tip: Review your answers before submitting.
      </p>
    </aside>
  );
}
