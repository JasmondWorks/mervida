"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, Category, Variant, ProcessVideo } from "@/app/lib/types";
import { generateId, generateSlug } from "@/app/lib/store";
import { fetchCategories, createProduct, updateProduct } from "@/app/lib/api-client";
import { uploadFile, UPLOAD_FOLDERS } from "@/app/lib/upload-client";

interface Props {
  initialData?: Product;
  mode: "create" | "edit";
}

type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

const inp =
  "w-full bg-white border border-slate-200 rounded-lg px-6 py-4 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
const area =
  "w-full bg-white border border-slate-200 rounded-4xl px-6 py-5 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none";
const lbl = "text-caption text-slate-400 block mb-2 ml-5";

interface InternalNutritionSpec {
  id: string;
  key: string;
  value: string;
}

interface InternalVariant extends Variant {
  id: string;
}

interface InternalFormData extends Omit<
  ProductFormData,
  "nutritionSpecs" | "variants"
> {
  nutritionSpecs: InternalNutritionSpec[];
  variants: InternalVariant[];
}

const EMPTY: InternalFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  images: [],
  price: 0,
  unit: "",
  categoryId: "",
  variants: [],
  nutritionSpecs: [],
  stockCount: 0,
  inStock: true,
  nafdacNumber: "",
  certifications: [],
  isFeatured: false,
  isBestseller: false,
  isNew: false,
  processVideo: null,
  seoTitle: "",
  seoDescription: "",
};

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<InternalFormData>(() => {
    if (initialData) {
      // Robust conversion: handle both Record and legacy Array formats for specs
      const rawSpecs = initialData.nutritionSpecs || {};
      const specsArray: InternalNutritionSpec[] = Array.isArray(rawSpecs)
        ? rawSpecs.map(
            (s: {
              id?: string;
              key?: string;
              label?: string;
              value?: any;
            }) => ({
              id: s.id || generateId(),
              key: s.key || s.label || "",
              value: String(s.value || ""),
            }),
          )
        : Object.entries(rawSpecs).map(([key, value]) => ({
            id: generateId(),
            key,
            value: String(value),
          }));

      // Conversion for variants to include IDs
      const variantsArray: InternalVariant[] = (initialData.variants || []).map(
        (v) => ({
          ...v,
          id: (v as any).id || generateId(),
        }),
      );

      return {
        ...initialData,
        nutritionSpecs: specsArray,
        variants: variantsArray,
      };
    }
    return { ...EMPTY };
  });
  const [slugManual, setSlugManual] = useState(mode === "edit");
  const [certInput, setCertInput] = useState("");
  const [slugError, setSlugError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  async function handleImageUpload(file: File) {
    setUploadError("");
    setUploadingImage(true);
    try {
      const url = await uploadFile(file, UPLOAD_FOLDERS.productImages);
      patch("images", [...form.images, url]);
    } catch {
      setUploadError("Image upload failed. Try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  function patchVideo<K extends keyof ProcessVideo>(key: K, value: ProcessVideo[K]) {
    const base: ProcessVideo = form.processVideo ?? {
      title: "",
      videoUrl: "",
      highlights: [],
    };
    patch("processVideo", { ...base, [key]: value });
  }

  async function handleVideoUpload(file: File) {
    setUploadError("");
    setUploadingVideo(true);
    try {
      const url = await uploadFile(file, UPLOAD_FOLDERS.productVideos);
      patchVideo("videoUrl", url);
    } catch {
      setUploadError("Video upload failed. Try again.");
    } finally {
      setUploadingVideo(false);
    }
  }

  async function handlePosterUpload(file: File) {
    setUploadError("");
    setUploadingPoster(true);
    try {
      const url = await uploadFile(file, UPLOAD_FOLDERS.productImages);
      patchVideo("posterUrl", url);
    } catch {
      setUploadError("Poster image upload failed. Try again.");
    } finally {
      setUploadingPoster(false);
    }
  }

  function patch<K extends keyof InternalFormData>(
    key: K,
    value: InternalFormData[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNameChange(name: string) {
    patch("name", name);
    if (!slugManual) patch("slug", generateSlug(name));
  }

  function handleSlugChange(raw: string) {
    setSlugManual(true);
    patch(
      "slug",
      raw
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    );
    setSlugError("");
  }

  function addVariant() {
    patch("variants", [
      ...form.variants,
      { id: generateId(), label: "", price: 0, stock: 0 },
    ]);
  }
  function updateVariant(
    id: string,
    field: keyof Variant,
    value: string | number,
  ) {
    patch(
      "variants",
      form.variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  }
  function removeVariant(id: string) {
    patch(
      "variants",
      form.variants.filter((v) => v.id !== id),
    );
  }

  function addSpec() {
    patch("nutritionSpecs", [
      ...form.nutritionSpecs,
      { id: generateId(), key: "", value: "" },
    ]);
  }
  function updateSpec(id: string, field: "key" | "value", value: string) {
    patch(
      "nutritionSpecs",
      form.nutritionSpecs.map((s) =>
        s.id === id ? { ...s, [field]: value } : s,
      ),
    );
  }
  function removeSpec(id: string) {
    patch(
      "nutritionSpecs",
      form.nutritionSpecs.filter((s) => s.id !== id),
    );
  }

  function addCert() {
    if (!certInput.trim()) return;
    patch("certifications", [...form.certifications, certInput.trim()]);
    setCertInput("");
  }
  function removeCert(cert: string) {
    patch(
      "certifications",
      form.certifications.filter((c) => c !== cert),
    );
  }

  function toggleImage(src: string) {
    if (form.images.includes(src)) {
      patch(
        "images",
        form.images.filter((i) => i !== src),
      );
    } else {
      patch("images", [...form.images, src]);
    }
  }
  function moveImageUp(idx: number) {
    if (idx === 0) return;
    const imgs = [...form.images];
    [imgs[idx - 1], imgs[idx]] = [imgs[idx], imgs[idx - 1]];
    patch("images", imgs);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSlugError("");
    setSaving(true);

    // Map local array-based specs back to Record for storage
    const specsRecord: Record<string, string> = {};
    form.nutritionSpecs.forEach((s) => {
      if (s.key.trim()) specsRecord[s.key] = s.value;
    });

    // Map internal variants back to clean API variants (removing IDs)
    const cleanVariants: Variant[] = form.variants.map(
      ({ id, ...rest }) => rest,
    );

    const payload = {
      ...form,
      variants: cleanVariants.length > 0 ? cleanVariants : null,
      nutritionSpecs: Object.keys(specsRecord).length > 0 ? specsRecord : null,
      processVideo: form.processVideo?.videoUrl ? form.processVideo : null,
    };

    try {
      if (mode === "edit" && initialData) {
        await updateProduct(initialData.id, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/admin/products");
    } catch (err) {
      setSlugError(
        err instanceof Error ? err.message : "Could not save product.",
      );
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-500"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div className="space-y-3">
          <h1 className="text-slate-900 tracking-tighter leading-none text-balance">
            {mode === "create" ? "New Product" : `Edit: ${form.name}`}
          </h1>
          {form.slug && (
            <p className="text-[10px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg w-fit tracking-tighter italic">
              URL: /products/{form.slug}
            </p>
          )}
        </div>
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
            className="text-caption px-8 py-3.5 bg-slate-900 text-white hover:bg-emerald-600 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-slate-900/10"
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Add Product"
                : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100">
        <h4 className="text-slate-900 px-4">Basic Info</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inp}
              required
              placeholder="Full Product Name"
            />
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>URL Slug *</label>
            <div className="flex gap-2">
              <input
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={inp}
                required
                placeholder="url-safe-slug"
              />
              <button
                type="button"
                onClick={() => {
                  setSlugManual(false);
                  patch("slug", generateSlug(form.name));
                }}
                className="text-caption px-4 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-emerald-600 hover:border-emerald-100 transition-all h-12"
                style={{ fontSize: "9px" }}
              >
                Auto
              </button>
            </div>
            {slugError && <p className="text-caption text-red-500 ml-5 mt-2" style={{ fontSize: "9px" }}>{slugError}</p>}
          </div>
        </div>

        <div className="space-y-1.5 px-4">
          <label className={lbl}>Short Description *</label>
          <input
            value={form.shortDescription}
            onChange={(e) => patch("shortDescription", e.target.value)}
            className={inp}
            required
            placeholder="High-impact summary for product cards"
          />
        </div>

        <div className="space-y-1.5 px-4">
          <label className={lbl}>Full Description</label>
          <textarea
            value={form.fullDescription}
            onChange={(e) => patch("fullDescription", e.target.value)}
            className={`${area} h-32`}
            placeholder="Deep dive into product benefits and details..."
          />
        </div>
      </section>

      {/* Pricing & Category */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h4 className="text-slate-900 px-4">Pricing &amp; Category</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Price (&#8358;) *</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => patch("price", +e.target.value)}
              className={inp}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Unit *</label>
            <input
              value={form.unit}
              onChange={(e) => patch("unit", e.target.value)}
              className={inp}
              required
              placeholder="e.g. 1kg, Pack of 10"
            />
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => patch("categoryId", e.target.value)}
              className={inp}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <div className="flex items-center justify-between px-4">
          <h4 className="text-slate-900">Product Images</h4>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploadingImage}
            className="text-caption px-4 py-2 border border-slate-200 text-slate-500 rounded-lg hover:text-emerald-600 hover:border-emerald-200 transition-all disabled:opacity-50"
            style={{ fontSize: "9px" }}
          >
            {uploadingImage ? "Uploading..." : "+ Upload Image"}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        {uploadError && (
          <p className="px-4 text-caption text-red-500" style={{ fontSize: "10px" }}>
            {uploadError}
          </p>
        )}

        {form.images.length > 0 ? (
          <div className="px-4">
            <p className="text-caption text-slate-400 mb-4" style={{ fontSize: "9px" }}>
              First image is the primary listing photo
            </p>
            <div className="flex gap-3 flex-wrap">
              {form.images.map((src, idx) => (
                <div key={src} className="relative group">
                  <div
                    className={`relative w-24 h-28 rounded-xl overflow-hidden border transition-all ${idx === 0 ? "border-emerald-500" : "border-slate-100 opacity-60 hover:opacity-100"}`}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                    {idx === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-white text-caption py-1 text-center" style={{ fontSize: "8px" }}>
                        Main
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 flex gap-1 z-20">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImageUp(idx)}
                        className="w-5 h-5 bg-white text-slate-900 rounded-full flex items-center justify-center text-xs shadow-xl border border-slate-100 transition-all hover:bg-emerald-500 hover:text-white hover:border-emerald-500 font-semibold"
                        title="Move earlier"
                      >
                        ↑
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleImage(src)}
                      className="w-5 h-5 bg-white text-slate-900 rounded-full flex items-center justify-center text-xs shadow-xl border border-slate-100 transition-all hover:bg-red-500 hover:text-white hover:border-red-500 font-semibold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="px-4 text-sm font-normal text-slate-400">
            No images yet. Upload at least one for this product to appear correctly in the catalog.
          </p>
        )}
      </section>

      {/* Manufacturing Process Video */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h4 className="text-slate-900 px-4">Manufacturing Process Video</h4>
        <p className="px-4 text-sm font-normal text-slate-400">
          Optional. If no video is uploaded, this product simply won&apos;t appear in the manufacturing showcase — nothing broken shows on the site.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-3">
            <label className={lbl}>Video File</label>
            {form.processVideo?.videoUrl ? (
              <div className="flex items-center gap-3">
                <video
                  src={form.processVideo.videoUrl}
                  className="w-24 h-16 rounded-xl object-cover bg-slate-100 border border-slate-100"
                  muted
                />
                <button
                  type="button"
                  onClick={() => patchVideo("videoUrl", "")}
                  className="text-caption text-red-500 hover:text-red-600"
                  style={{ fontSize: "9px" }}
                >
                  Remove Video
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploadingVideo}
                className="text-caption w-full h-24 rounded-2xl border border-dashed border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all disabled:opacity-50"
              >
                {uploadingVideo ? "Uploading..." : "+ Upload Manufacturing Video"}
              </button>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleVideoUpload(file);
                e.target.value = "";
              }}
            />
          </div>

          <div className="space-y-3">
            <label className={lbl}>Poster Image</label>
            {form.processVideo?.posterUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-100">
                  <Image src={form.processVideo.posterUrl} alt="" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => patchVideo("posterUrl", "")}
                  className="text-caption text-red-500 hover:text-red-600"
                  style={{ fontSize: "9px" }}
                >
                  Remove Poster
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => posterInputRef.current?.click()}
                disabled={uploadingPoster}
                className="text-caption w-full h-24 rounded-2xl border border-dashed border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all disabled:opacity-50"
              >
                {uploadingPoster ? "Uploading..." : "+ Upload Poster Thumbnail"}
              </button>
            )}
            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePosterUpload(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        {form.processVideo?.videoUrl && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <div className="space-y-1.5">
              <label className={lbl}>Video Title</label>
              <input
                value={form.processVideo.title}
                onChange={(e) => patchVideo("title", e.target.value)}
                className={inp}
                placeholder="How We Make This Product"
              />
            </div>
            <div className="space-y-1.5">
              <label className={lbl}>Duration (optional)</label>
              <input
                value={form.processVideo.duration ?? ""}
                onChange={(e) => patchVideo("duration", e.target.value)}
                className={inp}
                placeholder="1:10"
              />
            </div>
          </div>
        )}
      </section>

      {/* Inventory */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h4 className="text-slate-900 px-4">Stock</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Stock Quantity *</label>
            <input
              type="number"
              min="0"
              value={form.stockCount ?? 0}
              onChange={(e) => {
                const val = +e.target.value;
                patch("stockCount", val);
                // Auto-toggle inStock if stock is added to a previously out-of-stock item
                if (val > 0 && !form.inStock) patch("inStock", true);
                if (val === 0 && form.inStock) patch("inStock", false);
              }}
              className={inp}
              required
            />
            <p className="text-caption text-slate-400 mt-3 ml-5" style={{ fontSize: "10px" }}>
              Current state:{" "}
              <span
                className={
                  (form.stockCount ?? 0) <= 10
                    ? "text-amber-500"
                    : "text-emerald-500"
                }
              >
                {(form.stockCount ?? 0) === 0
                  ? "Empty"
                  : (form.stockCount ?? 0) <= 10
                    ? "Low"
                    : "Optimal"}
              </span>
            </p>
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Availability</label>
            <button
              type="button"
              onClick={() => patch("inStock", !form.inStock)}
              className={`w-full h-12 rounded-lg border transition-all flex items-center justify-center gap-3 px-6 ${
                form.inStock
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : "bg-red-50 border-red-100 text-red-700"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  form.inStock ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <span className="text-caption" style={{ fontSize: "10px" }}>
                {form.inStock ? "Currently in stock" : "Out of stock"}
              </span>
            </button>
            <p className="text-xs font-normal text-slate-400 mt-3 ml-5 leading-tight">
              Manually override product availability regardless of count.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>NAFDAC Number</label>
            <input
              value={form.nafdacNumber as any}
              onChange={(e) => patch("nafdacNumber", e.target.value as any)}
              className={inp}
              placeholder="REG NO."
            />
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100">
        <div className="flex items-center justify-between px-4">
          <h4 className="text-slate-900">Variants</h4>
          <button
            type="button"
            onClick={addVariant}
            className="text-caption text-emerald-600 hover:text-slate-900 transition-colors"
            style={{ fontSize: "9px" }}
          >
            + New Variant
          </button>
        </div>
        <div className="space-y-2 px-4">
          {form.variants.length === 0 ? (
            <p className="text-sm font-normal text-slate-400 text-center py-6 bg-white/50 rounded-2xl border border-dashed border-slate-200">
              No variants defined for this product.
            </p>
          ) : (
            form.variants.map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-white p-3 rounded-2xl border border-slate-100"
              >
                <input
                  value={v.label}
                  onChange={(e) => updateVariant(v.id, "label", e.target.value)}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-normal focus:bg-white focus:border-emerald-500 transition-all"
                  placeholder="Variant Label"
                />
                <input
                  type="number"
                  min="0"
                  value={v.price}
                  onChange={(e) =>
                    updateVariant(v.id, "price", +e.target.value)
                  }
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-normal focus:bg-white focus:border-emerald-500 transition-all"
                />
                <input
                  type="number"
                  min="0"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(v.id, "stock", +e.target.value)
                  }
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-normal focus:bg-white focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(v.id)}
                  className="text-caption text-red-400 hover:text-red-600 transition-colors"
                  style={{ fontSize: "9px" }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Nutrition Specs */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <div className="flex items-center justify-between px-4">
          <h4 className="text-slate-900">Nutrition Facts</h4>
          <button
            type="button"
            onClick={addSpec}
            className="text-caption text-emerald-600 hover:text-slate-900 transition-colors"
            style={{ fontSize: "9px" }}
          >
            + Add Spec
          </button>
        </div>
        <div className="space-y-2 px-4">
          {form.nutritionSpecs.length === 0 ? (
            <p className="text-sm font-normal text-slate-400 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No specifications added.
            </p>
          ) : (
            form.nutritionSpecs.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
              >
                <input
                  value={s.key}
                  onChange={(e) => updateSpec(s.id, "key", e.target.value)}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-xs font-normal focus:bg-white focus:border-emerald-500 transition-all"
                  placeholder="Label (e.g. Energy)"
                />
                <input
                  value={s.value}
                  onChange={(e) => updateSpec(s.id, "value", e.target.value)}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-xs font-normal focus:bg-white focus:border-emerald-500 transition-all"
                  placeholder="Value (e.g. 150kcal)"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(s.id)}
                  className="text-caption text-red-400 hover:text-red-600 transition-colors text-right px-4"
                  style={{ fontSize: "9px" }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100">
        <h4 className="text-slate-900 px-4">Certifications</h4>
        <div className="space-y-4 px-4">
          <div className="flex gap-2">
            <input
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCert();
                }
              }}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-6 py-3 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="Tag... (e.g. Organic)"
            />
            <button
              type="button"
              onClick={addCert}
              className="text-caption px-6 bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-all"
              style={{ fontSize: "9px" }}
            >
              Add
            </button>
          </div>
          {form.certifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-caption flex items-center gap-2 bg-white border border-slate-100 text-slate-900 px-4 py-2 rounded-lg ring-1 ring-emerald-500/10"
                  style={{ fontSize: "9px" }}
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCert(cert)}
                    className="text-slate-300 hover:text-red-500 transition-colors text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Visibility */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h4 className="text-slate-900 px-4">Visibility</h4>
        <div className="space-y-3 px-4">
          {(
            [
              {
                key: "isFeatured",
                label: "Homepage Spotlight",
                desc: "Feature this product in the main landing carousel",
              },
              {
                key: "isBestseller",
                label: "Bestseller Status",
                desc: "Mark as a popular choice to drive more interest",
              },
              {
                key: "isNew",
                label: "New Arrival",
                desc: 'Add a "New" badge for recent catalog updates',
              },
            ] as const
          ).map(({ key, label, desc }) => (
            <label
              key={key}
              className="flex items-center gap-6 p-5 rounded-3xl bg-slate-50 border border-slate-100 cursor-pointer select-none transition-all hover:bg-slate-100/70 group"
            >
              <button
                type="button"
                role="switch"
                aria-checked={form[key]}
                onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                className={`relative w-10 h-5 rounded-lg transition-all shrink-0 ${form[key] ? "bg-emerald-500" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form[key] ? "right-1" : "left-1"}`}
                />
              </button>
              <div>
                <p className="text-caption text-slate-900" style={{ fontSize: "12px" }}>
                  {label}
                </p>
                <p className="text-xs font-normal text-slate-400 tracking-tight mt-0.5">
                  {desc}
                </p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h4 className="text-slate-900 px-4">SEO</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Meta Title</label>
            <input
              value={form.seoTitle}
              onChange={(e) => patch("seoTitle", e.target.value)}
              className={inp}
              placeholder="Defaults to product name"
              maxLength={60}
            />
            <div className="mt-2 flex justify-end">
              <span className="text-caption text-slate-300" style={{ fontSize: "8px" }}>
                {form.seoTitle.length}/60
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Meta Description</label>
            <textarea
              value={form.seoDescription}
              onChange={(e) => patch("seoDescription", e.target.value)}
              className={`${area} h-24`}
              placeholder="Search engine snippet..."
              maxLength={160}
            />
            <div className="mt-2 flex justify-end">
              <span className="text-caption text-slate-300" style={{ fontSize: "8px" }}>
                {form.seoDescription.length}/160
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom save actions */}
      <div className="flex justify-end gap-6 pt-10 border-t border-slate-50">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-caption text-slate-400 hover:text-red-500 transition-all"
          style={{ fontSize: "10px" }}
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={saving}
          className="text-caption px-12 py-5 bg-slate-900 text-white hover:bg-emerald-600 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-black/10"
          style={{ fontSize: "12px" }}
        >
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Add Product"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
