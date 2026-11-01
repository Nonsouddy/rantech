"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

export type HeroSlideData = {
  id: string;
  image: string;
  caption: string;
};

const SLIDE_DURATION = 4500;

export default function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(t);
  }, [paused, next, count]);

  function handleDragEnd(_e: unknown, info: PanInfo) {
    const swipe = info.offset.x;
    if (swipe < -60) next();
    else if (swipe > 60) prev();
  }

  if (count === 0) return null;

  return (
    <div
      className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden border border-paper/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={index}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={slides[index].image}
            alt={slides[index].caption}
            fill
            priority={index === 0}
            draggable={false}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <p className="absolute bottom-9 left-4 right-4 font-mono text-xs text-paper/80 sm:bottom-10 sm:left-5">
            {slides[index].caption}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Short pagination segments, bottom center */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1 w-6 overflow-hidden rounded-full bg-paper/30"
          >
            {i < index && <div className="h-full w-full bg-copper" />}
            {i === index && (
              <motion.div
                key={index}
                className="h-full origin-left bg-copper"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Invisible edge tap-zones for click navigation  */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="absolute inset-y-0 left-0 z-10 w-1/4 cursor-w-resize opacity-0"
      />
      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute inset-y-0 right-0 z-10 w-1/4 cursor-e-resize opacity-0"
      />
    </div>
  );
}