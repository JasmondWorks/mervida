"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

export default function Toggle({ checked, onChange, label, description, className = "" }: ToggleProps) {
  const track = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-lg transition-all shrink-0 ${checked ? "bg-emerald-500" : "bg-slate-200"}`}
    >
      <div
        className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${checked ? "right-1" : "left-1"}`}
      />
    </button>
  );

  if (!label) return track;

  return (
    <label
      className={`flex items-center gap-6 p-5 rounded-3xl bg-slate-50 border border-slate-100 cursor-pointer select-none transition-all hover:bg-slate-100/70 ${className}`}
    >
      {track}
      <div>
        <p className="text-caption text-slate-900" style={{ fontSize: "12px" }}>
          {label}
        </p>
        {description && <p className="text-xs font-normal text-slate-400 tracking-tight mt-0.5">{description}</p>}
      </div>
    </label>
  );
}
