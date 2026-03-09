"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, Category, Variant } from "@/app/lib/types";
import {
  getCategories,
  saveProduct,
  isSlugUnique,
  generateId,
  generateSlug,
  AVAILABLE_IMAGES,
} from "@/app/lib/store";

interface Props {
  initialData?: Product;
  mode: "create" | "edit";
}

type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

const inp =
  "w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
const area =
  "w-full bg-white border border-slate-200 rounded-4xl px-6 py-5 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none";
const lbl =
  "block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5";

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
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSlugError("");
    if (!isSlugUnique(form.slug, initialData?.id)) {
      setSlugError("This slug is already in use by another product.");
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();

    // Map local array-based specs back to Record for storage
    const specsRecord: Record<string, string> = {};
    form.nutritionSpecs.forEach((s) => {
      if (s.key.trim()) specsRecord[s.key] = s.value;
    });

    // Map internal variants back to clean API variants (removing IDs)
    const cleanVariants: Variant[] = form.variants.map(
      ({ id, ...rest }) => rest,
    );

    saveProduct({
      ...form,
      variants: cleanVariants.length > 0 ? cleanVariants : null,
      nutritionSpecs: Object.keys(specsRecord).length > 0 ? specsRecord : null,
      id: initialData?.id ?? generateId(),
      createdAt: initialData?.createdAt ?? now,
      updatedAt: now,
    } as Product);
    router.push("/admin/products");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-500"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600">
            Product Studio
          </p>
          <h1 className="text-4xl font-display font-bold tracking-tighter text-slate-900 leading-none text-balance">
            {mode === "create" ? "Draft New Product" : `Editing: ${form.name}`}
          </h1>
          {form.slug && (
            <p className="text-[10px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit tracking-tighter italic">
              system.slug: {form.slug}
            </p>
          )}
        </div>
        <div className="flex gap-4 shrink-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3.5 border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-slate-900 text-white hover:bg-emerald-600 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-slate-900/10"
          >
            {saving
              ? "Synchronizing..."
              : mode === "create"
                ? "Add to Catalog"
                : "Push Updates"}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <section className="bg-slate-50 rounded-5xl p-8 space-y-6 border border-slate-100">
        <h2 className="text-[13px] font-bold text-slate-900 tracking-tight px-4">
          Product Definition
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Display Name *</label>
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
                className="px-4 bg-white border border-slate-200 text-slate-400 rounded-full text-[9px] font-bold uppercase tracking-widest hover:text-emerald-600 transition-all hover:border-emerald-100 h-12"
              >
                Auto
              </button>
            </div>
            {slugError && (
              <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest ml-5 mt-2">
                {slugError}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5 px-4">
          <label className={lbl}>Short Summary *</label>
          <input
            value={form.shortDescription}
            onChange={(e) => patch("shortDescription", e.target.value)}
            className={inp}
            required
            placeholder="High-impact summary for product cards"
          />
        </div>

        <div className="space-y-1.5 px-4">
          <label className={lbl}>Detailed Description</label>
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
        <h2 className="text-[13px] font-bold text-slate-900 tracking-tight px-4">
          Pricing & Category
        </h2>
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
            <label className={lbl}>Package Unit *</label>
            <input
              value={form.unit}
              onChange={(e) => patch("unit", e.target.value)}
              className={inp}
              required
              placeholder="e.g. 1kg, Pack of 10"
            />
          </div>
          <div className="space-y-1.5">
            <label className={lbl}>Catalog Category</label>
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
      <section className="bg-slate-900 rounded-5xl p-8 space-y-6 text-white">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-[13px] font-bold text-white tracking-tight">
            Product Images
          </h2>
          <button
            type="button"
            onClick={() => setShowPicker((p) => !p)}
            className="text-[9px] font-bold uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-all"
          >
            {showPicker ? "Close Picker" : "Open Library"}
          </button>
        </div>

        {form.images.length > 0 && (
          <div className="px-4">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4">
              Selection Matrix
            </p>
            <div className="flex gap-3 flex-wrap">
              {form.images.map((src, idx) => (
                <div key={src} className="relative group">
                  <div
                    className={`relative w-24 h-28 rounded-xl overflow-hidden border transition-all ${idx === 0 ? "border-emerald-500" : "border-white/5 opacity-50 hover:opacity-100"}`}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                    {idx === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-[8px] font-bold uppercase tracking-widest py-1 text-center">
                        Main
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 flex gap-1 opacity-100 group-hover:opacity-100 transition-all z-20">
                    <button
                      type="button"
                      onClick={() => toggleImage(src)}
                      className="w-5 h-5 bg-white text-slate-950 rounded-full flex items-center justify-center text-xs shadow-xl transition-all hover:bg-red-500 hover:text-white font-black"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPicker && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 animate-in fade-in duration-500">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {AVAILABLE_IMAGES.map((src) => {
                const selected = form.images.includes(src);
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => toggleImage(src)}
                    className={`relative aspect-3/4 rounded-lg overflow-hidden border transition-all ${selected ? "border-emerald-500 ring-2 ring-emerald-500/30" : "border-transparent opacity-40 hover:opacity-80"}`}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Inventory */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h2 className="text-[13px] font-bold text-slate-900 tracking-tight px-4">
          Inventory Control
        </h2>
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 ml-5">
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
              className={`w-full h-12 rounded-full border transition-all flex items-center justify-center gap-3 px-6 ${
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
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {form.inStock ? "Currently in stock" : "Out of stock"}
              </span>
            </button>
            <p className="text-[9px] text-slate-400 font-medium mt-3 ml-5 leading-tight">
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
          <h2 className="text-[13px] font-bold text-slate-900 tracking-tight">
            Product Options
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 hover:text-slate-950 transition-colors"
          >
            + New Variant
          </button>
        </div>
        <div className="space-y-2 px-4">
          {form.variants.length === 0 ? (
            <p className="text-[10px] font-medium text-slate-400 text-center py-6 bg-white/50 rounded-2xl border border-dashed border-slate-200">
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
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs focus:bg-white focus:border-emerald-500 transition-all"
                  placeholder="Variant Label"
                />
                <input
                  type="number"
                  min="0"
                  value={v.price}
                  onChange={(e) =>
                    updateVariant(v.id, "price", +e.target.value)
                  }
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs focus:bg-white focus:border-emerald-500 transition-all"
                />
                <input
                  type="number"
                  min="0"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(v.id, "stock", +e.target.value)
                  }
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs focus:bg-white focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(v.id)}
                  className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
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
          <h2 className="text-[13px] font-bold text-slate-900 tracking-tight">
            Technical Details
          </h2>
          <button
            type="button"
            onClick={addSpec}
            className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 hover:text-slate-950 transition-colors"
          >
            + Add Spec
          </button>
        </div>
        <div className="space-y-2 px-4">
          {form.nutritionSpecs.length === 0 ? (
            <p className="text-[10px] font-medium text-slate-400 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
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
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-emerald-500 transition-all"
                  placeholder="Label (e.g. Energy)"
                />
                <input
                  value={s.value}
                  onChange={(e) => updateSpec(s.id, "value", e.target.value)}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-emerald-500 transition-all"
                  placeholder="Value (e.g. 150kcal)"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(s.id)}
                  className="text-[9px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors text-right px-4"
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
        <h2 className="text-[13px] font-bold text-slate-900 tracking-tight px-4">
          Certifications
        </h2>
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
              className="flex-1 bg-white border border-slate-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="Tag... (e.g. Organic)"
            />
            <button
              type="button"
              onClick={addCert}
              className="px-6 bg-slate-950 text-white rounded-full font-bold text-[9px] uppercase tracking-widest hover:bg-emerald-600 transition-all"
            >
              Add
            </button>
          </div>
          {form.certifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.certifications.map((cert) => (
                <span
                  key={cert}
                  className="flex items-center gap-2 bg-white border border-slate-100 text-slate-900 text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full ring-1 ring-emerald-500/10"
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

      {/* Feature Tags */}
      <section className="bg-slate-950 rounded-5xl p-8 space-y-6 text-white relative overflow-hidden border border-slate-900">
        <h2 className="text-[13px] font-bold text-white tracking-tight px-4 relative z-10">
          Market Visibility
        </h2>
        <div className="space-y-3 px-4 relative z-10">
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
              className="flex items-center gap-6 p-5 rounded-3xl bg-white/5 border border-white/5 cursor-pointer select-none transition-all hover:bg-white/10 group"
            >
              <button
                type="button"
                role="switch"
                aria-checked={form[key]}
                onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                className={`relative w-10 h-5 rounded-full transition-all shrink-0 ${form[key] ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "bg-slate-800"}`}
              >
                <div
                  className={`absolute top-1 w-3 h-3 rounded-full transition-all ${form[key] ? "right-1 bg-white" : "left-1 bg-slate-500"}`}
                />
              </button>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest">
                  {label}
                </p>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                  {desc}
                </p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* SEO Positioning */}
      <section className="bg-white rounded-5xl p-8 space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/1">
        <h2 className="text-[13px] font-bold text-slate-900 tracking-tight px-4">
          SEO Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="space-y-1.5">
            <label className={lbl}>Meta Title Overide</label>
            <input
              value={form.seoTitle}
              onChange={(e) => patch("seoTitle", e.target.value)}
              className={inp}
              placeholder="Defaults to product name"
              maxLength={60}
            />
            <div className="mt-2 flex justify-end">
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
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
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
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
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all"
        >
          Abandon Draft
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-12 py-5 bg-slate-950 text-white hover:bg-emerald-600 rounded-full font-bold text-[12px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-black/10"
        >
          {saving
            ? "Synchronizing..."
            : mode === "create"
              ? "Finalize & Publish"
              : "Commit Changes"}
        </button>
      </div>
    </form>
  );
}
