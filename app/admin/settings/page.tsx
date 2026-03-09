"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getSettings, saveSettings, AVAILABLE_IMAGES } from "@/app/lib/store";
import type { AdminSettings } from "@/app/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  function patch<K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K],
  ) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  function toggleCarouselImage(src: string) {
    const current = settings!.carouselImages;
    if (current.includes(src)) {
      patch(
        "carouselImages",
        current.filter((i) => i !== src),
      );
    } else {
      patch("carouselImages", [...current, src]);
    }
  }

  function moveCarousel(idx: number, dir: -1 | 1) {
    const arr = [...settings!.carouselImages];
    const to = idx + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    patch("carouselImages", arr);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    let updated = { ...settings! };
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
      updated = { ...updated, adminPassword: newPassword };
    }

    saveSettings(updated);
    setSettings(updated);
    setSaved(true);
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 3000);
  }

  const inp =
    "w-full bg-white border border-slate-200 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
  const lbl =
    "block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5";

  return (
    <form
      onSubmit={handleSave}
      className="p-10 max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600">
            Global Configuration
          </p>
          <h1 className="text-3xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            Portal Settings
          </h1>
          <p className="text-slate-400 font-medium text-xs">
            Control business identity, integrations and assets
          </p>
        </div>
        <button
          type="submit"
          className="px-8 py-3 bg-slate-950 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
        >
          Synchronize Settings
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-full animate-in slide-in-from-top-4 duration-500">
          Environment configuration successfully updated.
        </div>
      )}

      {/* Business Identity */}
      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100/50">
        <h2 className="text-[13px] font-bold text-slate-900 tracking-tight px-4">
          Core Identity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Corporate Nomenclature</label>
            <input
              value={settings.businessName}
              onChange={(e) => patch("businessName", e.target.value)}
              className={inp}
              placeholder="Business Name"
            />
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Administrative Email</label>
            <input
              type="email"
              value={settings.businessEmail}
              onChange={(e) => patch("businessEmail", e.target.value)}
              className={inp}
              placeholder="contact@domain.com"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp Bridge */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h2 className="text-[13px] font-bold text-slate-900 tracking-tight px-4">
          WhatsApp Bridge
        </h2>
        <div className="space-y-6 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Recipient Anchor (Phone)</label>
            <input
              value={settings.whatsappNumber}
              onChange={(e) => patch("whatsappNumber", e.target.value)}
              className={inp}
              placeholder="234..."
            />
            <p className="text-[10px] font-medium text-slate-400 tracking-tight mt-2 ml-5">
              International format required (Prefix + Number)
            </p>
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Dynamic Messaging Blueprint</label>
            <textarea
              value={settings.whatsappMessageTemplate}
              onChange={(e) => patch("whatsappMessageTemplate", e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-all resize-none h-40"
            />
            <p className="text-[9px] font-medium text-slate-400 tracking-tight mt-2 ml-5">
              Variables enabled: {"{items}"}, {"{total}"}
            </p>
          </div>
        </div>
      </section>

      {/* Homepage Carousel */}
      <section className="bg-slate-950 rounded-5xl p-8 space-y-6 text-white border border-slate-900">
        <div className="px-4">
          <h2 className="text-[13px] font-bold text-white tracking-tight mb-1">
            Billboard Rotation
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Sequence high-impact visual assets for landing pages.
          </p>
        </div>

        {settings.carouselImages.length > 0 && (
          <div className="px-4 space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/50">
              Active Rotation Matrix
            </p>
            <div className="flex gap-3 flex-wrap">
              {settings.carouselImages.map((src, idx) => (
                <div key={src} className="relative group">
                  <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-white/10 group-hover:border-emerald-500/50 transition-all">
                    <Image
                      src={src}
                      alt=""
                      width={112}
                      height={64}
                      className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-all"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border border-white/10">
                      #{idx + 1}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex gap-1 bg-white p-0.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => moveCarousel(idx, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-950 font-bold hover:text-emerald-600 transition-colors text-xs"
                      >
                        ‹
                      </button>
                    )}
                    {idx < settings.carouselImages.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveCarousel(idx, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-950 font-bold hover:text-emerald-600 transition-colors text-xs"
                      >
                        ›
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleCarouselImage(src)}
                      className="w-6 h-6 flex items-center justify-center text-red-500 font-bold hover:text-red-700 transition-colors text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 bg-white/3 p-6 rounded-3xl border border-white/5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-4">
            Master Media Library
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {AVAILABLE_IMAGES.map((src) => {
              const selected = settings.carouselImages.includes(src);
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => toggleCarouselImage(src)}
                  className={`relative aspect-3/2 rounded-lg overflow-hidden border transition-all ${selected ? "border-emerald-500 ring-1 ring-emerald-500/50" : "border-white/5"}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className={`object-cover transition-all ${selected ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Access Security */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h2 className="text-[13px] font-bold text-slate-900 tracking-tight px-4">
          Access Security
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>New Credentials</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inp}
              placeholder="Secret Access Key"
            />
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Confirm Integrity</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inp}
              placeholder="Retype Credentials"
            />
            {passwordError && (
              <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-3 ml-5 animate-pulse">
                {passwordError}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Save */}
      <div className="flex justify-end pt-8 border-t border-slate-100">
        <button
          type="submit"
          className="px-8 py-3 bg-slate-950 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 active:scale-95 shadow-xl shadow-black/5"
        >
          Commit Environment Changes
        </button>
      </div>
    </form>
  );
}
