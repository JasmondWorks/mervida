"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, H1, Caption } from "@/app/components/ui";
import GfoWordmark from "@/app/components/GfoWordmark";

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
          <div className="inline-flex flex-col items-center mb-8 group">
            <GfoWordmark size="lg" />
            <Caption tone="muted" style={{ fontSize: "10px" }} className="mt-1">
              Admin
            </Caption>
          </div>
          <H1 className="text-slate-950 tracking-tighter leading-none mb-4">Welcome back.</H1>
          <Caption tone="muted" style={{ fontSize: "11px" }}>
            Authorized Access Only
          </Caption>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field
            label="Admin PIN"
            type="password"
            inputMode="numeric"
            value={pin}
            onValueChange={setPin}
            placeholder="••••••"
            className="font-mono tracking-widest text-center"
            required
            autoFocus
          />

          {error && (
            <div className="text-caption text-red-600 animate-in fade-in flex items-center justify-center gap-2 bg-red-50 py-3 rounded-lg">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full active:scale-[0.98]">
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
