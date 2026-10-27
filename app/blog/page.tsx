"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchBlogPosts, fetchSettings, type BlogPost, type Pagination } from "@/app/lib/api-client";
import { Skeleton, Button } from "@/app/components/ui";

const DEFAULT_TITLE = "The Blog";
const DEFAULT_DESCRIPTION =
  "Notes on clean food processing, natural ingredients, and the everyday habits that keep a household healthy — straight from our production floor.";
const DEFAULT_PLACEHOLDER = "Mervida Blog";

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

function CoverPlaceholder({ text }: { text: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-linear-to-br from-emerald-50 to-slate-50">
      <svg className="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700/60">
        {text}
      </span>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center bg-white rounded-5xl border border-border p-3 sm:p-4">
      <Skeleton className="aspect-video lg:aspect-square rounded-4xl" />
      <div className="py-4 lg:py-10 lg:pr-10 space-y-4">
        <Skeleton className="h-5 w-16 rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-3/4 rounded-lg" />
        <div className="space-y-2 pt-1">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-5/6 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-32 rounded-lg" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-video rounded-3xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-lg" />
        <Skeleton className="h-3 w-28 rounded-lg mt-1" />
      </div>
    </div>
  );
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [heroTitle, setHeroTitle] = useState(DEFAULT_TITLE);
  const [heroDescription, setHeroDescription] = useState(DEFAULT_DESCRIPTION);
  const [placeholderText, setPlaceholderText] = useState(DEFAULT_PLACEHOLDER);

  useEffect(() => {
    fetchSettings().then((s) => {
      setHeroTitle(s.blogTitle || DEFAULT_TITLE);
      setHeroDescription(s.blogDescription || DEFAULT_DESCRIPTION);
      setPlaceholderText(s.blogPlaceholderText || DEFAULT_PLACEHOLDER);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchBlogPosts({ page, limit: 10 }).then((res) => {
      if (!cancelled) {
        setPosts(res.data ?? []);
        setPagination(res.pagination);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const isFirstPage = page === 1;
  const featured = isFirstPage ? (posts ?? [])[0] : null;
  const gridPosts = isFirstPage ? (posts ?? []).slice(1) : (posts ?? []);

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 sm:pt-24 pb-10 sm:pb-14">
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-slate-950 leading-[1.05] max-w-2xl">
          {heroTitle}
        </h1>
        <div className="w-12 h-1 rounded-lg bg-emerald-500 mt-5 mb-5" />
        <p className="text-slate-500 text-sm sm:text-base font-normal max-w-xl leading-relaxed">
          {heroDescription}
        </p>
      </section>

      {posts === null ? (
        <div className="max-w-6xl mx-auto px-6 sm:px-12 pb-24 sm:pb-32 space-y-16 animate-pulse">
          <FeaturedSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="max-w-6xl mx-auto px-6 sm:px-12 pb-32">
          <p className="text-slate-400 text-sm font-normal border border-dashed border-slate-200 rounded-4xl py-20 text-center">
            No posts yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 sm:px-12 pb-24 sm:pb-32 space-y-16">
          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center bg-white rounded-5xl border border-border p-3 sm:p-4 hover:border-emerald-300 transition-colors duration-300"
            >
              <div className="relative aspect-video lg:aspect-square rounded-4xl overflow-hidden bg-slate-50">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <CoverPlaceholder text={placeholderText} />
                )}
              </div>
              <div className="py-4 lg:py-10 lg:pr-10 space-y-4">
                <span className="inline-block text-[9px] font-semibold uppercase tracking-[0.3em] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                  Latest
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-950 leading-tight group-hover:text-emerald-700 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  <PostDate post={featured} />
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>{estimateReadingTime(featured.body)} min read</span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid of remaining posts */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {gridPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block space-y-4">
                  <div className="relative aspect-video bg-slate-50 rounded-3xl overflow-hidden border border-border group-hover:border-emerald-300 transition-colors duration-300">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <CoverPlaceholder text={placeholderText} />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2.5 text-[9px] font-semibold uppercase tracking-widest text-slate-400 pt-1">
                      <PostDate post={post} />
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span>{estimateReadingTime(post.body)} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8 border-t border-slate-200/60 mt-12">
              <Button
                variant="secondary"
                size="sm"
                disabled={!pagination.hasPrevious}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-slate-500 px-3">
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
      )}
    </div>
  );
}
