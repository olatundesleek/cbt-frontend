'use client';
import { useTestAttempt } from '../context/TestAttemptContext';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import TestAttemptSidebar from './TestAttemptSidebar';
import TestAttemptHeader from './TestAttemptHeader';
import QuestionCard from './QuestionCard';
import QuestionNavigator from './QuestionNavigator';
import Spinner from '@/components/ui/Spinner';
import { useSubmitTestSession } from '../hooks/useSubmitTestSession';
import { useSubmitAnswersAndGetNext } from '../hooks/useSubmitAnswersAndGetNext';
import { useSubmitAnswersAndGetPrevious } from '../hooks/useSubmitAnswersAndGetPrevious';
import { useFetchQuestionsByNumber } from '../hooks/useFetchQuestionsByNumber';
import { parseOptions } from '../utils/parseOptions';
import { useExamSessionSocket } from '../hooks/useExamSessionSocket';
import { useStartTestSession } from '../hooks/useStartTestSession';

export default function TestAttemptPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  const { sessionId } = useParams();
  const { push } = useRouter();
  const {
    questions,
    progress,
    student,
    course,
    currentPage,
    answers,
    showSubmitButton,
    updateAnswer,
  } = useTestAttempt();

  const { mutate: startTest, isPending: isStartingTest } =
    useStartTestSession();

  useEffect(() => {
    if (questions.length > 0) return;
    if (!testId) return push('/tests');
    startTest({ testId: testId?.toString() });
  }, [questions, sessionId, push, startTest, testId]);

  const [marked, setMarked] = useState<number[]>([]);
  // Will initialize after mutation hook declaration below to avoid use-before-declare
  const [remainingSecondsState, setRemainingSecondsState] = useState<
    number | null
  >(null);
  const hasAutoSubmittedRef = useRef(false);

  // Use hooks for mutations
  const { mutate: submitTest, isPending: isSubmitting } = useSubmitTestSession(
    sessionId as string,
  );
  // Initialize socket AFTER submitTest is defined
  const { remainingSeconds } = useExamSessionSocket(
    sessionId ? Number(sessionId) : null,
    { autoConnect: true, autoJoin: true },
  );

  // Mirror remainingSeconds into local state to trigger effect safely
  useEffect(() => {
    setRemainingSecondsState(remainingSeconds);
  }, [remainingSeconds]);

  useEffect(() => {
    if (remainingSecondsState === 0 && !hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      submitTest();
    }
  }, [remainingSecondsState, submitTest]);
  const { mutate: submitAndNext, isPending: isSubmittingAndGettingNext } =
    useSubmitAnswersAndGetNext();
  const {
    mutate: submitAndPrevious,
    isPending: isSubmittingAndGettingPrevious,
  } = useSubmitAnswersAndGetPrevious();
  const { mutate: fetchByNumber } = useFetchQuestionsByNumber(
    Number(sessionId),
  );

  // Handle loading state - if no questions yet, show loading
  if (!questions || questions.length === 0 || isStartingTest) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner />
      </div>
    );
  }

  // Paging logic: 2 questions per page
  const startIdx = currentPage * 2;
  const pageQuestions = questions;

  // Transform backend question format to component format
  const transformQuestion = (q: (typeof questions)[0]) => ({
    id: q.id,
    question: q.text,
    options: parseOptions(q.options),
  });

  const handleSelect = (questionId: number, option: string) => {
    // Just update local state, don't submit yet
    updateAnswer(questionId, option);
  };

  const handleMark = (questionId: number) => {
    setMarked((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  const handleNext = () => {
    // Collect answers for the current page's questions
    const currentQuestionIds = pageQuestions.map((q) => q.id);

    const currentAnswers = currentQuestionIds.map((qId) =>
      answers[qId]
        ? { questionId: qId, selectedOption: answers[qId] }
        : { questionId: qId },
    );

    submitAndNext({
      sessionId: Number(sessionId),
      answers: currentAnswers,
    });
  };

  const handlePrev = () => {
    if (currentPage === 0) return;
    // Collect answers for the current page before going back (persist current edits)
    const currentQuestionIds = pageQuestions.map((q) => q.id);
    const currentAnswers = currentQuestionIds.map((qId) =>
      answers[qId]
        ? { questionId: qId, selectedOption: answers[qId] }
        : { questionId: qId },
    );

    submitAndPrevious({
      sessionId: Number(sessionId),
      answers: currentAnswers,
    });
  };

  const handleSubmitTest = () => {
    if (
      window.confirm(
        'Are you sure you want to submit this test? You cannot make changes after submission.',
      )
    ) {
      submitTest();
    }
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <TestAttemptSidebar
        studentName={`${student?.firstname} ${student?.lastname}`}
        total={progress?.total || 0}
        answered={Object.keys(answers).length}
        marked={marked.length}
        handleSubmit={handleSubmitTest}
        remainingSeconds={remainingSeconds}
        course={course}
      />

      {/* Main Section */}
      <div className='flex-1 flex flex-col'>
        <TestAttemptHeader
          remainingSeconds={remainingSeconds}
          studentName={`${student?.firstname} ${student?.lastname}`}
        />
        <div className='flex-1 grid grid-cols-[1fr_300px] gap-4 p-6'>
          {/* Question Area */}
          <div className='bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between'>
            {pageQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                displayNumber={q.displayNumber}
                question={transformQuestion(q)}
                selected={answers[q.id]}
                onSelect={(option) => handleSelect(q.id, option)}
                onMark={() => handleMark(q.displayNumber)}
                marked={marked.includes(q.displayNumber)}
              />
            ))}
            <div className='flex justify-between'>
              <button
                onClick={handlePrev}
                disabled={
                  pageQuestions[0].id === 1 ||
                  isSubmittingAndGettingNext ||
                  isSubmittingAndGettingPrevious
                }
                className='px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmittingAndGettingPrevious ? 'Loading...' : 'Previous'}
              </button>

              {showSubmitButton ? (
                <button
                  onClick={handleNext}
                  disabled={isSubmitting || isSubmittingAndGettingNext}
                  className='w-full max-w-40 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={isSubmittingAndGettingNext}
                  className='px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmittingAndGettingNext ? 'Saving...' : 'Save and Next'}
                </button>
              )}
            </div>
          </div>

          {/* Navigator */}
          <QuestionNavigator
            total={progress?.total || 0}
            current={startIdx + 1}
            onSelect={(num) => fetchByNumber(num)}
            answered={Object.keys(answers).map((id) => Number(id))}
            marked={marked}
          />
        </div>
      </div>
    </div>
  );
}

