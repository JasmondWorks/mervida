import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "dark";

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-900 border-transparent",
  success: "bg-emerald-50 text-emerald-600 border-emerald-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  danger: "bg-red-50 text-red-600 border-red-100",
  dark: "bg-slate-900 text-white border-transparent",
};

export default function Badge({ tone = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`text-caption inline-flex items-center justify-center px-3 py-1 rounded-lg border ${TONE_CLASS[tone]} ${className}`}
      style={{ fontSize: "10px" }}
    >
      {children}
    </span>
  );
}
