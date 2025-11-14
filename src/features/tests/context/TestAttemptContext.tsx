'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { StartTestSessionResponse } from '@/types/tests.types';

interface TestAttemptContextType {
  session: StartTestSessionResponse['data']['session'] | null;
  questions: StartTestSessionResponse['data']['questions'];
  progress: StartTestSessionResponse['data']['progress'] | null;
  student: StartTestSessionResponse['data']['student'] | null;
  course: StartTestSessionResponse['data']['course'] | null;
  currentPage: number;
  totalPages: number;
  answers: Record<number, string>;
  setSession: (session: StartTestSessionResponse['data']['session']) => void;
  setQuestions: (
    questions: StartTestSessionResponse['data']['questions'],
  ) => void;
  setProgress: (progress: StartTestSessionResponse['data']['progress']) => void;
  setStudent: (student: StartTestSessionResponse['data']['student']) => void;
  setCourse: (course: StartTestSessionResponse['data']['course']) => void;
  setCurrentPage: (page: number) => void;
  setAnswers: (answers: Record<number, string>) => void;
  updateAnswer: (questionId: number, selectedOption: string) => void;
  showSubmitButton: boolean | null;
  setshowSubmitButton: (showSubmitButton: boolean) => void;
}

const TestAttemptContext = createContext<TestAttemptContextType | undefined>(
  undefined,
);

export const TestAttemptProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] =
    useState<TestAttemptContextType['session']>(null);
  const [questions, setQuestions] = useState<
    TestAttemptContextType['questions']
  >([]);
  const [progress, setProgress] =
    useState<TestAttemptContextType['progress']>(null);
  const [student, setStudent] =
    useState<TestAttemptContextType['student']>(null);
  const [course, setCourse] = useState<TestAttemptContextType['course']>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showSubmitButton, setshowSubmitButton] = useState<boolean | null>(
    null,
  );

  const totalPages = progress ? Math.ceil(progress.total / 2) : 0;

  const updateAnswer = useCallback(
    (questionId: number, selectedOption: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
    },
    [],
  );

  return (
    <TestAttemptContext.Provider
      value={{
        session,
        questions,
        progress,
        student,
        course,
        currentPage,
        totalPages,
        answers,
        showSubmitButton,
        setSession,
        setQuestions,
        setProgress,
        setStudent,
        setCourse,
        setCurrentPage,
        setAnswers,
        updateAnswer,
        setshowSubmitButton,
      }}
    >
      {children}
    </TestAttemptContext.Provider>
  );
};

export const useTestAttempt = () => {
  const context = useContext(TestAttemptContext);
  if (!context) {
    throw new Error('useTestAttempt must be used within a TestAttemptProvider');
  }
  return context;
};
