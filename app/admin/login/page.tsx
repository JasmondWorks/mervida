"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, initStore, isAuthenticated } from "@/app/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initStore();
    if (isAuthenticated()) router.replace("/admin");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Slight delay for clean transition
    setTimeout(() => {
      if (login(password)) {
        router.push("/admin");
      } else {
        setError("Incorrect password. Try again.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative">
      {/* Background purely for depth */}
      <div className="absolute inset-0 bg-slate-50/50" />

      <div className="bg-white border border-slate-100 p-10 sm:p-14 w-full max-w-md relative z-10 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
          <div className="inline-flex flex-col mb-8 group">
            <span className="text-2xl font-display font-black tracking-tighter text-slate-900 uppercase">
              MERVIDA
            </span>
            <span className="text-[10px] font-bold tracking-[0.4em] text-slate-400 mt-1 uppercase">
              ADMIN PORTAL
            </span>
          </div>
          <h1 className="text-3xl font-display font-black text-slate-950 tracking-tighter leading-none mb-4">
            Welcome back.
          </h1>
          <p className="text-slate-400 font-medium text-[11px] uppercase tracking-[0.2em]">
            Authorized Access Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">
              Security Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white rounded-full px-8 py-4 text-sm outline-none transition-all placeholder:text-slate-200 font-mono tracking-widest"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-600 text-[10px] font-black uppercase tracking-widest animate-in fade-in flex items-center justify-center gap-2 bg-red-50 py-3 rounded-full">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-emerald-600 text-white font-black py-4 rounded-full text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            Default:{" "}
            <span className="text-slate-950 select-all font-black">
              admin123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
