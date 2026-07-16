import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { FaqSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = {
    title: "Pertanyaan Umum — GatrAI",
    description: "Temukan jawaban atas pertanyaan yang sering diajukan seputar GatrAI — platform pembuatan soal bahasa bertenaga AI.",
};

export default function PertanyaanPage() {
    return (
        <PageLayout>
            <div className="w-full animate-[fadeSlideUp_0.7s_ease-out_0.1s_both]">
                <FaqSection />
            </div>
        </PageLayout>
    );
}
