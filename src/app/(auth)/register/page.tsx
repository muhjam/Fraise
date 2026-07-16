import type { Metadata } from "next";
import { RegisterPage } from "@/components/auth/register-page";

export const metadata: Metadata = {
    title: "Daftar – Fraise",
    description: "Buat akun Fraise dan mulai perjalanan belajar bahasa Anda.",
};

export default function RegisterRoute() {
    return <RegisterPage />;
}
