import { Button } from "@/app/components/ui";
import { cn } from "@/app/lib/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-b-3xl sm:rounded-b-6xl border border-t-0 border-slate-100 bg-slate-50/50 px-4 sm:px-8 py-3.5 sm:py-4",
        className,
      )}
    >
      <span className="text-caption text-slate-400" style={{ fontSize: "10px" }}>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
