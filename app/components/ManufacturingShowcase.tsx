"use client";
import { useState } from "react";
import Image from "next/image";
import type { Product, ProcessVideo } from "@/app/lib/types";
import VideoModal from "./VideoModal";

interface Props {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ManufacturingShowcase({
  products,
  title = "Clean Manufacturing & Integrity",
  subtitle = "Watch how our raw natural ingredients are harvested, cold-pressed, milled, and packaged in NAFDAC-certified processing units.",
}: Props) {
  const [selectedVideo, setSelectedVideo] = useState<ProcessVideo | null>(null);

  const videoProducts = products.filter((p) => p.processVideo);

  return (
    <section className="py-16 sm:py-24 px-6 sm:px-12 max-w-[1440px] mx-auto">
      <div className="bg-slate-950 rounded-5xl p-8 sm:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-900">
        {/* Subtle Background Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6.75C4 5.231 5.231 4 6.75 4h10.5C18.769 4 20 5.231 20 6.75v10.5c0 1.519-1.231 2.75-2.75 2.75H6.75C5.231 20 4 18.769 4 17.25V6.75zm6 3.75v3rem4-1.5-4-1.5z" />
            </svg>
            Video Proof of Quality
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tighter text-white leading-tight">
            {title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {videoProducts.map((p) => {
            const video = p.processVideo!;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedVideo(video)}
                className="group relative bg-slate-900/80 rounded-3xl border border-white/10 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 shadow-lg"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-slate-800 overflow-hidden">
                  {video.posterUrl ? (
                    <Image
                      src={video.posterUrl}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                      Processing Reel
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300 border border-white/20">
                      <svg
                        className="w-6 h-6 ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.duration && (
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-semibold text-slate-300">
                      {video.duration}
                    </span>
                  )}

                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                    {p.name}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-base font-bold text-white font-display group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {video.title}
                  </h3>

                  {video.highlights && video.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {video.highlights.slice(0, 2).map((h, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-medium text-slate-300 border border-white/5"
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-emerald-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    <span>Watch process video</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
}
