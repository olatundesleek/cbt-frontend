import { create } from 'zustand';

interface Test {
  id: number;
  title: string;
  duration: string;
  totalQuestions: number;
  description: string;
  status: string;
  attemptsAllowed: number;
  sessionId: number | null;
  progress?: 'not-started' | 'in-progress' | 'completed' | null;
}

interface TestStore {
  selectedTest: Test | null;
  setSelectedTest: (t: Test | null) => void;
}

export const useTestStore = create<TestStore>((set) => ({
  selectedTest: null,
  setSelectedTest: (t: Test | null) => set({ selectedTest: t }),
}));
