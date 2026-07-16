"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Edit01, Plus, SearchLg, Trash01 } from "@untitledui/icons";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";

// ─── Column definition ────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
    /** Unique key matching a field in the row data (or custom id). */
    key: string;
    /** Column header label. */
    label: string;
    /** Whether this column is sortable. */
    sortable?: boolean;
    /** Custom render function. If omitted, renders `row[key]` as text. */
    render?: (row: T) => ReactNode;
    /** Tooltip text for the column header. */
    tooltip?: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataTableProps<T extends { id: string }> {
    /** Table card title. */
    title: string;
    /** Optional description below the title. */
    description?: string;
    /** Optional badge next to title (e.g. row count). */
    badge?: ReactNode;
    /** Column definitions. */
    columns: DataTableColumn<T>[];
    /** Row data. */
    data: T[];
    /** Whether to show the search input. */
    searchable?: boolean;
    /** Fields to search against when searchable is true. Defaults to all string fields. */
    searchFields?: (keyof T)[];
    /** Label for the primary action button. */
    addLabel?: string;
    /** Called when the primary action button is clicked. */
    onAdd?: () => void;
    /** Called when Edit is clicked in the row actions dropdown. */
    onEdit?: (row: T) => void;
    /** Called when Delete is clicked in the row actions dropdown. */
    onDelete?: (row: T) => void;
    /** Called when a row is clicked. */
    onRowClick?: (row: T) => void;
    /** Whether to show the default row actions dropdown. */
    rowActions?: boolean;
    /** Custom trailing content in the table card header (overrides default search + add button). */
    headerTrailing?: ReactNode;
    /** Empty state content. */
    emptyState?: ReactNode;
    /** Table size. */
    size?: "sm" | "md";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T extends { id: string }>({
    title,
    description,
    badge,
    columns,
    data,
    searchable = true,
    searchFields,
    addLabel,
    onAdd,
    onEdit,
    onDelete,
    onRowClick,
    rowActions = true,
    headerTrailing,
    emptyState,
    size = "md",
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({} as SortDescriptor);

    // ── Filter ──────────────────────────────────────────────────────────────
    const filtered = search.trim()
        ? data.filter((row) => {
            const fields = searchFields ?? (Object.keys(row) as (keyof T)[]);
            return fields.some((field) => {
                const val = row[field];
                return typeof val === "string" && val.toLowerCase().includes(search.toLowerCase());
            });
        })
        : data;

    // ── Sort ────────────────────────────────────────────────────────────────
    const sorted = sortDescriptor.column
        ? [...filtered].sort((a, b) => {
            const col = sortDescriptor.column as keyof T;
            const valA = a[col];
            const valB = b[col];
            const cmp =
                typeof valA === "string" && typeof valB === "string"
                    ? valA.localeCompare(valB)
                    : (valA as number) > (valB as number)
                        ? 1
                        : -1;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        })
        : filtered;

    // ── Header trailing ─────────────────────────────────────────────────────
    const defaultHeaderTrailing = (
        <div className="flex items-center gap-3">
            {searchable && (
                <Input
                    size="sm"
                    placeholder="Cari..."
                    icon={SearchLg}
                    value={search}
                    onChange={setSearch}
                    aria-label="Cari"
                    className="w-56"
                />
            )}
            {onAdd && addLabel && (
                <Button size="sm" iconLeading={Plus} onClick={onAdd}>
                    {addLabel}
                </Button>
            )}
        </div>
    );

    return (
        <TableCard.Root size={size}>
            <TableCard.Header
                title={title}
                description={description}
                badge={badge}
                contentTrailing={headerTrailing ?? defaultHeaderTrailing}
            />

            <Table
                aria-label={title}
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
            >
                <Table.Header>
                    {columns.map((col) => (
                        <Table.Head
                            key={col.key}
                            id={col.key}
                            label={col.label}
                            tooltip={col.tooltip}
                            allowsSorting={col.sortable}
                        />
                    ))}
                    {rowActions && <Table.Head key="__actions" id="__actions" label="" />}
                </Table.Header>

                <Table.Body
                    renderEmptyState={() => (
                        <div className="flex w-full items-center justify-center p-6 text-sm text-tertiary">
                            {emptyState ?? "Tidak ada data."}
                        </div>
                    )}
                >
                    {sorted.map((row) => (
                        <Table.Row
                            key={row.id}
                            id={row.id}
                            className={onRowClick ? "cursor-pointer" : undefined}
                            onAction={onRowClick ? () => onRowClick(row) : undefined}
                        >
                            {columns.map((col) => (
                                <Table.Cell key={col.key}>
                                    {col.render
                                        ? col.render(row)
                                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                                </Table.Cell>
                            ))}
                            {rowActions && (
                                <Table.Cell>
                                    <DataTableRowActions
                                        onEdit={onEdit ? () => onEdit(row) : undefined}
                                        onDelete={onDelete ? () => onDelete(row) : undefined}
                                    />
                                </Table.Cell>
                            )}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
}

// ─── Row actions dropdown ─────────────────────────────────────────────────────

function DataTableRowActions({
    onEdit,
    onDelete,
}: {
    onEdit?: () => void;
    onDelete?: () => void;
}) {
    // No wired callbacks — use the static default
    if (!onEdit && !onDelete) return <TableRowActionsDropdown />;

    return (
        <Dropdown.Root>
            <Dropdown.DotsButton />
            <Dropdown.Popover className="w-min">
                <Dropdown.Menu>
                    {onEdit && (
                        <Dropdown.Item icon={Edit01} onAction={onEdit}>
                            <span className="pr-4">Edit</span>
                        </Dropdown.Item>
                    )}
                    {onDelete && (
                        <Dropdown.Item icon={Trash01} onAction={onDelete}>
                            <span className="pr-4">Hapus</span>
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
}
