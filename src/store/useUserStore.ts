import { create } from "zustand";

interface UserState {
  firstname: string;
  lastname: string;
  setName: ({
    firstname,
    lastname,
  }: {
    firstname: string;
    lastname: string;
  }) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  firstname: "",
  lastname: "",
  setName: ({ firstname, lastname }) => set(() => ({ firstname, lastname })),
}));
