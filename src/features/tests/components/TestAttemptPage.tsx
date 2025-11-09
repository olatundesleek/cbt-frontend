'use client';
import { useTestAttempt } from '../context/TestAttemptContext';
import { useParams } from 'next/navigation';
import { useState } from 'react';
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

export default function TestAttemptPage() {
  const { sessionId } = useParams();
  const {
    questions,
    progress,
    currentPage,
    answers,
    showSubmitButton,
    updateAnswer,
  } = useTestAttempt();

  const [marked, setMarked] = useState<number[]>([]);

  // Use hooks for mutations
  const { mutate: submitTest, isPending: isSubmitting } = useSubmitTestSession(
    sessionId as string,
  );
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
  if (!questions || questions.length === 0) {
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
    let currentAnswers = currentQuestionIds
      .filter((qId) => answers[qId]) // Only include answered questions
      .map((qId) => ({
        questionId: qId,
        selectedOption: answers[qId],
      }));

    if (currentAnswers.length === 0) {
      currentAnswers = currentQuestionIds.slice(0, 1).map((qId) => ({
        questionId: qId,
        selectedOption: answers[qId] || '',
      }));
    }

    submitAndNext({
      sessionId: Number(sessionId),
      answers: currentAnswers,
    });
  };

  const handlePrev = () => {
    if (currentPage === 0) return;
    // Collect answers for the current page before going back (persist current edits)
    const currentQuestionIds = pageQuestions.map((q) => q.id);
    let currentAnswers = currentQuestionIds
      .filter((qId) => answers[qId])
      .map((qId) => ({
        questionId: qId,
        selectedOption: answers[qId],
      }));

    // If nothing answered, still send placeholder for first question to satisfy backend structure consistency
    if (currentAnswers.length === 0) {
      currentAnswers = currentQuestionIds.slice(0, 1).map((qId) => ({
        questionId: qId,
        selectedOption: answers[qId] || '',
      }));
    }

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
        total={progress?.total || 0}
        answered={Object.keys(answers).length}
        marked={marked.length}
        handleSubmit={handleSubmitTest}
      />

      {/* Main Section */}
      <div className='flex-1 flex flex-col'>
        <TestAttemptHeader />
        <div className='flex-1 grid grid-cols-[1fr_300px] gap-4 p-6'>
          {/* Question Area */}
          <div className='bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between'>
            {pageQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={transformQuestion(q)}
                selected={answers[q.id]}
                onSelect={(option) => handleSelect(q.id, option)}
                onMark={() => handleMark(q.id)}
                marked={marked.includes(q.id)}
              />
            ))}
            <div className='flex justify-between'>
              <button
                onClick={handlePrev}
                disabled={
                  isSubmittingAndGettingNext || isSubmittingAndGettingPrevious
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
                  {isSubmittingAndGettingNext ? 'Saving...' : 'Next'}
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

