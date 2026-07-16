"use client";

import { useState } from "react";
import { Mail01, Phone, MarkerPin01 } from "@untitledui/icons";

const CONTACT_INFO = [
    {
        icon: Mail01,
        label: "Email",
        value: "muhhjam@gmail.com",
        href: "mailto:muhhjam@gmail.com",
    },
    {
        icon: Phone,
        label: "WhatsApp",
        value: "081257578571",
        href: "https://wa.me/6281257578571",
    },
    {
        icon: MarkerPin01,
        label: "Lokasi",
        value: "Bandung, Indonesia",
        href: null,
    },
];

const SOCIAL_LINKS = [
    {
        label: "WhatsApp",
        href: "https://wa.me/6281257578571",
        icon: (
            <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/kodingkeliling/",
        icon: (
            <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
    },
    {
        label: "GitHub",
        href: "https://github.com/muhjam",
        icon: (
            <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        ),
    },
    {
        label: "Email",
        href: "mailto:muhhjam@gmail.com",
        icon: (
            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

type FormState = "idle" | "loading" | "success" | "error";

export const ContactSection = () => {
    const [formState, setFormState] = useState<FormState>("idle");
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("loading");

        // Simulate sending (replace with actual API call)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setFormState("success");
            setForm({ name: "", email: "", message: "" });
        } catch {
            setFormState("error");
        }
    };

    return (
        <section className="w-full py-12 md:py-16">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                {/* Heading */}
                <div className="reveal flex flex-col items-center gap-3 text-center mb-12">
                    <h2 className="text-display-sm font-semibold text-primary md:text-display-md">Hubungi Kami</h2>
                    <div className="h-1 w-16 rounded-full bg-brand-500" />
                    <p className="text-md text-tertiary max-w-md mt-1">
                        Punya pertanyaan atau ingin berkolaborasi? Kami siap membantu kamu.
                    </p>
                </div>

                <div className="reveal delay-1 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Left: Form */}
                    <div className="rounded-2xl border border-secondary bg-primary p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg font-semibold text-primary mb-6">Kirim Pesan</h3>

                        {formState === "success" ? (
                            <div className="flex flex-col items-center gap-4 py-10 text-center">
                                <div className="flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                                    <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-primary">Pesan terkirim!</p>
                                    <p className="text-sm text-tertiary mt-1">Kami akan membalas dalam 1×24 jam.</p>
                                </div>
                                <button
                                    onClick={() => setFormState("idle")}
                                    className="text-sm font-semibold text-brand-700 hover:underline"
                                >
                                    Kirim pesan lain
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-secondary">
                                        Nama <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        placeholder="Nama lengkap kamu"
                                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-sm text-primary placeholder:text-quaternary outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-secondary">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                        placeholder="email@kamu.com"
                                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-sm text-primary placeholder:text-quaternary outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-secondary">
                                        Pesan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                        placeholder="Tulis pesanmu di sini..."
                                        className="w-full rounded-xl border border-secondary bg-primary px-4 py-3 text-sm text-primary placeholder:text-quaternary outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors resize-none"
                                    />
                                </div>

                                {formState === "error" && (
                                    <p className="text-sm text-red-600">Gagal mengirim pesan. Silakan coba lagi.</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={formState === "loading"}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 transition-colors"
                                >
                                    {formState === "loading" ? (
                                        <>
                                            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            Kirim Pesan
                                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Right: Contact info */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-semibold text-primary">Informasi Kontak</h3>
                            <p className="text-sm text-tertiary">
                                Jangan ragu untuk menghubungi kami kapan saja. Kami dengan senang hati akan membantu.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {CONTACT_INFO.map((item) => {
                                const Icon = item.icon;
                                const content = (
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                            <Icon className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-primary">{item.label}</p>
                                            <p className="text-sm text-tertiary">{item.value}</p>
                                        </div>
                                    </div>
                                );

                                return item.href ? (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target={item.href.startsWith("http") ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        className="group hover:opacity-80 transition-opacity"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div key={item.label}>{content}</div>
                                );
                            })}
                        </div>

                        <div className="border-t border-secondary pt-6">
                            <p className="text-sm font-semibold text-primary mb-4">Ikuti Kami</p>
                            <div className="flex items-center gap-4">
                                {SOCIAL_LINKS.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="flex size-10 items-center justify-center rounded-xl border border-secondary text-tertiary hover:text-primary hover:border-primary transition-colors"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
