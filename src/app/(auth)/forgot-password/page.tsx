import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/components/auth/forgot-password-page";

export const metadata: Metadata = {
    title: "Lupa Password – GatrAI",
    description: "Reset password akun GatrAI Anda.",
};

export default function ForgotPasswordRoute() {
    return <ForgotPasswordPage />;
}
