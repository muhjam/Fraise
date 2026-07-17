import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "USER" | "SUPER_ADMIN";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    planId?: string | null;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    setUser: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: "fraise-auth-storage",
        }
    )
);
