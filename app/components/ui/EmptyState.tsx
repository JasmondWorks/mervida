import type { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ message, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-24 ${className}`}>
      <p className="text-caption text-slate-400 italic" style={{ fontSize: "11px" }}>
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
