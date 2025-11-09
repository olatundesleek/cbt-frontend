'use client';
import { useRouter } from 'next/navigation';
import { useTestResult } from '../context/TestResultContext';
import { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

export default function CorrectionsPage() {
  const router = useRouter();
  const { testResult } = useTestResult();

  // Redirect if no test result
  useEffect(() => {
    if (!testResult) {
      router.push('/tests');
    }
  }, [testResult, router]);

  if (!testResult) {
    return null;
  }

  const { test, answers, score } = testResult;
  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6'>
          <button
            onClick={() => router.push('/tests')}
            className='flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-4 transition-colors'
          >
            <FaArrowLeft className='w-4 h-4' />
            <span>Back to Tests</span>
          </button>

          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {test.title} - Corrections
              </h1>
              <p className='text-gray-600'>
                Review your answers and learn from mistakes
              </p>
            </div>

            <div className='bg-primary-50 rounded-xl p-4 text-center min-w-[150px]'>
              <p className='text-sm text-gray-600 mb-1'>Your Score</p>
              <p className='text-3xl font-bold text-primary-700'>
                {score}/{totalQuestions}
              </p>
              <p className='text-sm text-gray-500'>{percentage}%</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className='grid grid-cols-2 gap-4 mt-6'>
            <div className='bg-green-50 rounded-xl p-4 text-center'>
              <FaCheckCircle className='w-6 h-6 text-green-500 mx-auto mb-2' />
              <p className='text-2xl font-bold text-green-700'>
                {correctCount}
              </p>
              <p className='text-sm text-gray-600'>Correct</p>
            </div>
            <div className='bg-red-50 rounded-xl p-4 text-center'>
              <FaTimesCircle className='w-6 h-6 text-red-500 mx-auto mb-2' />
              <p className='text-2xl font-bold text-red-700'>
                {totalQuestions - correctCount}
              </p>
              <p className='text-sm text-gray-600'>Incorrect</p>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className='space-y-6'>
          {answers.map((answer, index) => (
            <div
              key={answer.id}
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                answer.isCorrect ? 'border-green-500' : 'border-red-500'
              }`}
            >
              {/* Question Number and Status */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <span className='bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-lg text-sm'>
                    Question {index + 1}
                  </span>
                  {answer.isCorrect ? (
                    <span className='flex items-center gap-1 text-green-600 text-sm font-medium'>
                      <FaCheckCircle className='w-4 h-4' />
                      Correct
                    </span>
                  ) : (
                    <span className='flex items-center gap-1 text-red-600 text-sm font-medium'>
                      <FaTimesCircle className='w-4 h-4' />
                      Incorrect
                    </span>
                  )}
                </div>
                <span className='text-sm text-gray-500'>
                  {answer.question.marks}{' '}
                  {answer.question.marks === 1 ? 'mark' : 'marks'}
                </span>
              </div>

              {/* Question Text */}
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {answer.question.text}
              </h3>

              {/* Options */}
              <div className='space-y-2'>
                {answer.question.options.map((option, optIndex) => {
                  const isCorrectAnswer =
                    option === answer.question.correctAnswer;
                  const isUserAnswer = option === answer.selectedOption;

                  return (
                    <div
                      key={optIndex}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isCorrectAnswer
                          ? 'bg-green-50 border-green-500'
                          : isUserAnswer && !answer.isCorrect
                          ? 'bg-red-50 border-red-500'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <span
                          className={`font-medium ${
                            isCorrectAnswer
                              ? 'text-green-700'
                              : isUserAnswer && !answer.isCorrect
                              ? 'text-red-700'
                              : 'text-gray-700'
                          }`}
                        >
                          {option}
                        </span>
                        {isCorrectAnswer && (
                          <span className='flex items-center gap-1 text-green-600 text-sm font-medium'>
                            <FaCheckCircle className='w-4 h-4' />
                            Correct Answer
                          </span>
                        )}
                        {isUserAnswer && !answer.isCorrect && (
                          <span className='flex items-center gap-1 text-red-600 text-sm font-medium'>
                            <FaTimesCircle className='w-4 h-4' />
                            Your Answer
                          </span>
                        )}
                        {isUserAnswer && answer.isCorrect && (
                          <span className='flex items-center gap-1 text-green-600 text-sm font-medium'>
                            <FaCheckCircle className='w-4 h-4' />
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className='mt-8 text-center'>
          <button
            onClick={() => router.push('/tests')}
            className='bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition-colors font-semibold shadow-lg'
          >
            Back to Tests
          </button>
        </div>
      </div>
    </div>
  );
}
