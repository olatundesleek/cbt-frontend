'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface Question {
  id: number;
  text: string;
  marks: number;
  bankId: number;
  createdAt: string;
  options: string[];
  correctAnswer: string;
}

interface Answer {
  id: number;
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
  question: Question;
}

interface Test {
  id: number;
  title: string;
  type: 'TEST' | 'EXAM';
  testState: string;
  showResult: boolean;
  startTime: string;
  endTime: string;
  duration: number;
  attemptsAllowed: number;
  courseId: number;
  bankId: number;
  createdBy: number;
  createdAt: string;
}

interface TestSession {
  id: number;
  studentId: number;
  testId: number;
  attemptNo: number;
  status: string;
  startedAt: string;
  endedAt: string;
  score: number;
  test: Test;
  answers: Answer[];
}

interface TestResultContextType {
  testResult: TestSession | null;
  setTestResult: (result: TestSession) => void;
  clearTestResult: () => void;
}

const TestResultContext = createContext<TestResultContextType | undefined>(
  undefined,
);

export const TestResultProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [testResult, setTestResultState] = useState<TestSession | null>(null);

  const setTestResult = useCallback((result: TestSession) => {
    setTestResultState(result);
  }, []);

  const clearTestResult = useCallback(() => {
    setTestResultState(null);
  }, []);

  return (
    <TestResultContext.Provider
      value={{
        testResult,
        setTestResult,
        clearTestResult,
      }}
    >
      {children}
    </TestResultContext.Provider>
  );
};

export const useTestResult = () => {
  const context = useContext(TestResultContext);
  if (!context) {
    throw new Error('useTestResult must be used within a TestResultProvider');
  }
  return context;
};
