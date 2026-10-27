"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchAdminBlogPosts, deleteBlogPost, type BlogPost, type Pagination } from "@/app/lib/api-client";
import { ConfirmDialog, H1, Modal, Button } from "@/app/components/ui";
import { Table, type TableColumn } from "@/app/components/table";

function estimateReadingTime(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    reload(page);
  }, [page]);

  async function reload(targetPage = page) {
    setLoading(true);
    const res = await fetchAdminBlogPosts({ page: targetPage, limit: 10 });
    setPosts(res.data ?? []);
    setPagination(res.pagination);
    setLoading(false);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    await deleteBlogPost(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    reload(page);
  }

  return (
    <div className="px-4 py-6 sm:p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <H1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-950 leading-tight">
            Blog
          </H1>
          <p className="text-slate-400 font-normal text-xs mt-1">
            {pagination?.totalCount ?? posts.length} {(pagination?.totalCount ?? posts.length) === 1 ? "post" : "posts"}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/blog"
            target="_blank"
            className="h-10 px-3.5 inline-flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 rounded-lg hover:border-emerald-500 hover:text-emerald-700 transition-all text-xs font-semibold"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            <span>Live Blog</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="h-10 px-4 inline-flex items-center justify-center bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
          >
            + New Post
          </Link>
        </div>
      </div>

      {/* Mobile Card List (< md) */}
      <div className="block md:hidden space-y-3">
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-400 text-sm font-normal">
            No posts yet. Click &quot;+ New Post&quot; to create one.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    /{post.slug}
                  </p>
                </div>
                <span
                  className={`text-caption shrink-0 px-2.5 py-1 rounded-lg ${
                    post.status === "published"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                  style={{ fontSize: "9px" }}
                >
                  {post.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewPost(post)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Preview
                </button>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(post)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 pb-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasPrevious}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-xs font-semibold text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Table (>= md) */}
      <div className="hidden md:block">
        <Table
          data={posts}
          loading={loading}
          isPaginated={Boolean(pagination && pagination.totalPages > 1)}
          currentPage={pagination?.page ?? page}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={(p) => setPage(p)}
          hasHeaders={false}
          emptyMessage="No posts yet."
          columns={
            [
              {
                key: "title",
                label: "Title",
                render: (post) => (
                  <div className="py-1">
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      /{post.slug}
                    </p>
                  </div>
                ),
              },
              {
                key: "status",
                label: "Status",
                className: "w-28",
                render: (post) => (
                  <span
                    className={`text-caption px-3 py-1 rounded-lg ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                    style={{ fontSize: "9px" }}
                  >
                    {post.status}
                  </span>
                ),
              },
              {
                key: "actions",
                label: "",
                className: "text-right w-48",
                render: (post) => (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewPost(post)}
                      className="inline-flex items-center gap-1 text-caption text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
                      style={{ fontSize: "10px" }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Preview
                    </button>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-caption text-slate-500 hover:text-slate-950 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
                      style={{ fontSize: "10px" }}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(post)}
                      className="text-caption text-red-500 hover:text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      style={{ fontSize: "10px" }}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ] as TableColumn<BlogPost>[]
          }
        />
      </div>

      {/* In-Dashboard Blog Post Preview Modal */}
      <Modal
        open={previewPost !== null}
        onClose={() => setPreviewPost(null)}
        title="Blog Post Preview"
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between w-full px-6 py-4 bg-slate-50/60 border-t border-slate-100 rounded-b-5xl gap-3">
            <Link
              href={`/blog/${previewPost?.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Open Live Post URL
            </Link>
            <div className="flex items-center gap-2">
              {previewPost && (
                <Link
                  href={`/admin/blog/${previewPost.id}/edit`}
                  className="h-10 px-4 inline-flex items-center justify-center rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-all bg-white"
                >
                  Edit Post
                </Link>
              )}
              <Button
                variant="secondary"
                onClick={() => setPreviewPost(null)}
                className="h-10 px-4 text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        }
      >
        {previewPost && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[65vh]">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className={`text-caption px-2.5 py-1 rounded-lg ${
                    previewPost.status === "published"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                  style={{ fontSize: "9px" }}
                >
                  {previewPost.status}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  /{previewPost.slug}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-normal">
                {estimateReadingTime(previewPost.body)} min read
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {previewPost.title}
              </h2>
              {previewPost.excerpt && (
                <p className="text-sm font-normal text-slate-500 mt-2 leading-relaxed">
                  {previewPost.excerpt}
                </p>
              )}
            </div>

            {previewPost.coverImage && (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 bg-slate-50">
                <Image
                  src={previewPost.coverImage}
                  alt={previewPost.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="blog-prose max-w-none pt-2"
              dangerouslySetInnerHTML={{ __html: previewPost.body }}
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete post?"
        message={`"${pendingDelete?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
