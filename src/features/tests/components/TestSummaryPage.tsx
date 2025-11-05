'use client';
import Button from '@/components/ui/Button';
import { useTest } from '@/context/TestContext';
import { useRouter } from 'next/navigation';
import { FcTodoList } from 'react-icons/fc';

export default function TestSummaryPage() {
  const { selectedTest } = useTest();
  const { push } = useRouter();

  const handleAttemptTest = function () {
    push(`/attempt/123`);
  };

  if (!selectedTest)
    return <p>No test selected. Please go back to the test list.</p>;

  return (
    <div className='space-y-4'>
      <div className='w-full flex gap-4'>
        <FcTodoList
          size={80}
          className='border-2  border-primary-500 rounded-lg w-30 h-20'
        />
        <div>
          <h1 className='text-5xl font-semibold text-neutral-700'>
            {selectedTest.title}{' '}
            {selectedTest.title.toLowerCase().includes('test') ? '' : 'Test'}
          </h1>
          <p
            className='text-sm text-neutral-600
          '
          >
            Read the instruction carefully before you begin.
          </p>
        </div>
      </div>

      <div className='flex w-full gap-4'>
        <div className='p-4 shadow-md rounded-lg bg-neutral-50 flex-1 space-y-4'>
          <h1 className='font-semibold text-neutral-700 text-2xl'>
            Instructions
          </h1>

          <ol className='list-decimal px-4 space-y-2'>
            <li>The test contains {selectedTest.totalQuestions} questions.</li>
            <li>Duration: {selectedTest.duration} minutes.</li>
            <li>Each questions carries two marks.</li>
            <li>Once started you cannot pause or restart.</li>
            <li>Click NEXT to move to the next question.</li>
            <li>Your answers are auto-saved.</li>
            <li>When done, click SUBMIT to finish.</li>
          </ol>
        </div>
        <div className='p-4 shadow-md rounded-lg bg-neutral-50 w-full max-w-60 space-y-4'>
          <h1 className='font-semibold text-neutral-700 text-xl'>
            Test Summary
          </h1>

          <ul className='space-y-2'>
            <li className='flex gap-4'>
              <span>Subject</span>
              <span className='capitalize'>
                {selectedTest.title.toLowerCase().replaceAll('test', '')}
              </span>
            </li>
            <li className='flex gap-4'>
              <span>Questions</span>
              <span>{selectedTest.totalQuestions}</span>
            </li>
            <li className='flex gap-4'>
              <span>Duration</span>
              <span>{selectedTest.duration} minutes.</span>
            </li>
            <li className='flex gap-4'>
              <span>Type</span>
              <span>Multiple Choice</span>
            </li>
            <li className='flex gap-4'>
              <span>Attempts</span>
              <span>Allowed 1</span>
            </li>
          </ul>
        </div>
      </div>
      <div className='w-full flex justify-end'>
        <div>
          <Button label='Start Test' onClick={() => handleAttemptTest()} />
        </div>
      </div>
      <p className='text-xs text-neutral-400 text-center'>
        Click the button above to begin your test immediately.
      </p>
    </div>
  );
}
