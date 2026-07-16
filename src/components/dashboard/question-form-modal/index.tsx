"use client";

import { useEffect, useState } from "react";
import { Heading as AriaHeading, DialogTrigger as AriaDialogTrigger } from "react-aria-components";
import { BookOpen01 } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { useDashboardStore, type DashboardQuestion } from "@/store/use-dashboard-store";
import type { SkillType } from "@/store/use-exam-store";

const SKILL_OPTIONS: { id: SkillType; label: string }[] = [
    { id: "Reading", label: "Reading" },
    { id: "Writing", label: "Writing" },
    { id: "Speaking", label: "Speaking" },
    { id: "Listening", label: "Listening" },
];

interface QuestionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: DashboardQuestion | null;
}

export const QuestionFormModal = ({ isOpen, onClose, initialData }: QuestionFormModalProps) => {
    const { createQuestion, updateQuestion } = useDashboardStore();

    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [skill, setSkill] = useState<SkillType>("Reading");
    const [answer, setAnswer] = useState("");
    const [isMultipleChoice, setIsMultipleChoice] = useState(false);
    const [options, setOptions] = useState(["", "", "", ""]);

    useEffect(() => {
        if (initialData) {
            setDescription(initialData.description);
            setLanguage(initialData.language);
            setSkill(initialData.skill);
            setAnswer(initialData.answer);
            setIsMultipleChoice(!!initialData.options);
            setOptions(initialData.options ?? ["", "", "", ""]);
        } else {
            setDescription("");
            setLanguage("");
            setSkill("Reading");
            setAnswer("");
            setIsMultipleChoice(false);
            setOptions(["", "", "", ""]);
        }
    }, [initialData, isOpen]);

    const handleOptionChange = (index: number, value: string) => {
        setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
    };

    const handleSave = () => {
        if (!description.trim() || !answer.trim()) return;
        const payload = {
            description: description.trim(),
            language: language.trim(),
            skill,
            answer: answer.trim(),
            options: isMultipleChoice ? options.filter((o) => o.trim()) : null,
        };
        if (initialData) {
            updateQuestion(initialData.id, payload);
        } else {
            createQuestion(payload);
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
                                    <FeaturedIcon color="brand" theme="light" size="md" icon={BookOpen01} />
                                    <div>
                                        <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                            {initialData ? "Edit Soal" : "Tambah Soal Baru"}
                                        </AriaHeading>
                                        <p className="text-sm text-tertiary">Isi detail soal di bawah ini.</p>
                                    </div>
                                </div>
                                <CloseButton onClick={onClose} size="sm" />
                            </div>

                            {/* Form */}
                            <div className="flex flex-col gap-4 p-6">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-primary">Pertanyaan</span>
                                    <textarea
                                        className="min-h-24 w-full resize-y rounded-lg border border-secondary bg-primary px-3.5 py-3 text-sm text-primary placeholder:text-placeholder outline-none ring-1 ring-primary transition focus:ring-2 focus:ring-brand-500"
                                        placeholder="Tulis pertanyaan di sini..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        size="md"
                                        label="Bahasa"
                                        placeholder="Contoh: English"
                                        value={language}
                                        onChange={setLanguage}
                                    />
                                    <Select
                                        label="Skill"
                                        size="md"
                                        items={SKILL_OPTIONS}
                                        selectedKey={skill}
                                        onSelectionChange={(key) => setSkill(key as SkillType)}
                                    >
                                        {(item) => (
                                            <Select.Item key={item.id} id={item.id}>
                                                {item.label}
                                            </Select.Item>
                                        )}
                                    </Select>
                                </div>

                                {/* Type toggle */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-primary">Tipe Soal:</span>
                                    <div className="flex rounded-lg overflow-hidden ring-1 ring-secondary">
                                        <button
                                            type="button"
                                            onClick={() => setIsMultipleChoice(false)}
                                            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                                !isMultipleChoice ? "bg-brand-600 text-white" : "bg-primary text-secondary hover:bg-secondary"
                                            }`}
                                        >
                                            Essay
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsMultipleChoice(true)}
                                            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                                isMultipleChoice ? "bg-brand-600 text-white" : "bg-primary text-secondary hover:bg-secondary"
                                            }`}
                                        >
                                            Pilihan Ganda
                                        </button>
                                    </div>
                                </div>

                                {/* Multiple choice options */}
                                {isMultipleChoice && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-primary">Pilihan Jawaban</span>
                                        {options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className="w-5 shrink-0 text-center text-sm font-semibold text-tertiary">
                                                    {String.fromCharCode(65 + i)}.
                                                </span>
                                                <input
                                                    type="text"
                                                    className="flex-1 rounded-lg border border-secondary bg-primary px-3.5 py-2 text-sm text-primary placeholder:text-placeholder outline-none ring-1 ring-primary transition focus:ring-2 focus:ring-brand-500"
                                                    placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Input
                                    size="md"
                                    label="Kunci Jawaban"
                                    placeholder={isMultipleChoice ? "Tulis pilihan yang benar, e.g. A atau teks lengkapnya" : "Tulis jawaban benar"}
                                    value={answer}
                                    onChange={setAnswer}
                                    isRequired
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
                                <Button size="md" color="secondary" onClick={onClose}>
                                    Batal
                                </Button>
                                <Button
                                    size="md"
                                    onClick={handleSave}
                                    disabled={!description.trim() || !answer.trim()}
                                >
                                    {initialData ? "Simpan Perubahan" : "Tambah Soal"}
                                </Button>
                            </div>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </AriaDialogTrigger>
    );
};
