"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";
import { useAuthStore } from "@/store/use-auth-store";

export const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setUser = useAuthStore((state) => state.setUser);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetSuccess = searchParams.get("reset") === "success";
    const redirectTo = searchParams.get("redirect") ?? "/";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Login gagal. Periksa email dan password Anda.");
                return;
            }

            setUser(data.user);
            router.push(redirectTo);
        } catch {
            setError("Terjadi kesalahan. Silakan coba lagi.");
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
                                    Selamat datang kembali
                                </h1>
                                <p className="text-md text-tertiary">
                                    Masuk ke akun Fraise Anda untuk melanjutkan.
                                </p>
                            </div>
                        </div>

                        {/* Success message after password reset */}
                        {resetSuccess && (
                            <div className="z-10 rounded-xl border border-success-200 bg-success-50 p-4 dark:border-success-800 dark:bg-success-900/20">
                                <p className="text-sm font-medium text-success-700 dark:text-success-400">
                                    ✅ Password berhasil diubah. Silakan login dengan password baru Anda.
                                </p>
                            </div>
                        )}

                        {/* Login Form */}
                        <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-5">
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
                                    placeholder="••••••••"
                                />
                                <div className="flex justify-end">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                                    >
                                        Lupa password?
                                    </Link>
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
                                Masuk
                            </Button>
                        </Form>

                        <div className="relative z-10 flex justify-center gap-1 text-center">
                            <span className="text-sm text-tertiary">Belum punya akun?</span>
                            <Link
                                href="/register"
                                className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                            >
                                Daftar sekarang
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
                        Buat soal latihan bahasa yang dipersonalisasi dalam hitungan detik menggunakan kecerdasan buatan.
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-white/60">
                        <span>✓ 14+ bahasa tersedia</span>
                        <span>✓ Soal selalu unik</span>
                        <span>✓ Reading, Writing, Speaking, Listening</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
