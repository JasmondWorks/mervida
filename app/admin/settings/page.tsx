"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { fetchSettings, updateSettings } from "@/app/lib/api-client";
import { uploadFile, UPLOAD_FOLDERS } from "@/app/lib/upload-client";
import type { AdminSettings } from "@/app/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  if (!settings) return null;

  function patch<K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K],
  ) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  function removeCarouselImage(src: string) {
    patch(
      "carouselImages",
      settings!.carouselImages.filter((i) => i !== src),
    );
  }

  function moveCarousel(idx: number, dir: -1 | 1) {
    const arr = [...settings!.carouselImages];
    const to = idx + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    patch("carouselImages", arr);
  }

  async function handleCarouselUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file, UPLOAD_FOLDERS.siteAssets);
      patch("carouselImages", [...settings!.carouselImages, url]);
    } catch {
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  const inp =
    "w-full bg-white border border-slate-200 rounded-lg px-6 py-3.5 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
  const lbl = "text-caption text-slate-400 block mb-2 ml-5";

  return (
    <form
      onSubmit={handleSave}
      className="p-10 max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
        <div className="space-y-2">
          <h1 className="text-slate-950 tracking-tighter leading-none">Settings</h1>
          <p className="text-slate-400 font-normal text-xs">
            Business details, WhatsApp number, and homepage carousel
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="text-caption px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="text-caption bg-emerald-50 border border-emerald-100 text-emerald-600 px-8 py-3 rounded-lg animate-in slide-in-from-top-4 duration-500">
          Settings successfully updated.
        </div>
      )}
      {error && (
        <div className="text-caption bg-red-50 border border-red-100 text-red-600 px-8 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Business Identity */}
      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100/50">
        <h4 className="text-slate-900 px-4">Core Identity</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Business Name</label>
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

      {/* WhatsApp */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h4 className="text-slate-900 px-4">WhatsApp</h4>
        <div className="space-y-6 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Recipient Number</label>
            <input
              value={settings.whatsappNumber}
              onChange={(e) => patch("whatsappNumber", e.target.value)}
              className={inp}
              placeholder="234... (leave blank to use the WHATSAPP_NUMBER env var)"
            />
            <p className="text-xs font-normal text-slate-400 tracking-tight mt-2 ml-5">
              International format, no leading &quot;+&quot;. Overrides the WHATSAPP_NUMBER env var when set.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Order Message Template</label>
            <textarea
              value={settings.whatsappMessageTemplate}
              onChange={(e) => patch("whatsappMessageTemplate", e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-xs font-normal font-mono focus:outline-none focus:border-emerald-500 transition-all resize-none h-40"
            />
            <p className="text-[11px] font-normal text-slate-400 tracking-tight mt-2 ml-5">
              Variables enabled: {"{items}"}, {"{total}"}
            </p>
          </div>
        </div>
      </section>

      {/* Homepage Carousel */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <div className="flex items-center justify-between px-4">
          <div>
            <h4 className="text-slate-900 mb-1">Homepage Carousel</h4>
            <p className="text-xs text-slate-400 font-normal">
              Upload and sequence the images shown on the landing page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
            className="text-caption px-4 py-2 border border-slate-200 text-slate-500 rounded-lg hover:text-emerald-600 hover:border-emerald-200 transition-all disabled:opacity-50 shrink-0"
            style={{ fontSize: "9px" }}
          >
            {uploading ? "Uploading..." : "+ Upload Image"}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCarouselUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        {settings.carouselImages.length > 0 ? (
          <div className="px-4 flex gap-3 flex-wrap">
            {settings.carouselImages.map((src, idx) => (
              <div key={src} className="relative group">
                <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-slate-100 group-hover:border-emerald-300 transition-all">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-all"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-slate-900/70 backdrop-blur-md text-white text-caption px-2 py-0.5 rounded-lg" style={{ fontSize: "8px" }}>
                    #{idx + 1}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 flex gap-1 bg-white p-0.5 rounded-lg shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => moveCarousel(idx, -1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-900 font-semibold hover:text-emerald-600 transition-colors text-xs"
                    >
                      ‹
                    </button>
                  )}
                  {idx < settings.carouselImages.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveCarousel(idx, 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-900 font-semibold hover:text-emerald-600 transition-colors text-xs"
                    >
                      ›
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeCarouselImage(src)}
                    className="w-6 h-6 flex items-center justify-center text-red-500 font-semibold hover:text-red-700 transition-colors text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-4 text-sm font-normal text-slate-400">
            No carousel images yet.
          </p>
        )}
      </section>

      {/* Bottom Save */}
      <div className="flex justify-end pt-8 border-t border-slate-100">
        <button
          type="submit"
          disabled={saving}
          className="text-caption px-8 py-3 bg-slate-900 text-white rounded-lg transition-all hover:bg-emerald-600 active:scale-95 shadow-xl shadow-black/5 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
