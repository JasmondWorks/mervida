export default function Divider({ className = "" }: { className?: string }) {
  return <div className={`border-t border-slate-100 ${className}`} />;
}
