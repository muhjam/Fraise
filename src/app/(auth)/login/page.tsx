import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/login-page";
import { APP_NAME } from "@/config";

export const metadata: Metadata = {
    title: `Masuk – ${APP_NAME}`,
    description: `Masuk ke akun ${APP_NAME} Anda.`,
};

export default function Page() {
    return (
        <Suspense>
            <LoginPage />
        </Suspense>
    );
}
