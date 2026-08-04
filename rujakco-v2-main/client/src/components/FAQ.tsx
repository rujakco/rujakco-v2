/*
 * RUJAK.Co — Experience Layer: FAQ Section
 * Content from faq.ts. Left-aligned header, clean accordion.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/faq";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Left-aligned header with side content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="overline mb-2">Pertanyaan Umum</p>
              <h2 className="font-display text-3xl lg:text-4xl font-medium text-ink">
                FAQ
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-ink-muted leading-relaxed">
                Semua yang perlu kamu ketahui tentang pemesanan, pengantaran, dan kesegaran produk kami.
              </p>
            </div>
          </div>

          <div className="max-w-2xl">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="border-b border-[#E8E5E0]">
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="font-display text-base font-medium text-ink pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-ink-muted flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-forest" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-sm text-ink-muted leading-relaxed">
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
      </div>
    </section>
  );
}
