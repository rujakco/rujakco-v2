/*
 * RUJAK.Co — Experience Layer: Testimonials
 * Content from reviews.ts. Left-aligned editorial layout.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "@/data/reviews";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const review = reviews[current];

  return (
    <section id="testimonials" className="section-padding bg-paper">
      <div className="container">
        {/* Left-aligned header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="overline mb-2">Testimoni</p>
            <h2 className="font-display text-3xl lg:text-4xl font-medium text-ink">
              Kata Mereka
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-[#E8E5E0] flex items-center justify-center hover:border-forest/30 hover:bg-forest/5 transition-colors"
              aria-label="Testimoni sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 text-ink-muted" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#E8E5E0] flex items-center justify-center hover:border-forest/30 hover:bg-forest/5 transition-colors"
              aria-label="Testimoni berikutnya"
            >
              <ChevronRight className="w-5 h-5 text-ink-muted" />
            </button>
          </div>
        </div>

        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white rounded-2xl p-8 lg:p-10 border border-[#E8E5E0] shadow-sm"
            >
              <Quote className="w-8 h-8 text-forest/15 mb-5" />
              <p className="text-lg lg:text-xl text-ink-soft italic leading-relaxed mb-6 font-display font-light">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-ink">
                    — {review.author}
                  </p>
                  <p className="text-sm text-ink-muted">{review.location}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-mango text-sm">★</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots + Pause */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true); }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "bg-forest w-8" : "bg-[#E8E5E0] w-4 hover:bg-forest/30"
                  }`}
                  aria-label={`Testimoni ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setPaused(!paused)}
              className="text-xs text-ink-muted hover:text-ink transition-colors ml-2"
            >
              {paused ? "Lanjut" : "Jeda"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
