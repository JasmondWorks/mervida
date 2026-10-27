"use client";
import { useEffect, useState } from "react";
import { generateSlug } from "@/app/lib/store";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategoryApi,
  fetchProducts,
} from "@/app/lib/api-client";
import type { Category } from "@/app/lib/types";

type FormState = { name: string; slug: string; description: string };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>(
    {},
  );
  const [editing, setEditing] = useState<string | null>(null); // id or 'new'
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    reload();
  }, []);

  async function reload() {
    const [cats, products] = await Promise.all([fetchCategories(), fetchProducts()]);
    setCategories(cats);
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
    });
    setProductCounts(counts);
  }

  function startEdit(cat?: Category) {
    if (cat) {
      setForm({ name: cat.name, slug: cat.slug, description: cat.description });
      setEditing(cat.id);
    } else {
      setForm({ name: "", slug: "", description: "" });
      setEditing("new");
    }
    setError("");
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: generateSlug(name) }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    const slug = form.slug || generateSlug(form.name);

    try {
      if (editing === "new") {
        await createCategory({ name: form.name.trim(), slug, description: form.description });
      } else {
        await updateCategory(editing!, {
          name: form.name.trim(),
          slug,
          description: form.description,
        });
      }
      setEditing(null);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save category.");
    }
  }

  async function handleDelete(id: string, name: string) {
    const count = productCounts[id] ?? 0;
    if (count > 0) {
      alert(
        `Cannot delete "${name}" — it has ${count} product(s). Reassign those products first.`,
      );
      return;
    }
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    setCategories((prev) => prev.filter((c) => c.id !== id)); // instant UI update
    await deleteCategoryApi(id);
  }

  const inp =
    "w-full bg-white border border-slate-200 rounded-lg px-6 py-3.5 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
  const lbl = "text-caption text-slate-400 block mb-2 ml-5";

  return (
    <div className="p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div className="space-y-3">
          <h1 className="text-slate-900 tracking-tighter leading-none">Categories</h1>
          <p className="text-slate-500 font-normal text-sm">
            <span className="text-slate-900 font-semibold">{categories.length}</span>{" "}
            {categories.length === 1 ? "category" : "categories"} organizing your products
          </p>
        </div>
        <button
          onClick={() => startEdit()}
          className="text-caption px-8 py-3.5 bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-all active:scale-95 shadow-2xl shadow-slate-900/10"
        >
          + New Category
        </button>
      </div>

      {/* Inline form */}
      {editing !== null && (
        <div className="bg-slate-50 rounded-5xl border border-slate-100 p-8 mb-8 space-y-6 animate-in zoom-in-95 duration-500">
          <h3 className="text-slate-900 px-2">
            {editing === "new" ? "New Category" : "Edit Category"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={lbl}>Category Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={inp}
                placeholder="e.g. African Foods"
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <label className={lbl}>URL Slug</label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                className={inp}
                placeholder="african-foods"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={lbl}>Description</label>
            <input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className={inp}
              placeholder="Shown to shoppers browsing this category (optional)"
            />
          </div>

          {error && <p className="text-caption text-red-500 ml-5">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 px-2">
            <button
              onClick={() => setEditing(null)}
              className="text-caption px-6 py-2.5 text-slate-400 hover:text-red-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-caption px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-black/10"
            >
              {editing === "new" ? "Add Category" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-6xl border border-slate-100 overflow-hidden shadow-2xl shadow-slate-900/2">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="text-left text-caption text-slate-400 px-10 py-5" style={{ fontSize: "10px" }}>
                Category
              </th>
              <th className="text-left text-caption text-slate-400 px-10 py-5" style={{ fontSize: "10px" }}>
                URL
              </th>
              <th className="text-left text-caption text-slate-400 px-10 py-5" style={{ fontSize: "10px" }}>
                Products
              </th>
              <th className="text-right text-caption text-slate-400 px-10 py-5" style={{ fontSize: "10px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-24 text-caption text-slate-400 italic"
                  style={{ fontSize: "11px" }}
                >
                  No categories yet
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-10 py-6">
                    <p className="text-sm font-semibold text-slate-900 tracking-tight">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-xs text-slate-400 font-normal mt-1.5">
                        {cat.description}
                      </p>
                    )}
                  </td>
                  <td className="px-10 py-6 font-mono text-[10px] text-slate-400">
                    /products?category={cat.slug}
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-caption inline-flex items-center justify-center bg-slate-100 text-slate-900 px-3 py-1 rounded-lg" style={{ fontSize: "10px" }}>
                      {productCounts[cat.id] ?? 0}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 border border-slate-100 rounded-lg p-1 bg-slate-50/50 w-fit ml-auto">
                      <button
                        onClick={() => startEdit(cat)}
                        className="text-caption px-5 py-2 text-slate-900 hover:bg-white rounded-lg transition-all"
                        style={{ fontSize: "10px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-caption px-5 py-2 text-red-500 hover:bg-white rounded-lg transition-all"
                        style={{ fontSize: "10px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
