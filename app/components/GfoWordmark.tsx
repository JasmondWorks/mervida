// The site's own chrome (nav, footer, page titles) identifies as GFO Foods —
// the operating company — not Mervida, the consumer product brand printed on
// packaging. "GFO" carries the accent color and extra weight as the
// identifying mark; "Foods" rides alongside it at a lighter weight so this
// reads as a lockup rather than a plain label.

const SIZE_CLASS = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
} as const;

interface GfoWordmarkProps {
  size?: keyof typeof SIZE_CLASS;
  /** Use on a dark background (hero overlays, the footer) for real contrast. */
  dark?: boolean;
  className?: string;
}

export default function GfoWordmark({ size = "md", dark = false, className = "" }: GfoWordmarkProps) {
  return (
    <span className={`${SIZE_CLASS[size]} tracking-tighter leading-none ${className}`}>
      <span className={`font-extrabold ${dark ? "text-emerald-400" : "text-emerald-600"}`}>GFO</span>
      <span className={`font-semibold ${dark ? "text-white" : "text-slate-900"}`}> Foods</span>
    </span>
  );
}
