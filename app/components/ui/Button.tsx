"use client";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-emerald-600",
  secondary: "border border-slate-200 text-slate-700 hover:border-emerald-500",
  ghost: "text-slate-400 hover:text-red-500",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-9 px-5",
  md: "h-12 px-8",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    children,
    className = "",
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg text-caption transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 cursor-pointer ${SIZE_CLASS[size]} ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
});

export default Button;
