import type { HTMLAttributes, ReactNode } from "react";
import { H4 } from "./Typography";

export type CardTone = "surface" | "muted";
export type CardPadding = "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  padding?: CardPadding;
  heading?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

const TONE_CLASS: Record<CardTone, string> = {
  surface: "bg-white border border-slate-100 shadow-2xl shadow-slate-900/1",
  muted: "bg-slate-50 border border-slate-100",
};

const PADDING_CLASS: Record<CardPadding, string> = {
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  tone = "surface",
  padding = "lg",
  heading,
  headerAction,
  children,
  className = "",
  ...rest
}: CardProps) {
  return (
    <section
      className={`rounded-5xl space-y-6 ${TONE_CLASS[tone]} ${PADDING_CLASS[padding]} ${className}`}
      {...rest}
    >
      {(heading || headerAction) && (
        <div className="flex items-center justify-between px-4">
          {heading && <H4 className="text-slate-900">{heading}</H4>}
          {headerAction}
        </div>
      )}
      {children}
    </section>
  );
}
