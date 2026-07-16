"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";
import { useAuthStore } from "@/store/use-auth-store";
import { cx } from "@/utils/cx";

export const RegisterPage = () => {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const pwd = formData.get("password") as string;

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password: pwd,
                    role: "STUDENT",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Registration failed");
                return;
            }

            setUser(data.user);

            if (data.user.role === "STUDENT") {
                router.push("/moduls");
            } else {
                router.push("/dashboard/home");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-primary lg:pr-[50%]">
            {/* Left Panel - Form */}
            <div className="flex min-h-screen flex-col bg-primary">
                <div className="flex flex-1 justify-center px-4 py-12 md:items-center md:px-8">
                    <div className="flex w-full flex-col gap-8 sm:max-w-90">
                        {/* Logo + Title */}
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className="relative">
                                <BackgroundPattern
                                    pattern="grid"
                                    className="absolute top-1/2 left-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                                />
                                <BackgroundPattern
                                    pattern="grid"
                                    size="md"
                                    className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 md:hidden"
                                />
                                <Image
                                    src="/logo.png"
                                    alt="Fraise Logo"
                                    width={48}
                                    height={48}
                                    className="relative z-10 object-contain"
                                />
                            </div>
                            <div className="z-10 flex flex-col gap-2 md:gap-3">
                                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
                                    Daftar Sekarang
                                </h1>
                                <p className="text-md text-tertiary">
                                    Daftar untuk menjadi siswa Fraise.
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <Form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                            <div className="flex flex-col gap-5">
                                <Input
                                    isRequired
                                    hideRequiredIndicator
                                    label="Nama Lengkap"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                    size="md"
                                />
                                <Input
                                    isRequired
                                    hideRequiredIndicator
                                    label="Email"
                                    type="email"
                                    name="email"
                                    placeholder="Masukkan email"
                                    size="md"
                                />
                                <Input
                                    isRequired
                                    hideRequiredIndicator
                                    label="Password"
                                    type="password"
                                    name="password"
                                    size="md"
                                    placeholder="Min. 8 karakter"
                                    minLength={8}
                                    hint="Minimal 8 karakter."
                                    onChange={setPassword}
                                />

                                {/* Password strength indicators */}
                                <div className="flex flex-col gap-2">
                                    <span className="flex items-center gap-2">
                                        <div
                                            className={cx(
                                                "flex size-4 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition-all duration-150",
                                                password.length >= 8 ? "bg-fg-success-primary" : ""
                                            )}
                                        >
                                            <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                                                <path d="M1.25 4L3.75 6.5L8.75 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="text-xs text-tertiary">Minimal 8 karakter</p>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <div
                                            className={cx(
                                                "flex size-4 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition-all duration-150",
                                                password.match(/[!@#$%^&*(),.?":{}|<>]/) ? "bg-fg-success-primary" : ""
                                            )}
                                        >
                                            <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                                                <path d="M1.25 4L3.75 6.5L8.75 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="text-xs text-tertiary">Mengandung karakter spesial</p>
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm font-medium text-red-600">{error}</p>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Daftar Sekarang
                            </Button>
                        </Form>

                        <div className="relative z-10 flex justify-center gap-1 text-center">
                            <span className="text-sm text-tertiary">Sudah punya akun?</span>
                            <Link
                                href="/login"
                                className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                            >
                                Masuk
                            </Link>
                        </div>
                    </div>
                </div>

                <footer className="hidden p-8 pt-11 lg:block">
                    <p className="text-sm text-tertiary">© Fraise {new Date().getFullYear()}</p>
                </footer>
            </div>

            {/* Right Panel - Decorative (Fixed) */}
            <div className="fixed top-0 right-0 hidden h-screen w-1/2 lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12 text-center">
                    <Image
                        src="/logo.png"
                        alt="Fraise Logo"
                        width={80}
                        height={80}
                        className="object-contain drop-shadow-2xl"
                    />
                    <Image
                        src="/title-light.png"
                        alt="Fraise"
                        width={160}
                        height={60}
                        className="object-contain drop-shadow-xl"
                    />
                    <p className="max-w-sm text-lg font-medium text-white/80">
                        Platform pembelajaran bahasa yang cerdas dan interaktif untuk Bimbel Anda.
                    </p>
                </div>
            </div>
        </section>
    );
};
