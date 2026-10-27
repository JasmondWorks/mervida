"use client";

export interface TabItem {
  label: string;
  value: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Tabs({ items, value, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex gap-2 ${className}`} role="tablist">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`h-12 px-6 rounded-lg text-caption transition-all ${
              active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {item.label}
            {item.count !== undefined && item.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-lg ${active ? "bg-white/20" : "bg-white"}`} style={{ fontSize: "9px" }}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
