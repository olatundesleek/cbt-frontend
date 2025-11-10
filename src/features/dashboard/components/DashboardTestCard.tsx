'use client';

import { PiNotepadFill } from 'react-icons/pi';
import Button from '@/components/ui/Button';
import { useTest } from '@/context/TestContext';
import { useRouter } from 'next/navigation';

interface TestCardProps {
  id: number;
  title: string;
  course: string;
  totalQuestions: number;
  durationMinutes: number;
  testStatus: 'active' | 'scheduled' | 'completed';
  progressStatus: 'not-started' | 'in-progress' | 'completed';
  description?: string;
  attemptsAllowed: number;
}

export default function DashboardTestCard({
  id,
  title,
  course,
  totalQuestions,
  durationMinutes,
  testStatus,
  progressStatus,
  description = '',
  attemptsAllowed,
}: TestCardProps) {
  const { push } = useRouter();
  const { setSelectedTest } = useTest();

  const handleViewTest = () => {
    setSelectedTest({
      id,
      title: title,
      status: testStatus,
      duration: durationMinutes.toString(),
      totalQuestions,
      description,
      attemptsAllowed,
    });
    push(`/tests/${id}/summary`);
  };

  const statusColorClass =
    testStatus === 'active'
      ? 'bg-green-600'
      : testStatus === 'scheduled'
      ? 'bg-yellow-500'
      : 'bg-gray-400';

  return (
    <div className='w-full min-w-[350px] p-4 space-y-4 bg-card container rounded-lg shadow-md border border-neutral-200'>
      <div className='flex gap-2 items-center'>
        <span className='text-primary-600'>
          <PiNotepadFill size={40} />
        </span>
        <span className='w-full'>
          <h1 className='text-lg'>{title}</h1>
          <span className='flex justify-between w-full'>
            <p className='text-neutral-700 font-extralight text-xs'>
              Course: {course}
            </p>
            <p className='text-neutral-700 font-extralight text-xs'>
              Total Questions: {totalQuestions}
            </p>
          </span>
        </span>
      </div>

      {/* Status and progress status info */}
      <div>
        <div className='flex gap-2 items-center mb-2'>
          <div className='flex gap-2 items-center'>
            <span className={`w-3 h-3 rounded-full ${statusColorClass}`}></span>
            <p className='capitalize'>
              {testStatus.toLowerCase() === 'scheduled'
                ? 'upcoming'
                : testStatus.toLowerCase()}
            </p>
          </div>
          <span>|</span>
          <p className='text-neutral-700 font-extralight text-xs'>
            {durationMinutes} minutes
          </p>
        </div>
        <p className='capitalize flex justify-between text-neutral-700 font-extralight text-xs'>
          <span className='text-neutral-800 font-normal text-base'>
            Progress
          </span>
          <span>{progressStatus.replace('-', ' ')}</span>
        </p>
      </div>

      <Button label='View Test' onClick={handleViewTest} />
    </div>
  );
}
