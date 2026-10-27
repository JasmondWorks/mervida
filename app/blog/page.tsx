"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchBlogPosts, type BlogPost } from "@/app/lib/api-client";

function estimateReadingTime(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function PostDate({ post }: { post: BlogPost }) {
  return (
    <span>
      {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </span>
  );
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    fetchBlogPosts().then(setPosts);
  }, []);

  const [featured, ...rest] = posts ?? [];

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 sm:pt-24 pb-10 sm:pb-14">
        <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tighter text-slate-950 leading-[1.05] max-w-2xl">
          The Journal
        </h1>
        <div className="w-12 h-1 rounded-lg bg-emerald-500 mt-5 mb-5" />
        <p className="text-slate-500 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
          Notes on clean food processing, natural ingredients, and the everyday
          habits that keep a household healthy — straight from our production floor.
        </p>
      </section>

      {posts === null ? null : posts.length === 0 ? (
        <div className="max-w-6xl mx-auto px-6 sm:px-12 pb-32">
          <p className="text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-4xl py-20 text-center">
            No posts yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 sm:px-12 pb-24 sm:pb-32 space-y-16">
          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center bg-white rounded-[2.5rem] border border-slate-100 p-3 sm:p-4 hover:border-emerald-200 transition-all shadow-sm"
            >
              <div className="relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden bg-slate-50">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                    Mervida Journal
                  </div>
                )}
              </div>
              <div className="py-4 lg:py-10 lg:pr-10 space-y-4">
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                  Latest
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-slate-950 leading-tight group-hover:text-emerald-700 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <PostDate post={featured} />
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>{estimateReadingTime(featured.body)} min read</span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid of remaining posts */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block space-y-4">
                  <div className="relative aspect-video bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-[9px] font-bold uppercase tracking-widest">
                        Mervida Journal
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 pt-1">
                      <PostDate post={post} />
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span>{estimateReadingTime(post.body)} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
