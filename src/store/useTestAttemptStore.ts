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

const STORAGE_PREFIX = 'cbt:testAttempt:';
const LAST_KEY = 'cbt:lastTestAttemptKey';

const initialState = {
  session: null as Session | null,
  questions: [] as Question[],
  progress: null as Progress | null,
  student: null as Student | null,
  course: null as Course | null,
  currentPage: 0,
  totalPages: 0,
  answers: {} as Record<number, string>,
  questionMap: {} as Record<number, number>,
  showSubmitButton: null as boolean | null,
};

export const useTestAttemptStore = create<TestAttemptStore>((set, get) => ({
  ...initialState,
  setQuestionMap: (m) => set({ questionMap: m }),
  updateQuestionMap: (entries) =>
    set((state) => {
      const next = { ...state.questionMap };
      entries.forEach((e) => {
        next[e.id] = e.displayNumber;
      });
      return { questionMap: next } as Partial<TestAttemptStore>;
    }),
  // When session is set we try to load persisted state for that session id.
  setSession: (s) => {
    const prevSessionId = get().session?.id;
    set({ session: s });
    if (typeof window === 'undefined') return;

    if (!s) {
      // Clear last pointer and any persisted data for previous session when session ended
      try {
        if (prevSessionId) {
          sessionStorage.removeItem(`${STORAGE_PREFIX}${prevSessionId}`);
        }
        sessionStorage.removeItem(LAST_KEY);
      } catch {
        /* ignore */
      }
      return;
    }

    const key = `${STORAGE_PREFIX}${(s as Session).id ?? 'unknown'}`;
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Only set known keys back into the store to avoid accidental mixing
        const toSet: Partial<TestAttemptStore> = {
          // session is the current session passed in
          questions: parsed.questions ?? initialState.questions,
          progress: parsed.progress ?? initialState.progress,
          student: parsed.student ?? initialState.student,
          course: parsed.course ?? initialState.course,
          currentPage: parsed.currentPage ?? initialState.currentPage,
          totalPages: parsed.totalPages ?? initialState.totalPages,
          answers: parsed.answers ?? initialState.answers,
          questionMap: parsed.questionMap ?? initialState.questionMap,
          showSubmitButton:
            typeof parsed.showSubmitButton === 'boolean'
              ? parsed.showSubmitButton
              : initialState.showSubmitButton,
        };
        set(toSet as TestAttemptStore);
      } else {
        // No persisted data for this session -> reset attempt state but keep session
        set({
          questions: initialState.questions,
          progress: initialState.progress,
          student: initialState.student,
          course: initialState.course,
          currentPage: initialState.currentPage,
          totalPages: initialState.totalPages,
          answers: initialState.answers,
          questionMap: initialState.questionMap,
          showSubmitButton: initialState.showSubmitButton,
        });
      }

      // remember last used key so a page reload can restore if needed
      sessionStorage.setItem(LAST_KEY, key);
    } catch {
      // ignore storage errors (quota/disabled)
    }
  },
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
    set((state) => {
      if (typeof window !== 'undefined') {
        try {
          const currentSessionId = state.session?.id;
          if (currentSessionId) {
            sessionStorage.removeItem(`${STORAGE_PREFIX}${currentSessionId}`);
          }
          sessionStorage.removeItem(LAST_KEY);
        } catch {
          // ignore storage errors
        }
      }

      return { ...initialState };
    }),
}));

// Persistence: subscribe to store changes and save to sessionStorage for the
// currently active session. Guarded for client-side only.
if (typeof window !== 'undefined') {
  // On module init try to restore last attempt if present. This helps when a
  // user refreshes the page — we can resume the last active attempt.
  try {
    const last = sessionStorage.getItem(LAST_KEY);
    if (last) {
      const raw = sessionStorage.getItem(last);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Apply the parsed state into the store. We don't set `session` here as
        // the session object shape may require fresh server-side validation.
        useTestAttemptStore.setState({
          questions: parsed.questions ?? initialState.questions,
          progress: parsed.progress ?? initialState.progress,
          student: parsed.student ?? initialState.student,
          course: parsed.course ?? initialState.course,
          currentPage: parsed.currentPage ?? initialState.currentPage,
          totalPages: parsed.totalPages ?? initialState.totalPages,
          answers: parsed.answers ?? initialState.answers,
          questionMap: parsed.questionMap ?? initialState.questionMap,
          showSubmitButton:
            typeof parsed.showSubmitButton === 'boolean'
              ? parsed.showSubmitButton
              : initialState.showSubmitButton,
        });
      }
    }
  } catch {
    // ignore parse/storage errors
  }

  // Subscribe to all store changes and persist the selected slice for the
  // active session id. We intentionally avoid persisting when there is no
  // session to ensure we don't leak data across different attempts.
  useTestAttemptStore.subscribe((state) => {
    try {
      const s = state.session as Session | null;
      if (!s || !(s as Session).id) return;
      const key = `${STORAGE_PREFIX}${(s as Session).id}`;
      const payload = JSON.stringify({
        // session intentionally not persisted in full; we key by session.id
        questions: state.questions,
        progress: state.progress,
        student: state.student,
        course: state.course,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        answers: state.answers,
        questionMap: state.questionMap,
        showSubmitButton: state.showSubmitButton,
      });
      sessionStorage.setItem(key, payload);
      sessionStorage.setItem(LAST_KEY, key);
    } catch {
      // ignore storage errors
    }
  });
}
