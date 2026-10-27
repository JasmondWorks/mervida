"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBlogPosts, deleteBlogPost, type BlogPost } from "@/app/lib/api-client";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts().then(setPosts);
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await deleteBlogPost(id);
  }

  return (
    <div className="p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold tracking-tighter text-slate-950 leading-none">
            Blog
          </h1>
          <p className="text-slate-400 font-medium text-xs">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-5xl border border-slate-100 overflow-hidden">
        {posts.length === 0 ? (
          <p className="text-center py-24 text-[11px] font-bold text-slate-400 tracking-widest uppercase italic">
            No posts yet.
          </p>
        ) : (
          <table className="w-full">
            <tbody className="divide-y divide-slate-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-900">{post.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">/{post.slug}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg ${
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-950 px-3 py-1.5"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 px-3 py-1.5"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
