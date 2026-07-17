"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { FeaturedCardProgressBar } from "@/components/application/app-navigation/base-components/featured-cards";
import { Settings01 } from "@untitledui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

export default function SettingsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");

    const handleSave = () => {
        // Simple mock save for now
        alert("Pengaturan disimpan!");
    };

    return (
        <div className="flex max-w-xl flex-col gap-8">
            <DashboardPageHeader
                icon={Settings01}
                title="Pengaturan Profil"
                description="Kelola informasi akun dan kata sandi Anda di sini."
            />

            <div className="flex flex-col gap-6 rounded-xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-secondary">
                        Email Address
                    </label>
                    <Input id="email" type="email" value={user?.email || ""} isReadOnly />
                    <p className="text-xs text-tertiary">Alamat email tidak dapat diubah.</p>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-secondary">
                        Nama Lengkap
                    </label>
                    <Input id="name" type="text" value={name} onChange={setName} />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-secondary">
                        Kata Sandi Baru
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="Biarkan kosong jika tidak merubah"
                    />
                </div>

                <div className="mt-2 text-right">
                    <Button color="primary" onClick={handleSave}>
                        Simpan Perubahan
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                <h3 className="text-lg font-semibold text-primary">Token Anda</h3>
                <FeaturedCardProgressBar
                    title="Penggunaan Token"
                    description="Anda telah menggunakan 80% dari token ujian bulan ini. Dapatkan akses unlimited sekarang."
                    confirmLabel="Upgrade Paket"
                    progress={80}
                    onDismiss={() => { }}
                    onConfirm={() => {
                        router.push("/pricing");
                    }}
                />
            </div>
        </div>
    );
}
