"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClockRewind, Trash01, Clock, Calendar, CheckCircle, Play, ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { useExamStore, ExamAttempt } from "@/store/use-exam-store";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { cx } from "@/utils/cx";

export const HistorySlideout = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { exams, deleteExam } = useExamStore();

    const handleAction = (exam: ExamAttempt) => {
        if (exam.status === "completed") {
            router.push(`/result/${exam.id}`);
        } else {
            router.push(`/playground/${exam.id}`);
        }
        setIsOpen(false);
    };

    return (
        <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button size="sm" color="secondary" iconLeading={ClockRewind} aria-label="View History" />
            <SlideoutMenu isDismissable className="z-[9999]">
                <SlideoutMenu.Header onClose={() => setIsOpen(false)} className="flex items-center gap-2">
                    <ClockRewind className="size-5" />
                    <h2 className="text-lg font-semibold text-primary">History</h2>
                </SlideoutMenu.Header>
                <SlideoutMenu.Content className="sm:p-6">
                    {exams.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                            <div className="rounded-full bg-secondary/50 p-4 mb-4">
                                <Clock className="size-8 text-tertiary" />
                            </div>
                            <p className="text-sm text-tertiary">No history yet</p>
                            <p className="text-xs text-tertiary mt-1">Start a test to see your history here</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-sm text-tertiary">{exams.length} attempts</span>
                            </div>
                            {exams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="group relative flex flex-col gap-3 rounded-xl border border-secondary bg-primary p-4 shadow-xs transition-shadow hover:shadow-md sm:gap-4 sm:p-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className={cx(
                                                "flex size-8 items-center justify-center rounded-lg",
                                                exam.status === "completed" ? "bg-success-100 text-success-600" : "bg-brand-100 text-brand-600"
                                            )}>
                                                {exam.status === "completed" ? <CheckCircle className="size-4" /> : <Play className="size-4" />}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <h3 className="text-sm font-semibold text-primary">
                                                    {exam.config.questionCount} Questions ({exam.config.skills.join(", ")})
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-tertiary">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="size-3" />
                                                        {new Date(exam.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="size-3" />
                                                        {new Date(exam.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
                                        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-1 rounded-md inline-block w-fit">
                                            {exam.config.language}
                                        </span>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <Button
                                                size="sm"
                                                color="secondary"
                                                iconLeading={Trash01}
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    deleteExam(exam.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 sm:w-auto"
                                            />
                                            <Button
                                                size="sm"
                                                color={exam.status === "completed" ? "secondary" : "primary"}
                                                iconTrailing={ArrowRight}
                                                onClick={() => handleAction(exam)}
                                                className="flex-1 sm:flex-none w-full sm:w-auto"
                                            >
                                                {exam.status === "completed" ? "View" : "Continue"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SlideoutMenu.Content>
            </SlideoutMenu>
        </SlideoutMenu.Trigger>
    );
};
