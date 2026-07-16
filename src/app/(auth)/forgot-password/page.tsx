import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/components/auth/forgot-password-page";

export const metadata: Metadata = {
    title: "Lupa Password – Fraise",
    description: "Reset password akun Fraise Anda.",
};

export default function ForgotPasswordRoute() {
    return <ForgotPasswordPage />;
}
