import { TestType } from '@/lib/constants';
import { create } from 'zustand';

interface Test {
  id: number;
  type: TestType;
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

const STORAGE_KEY = 'cbt:selectedTest';

const initialState = {
  selectedTest: null as Test | null,
};

export const useTestStore = create<TestStore>((set) => ({
  selectedTest: initialState.selectedTest,
  setSelectedTest: (t: Test | null) => set({ selectedTest: t }),
}));

// Client-side persistence so the selected test survives refreshes in the
// same tab. We intentionally use sessionStorage so data is cleared when the
// tab closes. Guard with typeof window to avoid SSR errors.
if (typeof window !== 'undefined') {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Test;
      useTestStore.setState({ selectedTest: parsed });
    }
  } catch {
    // ignore parse/storage errors
  }

  // Persist whenever selectedTest changes. If it becomes null we remove the
  // key to avoid stale data when a new test is selected.
  useTestStore.subscribe((state) => {
    try {
      if (state.selectedTest) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.selectedTest));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  });
}
