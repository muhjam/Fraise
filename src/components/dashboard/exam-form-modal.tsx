"use client";

import { useEffect, useState } from "react";
import { Heading as AriaHeading, DialogTrigger as AriaDialogTrigger } from "react-aria-components";
import { LayoutAlt01 } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { useDashboardStore, type DashboardExam } from "@/store/use-dashboard-store";
import type { SkillType } from "@/store/use-exam-store";

const SKILL_OPTIONS: { id: SkillType; label: string }[] = [
    { id: "Reading", label: "Reading" },
    { id: "Writing", label: "Writing" },
    { id: "Speaking", label: "Speaking" },
    { id: "Listening", label: "Listening" },
];

const STATUS_OPTIONS: { id: DashboardExam["status"]; label: string }[] = [
    { id: "draft", label: "Draft" },
    { id: "active", label: "Aktif" },
    { id: "closed", label: "Ditutup" },
];

interface ExamFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: DashboardExam | null;
}

export const ExamFormModal = ({ isOpen, onClose, initialData }: ExamFormModalProps) => {
    const { createExam, updateExam, questions } = useDashboardStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [status, setStatus] = useState<DashboardExam["status"]>("draft");
    const [selectedSkills, setSelectedSkills] = useState<SkillType[]>([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

    // Populate form when editing
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setLanguage(initialData.language);
            setStatus(initialData.status);
            setSelectedSkills(initialData.skills);
            setSelectedQuestionIds(initialData.questionIds);
        } else {
            setTitle("");
            setDescription("");
            setLanguage("");
            setStatus("draft");
            setSelectedSkills([]);
            setSelectedQuestionIds([]);
        }
    }, [initialData, isOpen]);

    const toggleSkill = (skill: SkillType) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const toggleQuestion = (id: string) => {
        setSelectedQuestionIds((prev) =>
            prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (!title.trim()) return;
        const payload = {
            title: title.trim(),
            description: description.trim(),
            language: language.trim(),
            skills: selectedSkills,
            questionIds: selectedQuestionIds,
            invitees: initialData?.invitees ?? [],
            status,
        };
        if (initialData) {
            updateExam(initialData.id, payload);
        } else {
            createExam(payload);
        }
        onClose();
    };

    return (
        <AriaDialogTrigger isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <ModalOverlay isDismissable>
                <Modal className="sm:max-w-lg">
                    <Dialog>
                        <div className="w-full rounded-xl bg-primary shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 p-6 pb-0">
                                <div className="flex items-start gap-4">
                                    <FeaturedIcon color="brand" theme="light" size="md" icon={LayoutAlt01} />
                                    <div>
                                        <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                            {initialData ? "Edit Ujian" : "Buat Ujian Baru"}
                                        </AriaHeading>
                                        <p className="text-sm text-tertiary">Isi detail ujian di bawah ini.</p>
                                    </div>
                                </div>
                                <CloseButton onClick={onClose} size="sm" />
                            </div>

                            {/* Form */}
                            <div className="flex flex-col gap-4 p-6">
                                <Input
                                    size="md"
                                    label="Judul Ujian"
                                    placeholder="Contoh: Ujian Bahasa Inggris Level 1"
                                    value={title}
                                    onChange={setTitle}
                                    isRequired
                                />
                                <Input
                                    size="md"
                                    label="Deskripsi"
                                    placeholder="Deskripsi singkat ujian (opsional)"
                                    value={description}
                                    onChange={setDescription}
                                />
                                <Input
                                    size="md"
                                    label="Bahasa"
                                    placeholder="Contoh: English, Indonesian"
                                    value={language}
                                    onChange={setLanguage}
                                />

                                {/* Skills */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-primary">Skills</span>
                                    <div className="flex flex-wrap gap-2">
                                        {SKILL_OPTIONS.map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => toggleSkill(s.id)}
                                                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                                                    selectedSkills.includes(s.id)
                                                        ? "bg-brand-600 text-white"
                                                        : "bg-secondary text-secondary hover:bg-secondary_hover"
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Status */}
                                <Select
                                    label="Status"
                                    size="md"
                                    items={STATUS_OPTIONS}
                                    selectedKey={status}
                                    onSelectionChange={(key) => setStatus(key as DashboardExam["status"])}
                                >
                                    {(item) => (
                                        <Select.Item key={item.id} id={item.id}>
                                            {item.label}
                                        </Select.Item>
                                    )}
                                </Select>

                                {/* Question picker */}
                                {questions.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-primary">
                                            Pilih Soal ({selectedQuestionIds.length} dipilih)
                                        </span>
                                        <div className="max-h-48 overflow-y-auto rounded-lg border border-secondary">
                                            {questions.map((q) => (
                                                <button
                                                    key={q.id}
                                                    type="button"
                                                    onClick={() => toggleQuestion(q.id)}
                                                    className={`flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors border-b border-secondary last:border-0 ${
                                                        selectedQuestionIds.includes(q.id)
                                                            ? "bg-brand-50 dark:bg-brand-950/20"
                                                            : "hover:bg-secondary"
                                                    }`}
                                                >
                                                    <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${
                                                        selectedQuestionIds.includes(q.id)
                                                            ? "border-brand-600 bg-brand-600 text-white"
                                                            : "border-secondary"
                                                    }`}>
                                                        {selectedQuestionIds.includes(q.id) && (
                                                            <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                                                                <path d="M1.25 4L3.75 6.5L8.75 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        )}
                                                    </span>
                                                    <div className="flex flex-col gap-0.5 min-w-0">
                                                        <span className="line-clamp-1 text-secondary">{q.description}</span>
                                                        <span className="text-xs text-tertiary">{q.skill} · {q.language}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
                                <Button size="md" color="secondary" onClick={onClose}>
                                    Batal
                                </Button>
                                <Button size="md" onClick={handleSave} disabled={!title.trim()}>
                                    {initialData ? "Simpan Perubahan" : "Buat Ujian"}
                                </Button>
                            </div>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </AriaDialogTrigger>
    );
};
