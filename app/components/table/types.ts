import type { ReactNode } from "react";

export interface TableColumn<T = any> {
  key: string;
  label?: string;
  width?: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

export interface TableAction<T = any> {
  label: string;
  onClick: (item: T) => void;
  className?: string;
  condition?: (item: T) => boolean;
}

export interface TableProps<T = any> {
  variant?: "default" | "minimal";
  data: T[] | undefined;
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  onRowSelect?: (selectedItems: T[]) => void;
  selectable?: boolean;
  actions?: TableAction<T>[];
  className?: string;
  rowClassName?: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  getRowHref?: (item: T) => string;
  isPaginated?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasHeaders?: boolean;
  paginationClassName?: string;
  clearSelectionTrigger?: number;
}

export interface ItemWithId {
  id: string | number;
  [key: string]: any;
}
