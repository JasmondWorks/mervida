"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { fetchSettings, updateSettings } from "@/app/lib/api-client";
import { uploadFile, UPLOAD_FOLDERS } from "@/app/lib/upload-client";
import { Button, Field, H1, H4 } from "@/app/components/ui";
import type { AdminSettings } from "@/app/lib/types";
import {
  ORDER_MESSAGE_VARIABLES,
  ORDER_MESSAGE_SAMPLE_ITEMS_TEXT,
  ORDER_MESSAGE_SAMPLE_TOTAL,
  renderOrderMessageTemplate,
} from "@/app/lib/orderMessage";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const templateRef = useRef<HTMLTextAreaElement>(null);

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

  function insertTemplateVariable(token: string) {
    const el = templateRef.current;
    const current = settings!.whatsappMessageTemplate ?? "";
    if (!el) {
      patch("whatsappMessageTemplate", current + token);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + token + current.slice(end);
    patch("whatsappMessageTemplate", next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + token.length;
      el.setSelectionRange(caret, caret);
    });
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

  return (
    <form
      onSubmit={handleSave}
      className="p-6 sm:p-10 max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
        <div className="space-y-2">
          <H1 className="text-slate-950 tracking-tighter leading-none">Settings</H1>
          <p className="text-slate-400 font-normal text-xs">
            Business details, WhatsApp number, and homepage carousel
          </p>
        </div>
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
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
        <H4 className="text-slate-900 px-4">Core Identity</H4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <Field
            label="Business Name"
            value={settings.businessName}
            onValueChange={(v) => patch("businessName", v)}
            placeholder="Business Name"
          />
          <Field
            label="Administrative Email"
            type="email"
            value={settings.businessEmail}
            onValueChange={(v) => patch("businessEmail", v)}
            placeholder="contact@domain.com"
          />
        </div>
      </section>

      {/* WhatsApp */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <H4 className="text-slate-900 px-4">WhatsApp</H4>
        <div className="space-y-6 px-4">
          <Field
            label="Recipient Number"
            value={settings.whatsappNumber}
            onValueChange={(v) => patch("whatsappNumber", v)}
            placeholder="234... (leave blank to use the WHATSAPP_NUMBER env var)"
            hint='International format, no leading "+". Overrides the WHATSAPP_NUMBER env var when set.'
          />
          <div className="space-y-1.5">
            <label className="text-caption text-slate-600 block mb-1.5">
              Order Message Template
            </label>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-slate-400">Insert:</span>
              {ORDER_MESSAGE_VARIABLES.map((v) => (
                <button
                  key={v.token}
                  type="button"
                  onClick={() => insertTemplateVariable(v.token)}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  {v.token}
                </button>
              ))}
            </div>

            <textarea
              ref={templateRef}
              value={settings.whatsappMessageTemplate}
              onChange={(e) =>
                patch("whatsappMessageTemplate", e.target.value)
              }
              rows={6}
              className="w-full bg-white border border-slate-200 rounded-lg px-6 py-3.5 text-sm font-mono resize-none focus:outline-none focus:border-emerald-500 transition-all"
            />

            <ul className="text-xs text-slate-400 ml-5 space-y-0.5">
              {ORDER_MESSAGE_VARIABLES.map((v) => (
                <li key={v.token}>
                  <code className="font-mono text-slate-500">{v.token}</code>
                  {" — "}
                  {v.description}
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <span className="text-xs text-slate-400 block mb-1.5 ml-5">
                Preview (sample data)
              </span>
              <div className="bg-[#e5fbe5] rounded-lg p-4 text-sm whitespace-pre-wrap font-mono text-slate-800 border border-emerald-100">
                {renderOrderMessageTemplate(
                  settings.whatsappMessageTemplate,
                  ORDER_MESSAGE_SAMPLE_ITEMS_TEXT,
                  ORDER_MESSAGE_SAMPLE_TOTAL,
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <H4 className="text-slate-900 px-4">Blog</H4>
        <div className="space-y-6 px-4">
          <Field
            label="Page Title"
            value={settings.blogTitle}
            onValueChange={(v) => patch("blogTitle", v)}
            placeholder="The Blog"
            hint="Shown as the heading at the top of /blog."
          />
          <Field
            label="Page Description"
            type="textarea"
            value={settings.blogDescription}
            onValueChange={(v) => patch("blogDescription", v)}
            className="h-24"
            hint="The intro text shown beneath the title."
          />
          <Field
            label="Cover Placeholder Text"
            value={settings.blogPlaceholderText}
            onValueChange={(v) => patch("blogPlaceholderText", v)}
            placeholder="Mervida Blog"
            hint="Shown on a post's thumbnail when it has no cover image."
          />
        </div>
      </section>

      {/* Homepage Carousel */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <div className="flex items-center justify-between px-4">
          <div>
            <H4 className="text-slate-900 mb-1">Homepage Carousel</H4>
            <p className="text-xs text-slate-400 font-normal">
              Upload and sequence the images shown on the landing page.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            loading={uploading}
            className="shrink-0"
          >
            {uploading ? "Uploading..." : "+ Upload Image"}
          </Button>
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
        <Button type="submit" loading={saving} className="shadow-xl shadow-black/5">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
