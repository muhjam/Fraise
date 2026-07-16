import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordPage } from "@/components/auth/reset-password-page";

export const metadata: Metadata = {
    title: "Reset Password – GatrAI",
    description: "Buat password baru untuk akun GatrAI Anda.",
};

export default function ResetPasswordRoute() {
    return (
        <Suspense>
            <ResetPasswordPage />
        </Suspense>
    );
}
