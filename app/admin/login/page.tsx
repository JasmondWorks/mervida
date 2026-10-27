"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Incorrect PIN. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-slate-50/50" />

      <div className="bg-white border border-slate-100 p-10 sm:p-14 w-full max-w-md relative z-10 rounded-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
          <div className="inline-flex flex-col mb-8 group">
            <span className="text-2xl font-extrabold tracking-tighter text-slate-900 uppercase">
              MERVIDA
            </span>
            <span className="text-caption text-slate-400 mt-1" style={{ fontSize: "10px" }}>
              Admin
            </span>
          </div>
          <h1 className="text-slate-950 tracking-tighter leading-none mb-4">Welcome back.</h1>
          <p className="text-caption text-slate-400" style={{ fontSize: "11px" }}>
            Authorized Access Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-caption block text-slate-400 ml-5">Admin PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white rounded-lg px-8 py-4 text-sm font-normal outline-none transition-all placeholder:text-slate-200 font-mono tracking-widest text-center"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="text-caption text-red-600 animate-in fade-in flex items-center justify-center gap-2 bg-red-50 py-3 rounded-lg">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="text-caption w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-lg transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
