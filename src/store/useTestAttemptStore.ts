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
  showSubmitButton: boolean | null;
  setSession: (s: Session | null) => void;
  setQuestions: (q: Question[]) => void;
  setProgress: (p: Progress | null) => void;
  setStudent: (s: Student | null) => void;
  setCourse: (c: Course | null) => void;
  setCurrentPage: (p: number) => void;
  setAnswers: (a: Record<number, string>) => void;
  updateAnswer: (questionId: number, selectedOption: string) => void;
  setShowSubmitButton: (v: boolean | null) => void;
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
  showSubmitButton: null,
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
}));
