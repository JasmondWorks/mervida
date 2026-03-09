"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSettings, initStore } from "@/app/lib/store";

const SLIDES = [
  {
    label: "Brand of GFO Foods",
    title: "Natural Nourishment\nby Mervida",
    sub: "Clean-label food products, responsibly sourced from Nigeria's local harvests.",
  },
  {
    label: "Quality Promise",
    title: "Honest Ingredients.\nPure Flavour.",
    sub: "No artificial preservatives, no compromise. Only the best for your kitchen.",
  },
  {
    label: "Directly Sourced",
    title: "From Farm\nto Your Table",
    sub: "Supporting local ecosystems while delivering premium goods to your family.",
  },
];

const INTERVAL = 7000;
const STEP = 100 / (INTERVAL / 50);

export default function HeroCarousel() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initStore();
    const settings = getSettings();
    setImages(settings.carouselImages ?? []);
    setMounted(true);
  }, []);

  const count = images.length > 0 ? images.length : 1;

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % count);
    progressRef.current = 0;
    setProgress(0);
  }, [count]);

  useEffect(() => {
    if (!mounted) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mounted, next]);

  useEffect(() => {
    if (!mounted) return;
    progressRef.current = 0;
    setProgress(0);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + STEP, 100);
      setProgress(progressRef.current);
    }, 50);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [mounted, current]);

  const slideText = SLIDES[current % SLIDES.length];

  return (
    <div className="relative h-[85vh] min-h-[600px] overflow-hidden bg-slate-100 group">
      {/* Slides with more subtle, modern transitions */}
      {images.length > 0 ? (
        images.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-10 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Slide ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
              sizes="100vw"
            />
            {/* Cinematic Overlay - Gradient for text anchoring + subtle global wash */}
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none" />
          </div>
        ))
      ) : (
        <div className="absolute inset-0 bg-slate-950" />
      )}

      {/* Hero Content - Modern, refined scale for "Smaller Elements" */}
      <div
        className="absolute inset-0 flex flex-col justify-center max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 z-20"
        key={current}
      >
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-2xl relative">
          <p className="text-[10px] font-bold text-emerald-400 tracking-[0.4em] uppercase mb-6 inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-sm transition-all hover:bg-white/20">
            {slideText.label}
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-display font-bold text-white leading-tight tracking-tighter mb-6 whitespace-pre-line animate-in slide-in-from-left-4 duration-1200 drop-shadow-sm">
            {slideText.title}
          </h1>
          <p className="text-white/90 text-sm sm:text-base mb-10 max-w-md leading-relaxed font-medium drop-shadow-sm">
            {slideText.sub}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/products"
              className="group px-8 py-3 bg-white text-slate-950 font-bold text-[10px] uppercase tracking-widest rounded-full transition-all hover:bg-emerald-500 hover:text-white active:scale-95 shadow-lg"
            >
              Shop collection
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border border-white/40 text-white hover:bg-white/10 font-bold text-[10px] uppercase tracking-widest rounded-full transition-all backdrop-blur-sm active:scale-95"
            >
              Our mission
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bars - Modern, rounded pill-like indicators - smaller scale */}
      <div className="absolute bottom-12 right-6 sm:right-12 lg:right-20 flex gap-2 z-30 items-center">
        {count > 1 &&
          images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all duration-500 rounded-full ${idx === current ? "w-12 bg-emerald-500" : "w-1.5 bg-white/20 hover:bg-white/40 shadow-sm"}`}
            />
          ))}
      </div>

      {/* Static Progress Bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-40">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-emerald-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(16,185,129,0.3)]"
        />
      </div>
    </div>
  );
}
