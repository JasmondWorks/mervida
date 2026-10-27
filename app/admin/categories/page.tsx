"use client";
import { useEffect, useState } from "react";
import { generateSlug } from "@/app/lib/store";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategoryApi,
  fetchProducts,
  type Pagination,
} from "@/app/lib/api-client";
import type { Category } from "@/app/lib/types";
import { Button, Field, Modal, ConfirmDialog, H1 } from "@/app/components/ui";
import { Table, type TableColumn } from "@/app/components/table";

type FormState = { name: string; slug: string; description: string };
const EMPTY_FORM: FormState = { name: "", slug: "", description: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<string | null>(null); // id or 'new'
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [blockedDelete, setBlockedDelete] = useState<{ name: string; count: number } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    reload(1);
  }, []);

  async function reload(targetPage = page) {
    const [catsRes, productsRes] = await Promise.all([
      fetchCategories({ page: targetPage, limit: 10 }),
      fetchProducts({ all: true }),
    ]);
    setCategories(catsRes.data ?? []);
    setPagination(catsRes.pagination);
    const counts: Record<string, number> = {};
    (productsRes.data ?? []).forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
    });
    setProductCounts(counts);
  }

  function startEdit(cat?: Category) {
    setForm(cat ? { name: cat.name, slug: cat.slug, description: cat.description } : EMPTY_FORM);
    setEditing(cat ? cat.id : "new");
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
    setSaving(true);
    setError("");

    try {
      if (editing === "new") {
        await createCategory({ name: form.name.trim(), slug, description: form.description });
      } else {
        await updateCategory(editing!, { name: form.name.trim(), slug, description: form.description });
      }
      setEditing(null);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save category.");
    } finally {
      setSaving(false);
    }
  }

  function requestDelete(cat: Category) {
    const count = productCounts[cat.id] ?? 0;
    if (count > 0) {
      setBlockedDelete({ name: cat.name, count });
      return;
    }
    setPendingDelete(cat);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setCategories((prev) => prev.filter((c) => c.id !== pendingDelete.id)); // instant UI update
    await deleteCategoryApi(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div className="space-y-3">
          <H1 className="text-slate-900 tracking-tighter leading-none">Categories</H1>
          <p className="text-slate-500 font-normal text-sm">
            <span className="text-slate-900 font-semibold">{categories.length}</span>{" "}
            {categories.length === 1 ? "category" : "categories"} organizing your products
          </p>
        </div>
        <Button onClick={() => startEdit()} className="shadow-2xl shadow-slate-900/10">
          + New Category
        </Button>
      </div>

      {/* Table */}
      <Table
        data={categories}
        emptyMessage="No categories yet"
        isPaginated={Boolean(pagination && pagination.totalPages > 1)}
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={(newPage) => {
          setPage(newPage);
          reload(newPage);
        }}
        columns={
          [
            {
              key: "name",
              label: "Category",
              render: (cat) => (
                <>
                  <p className="text-sm font-semibold text-slate-900 tracking-tight">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-slate-400 font-normal mt-1.5">{cat.description}</p>
                  )}
                </>
              ),
            },
            {
              key: "slug",
              label: "URL",
              className: "font-mono text-[10px] text-slate-400",
              render: (cat) => `/products?category=${cat.slug}`,
            },
            {
              key: "products",
              label: "Products",
              render: (cat) => (
                <span
                  className="text-caption inline-flex items-center justify-center bg-slate-100 text-slate-900 px-3 py-1 rounded-lg"
                  style={{ fontSize: "10px" }}
                >
                  {productCounts[cat.id] ?? 0}
                </span>
              ),
            },
          ] as TableColumn<Category>[]
        }
        actions={[
          { label: "Edit", onClick: startEdit },
          { label: "Delete", onClick: requestDelete, className: "text-red-500" },
        ]}
      />

      {/* New / Edit Category modal */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "New Category" : "Edit Category"}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editing === "new" ? "Add Category" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field
            label="Category Name"
            required
            value={form.name}
            onValueChange={handleNameChange}
            placeholder="e.g. African Foods"
            autoFocus
          />
          <Field
            label="URL Slug"
            value={form.slug}
            onValueChange={(v) => setForm((f) => ({ ...f, slug: v }))}
            placeholder="african-foods"
          />
          <Field
            label="Description"
            value={form.description}
            onValueChange={(v) => setForm((f) => ({ ...f, description: v }))}
            placeholder="Shown to shoppers browsing this category (optional)"
          />
          {error && <p className="text-caption text-red-500 ml-5">{error}</p>}
        </div>
      </Modal>

      {/* Blocked-delete notice */}
      <Modal
        open={blockedDelete !== null}
        onClose={() => setBlockedDelete(null)}
        title="Can't delete this category"
        size="sm"
        footer={
          <Button variant="secondary" onClick={() => setBlockedDelete(null)}>
            Got it
          </Button>
        }
      >
        <p className="text-sm font-normal text-slate-500 leading-relaxed">
          &ldquo;{blockedDelete?.name}&rdquo; has {blockedDelete?.count} product
          {blockedDelete?.count === 1 ? "" : "s"} assigned to it. Reassign those products to a different
          category first.
        </p>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete category?"
        message={`"${pendingDelete?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
