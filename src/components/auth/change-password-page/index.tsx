"use client";

import { useState } from "react";
import { Lock01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

interface ChangePasswordPageProps {
    onSuccess?: () => void;
}

export const ChangePasswordPage = ({ onSuccess }: ChangePasswordPageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const currentPassword = formData.get("currentPassword") as string;
        const newPwd = formData.get("newPassword") as string;
        const confirmPwd = formData.get("confirmPassword") as string;

        if (newPwd !== confirmPwd) {
            setError("Password baru tidak cocok");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword: newPwd }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Failed to change password");
                return;
            }

            setSuccess(true);
            onSuccess?.();
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-success-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-success-600">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <p className="text-lg font-semibold text-primary">Password Berhasil Diubah!</p>
                <p className="text-sm text-tertiary">Gunakan password baru Anda untuk login berikutnya.</p>
                <Button size="md" color="secondary" onClick={() => setSuccess(false)}>
                    Ubah password lagi
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <FeaturedIcon color="gray" theme="modern" size="md">
                    <Lock01 className="size-5" />
                </FeaturedIcon>
                <div>
                    <h2 className="text-lg font-semibold text-primary">Ubah Password</h2>
                    <p className="text-sm text-tertiary">Perbarui password akun Anda.</p>
                </div>
            </div>

            <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                    isRequired
                    hideRequiredIndicator
                    label="Password Saat Ini"
                    type="password"
                    name="currentPassword"
                    placeholder="••••••••"
                    size="md"
                />
                <Input
                    isRequired
                    hideRequiredIndicator
                    label="Password Baru"
                    type="password"
                    name="newPassword"
                    placeholder="Min. 8 karakter"
                    size="md"
                    minLength={8}
                    onChange={setNewPassword}
                />
                <Input
                    isRequired
                    hideRequiredIndicator
                    label="Konfirmasi Password Baru"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    size="md"
                    validate={(value) => value === newPassword || "Password tidak cocok"}
                />

                {/* Password strength */}
                <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2">
                        <div className={cx(
                            "flex size-4 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition-all duration-150",
                            newPassword.length >= 8 ? "bg-fg-success-primary" : ""
                        )}>
                            <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                                <path d="M1.25 4L3.75 6.5L8.75 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-xs text-tertiary">Minimal 8 karakter</p>
                    </span>
                </div>

                {error && (
                    <p className="text-sm font-medium text-red-600">{error}</p>
                )}

                <Button type="submit" size="md" isLoading={isLoading} disabled={isLoading}>
                    Simpan Perubahan
                </Button>
            </Form>
        </div>
    );
};
