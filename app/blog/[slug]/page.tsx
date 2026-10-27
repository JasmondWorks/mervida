"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogPostBySlug, type BlogPost } from "@/app/lib/api-client";

import { Button } from "@/app/components/ui";

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
        <p className="text-slate-400 text-sm font-normal">Post not found.</p>
        <Link href="/blog" className="text-emerald-600 text-sm font-semibold mt-4 inline-block">
          Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) return null;

  const publishedDate = post.publishedAt ?? post.createdAt;

  return (
    <article className="bg-[#faf9f7]">
      {post.status === "draft" && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 text-center text-xs text-amber-900 font-normal flex flex-wrap items-center justify-center gap-2">
          <span className="font-semibold px-2 py-0.5 rounded bg-amber-100 text-[10px] uppercase tracking-wider">
            Draft Preview
          </span>
          <span>This post is unpublished and only visible to logged-in admins.</span>
          <Link
            href={`/admin/blog/${post.id}/edit`}
            className="underline font-semibold text-amber-950 hover:text-black ml-1"
          >
            Edit in Admin
          </Link>
        </div>
      )}

      {/* Hero */}
      <header className="max-w-3xl mx-auto px-6 sm:px-0 pt-16 sm:pt-24 pb-10">
        <Link
          href="/blog"
          className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          ← Blog
        </Link>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-slate-950 mt-6 mb-5 leading-[1.08]">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
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
          <div className="relative aspect-video rounded-4xl overflow-hidden border border-border">
            <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 sm:px-0 pb-24 sm:pb-32">
        <div className="blog-prose max-w-none" dangerouslySetInnerHTML={{ __html: post.body }} />

        <div className="mt-16 pt-10 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 transition-colors"
          >
            ← More from the Blog
          </Link>
          <Link href="/products">
            <Button>
              Shop the Range
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
