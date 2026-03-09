"use client";
import { useEffect, useState } from "react";
import {
  getCategories,
  saveCategory,
  deleteCategory,
  getProducts,
  generateId,
  generateSlug,
} from "@/app/lib/store";
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

  function reload() {
    const cats = getCategories();
    setCategories(cats);
    const products = getProducts();
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

  function handleSave() {
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    const slug = form.slug || generateSlug(form.name);
    const now = new Date().toISOString();

    if (editing === "new") {
      saveCategory({
        id: generateId(),
        name: form.name.trim(),
        slug,
        description: form.description,
        createdAt: now,
      });
    } else {
      const existing = categories.find((c) => c.id === editing)!;
      saveCategory({
        ...existing,
        name: form.name.trim(),
        slug,
        description: form.description,
      });
    }
    setEditing(null);
    reload();
  }

  function handleDelete(id: string, name: string) {
    const count = productCounts[id] ?? 0;
    if (count > 0) {
      alert(
        `Cannot delete "${name}" — it has ${count} product(s). Reassign those products first.`,
      );
      return;
    }
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    deleteCategory(id);
    reload();
  }

  const inp =
    "w-full bg-white border border-slate-200 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
  const lbl =
    "block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 ml-5";

  return (
    <div className="p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
            Product Organization
          </p>
          <h1 className="text-4xl font-display font-black tracking-tighter text-slate-900 leading-none">
            Catalog Categories
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Structure your catalog with{" "}
            <span className="text-slate-900 font-bold">
              {categories.length}
            </span>{" "}
            logical groupings
          </p>
        </div>
        <button
          onClick={() => startEdit()}
          className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-2xl shadow-slate-900/10"
        >
          + Create Category
        </button>
      </div>

      {/* Inline form - Consistent Modern UI */}
      {editing !== null && (
        <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 mb-8 space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
              {editing === "new"
                ? "Drafting New Classification"
                : "Updating Category Schema"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={lbl}>Category Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={inp}
                placeholder="Display Name"
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
                placeholder="Perm-slug-format"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={lbl}>Meta Narrative</label>
            <input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className={inp}
              placeholder="Summary for internal organization (optional)"
            />
          </div>

          {error && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-5">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4 px-2">
            <button
              onClick={() => setEditing(null)}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-black/10"
            >
              Commit Entry
            </button>
          </div>
        </div>
      )}

      {/* Table - Consistent Modern Container */}
      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-900/[0.02]">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-10 py-5">
                Classification
              </th>
              <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-10 py-5">
                Permalink
              </th>
              <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-10 py-5">
                Volume
              </th>
              <th className="text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-10 py-5">
                Management
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-24 text-[11px] font-bold text-slate-400 tracking-widest uppercase italic"
                >
                  No Categories Initialized
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-10 py-6">
                    <p className="text-sm font-black text-slate-900 tracking-tight">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                        {cat.description}
                      </p>
                    )}
                  </td>
                  <td className="px-10 py-6 font-mono text-[10px] text-slate-400 italic">
                    sys.category/{cat.slug}
                  </td>
                  <td className="px-10 py-6">
                    <span className="inline-flex items-center justify-center bg-slate-100 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                      {productCounts[cat.id] ?? 0} SKU's
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 border border-slate-100 rounded-full p-1 bg-slate-50/50 w-fit ml-auto">
                      <button
                        onClick={() => startEdit(cat)}
                        className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-white rounded-full transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-white rounded-full transition-all"
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
