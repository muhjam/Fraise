import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/login-page";

export const metadata: Metadata = {
    title: "Masuk – Fraise",
    description: "Masuk ke akun Fraise Anda.",
};

export default function Page() {
    return (
        <Suspense>
            <LoginPage />
        </Suspense>
    );
}
