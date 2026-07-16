"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { logout, setUser } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    // Cookie invalid/missing, clear local storage state
                    logout();
                }
            } catch (error) {
                logout();
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [logout, setUser]);

    // Opional: If you want to block rendering while checking, you can return a loader
    // But returning children directly is smoother if you prefer optimistic UI.
    return <>{children}</>;
}
