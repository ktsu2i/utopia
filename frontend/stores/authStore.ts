import { User } from "@/lib/types";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  setIsAuthenticated: (auth: boolean) => void;
  setCurrentUser: (user: User) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setCurrentUser: (user) => set({ currentUser: user }),
}));

export default useAuthStore;
