"use client";

import { useState } from "react";
import { Heading as AriaHeading, DialogTrigger as AriaDialogTrigger } from "react-aria-components";
import { Mail01, UserPlus01 } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { useDashboardStore } from "@/store/use-dashboard-store";

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    examId: string;
}

export const InviteModal = ({ isOpen, onClose, examId }: InviteModalProps) => {
    const { inviteToExam } = useDashboardStore();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleInvite = () => {
        if (!email.trim()) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Format email tidak valid.");
            return;
        }
        inviteToExam(examId, email.trim());
        setEmail("");
        setError(null);
        onClose();
    };

    const handleClose = () => {
        setEmail("");
        setError(null);
        onClose();
    };

    return (
        <AriaDialogTrigger isOpen={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <ModalOverlay isDismissable>
                <Modal className="sm:max-w-md">
                    <Dialog>
                        <div className="w-full rounded-xl bg-primary shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 p-6 pb-0">
                                <div className="flex items-start gap-4">
                                    <FeaturedIcon color="brand" theme="light" size="md" icon={UserPlus01} />
                                    <div>
                                        <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                            Undang Peserta
                                        </AriaHeading>
                                        <p className="text-sm text-tertiary">
                                            Masukkan email peserta yang ingin diundang ke ujian ini.
                                        </p>
                                    </div>
                                </div>
                                <CloseButton onClick={handleClose} size="sm" />
                            </div>

                            {/* Form */}
                            <div className="flex flex-col gap-4 p-6">
                                <Input
                                    size="md"
                                    label="Email Peserta"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(v) => { setEmail(v); setError(null); }}
                                    icon={Mail01}
                                    hint={error ?? undefined}
                                    isInvalid={!!error}
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
                                <Button size="md" color="secondary" onClick={handleClose}>
                                    Batal
                                </Button>
                                <Button
                                    size="md"
                                    iconLeading={UserPlus01}
                                    onClick={handleInvite}
                                    disabled={!email.trim()}
                                >
                                    Kirim Undangan
                                </Button>
                            </div>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </AriaDialogTrigger>
    );
};
