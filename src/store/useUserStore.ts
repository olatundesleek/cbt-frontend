import { create } from "zustand";

interface UserState {
  firstname: string;
  lastname: string;
  role?: string;
  setName: ({
    firstname,
    lastname,
  }: {
    firstname: string;
    lastname: string;
  }) => void;
  setRole: (role: string) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  firstname: '',
  lastname: '',
  role: undefined,
  setName: ({ firstname, lastname }) => set(() => ({ firstname, lastname })),
  setRole: (role: string) => set(() => ({ role })),
}));
