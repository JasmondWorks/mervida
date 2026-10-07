"use client";
import { useEffect, useRef } from "react";
import type { ProcessVideo } from "@/app/lib/types";

interface VideoModalProps {
  video: ProcessVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-4xl overflow-hidden shadow-2xl z-10 flex flex-col my-auto max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">
              Manufacturing Process • {video.categoryName || "GFO Foods Standard"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.posterUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info & Highlights section */}
        <div className="p-6 sm:p-8 bg-slate-900 border-t border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                {video.title}
              </h3>
              {video.duration && (
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Video Duration: {video.duration}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white transition-all w-fit shadow-md shadow-emerald-900/30"
            >
              Close & Browse Catalog
            </button>
          </div>

          {video.highlights && video.highlights.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Quality Assurance Highlights
              </p>
              <div className="flex flex-wrap gap-2">
                {video.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/20"
                  >
                    <svg
                      className="w-3 h-3 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
