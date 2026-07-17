"use client";

import { useEffect, useState, useCallback } from "react";
import { Users01, Edit01, CheckCircle, XCircle } from "@untitledui/icons";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { PLANS } from "@/data/plans";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    planId: string | null;
    planStartDate: string | null;
    planEndDate: string | null;
    isVerified: boolean;
    createdAt: string;
}

// ─── Plan edit slideout ───────────────────────────────────────────────────────

function EditPlanPanel({
    user,
    onClose,
    onSaved,
}: {
    user: UserRow;
    onClose: () => void;
    onSaved: (updated: UserRow) => void;
}) {
    const [planId, setPlanId] = useState<string>(user.planId ?? "");
    const [startDate, setStartDate] = useState<DateValue | null>(
        user.planStartDate ? parseDate(user.planStartDate.slice(0, 10)) : null
    );
    const [endDate, setEndDate] = useState<DateValue | null>(
        user.planEndDate ? parseDate(user.planEndDate.slice(0, 10)) : null
    );
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toISOString = (d: DateValue | null) =>
        d ? `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}` : null;

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    planId: planId || null,
                    planStartDate: toISOString(startDate),
                    planEndDate: toISOString(endDate),
                }),
            });
            if (!res.ok) throw new Error("Gagal menyimpan perubahan.");
            const data = await res.json();
            onSaved({ ...user, ...data.user });
        } catch (e: any) {
            setError(e.message ?? "Terjadi kesalahan.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        /* Overlay */
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm">
            {/* Panel */}
            <div className="flex h-full w-full max-w-md flex-col gap-0 bg-primary shadow-2xl ring-1 ring-secondary overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-secondary px-6 py-5">
                    <div className="flex items-center gap-3">
                        <FeaturedIcon icon={Edit01} color="brand" theme="light" size="md" />
                        <div>
                            <p className="text-sm font-semibold text-primary">Atur Paket User</p>
                            <p className="text-xs text-tertiary truncate max-w-[220px]">{user.email}</p>
                        </div>
                    </div>
                    <Button color="tertiary" size="sm" onClick={onClose}>
                        Tutup
                    </Button>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-6 p-6">
                    {/* Plan selector */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Paket</Label>
                        <Select
                            selectedKey={planId}
                            onSelectionChange={(k) => setPlanId(k as string)}
                            placeholder="Pilih paket..."
                        >
                            <Select.Item key="" id="" label="Tidak ada paket">
                                Tidak ada paket
                            </Select.Item>
                            {PLANS.map((p) => (
                                <Select.Item key={p.id} id={p.id} label={p.name}>
                                    {p.name}
                                </Select.Item>
                            ))}
                        </Select>
                    </div>

                    {/* Start date */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Tanggal Mulai</Label>
                        <DatePicker
                            value={startDate}
                            onChange={setStartDate}
                            onApply={() => {}}
                            onCancel={() => setStartDate(null)}
                            fullWidth
                            placeholder="Pilih tanggal mulai"
                        />
                    </div>

                    {/* End date */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Tanggal Kadaluwarsa</Label>
                        <DatePicker
                            value={endDate}
                            onChange={setEndDate}
                            onApply={() => {}}
                            onCancel={() => setEndDate(null)}
                            fullWidth
                            placeholder="Pilih tanggal kadaluwarsa"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-error-primary">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex gap-3 border-t border-secondary px-6 py-5">
                    <Button color="secondary" size="md" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button size="md" onClick={handleSave} isLoading={isSaving} className="flex-1">
                        Simpan
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── Column helpers ───────────────────────────────────────────────────────────

function PlanBadge({ planId }: { planId: string | null }) {
    if (!planId) {
        return <span className="text-sm text-quaternary">—</span>;
    }
    const plan = PLANS.find((p) => p.id === planId);
    return (
        <Badge size="sm" type="pill-color" color="brand">
            {plan?.name ?? planId}
        </Badge>
    );
}

function PlanDateRange({ start, end }: { start: string | null; end: string | null }) {
    if (!start && !end) return <span className="text-sm text-quaternary">—</span>;
    const fmt = (d: string | null) =>
        d
            ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
            : "—";
    const isExpired = end ? new Date(end) < new Date() : false;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-tertiary">{fmt(start)} → {fmt(end)}</span>
            {isExpired && (
                <Badge size="sm" type="pill-color" color="error">Kadaluwarsa</Badge>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<UserRow | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSaved = (updated: UserRow) => {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setEditingUser(null);
    };

    const COLUMNS = [
        {
            key: "name",
            label: "Nama",
            sortable: true,
            render: (row: UserRow) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-primary">{row.name || "—"}</span>
                    <span className="text-xs text-tertiary">{row.email}</span>
                </div>
            ),
        },
        {
            key: "role",
            label: "Role",
            render: (row: UserRow) => (
                <Badge
                    size="sm"
                    type="pill-color"
                    color={row.role === "SUPER_ADMIN" ? "error" : "gray"}
                >
                    {row.role === "SUPER_ADMIN" ? "Admin" : "User"}
                </Badge>
            ),
        },
        {
            key: "isVerified",
            label: "Terverifikasi",
            render: (row: UserRow) =>
                row.isVerified ? (
                    <CheckCircle className="size-4 text-success-500" />
                ) : (
                    <XCircle className="size-4 text-error-500" />
                ),
        },
        {
            key: "planId",
            label: "Paket",
            render: (row: UserRow) => <PlanBadge planId={row.planId} />,
        },
        {
            key: "planEndDate",
            label: "Masa Aktif",
            render: (row: UserRow) => (
                <PlanDateRange start={row.planStartDate} end={row.planEndDate} />
            ),
        },
        {
            key: "createdAt",
            label: "Bergabung",
            sortable: true,
            render: (row: UserRow) => (
                <span className="text-sm text-tertiary">
                    {new Date(row.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
            ),
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-8">
                <DashboardPageHeader
                    icon={Users01}
                    title="Manajemen User"
                    description="Kelola paket langganan dan masa aktif tiap user."
                />

                <DataTable
                    title="Daftar User"
                    description="Semua user terdaftar"
                    badge={users.length}
                    columns={COLUMNS}
                    data={users}
                    searchable
                    searchFields={["name", "email"]}
                    rowActions={true}
                    onEdit={(row) => setEditingUser(row)}
                    emptyState={
                        isLoading ? (
                            <span className="text-sm text-tertiary">Memuat data...</span>
                        ) : (
                            <span className="text-sm text-tertiary">Belum ada user.</span>
                        )
                    }
                />
            </div>

            {/* Edit plan panel */}
            {editingUser && (
                <EditPlanPanel
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSaved={handleSaved}
                />
            )}
        </>
    );
}
