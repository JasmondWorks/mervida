"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { generateSlug } from "@/app/lib/store";
import { createBlogPost, updateBlogPost, type BlogPost } from "@/app/lib/api-client";
import { uploadFile, UPLOAD_FOLDERS } from "@/app/lib/upload-client";
import { sanitizeBlogHtml } from "@/app/lib/sanitize-html";
import { Button, Field, H1, H4, Modal } from "@/app/components/ui";
import RichTextEditor from "./RichTextEditor";

interface Props {
  initialData?: BlogPost;
  mode: "create" | "edit";
}

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
  const [showPreview, setShowPreview] = useState(false);
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
      className="p-6 sm:p-10 max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-500"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <H1 className="text-slate-950 tracking-tighter leading-none">
          {mode === "create" ? "New Post" : `Edit: ${title}`}
        </H1>
        <div className="flex gap-3 shrink-0">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowPreview(true)}
            disabled={!title.trim() && isBodyEmpty(body)}
          >
            Preview
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()} className="hover:text-red-500 hover:border-red-100">
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {mode === "create" ? "Create Post" : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && <p className="text-caption text-red-500 ml-5">{error}</p>}

      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100">
        <div className="px-4">
          <Field label="Title" required value={title} onValueChange={handleTitleChange} placeholder="Post Title" />
        </div>
        <div className="space-y-1.5 px-4">
          <label className={lbl}>URL Slug *</label>
          <div className="flex gap-2">
            <Field
              value={slug}
              onValueChange={(v) => {
                setSlugManual(true);
                setSlug(generateSlug(v));
              }}
              required
              placeholder="url-safe-slug"
              wrapperClassName="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSlugManual(false);
                setSlug(generateSlug(title));
              }}
              className="shrink-0"
              style={{ fontSize: "9px" }}
            >
              Auto
            </Button>
          </div>
        </div>
        <div className="px-4">
          <Field
            label="Excerpt"
            type="textarea"
            required
            value={excerpt}
            onValueChange={setExcerpt}
            className="h-20"
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
        <H4 className="text-slate-900 px-4">
          Cover Image <span className="text-slate-400 font-normal">(optional)</span>
        </H4>
        {coverImage ? (
          <div className="space-y-4 px-4">
            <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] min-h-[240px] max-h-[420px] rounded-4xl overflow-hidden border border-slate-100 bg-slate-50 group">
              <Image
                src={coverImage}
                alt="Post cover jumbotron"
                fill
                priority
                className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="h-10 px-4 bg-white/95 backdrop-blur-md text-slate-800 hover:text-emerald-700 hover:bg-white text-xs font-semibold shadow-md border-0"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  {uploadingCover ? "Uploading..." : "Replace Cover"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCoverImage("")}
                  className="h-10 px-4 bg-white/95 backdrop-blur-md text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold shadow-md border-0"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Remove
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              High-resolution editorial widescreen cover displayed prominently at the top of your post.
            </p>
          </div>
        ) : (
          <div className="px-4">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="w-full aspect-[21/9] sm:aspect-[16/7] min-h-[220px] max-h-[380px] rounded-4xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all disabled:opacity-50 flex flex-col items-center justify-center gap-3 group text-center p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-emerald-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-700 transition-colors">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {uploadingCover ? "Uploading high-res cover..." : "+ Add Jumbotron Cover Image"}
                </p>
                <p className="text-xs text-slate-400 font-normal">
                  Recommended widescreen format (16:9 or 21:9 ratio) up to 10MB
                </p>
              </div>
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
        <H4 className="text-slate-900 px-4">Visibility</H4>
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

      {/* Live In-Form Preview Modal */}
      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title="Post Preview"
        size="lg"
        footer={
          <div className="flex items-center justify-end w-full px-6 py-4 bg-slate-50/60 border-t border-slate-100 rounded-b-5xl gap-2">
            <Button variant="secondary" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </div>
        }
      >
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[65vh]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
              {title || "Untitled Post"}
            </h2>
            {excerpt && (
              <p className="text-sm font-normal text-slate-500 mt-2 leading-relaxed">
                {excerpt}
              </p>
            )}
          </div>
          {coverImage && (
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 bg-slate-50">
              <Image src={coverImage} alt={title || "Cover"} fill className="object-cover" />
            </div>
          )}
          <div
            className="blog-prose max-w-none pt-2"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(body) }}
          />
        </div>
      </Modal>
    </form>
  );
}
