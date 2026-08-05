/*
 * RUJAK.Co — Experience Layer: FAQ Section
 * Mobile-first accordion, token warna (tanpa hex).
 * Content from faq.ts — logic open/close tidak diubah.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/faq";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="bg-cream">
      <div className="max-w-md md:max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-5">
          <p className="text-[11px] font-medium tracking-wide uppercase text-forest mb-1">
            Pertanyaan Umum
          </p>
          <h2 className="font-display text-[16px] md:text-2xl font-bold text-ink tracking-tight">
            FAQ
          </h2>
          <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">
            Pemesanan, pengantaran, dan kesegaran produk kami.
          </p>
        </div>

        <div className="rounded-2xl border border-paper-border bg-white overflow-hidden divide-y divide-paper-border">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left active:bg-paper/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-sm text-ink pr-1 leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4.5 h-4.5 text-ink-muted flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-forest" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.25,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-ink-muted leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
