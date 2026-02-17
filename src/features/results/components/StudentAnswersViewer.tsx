'use client';

import { FaCheckCircle, FaTimesCircle, FaClock, FaPen } from 'react-icons/fa';
import MathHtmlRenderer from '@/components/mathHtmlRenderer';
import type { QuestionAnswerDetail } from '@/types/results.types';

interface StudentAnswersViewerProps {
  data: {
    session: {
      id: number;
      startedAt: string;
      endedAt: string;
      score: number | null;
      status: string;
    };
    student: {
      id: number;
      firstname?: string;
      lastname?: string;
      class?: {
        id: number;
        className: string;
        teacherId?: number;
        createdAt?: string;
      };
    };
    test: {
      id: number;
      title: string;
      type: string;
      showResult?: boolean;
      createdBy?: {
        id: number;
        name: string;
      };
      passMark?: number;
    };
    course: {
      id: number;
      title: string;
      description?: string;
      teacherId?: number;
      createdAt?: string;
    };
    questionsAnswers: QuestionAnswerDetail[];
  };
}

export default function StudentAnswersViewer({
  data,
}: StudentAnswersViewerProps) {
  const { session, student, test, course, questionsAnswers } = data;

  const correctCount = questionsAnswers.filter((a) => a.isCorrect).length;
  const unattemptedCount = questionsAnswers.filter(
    (a) => a.selectedOption === null,
  ).length;
  const attemptedCount = questionsAnswers.filter(
    (a) => a.selectedOption !== null,
  ).length;
  const wrongCount = attemptedCount - correctCount;

  const totalMarks = questionsAnswers.reduce(
    (sum, q) => sum + q.question.marks,
    0,
  );
  const percentage =
    session.score !== null && totalMarks > 0
      ? Math.round((session.score / totalMarks) * 100)
      : 0;
  const passMark = test.passMark ?? 0;
  const passed = session.score !== null && session.score >= passMark;
  const totalMinutesElapsed = Math.round(
    (new Date(session.endedAt).getTime() -
      new Date(session.startedAt).getTime()) /
      60000,
  );

  const totalSecondsElapsed =
    Math.round(
      (new Date(session.endedAt).getTime() -
        new Date(session.startedAt).getTime()) /
        1000,
    ) % 60;

  return (
    <div className='w-full max-w-4xl mx-auto space-y-6'>
      {/* Header Section */}
      <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {test.title}
            </h1>
            <p className='text-gray-600'>
              {student.firstname || ''} {student.lastname || ''} •{' '}
              <span className='text-gray-500'>{student.class?.className}</span>
            </p>
            <p className='text-sm text-gray-500 mt-2'>{course.title}</p>
          </div>

          <div className='bg-linear-to-br from-primary-50 to-primary-100 rounded-xl p-6 text-center min-w-[200px]'>
            <p className='text-sm text-gray-600 mb-1'>Score</p>
            <p className='text-4xl font-bold text-primary-700'>
              {session.score}/{totalMarks}
            </p>
            <p className='text-sm text-primary-600 font-semibold mt-2'>
              {percentage}%
            </p>
            <div className='mt-3 pt-3 border-t border-primary-200'>
              <p
                className={`text-sm font-medium ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {passed ? '✓ PASSED' : '✗ FAILED'}
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                Pass mark: {passMark}
              </p>
            </div>
          </div>
        </div>

        {/* Time Info */}
        <div className='mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row gap-6'>
          <div>
            <p className='text-sm text-gray-600 mb-1'>Started</p>
            <p className='font-medium text-gray-900'>
              {new Date(session.startedAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 mb-1'>Completed</p>
            <p className='font-medium text-gray-900'>
              {new Date(session.endedAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 mb-1'>Duration</p>
            <p className='font-medium text-gray-900'>
              {`${totalMinutesElapsed} ${totalMinutesElapsed <= 1 ? 'minute' : 'minutes'}`}{' '}
              {`${totalSecondsElapsed} ${totalSecondsElapsed <= 1 ? 'second' : 'seconds'}`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-green-50 rounded-xl p-4 text-center border border-green-200'>
          <FaCheckCircle className='w-6 h-6 text-green-500 mx-auto mb-2' />
          <p className='text-2xl font-bold text-green-700'>{correctCount}</p>
          <p className='text-xs text-gray-600 mt-1'>Correct</p>
        </div>
        <div className='bg-red-50 rounded-xl p-4 text-center border border-red-200'>
          <FaTimesCircle className='w-6 h-6 text-red-500 mx-auto mb-2' />
          <p className='text-2xl font-bold text-red-700'>{wrongCount}</p>
          <p className='text-xs text-gray-600 mt-1'>Incorrect</p>
        </div>
        <div className='bg-gray-50 rounded-xl p-4 text-center border border-gray-200'>
          <FaClock className='w-6 h-6 text-gray-500 mx-auto mb-2' />
          <p className='text-2xl font-bold text-gray-700'>{unattemptedCount}</p>
          <p className='text-xs text-gray-600 mt-1'>Unattempted</p>
        </div>
        <div className='bg-blue-50 rounded-xl p-4 text-center border border-blue-200'>
          <FaPen className='w-6 h-6 text-blue-500 mx-auto mb-2' />
          <p className='text-2xl font-bold text-blue-700'>{attemptedCount}</p>
          <p className='text-xs text-gray-600 mt-1'>Attempted</p>
        </div>
      </div>

      {/* Questions List */}
      <div className='space-y-6'>
        {questionsAnswers.map((answer) => {
          const isUnattempted = answer.selectedOption === null;
          const isCorrect = answer.isCorrect;

          return (
            <div
              key={answer.questionId}
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                isUnattempted
                  ? 'border-gray-400'
                  : isCorrect
                    ? 'border-green-500'
                    : 'border-red-500'
              }`}
            >
              {/* Question Number and Status */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3 flex-wrap'>
                  <span className='bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-lg text-sm'>
                    Question {answer.displayNumber}
                  </span>
                  {isUnattempted ? (
                    <span className='flex items-center gap-1 text-gray-600 text-sm font-medium'>
                      <FaClock className='w-4 h-4' />
                      Unattempted
                    </span>
                  ) : isCorrect ? (
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
                  {answer.question.marks <= 1 ? 'mark' : 'marks'}
                </span>
              </div>

              {/* Question Text */}
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                <MathHtmlRenderer html={answer.question.text} />
              </h3>

              {/* Unattempted State */}
              {isUnattempted && (
                <div className='bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4'>
                  <p className='text-gray-600 italic text-center'>
                    Student did not attempt this question
                  </p>
                </div>
              )}

              {/* Options */}
              <div className='space-y-2'>
                {answer.question.options.map((option, optIndex) => {
                  const isCorrectAnswer = option === answer.correctAnswer;
                  const isUserAnswer = option === answer.selectedOption;

                  return (
                    <div
                      key={optIndex}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isUnattempted
                          ? 'bg-gray-50 border-gray-200'
                          : isCorrectAnswer
                            ? 'bg-green-50 border-green-500'
                            : isUserAnswer && !isCorrect
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <span
                          className={`font-medium ${
                            isUnattempted
                              ? 'text-gray-700'
                              : isCorrectAnswer
                                ? 'text-green-700'
                                : isUserAnswer && !isCorrect
                                  ? 'text-red-700'
                                  : 'text-gray-700'
                          }`}
                        >
                          <MathHtmlRenderer html={option} />
                        </span>
                        <div className='flex items-center gap-2'>
                          {isCorrectAnswer && (
                            <span className='flex items-center gap-1 text-green-600 text-sm font-medium whitespace-nowrap'>
                              <FaCheckCircle className='w-4 h-4' />
                              Correct
                            </span>
                          )}
                          {isUserAnswer && !isCorrect && !isUnattempted && (
                            <span className='flex items-center gap-1 text-red-600 text-sm font-medium whitespace-nowrap'>
                              <FaTimesCircle className='w-4 h-4' />
                              Selected
                            </span>
                          )}
                          {isUserAnswer && isCorrect && (
                            <span className='flex items-center gap-1 text-green-600 text-sm font-medium whitespace-nowrap'>
                              <FaCheckCircle className='w-4 h-4' />
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className='bg-gray-50 rounded-2xl p-6 border border-gray-200'>
        <h3 className='font-semibold text-gray-900 mb-4'>Summary</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
          <div>
            <p className='text-gray-600 mb-1'>Total Questions</p>
            <p className='font-semibold text-gray-900'>
              {questionsAnswers.length}
            </p>
          </div>
          <div>
            <p className='text-gray-600 mb-1'>Attempted</p>
            <p className='font-semibold text-blue-700'>{attemptedCount}</p>
          </div>
          <div>
            <p className='text-gray-600 mb-1'>Success Rate</p>
            <p className='font-semibold text-gray-900'>
              {attemptedCount > 0
                ? Math.round((correctCount / attemptedCount) * 100)
                : 0}
              %
            </p>
          </div>
          <div>
            <p className='text-gray-600 mb-1'>Pass Status</p>
            <p
              className={`font-semibold ${
                passed ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {passed ? 'PASSED' : 'FAILED'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
