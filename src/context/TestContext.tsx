'use client';
import { TestStatus } from '@/lib/constants';
import { createContext, useContext, useState, ReactNode } from 'react';

interface Test {
  id: number;
  title: string;
  duration: string;
  totalQuestions: number;
  description: string;
  status: TestStatus;
  attemptsAllowed: number;
}

interface TestContextType {
  selectedTest: Test | null;
  setSelectedTest: (test: Test) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  return (
    <TestContext.Provider value={{ selectedTest, setSelectedTest }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) throw new Error('useTest must be used within TestProvider');
  return context;
}
