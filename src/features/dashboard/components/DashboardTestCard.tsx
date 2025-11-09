'use client';

import { PiNotepadFill } from 'react-icons/pi';
import Button from '@/components/ui/Button';
import { useTest } from '@/context/TestContext';
import { useRouter } from 'next/navigation';

interface TestCardProps {
  id: number;
  testName: string;
  totalQuestions: number;
  durationMinutes: number;
  testStatus: 'active' | 'upcoming';
  progressStatus: 'not-started' | 'in-progress' | 'completed';
  description?: string;
  attemptsAllowed: number;
}

export default function DashboardTestCard({
  id,
  testName,
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
      title: testName,
      status: testStatus,
      duration: durationMinutes.toString(),
      totalQuestions,
      description,
      attemptsAllowed,
    });
    push(`/tests/${id}/summary`);
  };

  return (
    <div className='w-72 p-4 space-y-4 bg-card container rounded-lg shadow-md border border-neutral-200'>
      <div className='flex gap-2 items-center'>
        <span className='text-primary-600'>
          <PiNotepadFill size={40} />
        </span>
        <span>
          <h1 className='text-lg'>{testName}</h1>
          <p className='text-neutral-700 font-extralight text-xs'>
            Total Questions: {totalQuestions}
          </p>
        </span>
      </div>

      {/* Status and progress status info */}
      <div>
        <div className='flex gap-2 items-center mb-2'>
          <div className='flex gap-2 items-center'>
            <span className='w-3 h-3 rounded-full bg-green-600'></span>
            <p className='capitalize'>{testStatus}</p>
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
