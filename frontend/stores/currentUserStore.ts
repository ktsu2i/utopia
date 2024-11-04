import { User } from "@/lib/types";
import { create } from "zustand";

interface CurrentUserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const useCurrentUserStore = create<CurrentUserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

export default useCurrentUserStore;
