import type { FC, HTMLAttributes, ReactNode } from "react";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface DashboardPageHeaderProps {
    /** Icon to display in the FeaturedIcon. */
    icon: FC<HTMLAttributes<HTMLOrSVGElement>>;
    /** Icon color. Defaults to "brand". */
    iconColor?: "brand" | "gray" | "success" | "warning" | "error";
    /** Page title. */
    title: string;
    /** Optional subtitle / description. */
    description?: string;
    /** Optional content rendered on the right side (e.g. action buttons). */
    actions?: ReactNode;
}

export function DashboardPageHeader({
    icon,
    iconColor = "brand",
    title,
    description,
    actions,
}: DashboardPageHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <FeaturedIcon icon={icon} color={iconColor} theme="light" size="lg" />
                <div>
                    <h1 className="text-display-xs font-semibold text-primary">{title}</h1>
                    {description && (
                        <p className="text-sm text-tertiary">{description}</p>
                    )}
                </div>
            </div>
            {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
        </div>
    );
}
