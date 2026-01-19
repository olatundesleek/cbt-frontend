'use client';
import { useTestAttemptStore } from '@/store/useTestAttemptStore';
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
import { LuX } from 'react-icons/lu';
import Image from 'next/image';

export default function TestAttemptPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  const { sessionId } = useParams();
  const { push } = useRouter();
  const questions = useTestAttemptStore((s) => s.questions);
  const progress = useTestAttemptStore((s) => s.progress);
  const student = useTestAttemptStore((s) => s.student);
  const course = useTestAttemptStore((s) => s.course);
  const currentPage = useTestAttemptStore((s) => s.currentPage);
  const answers = useTestAttemptStore((s) => s.answers);
  const showSubmitButton = useTestAttemptStore((s) => s.showSubmitButton);
  const updateAnswer = useTestAttemptStore((s) => s.updateAnswer);

  const { mutate: startTest, isPending: isStartingTest } =
    useStartTestSession();

  useEffect(() => {
    if (questions.length > 0) return;
    if (!testId) return push('/tests');
    startTest({ testId: testId?.toString() });
  }, [questions, sessionId, push, startTest, testId]);

  const [marked, setMarked] = useState<number[]>([]);
  // Resource viewers: modal for diagrams, drawer for comprehension text
  const [diagramModal, setDiagramModal] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<{ content: string } | null>(null);
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

  const pageQuestions = questions;

  // Transform backend question format to component format
  const transformQuestion = (q: (typeof questions)[0]) => ({
    id: q.id,
    question: q.text,
    options: parseOptions(q.options),
    imageUrl: q.imageUrl ?? null,
    comprehensionText: q.comprehensionText ?? null,
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
    if (currentPage === 1) return;
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
          <div className='bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-scroll h-[90vh] max-h-screen'>
            {pageQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                displayNumber={q.displayNumber}
                question={transformQuestion(q)}
                selected={answers[q.id]}
                onSelect={(option) => handleSelect(q.id, option)}
                onMark={() => handleMark(q.displayNumber)}
                marked={marked.includes(q.displayNumber)}
                onOpenResource={(type, content) =>
                  type === 'diagram'
                    ? setDiagramModal(content)
                    : setDrawer({ content })
                }
              />
            ))}

            {/* Diagram modal (centered, contains full image) */}
            {diagramModal && (
              <div
                className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'
                onClick={() => setDiagramModal(null)}
              >
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    setDiagramModal(null);
                  }}
                  className='absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white cursor-pointer shadow'
                  aria-label='Close diagram'
                >
                  <LuX className='w-5 h-5 text-neutral-800' />
                </button>
                <div
                  className='relative w-full h-full flex items-center justify-center'
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={diagramModal}
                    alt='Question diagram'
                    fill
                    sizes='90vw'
                    className='object-contain'
                    style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                  />
                </div>
              </div>
            )}

            {/* Right-side drawer for comprehension */}
            {drawer && (
              <div
                className='fixed inset-0 z-40'
                onClick={() => setDrawer(null)}
              >
                <div className='absolute inset-0 bg-black/40' />
                <div
                  className='absolute right-0 top-0 h-full w-full max-w-[380px] bg-white shadow-xl border-l border-neutral-200 p-4 flex flex-col'
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <h3 className='text-lg font-semibold'>Instructions</h3>
                    <button
                      type='button'
                      onClick={() => setDrawer(null)}
                      className='p-2 rounded-full hover:bg-neutral-100'
                      aria-label='Close drawer'
                    >
                      <LuX className='w-5 h-5' />
                    </button>
                  </div>
                  <div className='flex-1 overflow-auto'>
                    <p className='text-sm text-neutral-700 whitespace-pre-wrap'>
                      {drawer.content}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className='flex justify-between'>
              <button
                onClick={handlePrev}
                disabled={
                  isSubmittingAndGettingNext ||
                  isSubmittingAndGettingPrevious ||
                  currentPage === 1
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
            current={currentPage}
            onSelect={(num) => fetchByNumber(num)}
            answered={Object.keys(answers).map((id) => Number(id))}
            marked={marked}
          />
        </div>
      </div>
    </div>
  );
}

