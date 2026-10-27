"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/app/lib/cn";
import { Skeleton, EmptyState } from "@/app/components/ui";
import Pagination from "./Pagination";
import type { TableColumn, TableProps } from "./types";

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function MinusIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15" />
    </svg>
  );
}

function RowCheckbox({ checked, indeterminate, onClick, label }: { checked: boolean; indeterminate?: boolean; onClick: (e: React.MouseEvent) => void; label: string }) {
  return (
    <div
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border transition-all",
        checked || indeterminate ? "bg-emerald-600 border-emerald-600" : "border-slate-300 hover:border-emerald-400",
      )}
    >
      {checked && <CheckIcon className="w-3 h-3 text-white" />}
      {!checked && indeterminate && <MinusIcon className="w-3 h-3 text-white" />}
    </div>
  );
}

export default function Table<T extends { id: string | number }>(props: TableProps<T>) {
  const {
    variant = "default",
    data,
    columns,
    loading = false,
    emptyMessage = "No data found.",
    emptyAction,
    onRowSelect,
    selectable = false,
    actions = [],
    className = "",
    rowClassName,
    onRowClick,
    getRowHref,
    isPaginated = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    hasHeaders = true,
    paginationClassName,
    clearSelectionTrigger,
  } = props;

  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedItems(new Set());
  }, [clearSelectionTrigger]);

  useEffect(() => {
    if (!openDropdownId) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLElement)) {
        setOpenDropdownId(null);
      }
    }
    const id = setTimeout(() => document.addEventListener("click", handleClickOutside), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdownId]);

  useEffect(() => {
    onRowSelect?.((data ?? []).filter((item) => selectedItems.has(item.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const total = data?.length ?? 0;
  const selectedCount = selectedItems.size;
  const allSelected = total > 0 && selectedCount === total;
  const someSelected = selectedCount > 0 && selectedCount < total;

  function toggleAll() {
    setSelectedItems(allSelected || someSelected ? new Set() : new Set((data ?? []).map((d) => d.id)));
  }

  function toggleItem(id: string | number) {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function renderCell(column: TableColumn<T>, item: T, index: number) {
    if (column.render) return column.render(item, index);
    const value = column.key.split(".").reduce((obj: any, key) => obj?.[key], item as any);
    return value ?? "—";
  }

  const extraCols = (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0);

  if (loading) {
    return (
      <div className={cn("bg-white rounded-6xl border border-slate-100 overflow-hidden", className)}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {hasHeaders && (
              <thead className="bg-slate-50/50 border-b border-slate-50">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className="text-left px-8 py-5">
                      <Skeleton className="h-3 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-50">
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((c) => (
                    <td key={c.key} className="px-8 py-5">
                      <Skeleton className="h-4 w-full max-w-40" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={className}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {hasHeaders && (
              <thead>
                <tr className="border-b border-slate-100">
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className="text-left text-caption text-slate-400 py-3 pr-6 first:pl-0"
                      style={{ width: c.width, fontSize: "10px" }}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-50">
              {!data?.length ? (
                <tr>
                  <td colSpan={columns.length} className="py-10 text-center">
                    <EmptyState message={emptyMessage} action={emptyAction} className="py-0" />
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id}>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={c.className ?? "py-4 pr-6 text-sm font-normal text-slate-600 first:pl-0"}
                        style={{ width: c.width }}
                      >
                        {renderCell(c, item, index)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "bg-white border border-slate-100 overflow-hidden shadow-2xl shadow-slate-900/2",
          isPaginated ? "rounded-t-3xl sm:rounded-t-6xl" : "rounded-3xl sm:rounded-6xl",
          className,
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            {hasHeaders && (
              <thead className="bg-slate-50/50 border-b border-slate-50">
                <tr>
                  {selectable && (
                    <th className="px-4 sm:px-8 py-3.5 sm:py-5 text-left">
                      <RowCheckbox checked={allSelected} indeterminate={someSelected} onClick={toggleAll} label="Select all rows" />
                    </th>
                  )}
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className={cn("text-left text-caption text-slate-400 px-4 sm:px-8 py-3.5 sm:py-5", c.className)}
                      style={{ width: c.width, fontSize: "10px" }}
                    >
                      {c.label}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="px-4 sm:px-8 py-3.5 sm:py-5">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-50">
              {!data?.length ? (
                <tr>
                  <td colSpan={columns.length + extraCols}>
                    <EmptyState message={emptyMessage} action={emptyAction} />
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={cn(
                      "hover:bg-slate-50 transition-colors group",
                      rowClassName?.(item, index),
                      (onRowClick || getRowHref) && "cursor-pointer",
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td className="px-4 sm:px-8 py-3.5 sm:py-5" onClick={(e) => e.stopPropagation()}>
                        <RowCheckbox checked={selectedItems.has(item.id)} onClick={() => toggleItem(item.id)} label="Select row" />
                      </td>
                    )}
                    {columns.map((c, colIndex) => (
                      <td
                        key={c.key}
                        className={cn(
                          "px-4 sm:px-8 py-3.5 sm:py-5 text-sm font-normal text-slate-600",
                          c.className,
                          colIndex === 0 && getRowHref && "relative",
                        )}
                      >
                        {colIndex === 0 && getRowHref && (
                          <Link href={getRowHref(item)} className="absolute inset-0" aria-label="View row" />
                        )}
                        {renderCell(c, item, index)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 sm:px-8 py-3.5 sm:py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left" ref={openDropdownId === item.id ? dropdownRef : undefined}>
                          <button
                            type="button"
                            onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                            className="h-9 inline-flex items-center gap-1.5 px-4 rounded-lg border border-slate-200 text-caption text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                            style={{ fontSize: "10px" }}
                          >
                            Actions
                            <ChevronDownIcon
                              className={cn("w-3.5 h-3.5 transition-transform", openDropdownId === item.id && "rotate-180")}
                            />
                          </button>
                          {openDropdownId === item.id && (
                            <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg bg-white border border-slate-100 shadow-2xl shadow-slate-900/10 overflow-hidden">
                              {actions
                                .filter((a) => !a.condition || a.condition(item))
                                .map((action, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      action.onClick(item);
                                      setOpenDropdownId(null);
                                    }}
                                    className={cn(
                                      "block w-full text-left px-4 py-2.5 text-xs font-normal hover:bg-slate-50 transition-colors",
                                      action.className ?? "text-slate-700",
                                    )}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isPaginated && onPageChange && (
        <Pagination
          className={paginationClassName}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
