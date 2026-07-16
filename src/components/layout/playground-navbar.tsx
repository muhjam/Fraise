"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/foundations/theme-toggle";
import { useAuthStore } from "@/store/use-auth-store";
import { cx } from "@/utils/cx";
import { APP_NAME } from "@/config";

export function PlaygroundUserDropdown() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        setOpen(false);
        await fetch("/api/auth/logout", { method: "POST" });
        logout();
        router.push("/");
    };

    const initials = user?.name
        ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
        : user?.email?.slice(0, 2).toUpperCase() ?? "U";

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className={cx(
                    "flex items-center gap-2.5 rounded-full border border-secondary px-3 py-1.5",
                    "bg-primary hover:bg-secondary transition-colors text-sm",
                    open && "bg-secondary"
                )}
            >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                    {initials}
                </span>
                <span className="hidden sm:block max-w-[120px] truncate font-medium text-primary">
                    {user?.name || user?.email}
                </span>
                <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={cx("text-tertiary transition-transform duration-200", open && "rotate-180")}
                >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-secondary bg-primary shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header info */}
                    <div className="px-4 py-3 border-b border-secondary">
                        <p className="text-sm font-semibold text-primary truncate">{user?.name}</p>
                        <p className="text-xs text-tertiary truncate">{user?.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                        {/* Beranda */}
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:bg-secondary hover:text-primary transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                <polyline points="9,22 9,12 15,12 15,22" />
                            </svg>
                            Beranda
                        </Link>

                        {/* Dashboard — only for admin or all users */}
                        <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:bg-secondary hover:text-primary transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                            Dashboard
                        </Link>

                        <div className="my-1 border-t border-secondary" />

                        {/* Keluar */}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                <polyline points="16,17 21,12 16,7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Keluar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export const PlaygroundNavbar = () => {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-secondary bg-primary/80 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-container items-center justify-between px-4 py-3 md:px-8">
                {/* Logo */}
                <Link href="/playground" className="flex items-center gap-2 shrink-0">
                    <Image src="/logo.png" className="object-contain" alt={`${APP_NAME} Logo`} width={32} height={32} />
                    <Image src="/title-dark.png" className="object-contain dark:hidden" alt={APP_NAME} width={68} height={28} />
                    <Image src="/title-light.png" className="object-contain hidden dark:block" alt={APP_NAME} width={68} height={28} />
                </Link>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {isAuthenticated ? (
                        <PlaygroundUserDropdown />
                    ) : (
                        <button
                            onClick={() => router.push("/login?redirect=/playground")}
                            className="flex items-center gap-1.5 rounded-full border border-secondary bg-primary px-3 py-1.5 text-sm font-medium text-secondary hover:bg-secondary hover:text-primary transition-colors"
                        >
                            Masuk
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
