"use client";

import { ThemeToggle } from "../components/foundations/theme-toggle";
import { Badge } from "../components/base/badges/badges";
import { Button } from "../components/base/buttons/button";
import { HeroSection } from "../components/exam/hero-section";
import { PricingPlansSection } from "../components/marketing/pricing-sections/pricing-plans-section";
import { FaqSection } from "../components/marketing/faq-section";
import { Footer } from "../components/marketing/footer";
import Image from "next/image";

export const HomeScreen = () => {
    return (
        <div className="flex min-h-dvh flex-col bg-primary relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute -top-[10%] -left-[10%] size-[40%] rounded-full bg-brand-soft/20 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] size-[40%] rounded-full bg-brand-soft/20 blur-[120px]" />
            </div>

            <header className="relative mx-auto flex w-full max-w-container items-center justify-between px-4 py-6 md:px-8">
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" className="object-contain" alt="Fraise Logo" width={80} height={80} />
                    <Image src="/title-dark.png" className="object-contain dark:hidden" alt="Fraise Logo" width={100} height={100} />
                    <Image src="/title-light.png" className="object-contain hidden dark:block" alt="Fraise Logo" width={100} height={100} />
                    {/* <Badge color="success">AI Powered</Badge> */}
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button size="sm" color="secondary" href="/login">
                        Masuk
                    </Button>
                    <Button size="sm" href="/register" className="hidden sm:flex">
                        Daftar Gratis
                    </Button>
                </div>
            </header>

            <main className="relative flex flex-1 flex-col items-center">
                <HeroSection />

                {/* Pricing section with anchor */}
                <div id="pricing" className="w-full">
                    <PricingPlansSection />
                </div>

                {/* FAQ section with anchor */}
                <div id="faq" className="w-full">
                    <FaqSection />
                </div>
            </main>

            <Footer />
        </div>
    );
};
