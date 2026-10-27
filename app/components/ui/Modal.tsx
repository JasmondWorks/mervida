"use client";
import { useEffect } from "react";
import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

export default function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 animate-in fade-in duration-200"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${SIZE_CLASS[size]} bg-white rounded-5xl border border-slate-100 shadow-2xl shadow-slate-900/10 max-h-[90vh] flex flex-col animate-in zoom-in-95 slide-in-from-bottom-2 duration-200`}
      >
        {title && (
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 shrink-0">
            <h3 className="text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="px-8 py-6 overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-slate-50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
