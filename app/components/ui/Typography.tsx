import type { ElementType, HTMLAttributes, ReactNode } from "react";

// Heading components — h1 through h4 get their weight (800/800/800/600),
// tracking, and line-height from base element styles in app/globals.css.
// Never add a manual font-weight className to these; the tag already carries
// the correct weight in the regular -> semibold -> extrabold scale.

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { children: ReactNode };

export function H1({ children, className = "", ...rest }: HeadingProps) {
  return (
    <h1 className={className} {...rest}>
      {children}
    </h1>
  );
}

export function H2({ children, className = "", ...rest }: HeadingProps) {
  return (
    <h2 className={className} {...rest}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "", ...rest }: HeadingProps) {
  return (
    <h3 className={className} {...rest}>
      {children}
    </h3>
  );
}

export function H4({ children, className = "", ...rest }: HeadingProps) {
  return (
    <h4 className={className} {...rest}>
      {children}
    </h4>
  );
}

// Body text — the only weights ever used are regular (default) and
// semibold (emphasis). Never medium, never bold.
export type TextTone = "default" | "muted" | "subtle";
export type TextSize = "sm" | "md" | "xs";

interface TextProps extends HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  as?: "p" | "span" | "div";
  size?: TextSize;
  tone?: TextTone;
  emphasis?: boolean;
  children: ReactNode;
}

const TEXT_SIZE: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
};

const TEXT_TONE: Record<TextTone, string> = {
  default: "text-slate-700",
  muted: "text-slate-500",
  subtle: "text-slate-400",
};

export function Text({
  as = "p",
  size = "sm",
  tone = "default",
  emphasis = false,
  children,
  className = "",
  ...rest
}: TextProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={`${TEXT_SIZE[size]} ${TEXT_TONE[tone]} ${emphasis ? "font-semibold" : "font-normal"} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Small uppercase tracked label — form field labels, table headers, status
// text, eyebrow-style meta. Always semibold (per the 3-weight scale, never
// bold/black), uppercase, wide tracking.
export type CaptionTone = "default" | "muted" | "accent" | "danger";

interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: CaptionTone;
  children: ReactNode;
}

const CAPTION_TONE: Record<CaptionTone, string> = {
  default: "text-slate-900",
  muted: "text-slate-400",
  accent: "text-emerald-600",
  danger: "text-red-500",
};

export function Caption({ tone = "muted", children, className = "", ...rest }: CaptionProps) {
  return (
    <span className={`text-caption ${CAPTION_TONE[tone]} ${className}`} {...rest}>
      {children}
    </span>
  );
}

// Standalone field/section label — same visual treatment Field uses
// internally, exported for places that need a label without a full Field
// (e.g. a label above a custom composite control).
interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}

export function Label({ htmlFor, required, children, className = "", ...rest }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`text-caption text-slate-400 block mb-2 ml-5 ${className}`} {...rest}>
      {children}
      {required ? " *" : ""}
    </label>
  );
}
