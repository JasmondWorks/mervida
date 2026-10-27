"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, Category, Variant, ProcessVideo } from "@/app/lib/types";
import { generateId, generateSlug } from "@/app/lib/store";
import { fetchCategories, createProduct, updateProduct } from "@/app/lib/api-client";
import { uploadFile, UPLOAD_FOLDERS } from "@/app/lib/upload-client";
import { Button, Field, Toggle, H1, H4, type SelectOption } from "@/app/components/ui";

interface Props {
  initialData?: Product;
  mode: "create" | "edit";
}

type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

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

const VISIBILITY_FLAGS = [
  {
    key: "isFeatured" as const,
    label: "Homepage Spotlight",
    desc: "Feature this product in the main landing carousel",
  },
  {
    key: "isBestseller" as const,
    label: "Bestseller Status",
    desc: "Mark as a popular choice to drive more interest",
  },
  {
    key: "isNew" as const,
    label: "New Arrival",
    desc: 'Add a "New" badge for recent catalog updates',
  },
];

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
    fetchCategories({ all: true }).then((res) => setCategories(res.data ?? []));
  }, []);

  const categoryOptions: SelectOption[] = [
    { label: "Select Category", value: "" },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
  ];

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
      className="p-6 sm:p-10 max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-500"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div className="space-y-3">
          <H1 className="text-slate-900 tracking-tighter leading-none text-balance">
            {mode === "create" ? "New Product" : `Edit: ${form.name}`}
          </H1>
          {form.slug && (
            <p className="text-[10px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg w-fit tracking-tighter italic">
              URL: /products/{form.slug}
            </p>
          )}
        </div>
        <div className="flex gap-4 shrink-0">
          <Button type="button" variant="secondary" onClick={() => router.back()} className="hover:text-red-500 hover:border-red-100">
            Cancel
          </Button>
          <Button type="submit" loading={saving} className="shadow-2xl shadow-slate-900/10">
            {mode === "create" ? "Add Product" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100">
        <H4 className="text-slate-900 px-4">Basic Info</H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <Field
            label="Product Name"
            required
            value={form.name}
            onValueChange={handleNameChange}
            placeholder="Full Product Name"
          />
          <div className="space-y-1.5">
            <label className={lbl}>URL Slug *</label>
            <div className="flex gap-2">
              <Field
                value={form.slug}
                onValueChange={handleSlugChange}
                required
                placeholder="url-safe-slug"
                wrapperClassName="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSlugManual(false);
                  patch("slug", generateSlug(form.name));
                }}
                className="shrink-0"
                style={{ fontSize: "9px" }}
              >
                Auto
              </Button>
            </div>
            {slugError && <p className="text-caption text-red-500 ml-5 mt-2" style={{ fontSize: "9px" }}>{slugError}</p>}
          </div>
        </div>

        <div className="px-4">
          <Field
            label="Short Description"
            required
            value={form.shortDescription}
            onValueChange={(v) => patch("shortDescription", v)}
            placeholder="High-impact summary for product cards"
          />
        </div>

        <div className="px-4">
          <Field
            label="Full Description"
            type="textarea"
            value={form.fullDescription}
            onValueChange={(v) => patch("fullDescription", v)}
            className="h-32"
            placeholder="Deep dive into product benefits and details..."
          />
        </div>
      </section>

      {/* Pricing & Category */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <H4 className="text-slate-900 px-4">Pricing &amp; Category</H4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <Field
            label="Price (₦)"
            type="number"
            required
            min={0}
            value={form.price}
            onValueChange={(v) => patch("price", +v)}
          />
          <Field
            label="Unit"
            required
            value={form.unit}
            onValueChange={(v) => patch("unit", v)}
            placeholder="e.g. 1kg, Pack of 10"
          />
          <Field
            label="Category"
            type="select"
            options={categoryOptions}
            value={form.categoryId}
            onValueChange={(v) => patch("categoryId", v)}
          />
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <div className="flex items-center justify-between px-4">
          <H4 className="text-slate-900">Product Images</H4>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            loading={uploadingImage}
            style={{ fontSize: "9px" }}
          >
            {uploadingImage ? "Uploading..." : "+ Upload Image"}
          </Button>
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
        <H4 className="text-slate-900 px-4">Manufacturing Process Video</H4>
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
                <Button type="button" variant="ghost" size="sm" onClick={() => patchVideo("videoUrl", "")} style={{ fontSize: "9px" }}>
                  Remove Video
                </Button>
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
                <Button type="button" variant="ghost" size="sm" onClick={() => patchVideo("posterUrl", "")} style={{ fontSize: "9px" }}>
                  Remove Poster
                </Button>
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
            <Field
              label="Video Title"
              value={form.processVideo.title}
              onValueChange={(v) => patchVideo("title", v)}
              placeholder="How We Make This Product"
            />
            <Field
              label="Duration (optional)"
              value={form.processVideo.duration ?? ""}
              onValueChange={(v) => patchVideo("duration", v)}
              placeholder="1:10"
            />
          </div>
        )}
      </section>

      {/* Inventory */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <H4 className="text-slate-900 px-4">Stock</H4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div>
            <Field
              label="Stock Quantity"
              type="number"
              required
              min={0}
              value={form.stockCount ?? 0}
              onValueChange={(v) => {
                const val = +v;
                patch("stockCount", val);
                // Auto-toggle inStock if stock is added to a previously out-of-stock item
                if (val > 0 && !form.inStock) patch("inStock", true);
                if (val === 0 && form.inStock) patch("inStock", false);
              }}
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
            <Toggle
              checked={form.inStock}
              onChange={(checked) => patch("inStock", checked)}
              label={form.inStock ? "Currently in stock" : "Out of stock"}
            />
            <p className="text-xs font-normal text-slate-400 mt-3 ml-5 leading-tight">
              Manually override product availability regardless of count.
            </p>
          </div>
          <Field
            label="NAFDAC Number"
            value={form.nafdacNumber ?? ""}
            onValueChange={(v) => patch("nafdacNumber", v)}
            placeholder="REG NO."
          />
        </div>
      </section>

      {/* Variants */}
      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100">
        <div className="flex items-center justify-between px-4">
          <H4 className="text-slate-900">Variants</H4>
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
          <H4 className="text-slate-900">Nutrition Facts</H4>
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
        <H4 className="text-slate-900 px-4">Certifications</H4>
        <div className="space-y-4 px-4">
          <div className="flex gap-2">
            <Field
              value={certInput}
              onValueChange={setCertInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCert();
                }
              }}
              placeholder="Tag... (e.g. Organic)"
              wrapperClassName="flex-1"
            />
            <Button type="button" onClick={addCert} style={{ fontSize: "9px" }}>
              Add
            </Button>
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
        <H4 className="text-slate-900 px-4">Visibility</H4>
        <div className="space-y-3 px-4">
          {VISIBILITY_FLAGS.map(({ key, label, desc }) => (
            <Toggle
              key={key}
              checked={form[key]}
              onChange={(checked) => setForm((f) => ({ ...f, [key]: checked }))}
              label={label}
              description={desc}
              className="w-full"
            />
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <H4 className="text-slate-900 px-4">SEO</H4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div>
            <Field
              label="Meta Title"
              value={form.seoTitle}
              onValueChange={(v) => patch("seoTitle", v)}
              placeholder="Defaults to product name"
              maxLength={60}
            />
            <div className="mt-2 flex justify-end">
              <span className="text-caption text-slate-300" style={{ fontSize: "8px" }}>
                {form.seoTitle.length}/60
              </span>
            </div>
          </div>
          <div>
            <Field
              label="Meta Description"
              type="textarea"
              value={form.seoDescription}
              onValueChange={(v) => patch("seoDescription", v)}
              className="h-24"
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
        <Button type="button" variant="ghost" onClick={() => router.back()} style={{ fontSize: "10px" }}>
          Discard
        </Button>
        <Button type="submit" loading={saving} className="px-12 shadow-2xl shadow-black/10" style={{ fontSize: "12px" }}>
          {mode === "create" ? "Add Product" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
