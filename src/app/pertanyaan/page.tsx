import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { FaqSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = {
    title: "Pertanyaan Umum — Fraise",
    description: "Temukan jawaban atas pertanyaan yang sering diajukan seputar Fraise — platform pembuatan soal bahasa bertenaga AI.",
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
