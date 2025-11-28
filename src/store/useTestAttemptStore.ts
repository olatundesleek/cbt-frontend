import { create } from 'zustand';
import type { StartTestSessionResponse } from '@/types/tests.types';

export type Question = StartTestSessionResponse['data']['questions'][number];
export type Progress = StartTestSessionResponse['data']['progress'];
export type Student = StartTestSessionResponse['data']['student'];
export type Course = StartTestSessionResponse['data']['course'];
export type Session = StartTestSessionResponse['data']['session'];

interface TestAttemptStore {
  session: Session | null;
  questions: Question[];
  progress: Progress | null;
  student: Student | null;
  course: Course | null;
  currentPage: number;
  totalPages: number;
  answers: Record<number, string>;
  // Map question id -> displayNumber to help UI components (navigator)
  // determine which page/display number an answer belongs to.
  questionMap: Record<number, number>;
  showSubmitButton: boolean | null;
  setQuestionMap: (m: Record<number, number>) => void;
  updateQuestionMap: (
    entries: Array<{ id: number; displayNumber: number }>,
  ) => void;
  setSession: (s: Session | null) => void;
  setQuestions: (q: Question[]) => void;
  setProgress: (p: Progress | null) => void;
  setStudent: (s: Student | null) => void;
  setCourse: (c: Course | null) => void;
  setCurrentPage: (p: number) => void;
  setAnswers: (a: Record<number, string>) => void;
  updateAnswer: (questionId: number, selectedOption: string) => void;
  setShowSubmitButton: (v: boolean | null) => void;
  reset: () => void;
}

export const useTestAttemptStore = create<TestAttemptStore>((set, get) => ({
  session: null,
  questions: [],
  progress: null,
  student: null,
  course: null,
  currentPage: 0,
  totalPages: 0,
  answers: {},
  questionMap: {},
  showSubmitButton: null,
  setQuestionMap: (m) => set({ questionMap: m }),
  updateQuestionMap: (entries) =>
    set((state) => {
      const next = { ...state.questionMap };
      entries.forEach((e) => {
        next[e.id] = e.displayNumber;
      });
      return { questionMap: next } as Partial<TestAttemptStore>;
    }),
  setSession: (s) => set({ session: s }),
  setQuestions: (q) => set({ questions: q }),
  setProgress: (p) =>
    set({ progress: p, totalPages: p ? Math.ceil(p.total / 2) : 0 }),
  setStudent: (s) => set({ student: s }),
  setCourse: (c) => set({ course: c }),
  setCurrentPage: (p) => set({ currentPage: p }),
  setAnswers: (a) => set({ answers: a }),
  updateAnswer: (questionId, selectedOption) =>
    set({ answers: { ...get().answers, [questionId]: selectedOption } }),
  setShowSubmitButton: (v) => set({ showSubmitButton: v }),
  // Reset the store to initial empty state. Useful after a test finishes so a
  // new attempt starts fresh instead of reusing previous state.
  reset: () =>
    set({
      session: null,
      questions: [],
      progress: null,
      student: null,
      course: null,
      currentPage: 0,
      totalPages: 0,
      answers: {},
      questionMap: {},
      showSubmitButton: null,
    }),
}));
