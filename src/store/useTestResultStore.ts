import { create } from 'zustand';

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

interface TestSession {
  id: number;
  studentId: number;
  testId: number;
  attemptNo: number;
  status: string;
  startedAt: string;
  endedAt: string;
  score: number;
  test: {
    id: number;
    title: string;
    type: string;
    totalQuestions?: number;
  } | null;
  answers: Answer[];
}

interface TestResultStore {
  testResult: TestSession | null;
  setTestResult: (r: TestSession | null) => void;
  clearTestResult: () => void;
}

export const useTestResultStore = create<TestResultStore>((set) => ({
  testResult: null,
  setTestResult: (r) => set({ testResult: r }),
  clearTestResult: () => set({ testResult: null }),
}));
