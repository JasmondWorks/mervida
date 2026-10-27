"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogPostBySlug, type BlogPost } from "@/app/lib/api-client";

function estimateReadingTime(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchBlogPostBySlug(slug).then((result) => {
      if (!result) setNotFound(true);
      else setPost(result);
    });
  }, [slug]);

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="text-slate-400 text-sm font-medium">Post not found.</p>
        <Link href="/blog" className="text-emerald-600 text-sm font-bold mt-4 inline-block">
          Back to The Journal
        </Link>
      </div>
    );
  }

  if (!post) return null;

  const publishedDate = post.publishedAt ?? post.createdAt;

  return (
    <article className="bg-[#faf9f7]">
      {/* Hero */}
      <header className="max-w-3xl mx-auto px-6 sm:px-0 pt-16 sm:pt-24 pb-10">
        <Link
          href="/blog"
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          ← The Journal
        </Link>
        <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tighter text-slate-950 mt-6 mb-5 leading-[1.08]">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <span>
            {new Date(publishedDate).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          <span>{estimateReadingTime(post.body)} min read</span>
        </div>
      </header>

      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-6 sm:px-0 mb-14">
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-900/5">
            <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 sm:px-0 pb-24 sm:pb-32">
        <div className="blog-prose max-w-none" dangerouslySetInnerHTML={{ __html: post.body }} />

        <div className="mt-16 pt-10 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 transition-colors"
          >
            ← More from The Journal
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 bg-slate-950 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all"
          >
            Shop the Range
          </Link>
        </div>
      </div>
    </article>
  );
}
