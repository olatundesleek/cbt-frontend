import { create } from "zustand";

interface UserState {
  firstname: string;
  lastname: string;
  role?: 'admin' | 'teacher' | 'student';
  setName: ({
    firstname,
    lastname,
  }: {
    firstname: string;
    lastname: string;
  }) => void;
  setRole: (role: 'admin' | 'teacher' | 'student') => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  firstname: '',
  lastname: '',
  role: undefined,
  setName: ({ firstname, lastname }) => set(() => ({ firstname, lastname })),
  setRole: (role: 'admin' | 'teacher' | 'student') => set(() => ({ role })),
  reset: () => set(() => ({ firstname: '', lastname: '', role: undefined })),
}));
