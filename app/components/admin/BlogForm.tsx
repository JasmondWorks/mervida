"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { generateSlug } from "@/app/lib/store";
import { createBlogPost, updateBlogPost, type BlogPost } from "@/app/lib/api-client";
import { uploadFile, UPLOAD_FOLDERS } from "@/app/lib/upload-client";
import RichTextEditor from "./RichTextEditor";

interface Props {
  initialData?: BlogPost;
  mode: "create" | "edit";
}

const inp =
  "w-full bg-white border border-slate-200 rounded-lg px-6 py-4 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
const area =
  "w-full bg-white border border-slate-200 rounded-4xl px-6 py-5 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none";
const lbl = "text-caption text-slate-400 block mb-2 ml-5";

export default function BlogForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugManual, setSlugManual] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManual) setSlug(generateSlug(value));
  }

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    setError("");
    try {
      setCoverImage(await uploadFile(file, UPLOAD_FOLDERS.blogImages));
    } catch {
      setError("Cover image upload failed. Try again.");
    } finally {
      setUploadingCover(false);
    }
  }

  function isBodyEmpty(html: string) {
    return html.replace(/<[^>]*>/g, "").trim().length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isBodyEmpty(body)) {
      setError("Post content can't be empty.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { title, slug, excerpt, body, coverImage: coverImage || null, status };

    try {
      if (mode === "edit" && initialData) {
        await updateBlogPost(initialData.id, payload);
      } else {
        await createBlogPost(payload);
      }
      router.push("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save post.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-500"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h1 className="text-slate-950 tracking-tighter leading-none">
          {mode === "create" ? "New Post" : `Edit: ${title}`}
        </h1>
        <div className="flex gap-4 shrink-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-caption px-8 py-3.5 border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="text-caption px-8 py-3.5 bg-slate-900 text-white hover:bg-emerald-600 rounded-lg transition-all disabled:opacity-50 active:scale-95"
          >
            {saving ? "Saving..." : mode === "create" ? "Create Post" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && <p className="text-caption text-red-500 ml-5">{error}</p>}

      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100">
        <div className="space-y-1.5 px-4">
          <label className={lbl}>Title *</label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inp}
            required
            placeholder="Post Title"
          />
        </div>
        <div className="space-y-1.5 px-4">
          <label className={lbl}>URL Slug *</label>
          <div className="flex gap-2">
            <input
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(generateSlug(e.target.value));
              }}
              className={inp}
              required
              placeholder="url-safe-slug"
            />
            <button
              type="button"
              onClick={() => {
                setSlugManual(false);
                setSlug(generateSlug(title));
              }}
              className="text-caption px-4 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-emerald-600 transition-all h-12"
              style={{ fontSize: "9px" }}
            >
              Auto
            </button>
          </div>
        </div>
        <div className="space-y-1.5 px-4">
          <label className={lbl}>Excerpt *</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={`${area} h-20`}
            required
            placeholder="Short summary shown in the blog listing"
          />
        </div>
      </section>

      {/* Body — a real word processor: type and format directly, no markdown syntax */}
      <section className="space-y-2">
        <label className={lbl}>Post Content *</label>
        <RichTextEditor content={body} onChange={setBody} />
      </section>

      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100">
        <h4 className="text-slate-900 px-4">
          Cover Image <span className="text-slate-400 font-normal">(optional)</span>
        </h4>
        {coverImage ? (
          <div className="flex items-center gap-3 px-4">
            <div className="relative w-28 h-20 rounded-2xl overflow-hidden border border-slate-100">
              <Image src={coverImage} alt="" fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="text-caption text-red-500 hover:text-red-600"
              style={{ fontSize: "9px" }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="px-4">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="text-caption w-full h-24 rounded-2xl border border-dashed border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all disabled:opacity-50"
            >
              {uploadingCover ? "Uploading..." : "+ Upload Cover Image"}
            </button>
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverUpload(file);
            e.target.value = "";
          }}
        />
      </section>

      <section className="bg-white rounded-5xl p-8 space-y-4 border border-slate-100">
        <h4 className="text-slate-900 px-4">Visibility</h4>
        <div className="flex gap-3 px-4">
          {(["draft", "published"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`text-caption px-6 py-2.5 rounded-lg transition-all ${
                status === s
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-50 text-slate-400 hover:text-slate-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>
    </form>
  );
}
